const Decision = require('../models/Decision');
const { getDecisionAnalysis } = require('../services/aiService'); // Import the AI service function


// Create a new decision
const createDecision = async (req, res) => {
  try {
    const { choiceA, choiceB, description } = req.body;
    if (!choiceA || !choiceB || !description) {
      return res.status(400).json({ message: 'ChoiceA, choiceB, and description are required' });
    }
    const title = `${choiceA} or ${choiceB}?`; // Create a title based on the choices
    const userId = req.userId; // set by the protect middleware after verifying the JWT
    
    const aiAnalysis = await getDecisionAnalysis(choiceA, choiceB, description);

    const decision = await Decision.create({
      title,
      choiceA,
      choiceB,
      description,
      userId,
      situation: aiAnalysis.situation,
      tradeoff: aiAnalysis.tradeoff,
      avoidanceCheck: aiAnalysis.avoidanceCheck,
      recommendation: aiAnalysis.recommendation,
      recommendedChoice: aiAnalysis.recommendedChoice
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