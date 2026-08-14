import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDecisions, deleteDecision } from '../services/decisionService';
import NavBar from '../components/NavBar';

function MyDecisions() {
  const [decisions, setDecisions] = useState([]);

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const data = await getDecisions();
        setDecisions(data);
      } catch (error) {
        console.error('Error fetching decisions:', error);
      }
    };

    fetchDecisions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDecision(id);
      // Functional form — React hands you the guaranteed-current state as an argument 
      setDecisions((prevDecisions) => prevDecisions.filter((decision) => decision._id !== id));
    } catch (error) {
      console.error('Error deleting decision:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-3xl mx-auto mt-10 px-6">
        <h1 className="text-2xl font-semibold text-text-primary mb-6">
          My Decisions
        </h1>

        {decisions.length === 0 ? (
          <div className="bg-surface rounded-xl p-8 text-center">
            <p className="text-text-secondary mb-4">
              You haven't made any decisions yet.
            </p>
            <Link
              to="/new-decision"
              className="inline-block bg-accent hover:bg-accent-dark text-surface px-4 py-2 rounded-lg font-medium"
            >
              Start your first one
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {decisions.map((decision) => (
              <div
                key={decision._id}
                className="bg-surface rounded-xl p-5 flex items-center justify-between hover:border-accent border border-border transition-colors"
              >
                <Link to={`/decisions/${decision._id}`} className="flex-1">
                  <h3 className="text-text-primary font-medium mb-1">
                    {decision.title}
                  </h3>
                  {decision.recommendedChoice && (
                    <span className="inline-block bg-accent-light text-accent-dark text-xs font-medium px-3 py-1 rounded-full">
                      ✓ {decision.recommendedChoice}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => handleDelete(decision._id)}
                  className="text-muted-text hover:text-red-600 text-sm font-medium ml-4"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDecisions;