import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDecision } from '../services/decisionService';
import NavBar from '../components/NavBar';
import { Compass } from 'lucide-react';

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
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-surface rounded-xl shadow-sm">
          <h1 className="text-xl font-semibold text-text-primary mb-6">
            {result.title}
          </h1>

          <div className="bg-accent rounded-xl p-5 mb-4 flex gap-4 items-start">
            {/* <Compass size={28} className="text-accent-on flex-shrink-0 mt-1" /> */}
            <div>
              <p className="text-xs font-medium text-accent-on mb-1">The lean</p>
              <p className="text-lg font-medium text-surface mb-2">{result.recommendedChoice}</p>
              <p className="text-sm text-accent-on leading-relaxed">{result.recommendation}</p>
            </div>
          </div>

          <div className="bg-muted rounded-xl p-5 mb-4">
            <p className="text-xs font-medium text-text-secondary mb-1">What's really going on</p>
            <p className="text-sm text-text-muted leading-relaxed">{result.situation}</p>
          </div>

          <div className="bg-muted rounded-xl p-5 mb-4">
            <p className="text-xs font-medium text-text-secondary mb-1">The actual tradeoff</p>
            <p className="text-sm text-text-muted leading-relaxed">{result.tradeoff}</p>
          </div>

          <div className="bg-accent-light rounded-xl p-5 mb-6">
            <p className="text-xs font-medium text-accent-dark mb-1">Avoidance check</p>
            <p className="text-sm text-accent-dark leading-relaxed">{result.avoidanceCheck}</p>
          </div>

          <button
            onClick={() => navigate('/my-decisions')}
            className="w-full bg-accent hover:bg-accent-dark text-surface px-4 py-2 rounded-lg font-medium"
          >
            View my Decisions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
    <NavBar />
    <div className="max-w-2xl mx-auto mt-10 px-6">
      <h1 className="text-2xl font-semibold text-text-primary mb-2">
        Create a New Decision
      </h1>
      <p className="text-sm text-text-secondary mb-6">
        Describe the two options and what's making it hard to decide. We'll help you think it through.
      </p>

      <div className="p-8 bg-surface rounded-xl shadow-sm">
        <form onSubmit={handleSubmit}>
          <label className="block text-sm text-text-secondary mb-1">
            What are the two options you're stuck between?
          </label>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input
              type="text"
              id="choiceA"
              placeholder="Option A"
              value={choiceA}
              onChange={(e) => setChoiceA(e.target.value)}
              maxLength={60}
              className="border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="text"
              placeholder="Option B"
              value={choiceB}
              onChange={(e) => setChoiceB(e.target.value)}
              maxLength={60}
              className="border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <label htmlFor="description" className="block text-sm text-text-secondary mb-1">
            What's making this hard to decide?
          </label>
          <textarea
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1500}
            rows={4}
            className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent mb-4 resize-none"
          />

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent-dark text-surface px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Thinking it through...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  </div>
  );
}

export default NewDecision;