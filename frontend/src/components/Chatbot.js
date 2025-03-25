// frontend/src/components/Chatbot.js
import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css'; // optional: create a CSS file for chatbot-specific styles

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello, I am the Bhagavad Gita Chatbot. How may I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Default parameters for the chatbot API request
  const defaultParams = {
    model_name: "llama-3.3-70b-versatile",      // use one of the allowed models
    model_provider: "Groq",       // or "Groq" if preferred
    system_prompt: "You are a helpful assistant answering queries about Bhagavad Gita.",
    allow_search: true
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    // Append user message to conversation
    const newMessages = [...messages, { sender: 'user', text: inputText }];
    setMessages(newMessages);
    setInputText('');
    setLoading(true);

    try {
      // Prepare the request body; here we send all messages as a list of strings
      const requestBody = {
        ...defaultParams,
        messages: newMessages.map(m => m.text)
      };

      const response = await axios.post("http://localhost:5001/chat", requestBody);
      const botResponse = response.data.response || "Sorry, I did not understand that.";

      setMessages([...newMessages, { sender: 'bot', text: botResponse }]);
    } catch (error) {
      console.error('Error sending message:', error.response ? error.response.data : error.message);
      setMessages([...newMessages, { sender: 'bot', text: "Error: Unable to get response." }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-window">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && <div className="message bot"><p>Loading...</p></div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
