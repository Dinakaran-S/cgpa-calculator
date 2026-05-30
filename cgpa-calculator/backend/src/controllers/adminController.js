const pool = require('../config/database');

// GET /api/admin/users — list all students
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, college_name, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/admin/grading-rules — list all rules
const getGradingRules = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM grading_rules ORDER BY college_name, min_marks DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// POST /api/admin/grading-rules — add or update a grading rule
const upsertGradingRule = async (req, res) => {
  const { college_name, grade, min_marks, max_marks, grade_point } = req.body;
  if (!college_name || !grade || min_marks == null || max_marks == null || grade_point == null) {
    return res.status(400).json({ error: 'All fields required.' });
  }

  try {
    await pool.query(
      `INSERT INTO grading_rules (college_name, grade, min_marks, max_marks, grade_point)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (college_name, grade) DO UPDATE
       SET min_marks = $3, max_marks = $4, grade_point = $5`,
      [college_name, grade, min_marks, max_marks, grade_point]
    );
    res.json({ message: 'Grading rule saved.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// DELETE /api/admin/grading-rules/:id
const deleteGradingRule = async (req, res) => {
  try {
    await pool.query('DELETE FROM grading_rules WHERE id = $1', [req.params.id]);
    res.json({ message: 'Rule deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { getAllUsers, getGradingRules, upsertGradingRule, deleteGradingRule };
