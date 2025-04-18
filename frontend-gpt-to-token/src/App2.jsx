import React, { useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { FaPaperPlane } from "react-icons/fa";
import "./App2.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() !== "") {
      const userMessage = { sender: "user", text: input };
      const aiMessage = { sender: "ai", text: "Hello! How can I help you today?" };

      setMessages((prevMessages) => [...prevMessages, userMessage, aiMessage]);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <header className="header">
        How can I help you today?
      </header>

      <ScrollToBottom className="message-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </ScrollToBottom>

      <div className="input-container">
        <textarea
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          rows={2}
        ></textarea>
        <button onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default App;
