import { z } from "zod";

import type { Listing } from "../types/Listing";
import { MARKETPLACES } from "../types/Listing";
import { jsonStringArray } from "./jsonColumn";

export const marketplaceSchema = z.enum(MARKETPLACES, "Selecione o marketplace.");

export const listingInputSchema = z.object({
  marketplace: marketplaceSchema,
  sourceUrl: z.url("URL inválida.").optional().or(z.literal("")),
  brand: z.string().min(1, "Informe a marca."),
  model: z.string().min(1, "Informe o modelo."),
  year: z.number("Ano inválido.").int("Ano inválido."),
  mileageKm: z.coerce.number().int().min(0, "Quilometragem inválida."),
  askingPrice: z.coerce.number().positive("Preço inválido."),
  location: z.string().optional(),
  photos: z.array(z.string()).default([]),
});

export type ListingInput = z.infer<typeof listingInputSchema>;

export const listingRowSchema = z
  .object({
    id: z.string(),
    vehicle_id: z.string(),
    source_url: z.string().nullable(),
    marketplace: marketplaceSchema.nullable(),
    brand: z.string(),
    model: z.string(),
    year: z.number().int(),
    mileage_km: z.number().int(),
    asking_price: z.number(),
    location: z.string().nullable(),
    photos: jsonStringArray,
    created_at: z.string(),
    updated_at: z.string(),
  })
  .transform(
    (row): Listing => ({
      id: row.id,
      vehicleId: row.vehicle_id,
      sourceUrl: row.source_url,
      marketplace: row.marketplace,
      brand: row.brand,
      model: row.model,
      year: row.year,
      mileageKm: row.mileage_km,
      askingPrice: row.asking_price,
      location: row.location,
      photos: row.photos,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }),
  );
