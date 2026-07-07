import type { SQLiteDatabase } from 'expo-sqlite';

import {
  dashboardStatsRowSchema,
  type DashboardStats,
} from '../../schemas/statsSchema';
import { listingRowSchema } from '../../schemas/listingSchema';
import type { Listing } from '../../types/Listing';
import { RECOMMENDED_MIN_SCORE } from '../../utils/scoreCalculator';

const LISTING_COLUMNS =
  'l.id, l.vehicle_id, l.source_url, l.marketplace, l.brand, l.model, l.year, ' +
  'l.mileage_km, l.asking_price, l.location, l.photos, l.created_at, l.updated_at';

export type StatsRepository = {
  getDashboardStats(userId: string): Promise<DashboardStats>;
  listRecentListings(userId: string, limit: number): Promise<Listing[]>;
};

export function createStatsRepository(db: SQLiteDatabase): StatsRepository {
  async function getDashboardStats(userId: string): Promise<DashboardStats> {
    const row = await db.getFirstAsync<unknown>(
      `SELECT
         (SELECT COUNT(*) FROM vehicles WHERE user_id = ?) AS vehicle_count,
         (SELECT COUNT(*) FROM listings l
            JOIN vehicles v ON v.id = l.vehicle_id
            WHERE v.user_id = ?) AS listing_count,
         (SELECT COUNT(*) FROM evaluations e
            JOIN listings l ON l.id = e.listing_id
            JOIN vehicles v ON v.id = l.vehicle_id
            WHERE v.user_id = ? AND e.score >= ?) AS recommended_count,
         (SELECT AVG(e.score) FROM evaluations e
            JOIN listings l ON l.id = e.listing_id
            JOIN vehicles v ON v.id = l.vehicle_id
            WHERE v.user_id = ?) AS average_score;`,
      [userId, userId, userId, RECOMMENDED_MIN_SCORE, userId],
    );
    return dashboardStatsRowSchema.parse(row);
  }

  async function listRecentListings(
    userId: string,
    limit: number,
  ): Promise<Listing[]> {
    const rows = await db.getAllAsync<unknown>(
      `SELECT ${LISTING_COLUMNS}
         FROM listings l
         JOIN vehicles v ON v.id = l.vehicle_id
        WHERE v.user_id = ?
        ORDER BY l.created_at DESC, l.id DESC
        LIMIT ?;`,
      [userId, limit],
    );
    return rows.map((row) => listingRowSchema.parse(row));
  }

  return { getDashboardStats, listRecentListings };
}
