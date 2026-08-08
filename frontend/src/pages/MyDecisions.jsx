import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDecisions } from '../services/decisionService';

function MyDecisions() {
  const { user } = useAuth();
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

  return (
    <div>
      <h1>My Decisions</h1>
      {decisions.length === 0 ? (
        <p>You haven't made any decisions yet. Start your first one!</p>
      ) : (
        <ul>
          {decisions.map((decision) => (
            <li key={decision._id}>
              <h3>{decision.title}</h3>
              {decision.recommendedChoice && (
                <span className="badge">✓ {decision.recommendedChoice}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyDecisions;