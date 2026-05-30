const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { getAllUsers, getGradingRules, upsertGradingRule, deleteGradingRule } = require('../controllers/adminController');

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.get('/users', getAllUsers);
router.get('/grading-rules', getGradingRules);
router.post('/grading-rules', upsertGradingRule);
router.delete('/grading-rules/:id', deleteGradingRule);

module.exports = router;
