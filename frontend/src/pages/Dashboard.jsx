import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import NavBar from '../components/NavBar';
import { getDecisions } from '../services/decisionService';

function Dashboard() {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const data = await getDecisions();
        setDecisions(data);
      } catch (error) {
        console.error('Error fetching decisions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDecisions();
  }, []);

  const recentDecisions = decisions.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-3xl mx-auto mt-10 px-6">
        <h1 className="text-2xl font-semibold text-text-primary mb-6">
          Dashboard
        </h1>

        {/* Banner */}
        <div className="bg-accent rounded-xl p-6 mb-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Compass size={36} className="text-accent-on flex-shrink-0" />
            <div>
              <p className="text-white font-medium text-lg mb-1">
                Stuck between two choices?
              </p>
              <p className="text-accent-on text-sm">
                Tell us what's making it hard and we'll help you think it through.
              </p>
            </div>
          </div>
          <Link
            to="/new-decision"
            className="bg-surface hover:opacity-90 text-accent px-5 py-2 rounded-lg font-medium whitespace-nowrap"
          >
            Get UnStuck
          </Link>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-surface rounded-xl p-5">
              <p className="text-xs text-text-secondary mb-1">Total decisions</p>
              <p className="text-2xl font-semibold text-text-primary">
                {decisions.length}
              </p>
            </div>
            <div className="bg-surface rounded-xl p-5">
              <p className="text-xs text-text-secondary mb-1">This month</p>
              <p className="text-2xl font-semibold text-text-primary">
                {
                  decisions.filter((d) => {
                    const created = new Date(d.createdAt);
                    const now = new Date();
                    return (
                      created.getMonth() === now.getMonth() &&
                      created.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </p>
            </div>
          </div>
        )}

        {/* Recent activity */}
        <h2 className="text-lg font-medium text-text-primary mb-3">
          Recent activity
        </h2>
        {recentDecisions.length === 0 ? (
          <p className="text-text-secondary">Nothing here yet.</p>
        ) : (
          <div className="space-y-3">
            {recentDecisions.map((decision) => (
              <Link
                key={decision._id}
                to={`/decisions/${decision._id}`}
                className="block bg-surface rounded-xl p-4 hover:border-accent border border-border transition-colors"
              >
                <p className="text-text-primary font-medium">{decision.title}</p>
                {decision.recommendedChoice && (
                  <span className="inline-block bg-accent-light text-accent-dark text-xs font-medium px-3 py-1 rounded-full mt-1">
                    ✓ {decision.recommendedChoice}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;