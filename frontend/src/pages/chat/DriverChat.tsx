import React, { useState, useEffect } from "react";
import "./DriverChat.css";

interface Message {
  sender: string;
  content: string;
  isUser: boolean;
  time?: string;
}

const DriverChat: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const roomID = "booking123"; // กำหนด roomID ตามตัวอย่าง

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/ws?room=${roomID}`);

    ws.onopen = () => {
      console.log("WebSocket connection established.");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.sender !== "Driver") {
          setMessages((prev) => [
            ...prev,
            { sender: msg.sender, content: msg.content, isUser: false, time: msg.time },
          ]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = (event) => {
      console.log(`WebSocket connection closed. Code: ${event.code}`);
      setIsConnected(false);
      if (event.code !== 1000) {
        console.log("Reconnecting...");
        setTimeout(() => setSocket(new WebSocket(`ws://localhost:8080/ws?room=${roomID}`)), 3000);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(ws);

    return () => {
      console.log("Closing WebSocket connection.");
      ws.close(1000, "Component unmounted");
    };
  }, [roomID]);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && message.trim()) {
      const msg = { room: roomID, sender: "Driver", content: message, time: new Date().toISOString() };

      socket.send(JSON.stringify(msg));

      setMessages((prev) => [
        ...prev,
        { sender: "Driver", content: message, isUser: true, time: new Date().toLocaleTimeString() },
      ]);

      setMessage(""); // ล้างช่องข้อความหลังส่ง
    } else {
      console.warn("Cannot send message. WebSocket is not open.");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img
          src="https://via.placeholder.com/50"
          alt="Driver Avatar"
          className="chat-avatar"
        />
        <div className="chat-user-details">
          <span className="chat-name">Driver Chat</span>
          <span className="chat-status">
            {isConnected ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="messages-container">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message-bubble ${msg.isUser ? "user" : "other"}`}
            >
              <span className="message-sender">{msg.sender}</span>
              <p className="message-content">{msg.content}</p>
              {msg.time && <span className="message-time">{msg.time}</span>}
            </div>
          ))
        ) : (
          <p className="no-messages">No messages yet</p>
        )}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="chat-input"
        />
        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default DriverChat;
