import { randomUUID } from 'expo-crypto';
import type { SQLiteDatabase } from 'expo-sqlite';

import { evaluationRowSchema } from '../../schemas/evaluationSchema';
import { listingRowSchema, type ListingInput } from '../../schemas/listingSchema';
import type { Evaluation } from '../../types/Evaluation';
import type { Listing, ListingWithEvaluation } from '../../types/Listing';

const LISTING_COLUMNS =
  'id, vehicle_id, source_url, marketplace, brand, model, year, ' +
  'mileage_km, asking_price, location, photos, created_at, updated_at';

const EVALUATION_COLUMNS =
  'id, listing_id, general_cond, price_vs_mkt, maint_hist, score, ' +
  'pros, cons, created_at, updated_at';

export type ListingRepository = {
  listByVehicle(vehicleId: string): Promise<Listing[]>;
  getById(id: string): Promise<ListingWithEvaluation | null>;
  create(input: ListingInput & { vehicleId: string }): Promise<Listing>;
  update(id: string, input: ListingInput): Promise<Listing>;
  remove(id: string): Promise<void>;
};

export function createListingRepository(db: SQLiteDatabase): ListingRepository {
  async function findListing(id: string): Promise<Listing | null> {
    const row = await db.getFirstAsync<unknown>(
      `SELECT ${LISTING_COLUMNS} FROM listings WHERE id = ?;`,
      [id],
    );
    return row ? listingRowSchema.parse(row) : null;
  }

  async function findEvaluation(listingId: string): Promise<Evaluation | null> {
    const row = await db.getFirstAsync<unknown>(
      `SELECT ${EVALUATION_COLUMNS} FROM evaluations WHERE listing_id = ?;`,
      [listingId],
    );
    return row ? evaluationRowSchema.parse(row) : null;
  }

  async function getById(id: string): Promise<ListingWithEvaluation | null> {
    const listing = await findListing(id);
    if (!listing) {
      return null;
    }
    const evaluation = await findEvaluation(id);
    return { ...listing, evaluation };
  }

  async function listByVehicle(vehicleId: string): Promise<Listing[]> {
    const rows = await db.getAllAsync<unknown>(
      `SELECT ${LISTING_COLUMNS}
         FROM listings
        WHERE vehicle_id = ?
        ORDER BY created_at DESC, id DESC;`,
      [vehicleId],
    );
    return rows.map((row) => listingRowSchema.parse(row));
  }

  async function requireById(id: string): Promise<Listing> {
    const listing = await findListing(id);
    if (!listing) {
      throw new Error(`Listing ${id} vanished immediately after a write.`);
    }
    return listing;
  }

  async function create(
    input: ListingInput & { vehicleId: string },
  ): Promise<Listing> {
    const id = randomUUID();
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO listings
         (id, vehicle_id, source_url, marketplace, brand, model, year,
          mileage_km, asking_price, location, photos, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        input.vehicleId,
        input.sourceUrl ?? null,
        input.marketplace,
        input.brand,
        input.model,
        input.year,
        input.mileageKm,
        input.askingPrice,
        input.location ?? null,
        JSON.stringify(input.photos),
        now,
        now,
      ],
    );
    return requireById(id);
  }

  async function update(id: string, input: ListingInput): Promise<Listing> {
    const now = new Date().toISOString();
    await db.runAsync(
      `UPDATE listings
          SET source_url = ?, marketplace = ?, brand = ?, model = ?, year = ?,
              mileage_km = ?, asking_price = ?, location = ?, photos = ?,
              updated_at = ?
        WHERE id = ?;`,
      [
        input.sourceUrl ?? null,
        input.marketplace,
        input.brand,
        input.model,
        input.year,
        input.mileageKm,
        input.askingPrice,
        input.location ?? null,
        JSON.stringify(input.photos),
        now,
        id,
      ],
    );
    return requireById(id);
  }

  async function remove(id: string): Promise<void> {
    await db.runAsync('DELETE FROM listings WHERE id = ?;', [id]);
  }

  return { getById, listByVehicle, create, update, remove };
}
