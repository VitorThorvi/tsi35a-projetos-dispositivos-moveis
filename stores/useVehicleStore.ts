import * as Crypto from "expo-crypto";
import { create } from "zustand";

import type { Vehicle } from "../types/Vehicle";

type VehicleState = {
  vehicles: Vehicle[];
  addVehicle: (input: Omit<Vehicle, "id">) => void;
  removeVehicle: (id: string) => void;
};

const seedVehicles: Vehicle[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
    listingsCount: 4,
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    brand: "Honda",
    model: "Civic",
    year: 2019,
    listingsCount: 7,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    brand: "Volkswagen",
    model: "Golf",
    year: 2021,
    listingsCount: 2,
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    brand: "Ford",
    model: "Focus",
    year: 2018,
    listingsCount: 5,
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    brand: "Chevrolet",
    model: "Onix",
    year: 2022,
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
