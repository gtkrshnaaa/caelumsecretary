// Task Model
// Comments in English only
import { getDb, runMigrations } from '../../server/lib/db.js';
runMigrations();

export const Task = {
  findByProject(project_id) {
    const db = getDb();
    const stmt = db.prepare('SELECT id, project_id, title, status, due_date, created_at FROM tasks WHERE project_id = ? ORDER BY created_at DESC');
    return stmt.all(project_id);
  },
  create({ project_id, title, status = 'todo', due_date = null }) {
    const db = getDb();
    const stmt = db.prepare('INSERT INTO tasks (project_id, title, status, due_date) VALUES (?, ?, ?, ?)');
    const info = stmt.run(project_id, title, status, due_date);
    return info.lastInsertRowid;
  },
  update(id, payload) {
    const fields = ['title','status','due_date'];
    const sets = [];
    const values = [];
    for (const f of fields) {
      if (payload[f] !== undefined) { sets.push(`${f} = ?`); values.push(payload[f]); }
    }
    if (!sets.length) return 0;
    const db = getDb();
    const stmt = db.prepare(`UPDATE tasks SET ${sets.join(', ')} WHERE id = ?`);
    const info = stmt.run(...values, id);
    return info.changes;
  },
  remove(id) {
    const db = getDb();
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const info = stmt.run(id);
    return info.changes;
  }
};
