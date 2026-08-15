import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { getDecisionById } from '../services/decisionService';
import FollowUpChat from '../components/FollowUpChat';
import NavBar from '../components/NavBar';

function SingleDecision() {
  const { id } = useParams();
  const [singleDecision, setSingleDecision] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecisionById = async () => {
      try {
        const data = await getDecisionById(id);
        setSingleDecision(data);
      } catch (error) {
        console.error('Error fetching single decision:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDecisionById();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <p className="text-text-secondary text-center mt-10">Loading...</p>
      </div>
    );
  }

  if (!singleDecision) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <p className="text-text-secondary text-center mt-10">Decision not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
        <NavBar />
        <div className="max-w-2xl mx-auto mt-10 px-6 pb-10">
            <h1 className="text-2xl font-semibold text-text-primary mb-6">
                {singleDecision.title}
            </h1>

        {/* The lean — the only section with special treatment */}
        <div className="bg-accent rounded-xl p-5 mb-6 flex gap-4 items-start">
            <Compass size={28} className="text-accent-on flex-shrink-0 mt-1" />
            <div>
            <p className="text-xs font-medium text-accent-on mb-1">The lean</p>
            <p className="text-lg font-medium text-surface mb-2">
                {singleDecision.recommendedChoice}
            </p>
            <p className="text-sm text-accent-on leading-relaxed">
                {singleDecision.recommendation}
            </p>
            </div>
        </div>

        {/* Everything else — one white card */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-6 space-y-5">
            <div>
            <p className="text-xs font-medium text-text-secondary mb-2">
                What you told us
            </p>
            <p className="text-sm text-text-primary mb-2">
                <span className="font-medium">{singleDecision.choiceA}</span>
                <span className="text-text-secondary mx-2">vs</span>
                <span className="font-medium">{singleDecision.choiceB}</span>
            </p>
            <p className="text-sm text-text-muted leading-relaxed">
                {singleDecision.description}
            </p>
            </div>

            <div className="border-t border-border pt-5">
            <p className="text-xs font-medium text-text-secondary mb-1">
                What's really going on
            </p>
            <p className="text-sm text-text-muted leading-relaxed">
                {singleDecision.situation}
            </p>
            </div>

            <div className="border-t border-border pt-5">
            <p className="text-xs font-medium text-text-secondary mb-1">
                The actual tradeoff
            </p>
            <p className="text-sm text-text-muted leading-relaxed">
                {singleDecision.tradeoff}
            </p>
            </div>

            <div className="border-t border-border pt-5">
            <p className="text-xs font-medium text-text-secondary mb-1">
                Avoidance check
            </p>
            <p className="text-sm text-text-muted leading-relaxed">
                {singleDecision.avoidanceCheck}
            </p>
            </div>
        </div>

        <FollowUpChat
            decisionId={singleDecision._id}
            initialMessages={singleDecision.followUpConversation}
        />
        </div>
    </div>
  );
}

export default SingleDecision;