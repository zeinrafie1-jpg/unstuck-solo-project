import { useState, useRef, useEffect } from 'react';
import { streamFollowUp } from '../services/decisionService';

function FollowUpChat({ decisionId, initialMessages = [] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="bg-surface border-2 border-border rounded-xl p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          Need to discuss this further?
        </p>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="border border-accent text-accent hover:bg-accent hover:text-surface transition-colors text-sm font-medium whitespace-nowrap ml-4 px-4 py-2 rounded-lg"
        >
          {isOpen ? 'Hide' : 'Start a follow-up chat'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4">
          {messages.length > 0 && (
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-accent text-surface'
                        : 'bg-muted text-text-primary'
                    }`}
                  >
                    {msg.content || (
                      <span className="text-text-secondary italic">Thinking...</span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              placeholder="Type your response..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming}
              className="flex-1 border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isStreaming}
              className="bg-accent hover:bg-accent-dark text-surface px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStreaming ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default FollowUpChat;