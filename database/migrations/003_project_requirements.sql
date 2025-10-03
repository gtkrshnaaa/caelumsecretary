-- Project requirements table
CREATE TABLE IF NOT EXISTS project_requirements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);
