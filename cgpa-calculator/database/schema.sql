-- ============================================
-- CGPA Calculator Database Schema
-- Run this file once to initialize the database
-- ============================================

-- Users table (students + admins)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  college_name VARCHAR(200) DEFAULT 'Amrita Vishwa Vidyapeetham',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Grading rules per college
CREATE TABLE IF NOT EXISTS grading_rules (
  id SERIAL PRIMARY KEY,
  college_name VARCHAR(200) NOT NULL,
  grade VARCHAR(5) NOT NULL,
  min_marks INTEGER NOT NULL,
  max_marks INTEGER NOT NULL,
  grade_point NUMERIC(3,1) NOT NULL,
  UNIQUE(college_name, grade)
);

-- Subjects per semester per student
CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 12),
  name VARCHAR(200) NOT NULL,
  credits INTEGER NOT NULL CHECK (credits > 0),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Marks for each subject
CREATE TABLE IF NOT EXISTS marks (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  marks_obtained NUMERIC(5,2),
  grade VARCHAR(5),
  grade_point NUMERIC(3,1),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(subject_id)
);

-- Computed CGPA records (cached per semester)
CREATE TABLE IF NOT EXISTS cgpa_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  semester INTEGER NOT NULL,
  sgpa NUMERIC(4,2),
  total_credits INTEGER,
  computed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, semester)
);

-- ============================================
-- Seed: Amrita Vishwa Vidyapeetham grading rules
-- Source: B.Tech Regulations 2023 (R.16)
-- ============================================
INSERT INTO grading_rules (college_name, grade, min_marks, max_marks, grade_point) VALUES
  ('Amrita Vishwa Vidyapeetham', 'O',  91, 100, 10.0),
  ('Amrita Vishwa Vidyapeetham', 'A+', 81,  90,  9.0),
  ('Amrita Vishwa Vidyapeetham', 'A',  71,  80,  8.0),
  ('Amrita Vishwa Vidyapeetham', 'B+', 61,  70,  7.0),
  ('Amrita Vishwa Vidyapeetham', 'B',  51,  60,  6.0),
  ('Amrita Vishwa Vidyapeetham', 'C',  45,  50,  5.0),
  ('Amrita Vishwa Vidyapeetham', 'F',   0,  44,  0.0)
ON CONFLICT (college_name, grade) DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subjects_user_semester ON subjects(user_id, semester);
CREATE INDEX IF NOT EXISTS idx_marks_user ON marks(user_id);
CREATE INDEX IF NOT EXISTS idx_cgpa_user ON cgpa_records(user_id);
