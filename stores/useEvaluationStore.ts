import { create } from "zustand";

import { getRepositories } from "../database";
import type { EvaluationInput } from "../schemas/evaluationSchema";
import type { Evaluation } from "../types/Evaluation";

type EvaluationState = {
  byListing: Record<string, Evaluation | null>;
  loadByListing: (listingId: string) => Promise<void>;
  saveEvaluation: (input: EvaluationInput & { listingId: string }) => Promise<void>;
  removeEvaluation: (listingId: string) => Promise<void>;
};

export const useEvaluationStore = create<EvaluationState>((set) => ({
  byListing: {},

  loadByListing: async (listingId) => {
    const repos = await getRepositories();
    const evaluation = await repos.evaluations.getByListing(listingId);
    set((state) => ({
      byListing: { ...state.byListing, [listingId]: evaluation },
    }));
  },

  saveEvaluation: async (input) => {
    const repos = await getRepositories();
    const saved = await repos.evaluations.upsert(input);
    set((state) => ({
      byListing: { ...state.byListing, [input.listingId]: saved },
    }));
  },

  removeEvaluation: async (listingId) => {
    const repos = await getRepositories();
    await repos.evaluations.remove(listingId);
    set((state) => ({
      byListing: { ...state.byListing, [listingId]: null },
    }));
  },
}));
