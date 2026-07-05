import { randomUUID } from 'expo-crypto';
import type { SQLiteDatabase } from 'expo-sqlite';
import { z } from 'zod';

import { vehicleRowSchema, type VehicleInput } from '../../schemas/vehicleSchema';
import type { Vehicle, VehicleWithCounts } from '../../types/Vehicle';

const VEHICLE_COLUMNS =
  'id, user_id, brand, model, year_start, year_end, notes, created_at, updated_at';

const VEHICLE_JOIN_COLUMNS =
  'v.id, v.user_id, v.brand, v.model, v.year_start, v.year_end, v.notes, ' +
  'v.created_at, v.updated_at, COUNT(l.id) AS listings_count';

const listingsCountRowSchema = z.object({
  listings_count: z.number().int().nonnegative(),
});

function toVehicleWithCounts(row: unknown): VehicleWithCounts {
  return {
    ...vehicleRowSchema.parse(row),
    listingsCount: listingsCountRowSchema.parse(row).listings_count,
  };
}

function escapeLikePattern(query: string): string {
  return query.replace(/[\\%_]/g, (char) => `\\${char}`);
}

export type VehicleRepository = {
  listByUser(userId: string): Promise<VehicleWithCounts[]>;
  searchByUser(userId: string, query: string): Promise<VehicleWithCounts[]>;
  getById(id: string): Promise<Vehicle | null>;
  create(input: VehicleInput & { userId: string }): Promise<Vehicle>;
  update(id: string, input: VehicleInput): Promise<Vehicle>;
  remove(id: string): Promise<void>;
};

export function createVehicleRepository(db: SQLiteDatabase): VehicleRepository {
  async function getById(id: string): Promise<Vehicle | null> {
    const row = await db.getFirstAsync<unknown>(
      `SELECT ${VEHICLE_COLUMNS} FROM vehicles WHERE id = ?;`,
      [id],
    );
    return row ? vehicleRowSchema.parse(row) : null;
  }

  async function listByUser(userId: string): Promise<VehicleWithCounts[]> {
    const rows = await db.getAllAsync<unknown>(
      `SELECT ${VEHICLE_JOIN_COLUMNS}
         FROM vehicles v
         LEFT JOIN listings l ON l.vehicle_id = v.id
        WHERE v.user_id = ?
        GROUP BY v.id
        ORDER BY v.created_at DESC, v.id DESC;`,
      [userId],
    );
    return rows.map(toVehicleWithCounts);
  }

  async function searchByUser(
    userId: string,
    query: string,
  ): Promise<VehicleWithCounts[]> {
    const pattern = `%${escapeLikePattern(query)}%`;
    const rows = await db.getAllAsync<unknown>(
      `SELECT ${VEHICLE_JOIN_COLUMNS}
         FROM vehicles v
         LEFT JOIN listings l ON l.vehicle_id = v.id
        WHERE v.user_id = ?
          AND (v.brand LIKE ? ESCAPE '\\' OR v.model LIKE ? ESCAPE '\\')
        GROUP BY v.id
        ORDER BY v.created_at DESC, v.id DESC;`,
      [userId, pattern, pattern],
    );
    return rows.map(toVehicleWithCounts);
  }

  async function requireById(id: string): Promise<Vehicle> {
    const vehicle = await getById(id);
    if (!vehicle) {
      throw new Error(`Vehicle ${id} vanished immediately after a write.`);
    }
    return vehicle;
  }

  async function create(
    input: VehicleInput & { userId: string },
  ): Promise<Vehicle> {
    const id = randomUUID();
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO vehicles
         (id, user_id, brand, model, year_start, year_end, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        input.userId,
        input.brand,
        input.model,
        input.yearStart ?? null,
        input.yearEnd ?? null,
        input.notes ?? null,
        now,
        now,
      ],
    );
    return requireById(id);
  }

  async function update(id: string, input: VehicleInput): Promise<Vehicle> {
    const now = new Date().toISOString();
    await db.runAsync(
      `UPDATE vehicles
          SET brand = ?, model = ?, year_start = ?, year_end = ?,
              notes = ?, updated_at = ?
        WHERE id = ?;`,
      [
        input.brand,
        input.model,
        input.yearStart ?? null,
        input.yearEnd ?? null,
        input.notes ?? null,
        now,
        id,
      ],
    );
    return requireById(id);
  }

  async function remove(id: string): Promise<void> {
    await db.runAsync('DELETE FROM vehicles WHERE id = ?;', [id]);
  }

  return { getById, listByUser, searchByUser, create, update, remove };
}
