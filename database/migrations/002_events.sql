-- Events table for calendar
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  ends_at TEXT,
  location TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%fZ','now'))
);
