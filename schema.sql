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

-- Student → counselor reverse sync.
-- Task completion ticks (per student, whole map as JSON keyed by day/shift).
CREATE TABLE IF NOT EXISTS task_progress (
  student_id    TEXT PRIMARY KEY,
  progress_json TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

-- Daily reports submitted by students, readable by counselor/admin (and parents).
CREATE TABLE IF NOT EXISTS daily_reports (
  id           TEXT PRIMARY KEY,
  student_id   TEXT NOT NULL,
  student_name TEXT,
  text         TEXT NOT NULL,
  created_at   TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_daily_reports_student ON daily_reports(student_id);
CREATE INDEX IF NOT EXISTS idx_daily_reports_created ON daily_reports(created_at);

-- Rate limiting (brute-force protection for login / OTP).
CREATE TABLE IF NOT EXISTS rate_limits (
  key          TEXT PRIMARY KEY,
  count        INTEGER NOT NULL,
  window_start TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);

-- Zarinpal payment sessions: store the amount per authority so verify can
-- confirm the exact amount (Zarinpal requires the same amount at verify time).
CREATE TABLE IF NOT EXISTS payment_sessions (
  authority  TEXT PRIMARY KEY,
  amount     INTEGER NOT NULL,
  student_id TEXT,
  created_at TEXT NOT NULL
);

-- پاسخ‌های تست کاربران ربات (تلگرام/بله) برای داشبورد و تحلیل روانشناسی
CREATE TABLE IF NOT EXISTS bot_quiz_log (
  id         TEXT PRIMARY KEY,
  platform   TEXT NOT NULL,          -- telegram | bale
  chat_id    TEXT NOT NULL,
  subject    TEXT,
  field      TEXT,
  year       TEXT,
  correct    INTEGER NOT NULL,       -- 1 درست / 0 غلط
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_bot_quiz_chat ON bot_quiz_log (platform, chat_id, created_at);

-- آخرین سوال فعال هر کاربر ربات (برای پاسخ عددی در بله که دکمه ندارد)
CREATE TABLE IF NOT EXISTS bot_quiz_state (
  platform    TEXT NOT NULL,
  chat_id     TEXT NOT NULL,
  qi          INTEGER NOT NULL,
  correct_idx INTEGER NOT NULL,
  created_at  TEXT NOT NULL,
  PRIMARY KEY (platform, chat_id)
);

-- پروفایل ثبت‌نام کاربران ربات (رشته/پایه) برای تست شخصی‌سازی‌شده
CREATE TABLE IF NOT EXISTS bot_profiles (
  platform   TEXT NOT NULL,
  chat_id    TEXT NOT NULL,
  name       TEXT,
  field      TEXT,
  grade      TEXT,
  step       TEXT NOT NULL DEFAULT 'field',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (platform, chat_id)
);

-- ستون‌های معدل و سن پروفایل ربات (v2)
-- ALTER TABLE bot_profiles ADD COLUMN gpa REAL;
-- ALTER TABLE bot_profiles ADD COLUMN age INTEGER;
