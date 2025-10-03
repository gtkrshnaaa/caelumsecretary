// Event Model
// Comments in English only
import { getDb, runMigrations } from '../../server/lib/db.js';
runMigrations();

export const Event = {
  findAll() {
    const db = getDb();
    const stmt = db.prepare('SELECT id, title, starts_at, ends_at, location, notes, created_at FROM events ORDER BY starts_at ASC');
    return stmt.all();
  },
  create({ title, starts_at, ends_at = null, location = null, notes = null }) {
    const db = getDb();
    const stmt = db.prepare('INSERT INTO events (title, starts_at, ends_at, location, notes) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(title, starts_at, ends_at, location, notes);
    return info.lastInsertRowid;
  },
  update(id, payload) {
    const fields = ['title','starts_at','ends_at','location','notes'];
    const sets = [];
    const values = [];
    for (const f of fields) {
      if (payload[f] !== undefined) { sets.push(`${f} = ?`); values.push(payload[f]); }
    }
    if (!sets.length) return 0;
    const db = getDb();
    const stmt = db.prepare(`UPDATE events SET ${sets.join(', ')} WHERE id = ?`);
    const info = stmt.run(...values, id);
    return info.changes;
  },
  remove(id) {
    const db = getDb();
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    const info = stmt.run(id);
    return info.changes;
  }
};
