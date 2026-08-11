const Decision = require('../models/Decision');
const { getDecisionAnalysis, streamFollowUp } = require('../services/aiService'); // Import the AI service function
const Anthropic = require('@anthropic-ai/sdk'); 
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Create a new decision
const createDecision = async (req, res) => {
  try {
    const { choiceA, choiceB, description } = req.body;
    if (!choiceA || !choiceB || !description) {
      return res.status(400).json({ message: 'ChoiceA, choiceB, and description are required' });
    }
    const userId = req.userId; // set by the protect middleware after verifying the JWT
    
    const aiAnalysis = await getDecisionAnalysis(choiceA, choiceB, description);

    const decision = await Decision.create({
      title: aiAnalysis.title,
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

const addFollowUp = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    const decision = await Decision.findOne({ _id: req.params.id, userId });
    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    decision.followUpConversation.push({ role: 'user', content: message });

    let fullResponse = '';

    const context = `You are continuing a conversation about this decision:
Options: ${decision.choiceA} vs ${decision.choiceB}
Original context: ${decision.description}
Your original analysis: ${decision.recommendation}
The user now says: ${message}
Respond conversationally and directly, building on your original analysis. Keep it concise.`;

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [{ role: 'user', content: context }],
    });

    stream.on('text', (text) => {
      fullResponse += text;
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    });

    stream.on('end', async () => {
      decision.followUpConversation.push({ role: 'assistant', content: fullResponse });
      await decision.save();
      res.write('data: [DONE]\n\n');
      res.end();
    });

    stream.on('error', (error) => {
      console.error('Streaming error:', error);
      res.end();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Export the controller functions
module.exports = { createDecision, getDecisions, getDecisionById, deleteDecision, addFollowUp };