const pool = require('../config/database');
const { validationResult } = require('express-validator');

// ── Helpers ────────────────────────────────────────────────

// Fetch grading rules for a college from DB
const getGradingRules = async (collegeName) => {
  const result = await pool.query(
    'SELECT * FROM grading_rules WHERE college_name = $1 ORDER BY min_marks DESC',
    [collegeName]
  );
  return result.rows;
};

// Convert a marks value to grade + grade_point using college rules
const marksToGrade = (marks, rules) => {
  for (const rule of rules) {
    if (marks >= rule.min_marks && marks <= rule.max_marks) {
      return { grade: rule.grade, grade_point: parseFloat(rule.grade_point) };
    }
  }
  return { grade: 'F', grade_point: 0 };
};

// SGPA = Σ(credit × grade_point) / Σ(credit)
const computeSGPA = (subjects) => {
  let totalWeighted = 0;
  let totalCredits = 0;
  for (const s of subjects) {
    totalWeighted += s.credits * s.grade_point;
    totalCredits += s.credits;
  }
  if (totalCredits === 0) return 0;
  return parseFloat((totalWeighted / totalCredits).toFixed(2));
};

// CGPA = Σ(semesterCredits × SGPA) / Σ(semesterCredits)
const computeCGPA = (semesterRecords) => {
  let totalWeighted = 0;
  let totalCredits = 0;
  for (const rec of semesterRecords) {
    totalWeighted += rec.total_credits * rec.sgpa;
    totalCredits += rec.total_credits;
  }
  if (totalCredits === 0) return 0;
  return parseFloat((totalWeighted / totalCredits).toFixed(2));
};

// ── Controllers ────────────────────────────────────────────

// POST /api/gpa/subject  — add a subject with marks
const addSubject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { semester, name, credits, marks_obtained } = req.body;
  const userId = req.user.id;

  try {
    // Get user's college grading rules
    const userResult = await pool.query('SELECT college_name FROM users WHERE id = $1', [userId]);
    const collegeName = userResult.rows[0].college_name;
    const rules = await getGradingRules(collegeName);

    const { grade, grade_point } = marksToGrade(parseFloat(marks_obtained), rules);

    // Insert subject
    const subjectResult = await pool.query(
      `INSERT INTO subjects (user_id, semester, name, credits)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, semester, name, credits]
    );
    const subject = subjectResult.rows[0];

    // Insert marks
    await pool.query(
      `INSERT INTO marks (subject_id, user_id, marks_obtained, grade, grade_point)
       VALUES ($1, $2, $3, $4, $5)`,
      [subject.id, userId, marks_obtained, grade, grade_point]
    );

    // Recompute & cache SGPA for this semester
    await recomputeSGPA(userId, semester);

    res.status(201).json({
      message: 'Subject added.',
      subject: { ...subject, marks_obtained, grade, grade_point },
    });
  } catch (err) {
    console.error('addSubject error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// PUT /api/gpa/subject/:id — update subject marks
const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { marks_obtained, credits, name } = req.body;
  const userId = req.user.id;

  try {
    // Verify ownership
    const check = await pool.query('SELECT * FROM subjects WHERE id = $1 AND user_id = $2', [id, userId]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Subject not found.' });

    const subject = check.rows[0];

    if (credits) {
      await pool.query('UPDATE subjects SET credits = $1, name = $2 WHERE id = $3', [credits, name || subject.name, id]);
    }

    if (marks_obtained !== undefined) {
      const userResult = await pool.query('SELECT college_name FROM users WHERE id = $1', [userId]);
      const rules = await getGradingRules(userResult.rows[0].college_name);
      const { grade, grade_point } = marksToGrade(parseFloat(marks_obtained), rules);

      await pool.query(
        `UPDATE marks SET marks_obtained = $1, grade = $2, grade_point = $3
         WHERE subject_id = $4`,
        [marks_obtained, grade, grade_point, id]
      );
    }

    await recomputeSGPA(userId, subject.semester);

    res.json({ message: 'Subject updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// DELETE /api/gpa/subject/:id
const deleteSubject = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const check = await pool.query('SELECT * FROM subjects WHERE id = $1 AND user_id = $2', [id, userId]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Subject not found.' });

    const { semester } = check.rows[0];
    await pool.query('DELETE FROM subjects WHERE id = $1', [id]); // cascades to marks
    await recomputeSGPA(userId, semester);

    res.json({ message: 'Subject deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/gpa/report — full student report with all semesters
const getReport = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch all subjects + marks
    const result = await pool.query(
      `SELECT s.id, s.semester, s.name, s.credits,
              m.marks_obtained, m.grade, m.grade_point
       FROM subjects s
       LEFT JOIN marks m ON m.subject_id = s.id
       WHERE s.user_id = $1
       ORDER BY s.semester, s.name`,
      [userId]
    );

    // Group by semester
    const semesters = {};
    for (const row of result.rows) {
      if (!semesters[row.semester]) semesters[row.semester] = [];
      semesters[row.semester].push(row);
    }

    // Build semester summaries
    const semesterSummaries = Object.entries(semesters).map(([sem, subjects]) => {
      const sgpa = computeSGPA(subjects.filter(s => s.grade_point !== null));
      const totalCredits = subjects.reduce((acc, s) => acc + s.credits, 0);
      const failedSubjects = subjects.filter(s => s.grade === 'F');
      return {
        semester: parseInt(sem),
        subjects,
        sgpa,
        total_credits: totalCredits,
        failed_count: failedSubjects.length,
      };
    });

    // Overall CGPA
    const cgpaRecords = await pool.query(
      'SELECT sgpa, total_credits FROM cgpa_records WHERE user_id = $1',
      [userId]
    );
    const cgpa = computeCGPA(cgpaRecords.rows);

    // Classification
    let classification = '';
    if (cgpa >= 8.5) classification = 'First Class with Distinction';
    else if (cgpa >= 6.5) classification = 'First Class';
    else if (cgpa >= 5.5) classification = 'Second Class';
    else if (cgpa >= 5.0) classification = 'Pass';
    else classification = 'Below Pass';

    res.json({ semesters: semesterSummaries, cgpa, classification });
  } catch (err) {
    console.error('getReport error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// POST /api/gpa/calculate — quick calculate without saving (just marks + credits array)
const quickCalculate = async (req, res) => {
  const { subjects, college_name } = req.body;
  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
    return res.status(400).json({ error: 'Provide an array of subjects.' });
  }

  try {
    const collegeName = college_name || 'Amrita Vishwa Vidyapeetham';
    const rules = await getGradingRules(collegeName);

    const computed = subjects.map((s) => {
      const { grade, grade_point } = marksToGrade(parseFloat(s.marks_obtained), rules);
      return { ...s, grade, grade_point };
    });

    const sgpa = computeSGPA(computed);

    let classification = '';
    if (sgpa >= 8.5) classification = 'First Class with Distinction';
    else if (sgpa >= 6.5) classification = 'First Class';
    else if (sgpa >= 5.5) classification = 'Second Class';
    else if (sgpa >= 5.0) classification = 'Pass';
    else classification = 'Below Pass';

    res.json({ subjects: computed, sgpa, classification });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// ── Internal: recompute & upsert SGPA for a semester ──────
const recomputeSGPA = async (userId, semester) => {
  const result = await pool.query(
    `SELECT s.credits, m.grade_point
     FROM subjects s
     JOIN marks m ON m.subject_id = s.id
     WHERE s.user_id = $1 AND s.semester = $2`,
    [userId, semester]
  );

  const sgpa = computeSGPA(result.rows);
  const totalCredits = result.rows.reduce((acc, r) => acc + r.credits, 0);

  await pool.query(
    `INSERT INTO cgpa_records (user_id, semester, sgpa, total_credits)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, semester) DO UPDATE
     SET sgpa = $3, total_credits = $4, computed_at = NOW()`,
    [userId, semester, sgpa, totalCredits]
  );
};

module.exports = { addSubject, updateSubject, deleteSubject, getReport, quickCalculate };
