import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDecision } from '../services/decisionService';
import { useAuth } from '../context/AuthContext';

function NewDecision() {
  const [title, setTitle] = useState('');
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
        const data = await createDecision(title, choiceA, choiceB, description);
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
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Choice A"
          value={choiceA}
          onChange={(e) => setChoiceA(e.target.value)}
        />
        <input
          type="text"
          placeholder="Choice B"
          value={choiceB}
          onChange={(e) => setChoiceB(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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