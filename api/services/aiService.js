// This file's job: take the user's choiceA, choiceB, and description
// send a well-crafted prompt to Anthropic, 
// and return the AI's response in a structured, parseable way.

const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Ask the AI to respond in JSON directly. This avoids fragile text-parsing (like splitting on headers, which breaks if the AI phrases things slightly differently each time).

async function getDecisionAnalysis(choiceA, choiceB, description) {
  const prompt = `You are a thoughtful, direct decision coach helping someone choose between two options. Be specific to what they've actually described — never generic.

Option A: ${choiceA}
Option B: ${choiceB}
Context: ${description}

Respond ONLY with valid JSON in exactly this shape, no other text, no markdown formatting, no code blocks:
{
  "title": "A short, clear question framing this decision (e.g. 'Should I go to the concert or stay in?'), max 15 words",
  "situation": "A short read on what's really going on emotionally or practically (1-2 sentences)",
  "tradeoff": "The genuine pros/cons of each option (2-3 sentences)",
  "avoidanceCheck": "Is any part of this avoidance/anxiety rather than a real downside? (1-2 sentences)",
  "recommendation": "A direct lean with reasoning, not just 'it's up to you' (2-3 sentences)",
  "recommendedChoice": "Either the exact text of Option A or Option B, whichever is recommended"
}`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  let responseText = response.content[0].text;

  // Strip markdown code fences if the AI added them despite instructions
  responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  return JSON.parse(responseText);
}

async function streamFollowUp(decision, userMessage, res) {
  const context = `You are continuing a conversation about this decision:

Options: ${decision.choiceA} vs ${decision.choiceB}
Original context: ${decision.description}
Your original analysis: ${decision.recommendation}

The user now says: ${userMessage}

Respond conversationally and directly, building on your original analysis. Keep it concise.`;

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{ role: 'user', content: context }],
  });

  stream.on('text', (text) => {
    res.write(`data: ${JSON.stringify({ text })}\n\n`);
  });

  stream.on('end', () => {
    res.write('data: [DONE]\n\n');
    res.end();
  });

  stream.on('error', (error) => {
    console.error('Streaming error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`);
    res.end();
  });
}

module.exports = { getDecisionAnalysis, streamFollowUp };

