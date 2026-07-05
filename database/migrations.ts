import type { SQLiteDatabase } from 'expo-sqlite';

type Migration = {
  version: number;
  up(db: SQLiteDatabase): Promise<void>;
};

const migrations: Migration[] = [
  {
    version: 1,
    async up(db) {
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS vehicles (
           id         TEXT PRIMARY KEY NOT NULL,
           user_id    TEXT NOT NULL,            -- Firebase UID or 'local' guest sentinel (no FK)
           brand      TEXT NOT NULL,
           model      TEXT NOT NULL,
           year_start INTEGER,                  -- nullable optional range
           year_end   INTEGER,                  -- nullable
           notes      TEXT,
           created_at TEXT NOT NULL,
           updated_at TEXT NOT NULL
         );
         CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);

         CREATE TABLE IF NOT EXISTS listings (
           id           TEXT PRIMARY KEY NOT NULL,
           vehicle_id   TEXT NOT NULL,
           source_url   TEXT,
           marketplace  TEXT,                   -- 'olx' | 'webmotors' | 'mercado_livre' | 'outro'
           brand        TEXT NOT NULL,
           model        TEXT NOT NULL,
           year         INTEGER NOT NULL,
           mileage_km   INTEGER NOT NULL,
           asking_price REAL NOT NULL,
           location     TEXT,
           photos       TEXT NOT NULL DEFAULT '[]',  -- JSON array of image URIs
           created_at   TEXT NOT NULL,
           updated_at   TEXT NOT NULL,
           FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
         );
         CREATE INDEX IF NOT EXISTS idx_listings_vehicle_id ON listings(vehicle_id);

         CREATE TABLE IF NOT EXISTS evaluations (
           id           TEXT PRIMARY KEY NOT NULL,
           listing_id   TEXT NOT NULL UNIQUE,   -- 1:1 with listing
           general_cond INTEGER NOT NULL,       -- 1..5
           price_vs_mkt INTEGER NOT NULL,       -- 1..5
           maint_hist   INTEGER NOT NULL,       -- 1..5
           score        REAL NOT NULL,          -- 0..10 = ((general_cond+price_vs_mkt+maint_hist)/3)*2
           pros         TEXT NOT NULL DEFAULT '[]',  -- JSON array of strings
           cons         TEXT NOT NULL DEFAULT '[]',  -- JSON array of strings
           created_at   TEXT NOT NULL,
           updated_at   TEXT NOT NULL,
           FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
         );
         CREATE INDEX IF NOT EXISTS idx_evaluations_listing_id ON evaluations(listing_id);`,
      );
    },
  },
];

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS schema_version (
       version    INTEGER PRIMARY KEY,
       applied_at TEXT NOT NULL
     );`,
  );

  const current = await db.getFirstAsync<{ version: number | null }>(
    'SELECT MAX(version) AS version FROM schema_version;',
  );
  const currentVersion = current?.version ?? 0;

  for (const migration of migrations) {
    if (migration.version <= currentVersion) {
      continue;
    }
    await db.withTransactionAsync(async () => {
      await migration.up(db);
      await db.runAsync(
        'INSERT INTO schema_version (version, applied_at) VALUES (?, ?);',
        [migration.version, new Date().toISOString()],
      );
    });
  }
}
