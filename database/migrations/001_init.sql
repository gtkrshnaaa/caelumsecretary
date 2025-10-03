-- Initial schema for Caelum Secretary (projects only for start)
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  client TEXT,
  tech_stack TEXT,
  created_at TEXT NOT NULL
);
