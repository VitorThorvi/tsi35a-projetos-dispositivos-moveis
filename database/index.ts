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
  createVehicleRepository,
  type VehicleRepository,
} from './repositories/vehicleRepository';

export type Repositories = {
  vehicles: VehicleRepository;
  listings: ListingRepository;
  evaluations: EvaluationRepository;
};

export async function getRepositories(): Promise<Repositories> {
  const db = await getDb();
  return {
    vehicles: createVehicleRepository(db),
    listings: createListingRepository(db),
    evaluations: createEvaluationRepository(db),
  };
}
