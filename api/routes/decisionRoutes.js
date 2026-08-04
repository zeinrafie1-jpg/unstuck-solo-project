const express = require('express');
const router = express.Router();
const { createDecision, getDecisions, getDecisionById, deleteDecision } = require('../controllers/decisionController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createDecision);
router.get('/', protect, getDecisions);
router.get('/:id', protect, getDecisionById);
router.delete('/:id', protect, deleteDecision);

module.exports = router;