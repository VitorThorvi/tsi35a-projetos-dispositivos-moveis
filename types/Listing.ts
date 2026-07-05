import type { Evaluation } from "./Evaluation";

export const MARKETPLACES = [
  "olx",
  "webmotors",
  "mercado_livre",
  "outro",
] as const;

export type Marketplace = (typeof MARKETPLACES)[number];

export type Listing = {
  id: string;
  vehicleId: string;
  sourceUrl: string | null;
  marketplace: Marketplace | null;
  brand: string;
  model: string;
  year: number;
  mileageKm: number;
  askingPrice: number;
  location: string | null;
  photos: string[];
  createdAt: string;
  updatedAt: string;
};

export type ListingWithEvaluation = Listing & {
  evaluation: Evaluation | null;
};
