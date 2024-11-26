import React, { useState, useEffect } from "react";
import "./Chat.css";
import { sendMessageToBackend, fetchMessagesFromBackend } from "../../services/https/index";
import { Message } from "../../interfaces/IMessage"; // Import Interface

interface ChatMessage {
  sender: string;
  content: string;
  isUser: boolean;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>("");

  // ฟังก์ชันสำหรับดึงข้อความเก่าจาก Backend
  const loadMessages = async () => {
    const bookingID = 10; // ตัวอย่าง BookingID
    try {
      const backendMessages = await fetchMessagesFromBackend(bookingID); // ดึงข้อความจาก Backend

      console.log("Response from Backend:", backendMessages); // Debug

      if (backendMessages && Array.isArray(backendMessages.data)) {
        // แปลงข้อความจาก Backend ให้อยู่ในรูปแบบที่ UI ใช้
        const chatMessages = backendMessages.data.map((msg: Message) => ({
          sender: msg.PassengerID ? "คุณ" : "อีกฝ่าย",
          content: msg.Content || "",
          isUser: !!msg.PassengerID,
        }));

        console.log("Transformed Messages:", chatMessages); // Debug
        setMessages(chatMessages); // ตั้งค่า State
      } else {
        console.error("Invalid response format or no data:", backendMessages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  // เรียกใช้ loadMessages เมื่อ Component โหลดครั้งแรก
  useEffect(() => {
    loadMessages();
  }, []);

  const handleSendMessage = async () => {
    if (message.trim()) {
      // เพิ่มข้อความของผู้ใช้ใน Local State
      setMessages((prev) => [
        ...prev,
        { sender: "คุณ", content: message, isUser: true },
      ]);

      // เตรียมข้อมูลข้อความในรูปแบบ Message Interface
      const messageData: Message = {
        Content: message,
        MessageType: "text",
        ReadStatus: false,
        SendTime: new Date().toISOString(),
        PassengerID: 1, // ตัวอย่าง Passenger ID
        DriverID: 2, // ตัวอย่าง Driver ID
        BookingID: 10, // ตัวอย่าง Booking ID
      };

      try {
        // ส่งข้อความไป Backend
        const backendResponse = await sendMessageToBackend(messageData);

        if (backendResponse) {
          // เพิ่มข้อความตอบกลับจาก Backend ใน Local State
          setMessages((prev) => [
            ...prev,
            { sender: "อีกฝ่าย", content: "ข้อความถูกบันทึกในระบบ!", isUser: false },
          ]);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }

      // ล้างข้อความในช่อง Input
      setMessage("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src="https://via.placeholder.com/50" alt="avatar" />
        <span className="chat-name">นาย สุเมฆ สุดหล่อ</span>
      </div>
      <div className="messages-container">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message-bubble ${msg.isUser ? "user" : "other"}`}
            >
              {msg.content}
            </div>
          ))
        ) : (
          <p>ไม่มีข้อความที่จะแสดง</p>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="ส่งข้อความ....."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage}>📨</button>
      </div>
    </div>
  );
};

export default Chat;
