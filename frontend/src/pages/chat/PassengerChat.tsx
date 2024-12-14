import React, { useState, useEffect } from "react";
import { getBookingById } from "../../services/https"; // Import service
import "./PassengerChat.css";

interface Message {
  sender: string;
  content: string;
  isUser: boolean;
  time?: string;
}

const PassengerChat: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [roomID, setRoomID] = useState<string | null>(null);

  const bookingId = "booking123"; // ตัวอย่าง bookingId ที่ต้องการดึงข้อมูล

  // ดึง roomID จาก API
  useEffect(() => {
    const fetchRoomID = async () => {
      try {
        const booking = await getBookingById(bookingId); // ดึงข้อมูล booking จาก service
        setRoomID(booking.room); // ตั้งค่า roomID จาก response
      } catch (error) {
        console.error("Error fetching room ID:", error);
      }
    };

    fetchRoomID();
  }, [bookingId]);

  useEffect(() => {
    if (!roomID) return;

    // สร้าง WebSocket connection
    const ws = new WebSocket(`ws://localhost:8080/ws?room=${roomID}`);

    ws.onopen = () => {
      console.log("WebSocket connection established.");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.sender !== "Passenger") {
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
    // ตรวจสอบว่า WebSocket พร้อมใช้งานและเชื่อมต่อแล้ว
    if (socket && socket.readyState === WebSocket.OPEN && message.trim()) {
      const msg = { room: roomID, sender: "Passenger", content: message, time: new Date().toISOString() };

      socket.send(JSON.stringify(msg));

      setMessages((prev) => [
        ...prev,
        { sender: "Passenger", content: message, isUser: true, time: new Date().toLocaleTimeString() },
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
          alt="User Avatar"
          className="chat-avatar"
        />
        <div className="chat-user-details">
          <span className="chat-name">Passenger Chat</span>
          <span className="chat-status">
            {isConnected ? "ออนไลน์" : "ออฟไลน์"}
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
          <p className="no-messages">ไม่มีข้อความที่จะแสดง</p>
        )}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="ส่งข้อความ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="chat-input"
        />
        <button onClick={sendMessage} className="send-button">
          ส่ง
        </button>
      </div>
    </div>
  );
};

export default PassengerChat;
