// Profile Model
// Comments in English only
import { getDb, runMigrations } from '../../server/lib/db.js';
runMigrations();

export const Profile = {
  get() {
    const db = getDb();
    const stmt = db.prepare('SELECT id, name, role, preferences_json, ai_persona, updated_at FROM profile WHERE id = 1');
    return stmt.get();
  },
  update(payload) {
    const fields = ['name','role','preferences_json','ai_persona'];
    const sets = [];
    const values = [];
    for (const f of fields) {
      if (payload[f] !== undefined) { sets.push(`${f} = ?`); values.push(payload[f]); }
    }
    sets.push('updated_at = ?');
    values.push(new Date().toISOString());

    const db = getDb();
    const stmt = db.prepare(`UPDATE profile SET ${sets.join(', ')} WHERE id = 1`);
    const info = stmt.run(...values);
    return info.changes;
  }
};
