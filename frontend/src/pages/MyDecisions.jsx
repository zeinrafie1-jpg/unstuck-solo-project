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
      <ul>
        {decisions.map((decision) => (
          <li key={decision._id}>{decision.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default MyDecisions;