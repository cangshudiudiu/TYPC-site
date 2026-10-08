CREATE TABLE IF NOT EXISTS guestbook_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  website TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TEXT NOT NULL,
  reviewed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_guestbook_status_created
ON guestbook_messages(status, created_at DESC);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  author TEXT NOT NULL,
  contact TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'zh',
  tags TEXT,
  source_url TEXT,
  attachments TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TEXT NOT NULL,
  reviewed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_submissions_status_created
ON submissions(status, created_at DESC);

CREATE TABLE IF NOT EXISTS request_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scope TEXT NOT NULL,
  client_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_request_log_scope_client_created
ON request_log(scope, client_hash, created_at DESC);
