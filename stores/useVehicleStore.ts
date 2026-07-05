import { create } from "zustand";

import { getRepositories } from "../database";
import type { VehicleInput } from "../schemas/vehicleSchema";
import type { Vehicle, VehicleWithCounts } from "../types/Vehicle";

type VehicleState = {
  vehicles: VehicleWithCounts[];
  loading: boolean;
  loadVehicles: (uid: string) => Promise<void>;
  search: (uid: string, query: string) => Promise<void>;
  addVehicle: (input: VehicleInput, uid: string) => Promise<void>;
  updateVehicle: (id: string, input: VehicleInput) => Promise<void>;
  removeVehicle: (id: string) => Promise<void>;
  getVehicle: (id: string) => Promise<Vehicle | null>;
};

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: [],
  loading: false,

  loadVehicles: async (uid) => {
    set({ loading: true });
    try {
      const repos = await getRepositories();
      set({ vehicles: await repos.vehicles.listByUser(uid) });
    } finally {
      set({ loading: false });
    }
  },

  search: async (uid, query) => {
    const trimmed = query.trim();
    if (!trimmed) {
      await get().loadVehicles(uid);
      return;
    }
    set({ loading: true });
    try {
      const repos = await getRepositories();
      set({ vehicles: await repos.vehicles.searchByUser(uid, trimmed) });
    } finally {
      set({ loading: false });
    }
  },

  addVehicle: async (input, uid) => {
    const repos = await getRepositories();
    const created = await repos.vehicles.create({ ...input, userId: uid });
    set((state) => ({
      vehicles: [{ ...created, listingsCount: 0 }, ...state.vehicles],
    }));
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

  updateVehicle: async (id, input) => {
    const repos = await getRepositories();
    const updated = await repos.vehicles.update(id, input);
    set((state) => ({
      vehicles: state.vehicles.map((vehicle) =>
        vehicle.id === id
          ? { ...updated, listingsCount: vehicle.listingsCount }
          : vehicle,
      ),
    }));
  },

  removeVehicle: async (id) => {
    const repos = await getRepositories();
    await repos.vehicles.remove(id);
    set((state) => ({
      vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
    }));
  },

  getVehicle: async (id) => {
    const repos = await getRepositories();
    return repos.vehicles.getById(id);
  },
}));
