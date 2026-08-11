import { useState } from 'react';
import { streamFollowUp } from '../services/decisionService';

function FollowUpChat({ decisionId, initialMessages = [] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      await streamFollowUp(decisionId, input, (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: updated[lastIndex].content + chunk,
          };
          return updated;
        });
      });
    } catch (error) {
      console.error('Error streaming follow-up:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="follow-up-chat">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type your response..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isStreaming}
        />
        <button type="submit" disabled={isStreaming}>
          {isStreaming ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default FollowUpChat;