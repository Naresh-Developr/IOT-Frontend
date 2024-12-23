import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');

  const sendMessage = () => {
    if (!query.trim()) return;

    const userMessage = { type: 'user', text: query };
    setMessages([...messages, userMessage]);

    // Simulate bot response
    const botMessage = { type: 'bot', text: "I'm processing your query..." };
    setMessages([...messages, userMessage, botMessage]);
    setQuery('');
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 h-screen">
      <div className="bg-white shadow-md rounded-md p-4 w-full max-w-md h-[70vh] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-2 p-2 rounded-md ${
              msg.type === 'user' ? 'bg-blue-500 text-white text-right' : 'bg-gray-300 text-left'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex w-full max-w-md p-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question..."
          className="flex-grow p-2 border rounded-md"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
