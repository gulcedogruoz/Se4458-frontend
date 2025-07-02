import React, { useState } from "react";
import api from "../api";

function AIChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/ai", { question });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error calling AI agent:", error);
      setAnswer("Error getting response from AI agent.");
    }
  };

  return (
    <div>
      <h2>AI Chat</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask something..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <button type="submit">Ask</button>
      </form>
      {answer && (
        <div>
          <h4>AI Response:</h4>
          <pre>{answer}</pre>
        </div>
      )}
    </div>
  );
}

export default AIChat;
