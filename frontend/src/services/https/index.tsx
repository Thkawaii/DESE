import { Message } from "../../interfaces/IMessage"; // ปรับ path ให้ตรงกับตำแหน่งจริงของ interface

const apiUrl = "http://localhost:8080";

async function sendMessageToBackend(data: Message) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), // ใช้ `Message` Interface เป็นโครงสร้าง
  };

  let res = await fetch(`${apiUrl}/message`, requestOptions)
    .then((res) => {
      if (res.status === 201) {
        return res.json(); // คืนค่าข้อมูลข้อความที่สร้างสำเร็จ
      } else {
        return false; // หากเกิดข้อผิดพลาด
      }
    });

  return res;
}

// ฟังก์ชันสำหรับดึงข้อความจาก Backend
export const fetchMessagesFromBackend = async (bookingID: number) => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
  
    let res = await fetch(`${apiUrl}/messages/booking/${bookingID}`, requestOptions)
      .then((res) => {
        if (res.status === 200) {
          return res.json(); // คืนข้อความที่ดึงสำเร็จ
        } else {
          console.error("Failed to fetch messages from backend.");
          return null;
        }
      });
  
    return res;
  };

export 
{ sendMessageToBackend };
{fetchMessagesFromBackend};
