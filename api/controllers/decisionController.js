const Decision = require('../models/Decision');

// Create a new decision
const createDecision = async (req, res) => {
  try {
    const { title, choiceA, choiceB, description } = req.body;
    if (!title || !choiceA || !choiceB || !description) {
      return res.status(400).json({ message: 'Title, choiceA, choiceB, and description are required' });
    }
    
    const userId = req.userId; // set by the protect middleware after verifying the JWT

    const decision = await Decision.create({
      title,
      choiceA,
      choiceB,
      description,
      userId
    });

    res.status(201).json(decision);
  } catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong, please try again' });
  }
};

// Get all decisions for the logged-in user
const getDecisions = async (req, res) => {
  try {
    const userId = req.userId; // set by the protect middleware after verifying the JWT
    const decisions = await Decision.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(decisions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
};

//get decision by id
const getDecisionById = async (req, res) => {
  try {
    const userId = req.userId; // set by the protect middleware after verifying the JWT
    const decision = await Decision.findOne({ _id: req.params.id, userId });
    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }
    res.status(200).json(decision);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
};

// Delete a decision by ID
const deleteDecision = async (req, res) => {
  try {
    const userId = req.userId; // set by the protect middleware after verifying the JWT
    const decision = await Decision.findOneAndDelete({ _id: req.params.id, userId });
    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }
    res.status(200).json({ message: 'Decision deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
};

// Export the controller functions
module.exports = { createDecision, getDecisions, getDecisionById, deleteDecision };