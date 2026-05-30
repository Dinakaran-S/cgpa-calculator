const express = require('express');
const { body } = require('express-validator');
const { addSubject, updateSubject, deleteSubject, getReport, quickCalculate } = require('../controllers/gpaController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes require login
router.use(authMiddleware);

router.post('/subject', [
  body('semester').isInt({ min: 1, max: 12 }).withMessage('Semester must be 1–12.'),
  body('name').trim().notEmpty().withMessage('Subject name required.'),
  body('credits').isInt({ min: 1 }).withMessage('Credits must be a positive integer.'),
  body('marks_obtained').isFloat({ min: 0, max: 100 }).withMessage('Marks must be 0–100.'),
], addSubject);

router.put('/subject/:id', updateSubject);
router.delete('/subject/:id', deleteSubject);
router.get('/report', getReport);

// Quick calculate — no auth needed, useful for guest mode
router.post('/calculate', quickCalculate);

module.exports = router;
