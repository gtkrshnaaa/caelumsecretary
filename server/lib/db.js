// SQLite connection using better-sqlite3
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

let dbInstance = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  const root = path.resolve(process.cwd());
  const defaultPath = path.join(root, 'database', 'sqlite', 'sqlite.db');
  const dbPath = process.env.DATABASE_PATH || defaultPath;

  // Ensure directory exists
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  dbInstance = db;
  return dbInstance;
}

export function runMigrations() {
  const root = path.resolve(process.cwd());
  const migrationsDir = path.join(root, 'database', 'migrations');
  if (!fs.existsSync(migrationsDir)) return;

  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  const db = getDb();

  // Simple migration table
  db.exec(`CREATE TABLE IF NOT EXISTS _migrations (id TEXT PRIMARY KEY);`);

  const isApplied = db.prepare('SELECT 1 FROM _migrations WHERE id = ?').pluck();
  const insertMig = db.prepare('INSERT INTO _migrations (id) VALUES (?)');

  for (const file of files) {
    const id = file;
    const applied = isApplied.get(id);
    if (applied) continue;

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    db.exec(sql);
    insertMig.run(id);
    console.log(`[db] applied migration ${id}`);
  }
}
