export type Vehicle = {
  id: string;
  userId: string;
  brand: string;
  model: string;
  yearStart: number | null;
  yearEnd: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VehicleWithCounts = Vehicle & {
  listingsCount: number;
};
