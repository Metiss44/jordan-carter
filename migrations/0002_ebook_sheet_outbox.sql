CREATE TABLE ebook_sheet_outbox (
  request_id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  requested_at INTEGER NOT NULL,
  next_attempt INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  synced_at INTEGER,
  marker_id INTEGER,
  row_fingerprint TEXT
);

CREATE INDEX ebook_sheet_due ON ebook_sheet_outbox(next_attempt);

-- A new request and its pending Sheet row are committed together, including
-- when the email provider is unavailable or the Worker stops after capture.
CREATE TRIGGER ebook_sheet_new AFTER INSERT ON ebook_requests BEGIN
  INSERT INTO ebook_sheet_outbox (request_id,email,first_name,requested_at,next_attempt)
  VALUES (NEW.request_id,NEW.email,NEW.first_name,NEW.requested_at,NEW.requested_at);
END;

-- A genuine repeat after the 24h email window gets a new request_id; a
-- double-click, provider retry or update of sent_at never queues a second row.
CREATE TRIGGER ebook_sheet_repeat AFTER UPDATE OF request_id ON ebook_requests
WHEN OLD.request_id <> NEW.request_id BEGIN
  INSERT INTO ebook_sheet_outbox (request_id,email,first_name,requested_at,next_attempt)
  VALUES (NEW.request_id,NEW.email,NEW.first_name,NEW.requested_at,NEW.requested_at);
END;

INSERT INTO ebook_sheet_outbox (request_id,email,first_name,requested_at,next_attempt)
SELECT request_id,email,first_name,requested_at,requested_at FROM ebook_requests;
