import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDecision } from '../services/decisionService';
import { useAuth } from '../context/AuthContext';

function NewDecision() {
  const [choiceA, setChoiceA] = useState('');
  const [choiceB, setChoiceB] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
        const data = await createDecision(choiceA, choiceB, description);
        navigate('/my-decisions'); // Navigate to the MyDecisions page after successful creation (change this to the appropriate route if needed)
    } catch (error) {
        setError('Error creating decision. Please try again.');
        console.error('Error creating decision:', error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Create a New Decision</h1>
      <form onSubmit={handleSubmit}>
        <label>What are the two options you're stuck between?</label>
        <input
          type="text"
          id="choiceA"
          placeholder="Option A"
          value={choiceA}
          onChange={(e) => setChoiceA(e.target.value)}
          maxLength={60}
        />
        <input
          type="text"
          placeholder="Option B"
          value={choiceB}
          onChange={(e) => setChoiceB(e.target.value)}
          maxLength={60}
        />
        <label htmlFor="description">What's making this hard to decide?</label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1500}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default NewDecision;