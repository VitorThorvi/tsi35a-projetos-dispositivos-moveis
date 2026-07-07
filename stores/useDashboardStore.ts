import { create } from "zustand";

import { getRepositories } from "../database";
import type { DashboardStats } from "../schemas/statsSchema";
import type { Listing } from "../types/Listing";

const RECENT_LISTINGS_LIMIT = 5;

type DashboardState = {
  stats: DashboardStats | null;
  recentListings: Listing[];
  loading: boolean;
  loadDashboard: (uid: string) => Promise<void>;
  loadStats: (uid: string) => Promise<void>;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  recentListings: [],
  loading: false,

  loadDashboard: async (uid) => {
    set({ loading: true });
    try {
      const repos = await getRepositories();
      const [stats, recentListings] = await Promise.all([
        repos.stats.getDashboardStats(uid),
        repos.stats.listRecentListings(uid, RECENT_LISTINGS_LIMIT),
      ]);
      set({ stats, recentListings });
    } finally {
      set({ loading: false });
    }
  },

  loadStats: async (uid) => {
    set({ loading: true });
    try {
      const repos = await getRepositories();
      set({ stats: await repos.stats.getDashboardStats(uid) });
    } finally {
      set({ loading: false });
    }
  },
}));
