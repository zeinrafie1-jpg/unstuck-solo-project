const API_URL = import.meta.env.VITE_API_URL;

export async function createDecision(choiceA, choiceB, description, token) {
  const response = await fetch(`${API_URL}/decisions`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include', // this can be removed. doesn't do anything functionally anymore
    body: JSON.stringify({choiceA, choiceB, description }),
  });   

  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.message || 'Failed to create decision');
  }

  return data;
}

export async function getDecisions(token) {
  const response = await fetch(`${API_URL}/decisions`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.message || 'Failed to get decisions');
  }

  return data;
}  

export async function getDecisionById(id, token) {
  const response = await fetch(`${API_URL}/decisions/${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.message || 'Failed to get decision');
  }

  return data;
}

export async function deleteDecision(id, token) {
  const response = await fetch(`${API_URL}/decisions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });
  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.message || 'Failed to delete decision');
  }

  return data;
}
// this function will be used to send a follow-up message to the AI and receive a streamed response
export async function streamFollowUp(decisionId, message, token, onChunk) {
  const response = await fetch(`${API_URL}/decisions/${decisionId}/followup`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({ message }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

    for (const line of lines) {
      const data = line.replace('data: ', '');
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data);
        if (parsed.text) {
          onChunk(parsed.text);
        }
      } catch (e) {
        console.error('Failed to parse chunk:', e);
      }
    }
  }
}