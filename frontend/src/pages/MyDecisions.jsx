import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDecisions, deleteDecision } from '../services/decisionService';

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
    <div>
      <h1>My Decisions</h1>
      {decisions.length === 0 ? (
        <p>You haven't made any decisions yet. Start your first one!</p>
      ) : (
        <ul>
          {decisions.map((decision) => (
            <li key={decision._id}>
              <Link to={`/decisions/${decision._id}`}>
                <h3>{decision.title}</h3>
                {decision.recommendedChoice && (
                  <span className="badge">✓ {decision.recommendedChoice}</span>
                )}
              </Link>
              <button
                onClick={() => handleDelete(decision._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


export default MyDecisions;