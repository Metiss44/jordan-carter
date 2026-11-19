CREATE TABLE ebook_requests (
  email TEXT PRIMARY KEY COLLATE NOCASE,
  first_name TEXT NOT NULL,
  request_id TEXT NOT NULL UNIQUE,
  ebook_url TEXT NOT NULL,
  requested_at INTEGER NOT NULL,
  sent_at INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt INTEGER
);
CREATE INDEX ebook_pending ON ebook_requests(next_attempt) WHERE sent_at IS NULL;
CREATE INDEX ebook_retention ON ebook_requests(requested_at);
