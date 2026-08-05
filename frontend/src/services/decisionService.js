const API_URL = import.meta.env.VITE_API_URL;

export async function createDecision(title, choiceA, choiceB, description) {
  const response = await fetch(`${API_URL}/decisions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ title, choiceA, choiceB, description }),
  });   

  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.message || 'Failed to create decision');
  }

  return data;
}

export async function getDecisions() {
  const response = await fetch(`${API_URL}/decisions`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.message || 'Failed to get decisions');
  }

  return data;
}  

export async function getDecisionById(id) {
  const response = await fetch(`${API_URL}/decisions/${id}`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.message || 'Failed to get decision');
  }

  return data;
}

export async function deleteDecision(id) {
  const response = await fetch(`${API_URL}/decisions/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.message || 'Failed to delete decision');
  }

  return data;
}