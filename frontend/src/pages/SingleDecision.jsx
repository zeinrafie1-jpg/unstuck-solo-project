// TBC write code for SingleDecision.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDecisionById } from '../services/decisionService';

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
    
    if (loading) return <p>Loading...</p>;
    if (!singleDecision) return <p>Decision not found.</p>;

    return (
        <div className="single-decision">
            <h1>My Decision</h1>
            <section>
                <h2>My recommendation</h2>
                <p>{singleDecision.recommendedChoice}</p>
            </section>

            <section>
                <h2>What are the two options you're stuck between?</h2>
                <p>{singleDecision.choiceA}</p>
                <p>{singleDecision.choiceB}</p>
            </section>

            <section>
                <h2>What's making this hard to decide?</h2>
                <p>{singleDecision.description}</p>
            </section>

            <section>
                <h2>What's really going on</h2>
                <p>{singleDecision.situation}</p>
            </section>
            <section>
                <h2>The actual tradeoff</h2>
                <p>{singleDecision.tradeoff}</p>
            </section>
            <section>
                <h2>Avoidance check</h2>
                <p>{singleDecision.avoidanceCheck}</p>
            </section>
            <section>
                <h2>The lean</h2>
                <p>{singleDecision.recommendation}</p>
            </section>
        </div>
    )

}

export default SingleDecision;