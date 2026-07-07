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
