import React, { useState } from "react";
import axios from "axios";
import "./Chat.css";

const ChatBox = ({ articleId }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setChatHistory([...chatHistory, { text: message, sender: "user" }]);
    setMessage("");

    try {
      const response = await axios.get("http://127.0.0.1:5000/chat", {
        params: { message: message, articleUrl: articleId },
      });

      const aiResponse = response.data.response || "No answer found.";
      setChatHistory([
        ...chatHistory,
        { text: message, sender: "user" },
        { text: aiResponse, sender: "ai" },
      ]);
    } catch (error) {
      console.error("Error fetching answer:", error);
      setChatHistory([
        ...chatHistory,
        { text: "Error processing your query.", sender: "ai" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="chat-title">Article AI Assistant</span>
      </div>
      
      <div className="chat-messages">
        {chatHistory.length === 0 && (
          <div className="chat-empty-state">
            <div className="chat-empty-text">
              Ask me anything about this article!
            </div>
          </div>
        )}
        
        {chatHistory.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender}`}>
            <div className="chat-message">{msg.text}</div>
          </div>
        ))}
        
        {loading && (
          <div className="chat-bubble ai loading">
            <div className="chat-message">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <form className="chat-form" onSubmit={handleQuerySubmit}>
        <input
          type="text"
          placeholder="Ask something about this article..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="chat-input"
          required
        />
        <button type="submit" className="chat-button" disabled={loading}>
          {loading ? (
            <span className="button-loading"></span>
          ) : (
            <span className="button-text">→</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;