import { useState } from "react";
import ReactMarkdown from "react-markdown"
// import "./Chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch(`https://mindhive-be-cbcdbcb3e71d.herokuapp.com/chat?message=${input}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ message: input }),
      });
      
      const data = await response.json();
      // console.log("data:", data)
      const botMessage = { text: data, sender: "bot" };
      // console.log("botMessageSent", botMessage)
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      const botMessage = { text: "Sorry, I couldn't connect to the server.", sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chatbot-message ${msg.sender}`}>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
      </div>
      <div className="chatbot-input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="chatbot-input"
        />
        <button onClick={sendMessage} className="chatbot-send-button">Send</button>
      </div>
    </div>
  );
}