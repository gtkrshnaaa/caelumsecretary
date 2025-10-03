-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo', -- todo | in-progress | done
  due_date TEXT,
  created_at TEXT NOT NULL DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);
