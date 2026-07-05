import type { Evaluation } from "../types/Evaluation";

export type Ratings = Pick<Evaluation, "generalCond" | "priceVsMkt" | "maintHist">;

export function calculateScore({
  generalCond,
  priceVsMkt,
  maintHist,
}: Ratings): number {
  return ((generalCond + priceVsMkt + maintHist) / 3) * 2;
}

export const RECOMMENDATIONS = ["recomendado", "atenção", "evitar"] as const;

export type Recommendation = (typeof RECOMMENDATIONS)[number];

const RECOMMENDED_MIN_SCORE = 7;
const CAUTION_MIN_SCORE = 4;

export function getRecommendation(score: number): Recommendation {
  if (score >= RECOMMENDED_MIN_SCORE) return "recomendado";
  if (score >= CAUTION_MIN_SCORE) return "atenção";
  return "evitar";
}
