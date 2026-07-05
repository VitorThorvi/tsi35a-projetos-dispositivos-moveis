import * as Crypto from "expo-crypto";
import { create } from "zustand";

import type { VehicleWithCounts } from "../types/Vehicle";

type VehicleState = {
  vehicles: VehicleWithCounts[];
  addVehicle: (input: Omit<VehicleWithCounts, "id">) => void;
  removeVehicle: (id: string) => void;
};

const seedVehicles: VehicleWithCounts[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    userId: "local",
    brand: "Toyota",
    model: "Corolla",
    yearStart: 2020,
    yearEnd: null,
    notes: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    listingsCount: 4,
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    userId: "local",
    brand: "Honda",
    model: "Civic",
    yearStart: 2019,
    yearEnd: null,
    notes: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    listingsCount: 7,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    userId: "local",
    brand: "Volkswagen",
    model: "Golf",
    yearStart: 2021,
    yearEnd: null,
    notes: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    listingsCount: 2,
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    userId: "local",
    brand: "Ford",
    model: "Focus",
    yearStart: 2018,
    yearEnd: null,
    notes: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    listingsCount: 5,
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    userId: "local",
    brand: "Chevrolet",
    model: "Onix",
    yearStart: 2022,
    yearEnd: null,
    notes: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    listingsCount: 3,
  },
];

export const useVehicleStore = create<VehicleState>((set) => ({
  vehicles: seedVehicles,
  addVehicle: (input) =>
    set((state) => ({
      vehicles: [...state.vehicles, { ...input, id: Crypto.randomUUID() }],
    })),
  removeVehicle: (id) =>
    set((state) => ({
      vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
    })),
}));
