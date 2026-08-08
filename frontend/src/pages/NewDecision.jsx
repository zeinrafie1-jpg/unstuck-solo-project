import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDecision } from '../services/decisionService';

function NewDecision() {
  const [choiceA, setChoiceA] = useState('');
  const [choiceB, setChoiceB] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const data = await createDecision(choiceA, choiceB, description);
      setResult(data);
    } catch (error) {
      setError('Error creating decision. Please try again.');
      console.error('Error creating decision:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="decision-result">
        <h1>{result.title}</h1>

        <section className="result-section">
          <h2>What's really going on</h2>
          <p>{result.situation}</p>
        </section>

        <section className="result-section">
          <h2>The actual tradeoff</h2>
          <p>{result.tradeoff}</p>
        </section>

        <section className="result-section">
          <h2>Avoidance check</h2>
          <p>{result.avoidanceCheck}</p>
        </section>

        <section className="result-section recommendation">
          <h2>The lean</h2>
          <p>{result.recommendation}</p>
        </section>

        <button onClick={() => navigate('/my-decisions')}>
          Done — view my decisions
        </button>
      </div>
    );
  }

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