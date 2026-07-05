import { randomUUID } from 'expo-crypto';
import type { SQLiteDatabase } from 'expo-sqlite';

import { evaluationRowSchema, type EvaluationInput } from '../../schemas/evaluationSchema';
import type { Evaluation } from '../../types/Evaluation';
import { calculateScore } from '../../utils/scoreCalculator';

const EVALUATION_COLUMNS =
  'id, listing_id, general_cond, price_vs_mkt, maint_hist, score, ' +
  'pros, cons, created_at, updated_at';

export type EvaluationRepository = {
  getByListing(listingId: string): Promise<Evaluation | null>;
  upsert(input: EvaluationInput & { listingId: string }): Promise<Evaluation>;
  remove(listingId: string): Promise<void>;
};

export function createEvaluationRepository(db: SQLiteDatabase): EvaluationRepository {
  async function getByListing(listingId: string): Promise<Evaluation | null> {
    const row = await db.getFirstAsync<unknown>(
      `SELECT ${EVALUATION_COLUMNS} FROM evaluations WHERE listing_id = ?;`,
      [listingId],
    );
    return row ? evaluationRowSchema.parse(row) : null;
  }

  async function requireByListing(listingId: string): Promise<Evaluation> {
    const evaluation = await getByListing(listingId);
    if (!evaluation) {
      throw new Error(
        `Evaluation for listing ${listingId} vanished immediately after a write.`,
      );
    }
    return evaluation;
  }

  async function upsert(
    input: EvaluationInput & { listingId: string },
  ): Promise<Evaluation> {
    const score = calculateScore(input);
    const now = new Date().toISOString();
    const pros = JSON.stringify(input.pros);
    const cons = JSON.stringify(input.cons);

    const existing = await getByListing(input.listingId);
    if (existing) {
      await db.runAsync(
        `UPDATE evaluations
            SET general_cond = ?, price_vs_mkt = ?, maint_hist = ?, score = ?,
                pros = ?, cons = ?, updated_at = ?
          WHERE listing_id = ?;`,
        [
          input.generalCond,
          input.priceVsMkt,
          input.maintHist,
          score,
          pros,
          cons,
          now,
          input.listingId,
        ],
      );
    } else {
      await db.runAsync(
        `INSERT INTO evaluations
           (id, listing_id, general_cond, price_vs_mkt, maint_hist, score,
            pros, cons, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          randomUUID(),
          input.listingId,
          input.generalCond,
          input.priceVsMkt,
          input.maintHist,
          score,
          pros,
          cons,
          now,
          now,
        ],
      );
    }
    return requireByListing(input.listingId);
  }

  async function remove(listingId: string): Promise<void> {
    await db.runAsync('DELETE FROM evaluations WHERE listing_id = ?;', [
      listingId,
    ]);
  }

  return { getByListing, upsert, remove };
}
