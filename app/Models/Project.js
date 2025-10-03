// Project Model using better-sqlite3
import { getDb, runMigrations } from '../../server/lib/db.js';

// Ensure migrations run once when model is imported
runMigrations();

export const Project = {
  findAll() {
    const db = getDb();
    const stmt = db.prepare('SELECT id, name, client, tech_stack, created_at FROM projects ORDER BY created_at DESC');
    return stmt.all();
  },

  create({ name, client, tech_stack }) {
    const db = getDb();
    const now = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO projects (name, client, tech_stack, created_at) VALUES (?, ?, ?, ?)');
    const info = stmt.run(name, client, tech_stack, now);
    return info.lastInsertRowid;
  }
};
