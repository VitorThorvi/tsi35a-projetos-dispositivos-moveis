import { z } from "zod";

export type DashboardStats = {
  vehicleCount: number;
  listingCount: number;
  recommendedCount: number;
  averageScore: number | null;
};

export const dashboardStatsRowSchema = z
  .object({
    vehicle_count: z.coerce.number().int(),
    listing_count: z.coerce.number().int(),
    recommended_count: z.coerce.number().int(),
    average_score: z.coerce.number().nullable(),
  })
  .transform(
    (row): DashboardStats => ({
      vehicleCount: row.vehicle_count,
      listingCount: row.listing_count,
      recommendedCount: row.recommended_count,
      averageScore: row.average_score,
    }),
  );
