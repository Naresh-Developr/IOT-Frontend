import React, { useState } from "react";
import { useLocation } from "react-router-dom";  // useLocation to get state

const AskQuestion = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const location = useLocation();  // Get location to access passed state
    const data = location.state?.data || [];  // Access data from location state

    const handleAsk = async (e) => {
      e.preventDefault();
  
      const response = await fetch("http://127.0.0.1:8000/ask-gemini/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ context: JSON.stringify(data), question }),
      });
  
      const result = await response.json();
      setAnswer(result.answer || "No answer available.");
    };
  
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-6">Ask a Question</h2>
          <form onSubmit={handleAsk} className="space-y-6">
            <textarea
              rows="4"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Ask a question about the data..."
              required
            />
            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Get Answer
            </button>
          </form>
          {answer && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
              <p className="font-medium">Answer:</p>
              <p>{answer}</p>
            </div>
          )}
        </div>
      </div>
    );
}

export default AskQuestion;
