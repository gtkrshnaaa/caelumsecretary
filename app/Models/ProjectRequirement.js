// ProjectRequirement Model
// Comments in English only
import { getDb, runMigrations } from '../../server/lib/db.js';
runMigrations();

export const ProjectRequirement = {
  findByProject(project_id) {
    const db = getDb();
    const stmt = db.prepare('SELECT id, project_id, title, description, created_at FROM project_requirements WHERE project_id = ? ORDER BY created_at DESC');
    return stmt.all(project_id);
  },
  create({ project_id, title, description = null }) {
    const db = getDb();
    const stmt = db.prepare('INSERT INTO project_requirements (project_id, title, description) VALUES (?, ?, ?)');
    const info = stmt.run(project_id, title, description);
    return info.lastInsertRowid;
  },
  update(id, payload) {
    const fields = ['title','description'];
    const sets = [];
    const values = [];
    for (const f of fields) {
      if (payload[f] !== undefined) { sets.push(`${f} = ?`); values.push(payload[f]); }
    }
    if (!sets.length) return 0;
    const db = getDb();
    const stmt = db.prepare(`UPDATE project_requirements SET ${sets.join(', ')} WHERE id = ?`);
    const info = stmt.run(...values, id);
    return info.changes;
  },
  remove(id) {
    const db = getDb();
    const stmt = db.prepare('DELETE FROM project_requirements WHERE id = ?');
    const info = stmt.run(id);
    return info.changes;
  }
};
