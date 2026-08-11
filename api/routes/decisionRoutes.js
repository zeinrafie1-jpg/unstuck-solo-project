const express = require('express');
const router = express.Router();
const { createDecision, getDecisions, getDecisionById, deleteDecision, addFollowUp } = require('../controllers/decisionController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createDecision);
router.get('/', protect, getDecisions);
router.get('/:id', protect, getDecisionById);
router.delete('/:id', protect, deleteDecision);
router.post('/:id/followup', protect, addFollowUp);

module.exports = router;