-- ============================================================
-- Taranom Mehr — Cloudflare D1 schema
-- Run with:  npx wrangler d1 execute taranom-mehr-db --remote --file=./schema.sql
-- (and again with --local for local dev)
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE,
  mobile        TEXT UNIQUE,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'student',
  field         TEXT NOT NULL DEFAULT 'tajrobi',
  grade         TEXT,
  city          TEXT,
  age            INTEGER,
  avatar        TEXT,
  target_major  TEXT,
  created_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS otp_codes (
  mobile     TEXT PRIMARY KEY,
  code       TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email  ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);

-- Counselor-authored plans shared across counselor and student devices.
CREATE TABLE IF NOT EXISTS study_plans (
  student_id    TEXT PRIMARY KEY,
  plan_json     TEXT NOT NULL,
  counselor_id  TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_study_plans_counselor ON study_plans(counselor_id);
