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
        <h3>What are the two options you're stuck between?</h3>
        <input
          type="text"
          placeholder="Choice A"
          value={choiceA}
          onChange={(e) => setChoiceA(e.target.value)}
          maxLength={60}
        />
        <input
          type="text"
          placeholder="Choice B"
          value={choiceB}
          onChange={(e) => setChoiceB(e.target.value)}
          maxLength={60}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
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