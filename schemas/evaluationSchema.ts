import { z } from "zod";

import type { Evaluation } from "../types/Evaluation";
import { jsonStringArray } from "./jsonColumn";

const ratingField = z
  .number()
  .int("Avaliação inválida.")
  .min(1, "Avaliação inválida.")
  .max(5, "Avaliação inválida.");

export const evaluationInputSchema = z.object({
  generalCond: ratingField,
  priceVsMkt: ratingField,
  maintHist: ratingField,
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
});

export type EvaluationInput = z.infer<typeof evaluationInputSchema>;

export const evaluationRowSchema = z
  .object({
    id: z.string(),
    listing_id: z.string(),
    general_cond: z.number().int(),
    price_vs_mkt: z.number().int(),
    maint_hist: z.number().int(),
    score: z.number().min(0).max(10),
    pros: jsonStringArray,
    cons: jsonStringArray,
    created_at: z.string(),
    updated_at: z.string(),
  })
  .transform(
    (row): Evaluation => ({
      id: row.id,
      listingId: row.listing_id,
      generalCond: row.general_cond,
      priceVsMkt: row.price_vs_mkt,
      maintHist: row.maint_hist,
      score: row.score,
      pros: row.pros,
      cons: row.cons,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }),
  );
