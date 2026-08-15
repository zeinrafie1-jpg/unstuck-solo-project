import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
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
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-accent hover:bg-accent-dark text-surface rounded-full p-4 shadow-lg flex items-center gap-2"
        >
          <MessageCircle size={22} />
          <span className="text-sm font-medium pr-1">Need to discuss this further?</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-surface border-2 border-border rounded-xl shadow-lg w-80 sm:w-96 flex flex-col max-h-[500px]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-sm text-text-secondary">
              What's on your mind?
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-secondary hover:text-text-primary ml-2"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-sm text-text-muted">
                Want to add context or push back on the lean? Ask below.
              </p>
            ) : (
              messages.map((msg, index) => (
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
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-border">
            <input
              type="text"
              placeholder="Type your response..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming}
              className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isStreaming}
              className="bg-accent hover:bg-accent-dark text-surface px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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