import { create } from "zustand";

import { getRepositories } from "../database";
import type { ListingInput } from "../schemas/listingSchema";
import type { Listing, ListingWithEvaluation } from "../types/Listing";

type ListingState = {
  listingsByVehicle: Record<string, Listing[]>;
  loading: boolean;
  loadByVehicle: (vehicleId: string) => Promise<void>;
  addListing: (input: ListingInput, vehicleId: string) => Promise<void>;
  updateListing: (id: string, input: ListingInput) => Promise<void>;
  removeListing: (id: string, vehicleId: string) => Promise<void>;
  getListing: (id: string) => Promise<ListingWithEvaluation | null>;
};

export const useListingStore = create<ListingState>((set) => ({
  listingsByVehicle: {},
  loading: false,

  loadByVehicle: async (vehicleId) => {
    set({ loading: true });
    try {
      const repos = await getRepositories();
      const rows = await repos.listings.listByVehicle(vehicleId);
      set((state) => ({
        listingsByVehicle: { ...state.listingsByVehicle, [vehicleId]: rows },
      }));
    } finally {
      set({ loading: false });
    }
  },

  addListing: async (input, vehicleId) => {
    const repos = await getRepositories();
    const created = await repos.listings.create({ ...input, vehicleId });
    set((state) => ({
      listingsByVehicle: {
        ...state.listingsByVehicle,
        [vehicleId]: [created, ...(state.listingsByVehicle[vehicleId] ?? [])],
      },
    }));
  },

  updateListing: async (id, input) => {
    const repos = await getRepositories();
    const updated = await repos.listings.update(id, input);
    set((state) => ({
      listingsByVehicle: {
        ...state.listingsByVehicle,
        [updated.vehicleId]: (
          state.listingsByVehicle[updated.vehicleId] ?? []
        ).map((listing) => (listing.id === id ? updated : listing)),
      },
    }));
  },

  removeListing: async (id, vehicleId) => {
    const repos = await getRepositories();
    await repos.listings.remove(id);
    set((state) => ({
      listingsByVehicle: {
        ...state.listingsByVehicle,
        [vehicleId]: (state.listingsByVehicle[vehicleId] ?? []).filter(
          (listing) => listing.id !== id,
        ),
      },
    }));
  },

  getListing: async (id) => {
    const repos = await getRepositories();
    return repos.listings.getById(id);
  },
}));
