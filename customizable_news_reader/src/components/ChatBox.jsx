import React, { useState } from 'react';
import axios from 'axios';

const ChatBox = ({ articleId }) => {
  const [message, setMessage] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnswer('');

    try {
      const response = await axios.get('http://127.0.0.1:5000/chat', {
        params: {
          message: message,
          articleUrl: articleId,  // Pass article URL (or ID) as query parameter
        },
      });

      // Assuming backend returns the answer under 'response' key
      setAnswer(response.data.response || 'No answer found.');
    } catch (error) {
      setAnswer('Error processing your query.');
      console.error('Error fetching answer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleQuerySubmit}>
        <input
          type="text"
          placeholder="Ask a question about this article..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Ask'}
        </button>
      </form>
      {answer && <div>{answer}</div>}
    </div>
  );
};

export default ChatBox;
