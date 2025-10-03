-- Profile table
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT,
  role TEXT,
  preferences_json TEXT,
  ai_persona TEXT,
  updated_at TEXT NOT NULL DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- ensure single row exists
INSERT OR IGNORE INTO profile (id, name, role, preferences_json, ai_persona, updated_at)
VALUES (1, NULL, NULL, '{}', '{}', STRFTIME('%Y-%m-%dT%H:%M:%fZ','now'));
