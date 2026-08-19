import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, MessageSquare, Search, ChevronRight } from 'lucide-react';
import NavBar from '../components/NavBar';
import { getDecisions } from '../services/decisionService';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const data = await getDecisions(token);
        setDecisions(data);
      } catch (error) {
        console.error('Error fetching decisions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDecisions();
  }, [token]);

  const recentDecisions = decisions.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-3xl mx-auto mt-10 px-6">
        <h1 className="text-2xl font-semibold text-text-primary mb-6">
          Dashboard
        </h1>

        {/* Banner */}
        <div className="bg-accent rounded-xl p-6 mb-6 flex items-center justify-between gap-6">
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

        {/* First-time explainer — only shows before any decisions exist */}
        {!loading && decisions.length === 0 && (
          <div className="bg-surface border border-border rounded-xl p-6 mb-8 grid sm:grid-cols-3 gap-5">
            <div className="flex gap-3">
              <div className="bg-accent-light text-accent-dark rounded-full p-2 flex-shrink-0 h-fit">
                <MessageSquare size={16} />
              </div>
              <p className="text-sm text-text-secondary">Describe your two options</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-accent-light text-accent-dark rounded-full p-2 flex-shrink-0 h-fit">
                <Search size={16} />
              </div>
              <p className="text-sm text-text-secondary">We check what's really going on</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-accent-light text-accent-dark rounded-full p-2 flex-shrink-0 h-fit">
                <Compass size={16} />
              </div>
              <p className="text-sm text-text-secondary">Get a clear lean, backed by real reasoning</p>
            </div>
          </div>
        )}

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
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-text-primary">
            Recent activity
          </h2>
          {decisions.length > 0 && (
            <Link
              to="/my-decisions"
              className="text-sm text-accent hover:underline font-medium flex items-center gap-1"
            >
              View all
              <ChevronRight size={14} />
            </Link>
          )}
        </div>
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