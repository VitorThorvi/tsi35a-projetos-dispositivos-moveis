import { z } from "zod";

import type { Vehicle } from "../types/Vehicle";

const MAX_YEAR = new Date().getFullYear() + 1;

const yearField = z
  .number()
  .int("Ano inválido.")
  .min(1900, "Ano inválido.")
  .max(MAX_YEAR, "Ano inválido.")
  .optional();

export const vehicleInputSchema = z
  .object({
    brand: z.string().min(1, "Informe a marca."),
    model: z.string().min(1, "Informe o modelo."),
    yearStart: yearField,
    yearEnd: yearField,
    notes: z.string().optional(),
  })
  .refine(
    (input) =>
      input.yearStart == null ||
      input.yearEnd == null ||
      input.yearEnd >= input.yearStart,
    {
      path: ["yearEnd"],
      message: "O ano final deve ser maior ou igual ao ano inicial.",
    },
  );

export type VehicleInput = z.infer<typeof vehicleInputSchema>;

export const vehicleRowSchema = z
  .object({
    id: z.string(),
    user_id: z.string(),
    brand: z.string(),
    model: z.string(),
    year_start: z.number().int().nullable(),
    year_end: z.number().int().nullable(),
    notes: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .transform(
    (row): Vehicle => ({
      id: row.id,
      userId: row.user_id,
      brand: row.brand,
      model: row.model,
      yearStart: row.year_start,
      yearEnd: row.year_end,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }),
  );
