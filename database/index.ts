import { getDb } from './client';
import {
  createEvaluationRepository,
  type EvaluationRepository,
} from './repositories/evaluationRepository';
import {
  createListingRepository,
  type ListingRepository,
} from './repositories/listingRepository';
import {
  createStatsRepository,
  type StatsRepository,
} from './repositories/statsRepository';
import {
  createVehicleRepository,
  type VehicleRepository,
} from './repositories/vehicleRepository';

export type Repositories = {
  vehicles: VehicleRepository;
  listings: ListingRepository;
  evaluations: EvaluationRepository;
  stats: StatsRepository;
};

export async function getRepositories(): Promise<Repositories> {
  const db = await getDb();
  return {
    vehicles: createVehicleRepository(db),
    listings: createListingRepository(db),
    evaluations: createEvaluationRepository(db),
    stats: createStatsRepository(db),
  };
}
