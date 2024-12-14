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


 

  export const sendDataStartlocationToBackend = async (pickupLocation: { lat: number; lng: number; name: string }) => {
    try {
      const response = await fetch(`${apiUrl}/startlocation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: pickupLocation.lat,  // ส่งข้อมูลตามชื่อฟิลด์ใน backend
          longitude: pickupLocation.lng,
          province: 'Your Province',    // กำหนดค่า province ตามที่ต้องการ
          place: pickupLocation.name,   // ชื่อสถานที่
          address: 'Your Address',      // ที่อยู่ (ใส่ข้อมูลจริง)
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error sending data to backend:', errorData);
        throw new Error(errorData.message || 'Unknown error occurred');
      }
  
      const data = await response.json();
      console.log('Data sent to backend:', data);

      // Return the ID of the created start location
      return data.data.id; // Assume the backend returns the ID in data.data.id
    } catch (error) {
      console.error('Error sending data to backend:', error);
      throw error; // Throw the error for further handling
    }
};

  

export const sendDataDestinationToBackend = async (destinationLocation: { lat: number; lng: number; name: string }) => {
  try {
    const response = await fetch(`${apiUrl}/destination`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: destinationLocation.lat,
        longitude: destinationLocation.lng,
        province: 'Your Province',
        place: destinationLocation.name,
        address: 'Your Address',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Unknown error occurred');
    }

    const data = await response.json();
    console.log('Destination Data sent to backend:', data);
    return data.data.id; // Return only the destination_id
  } catch (error) {
    console.error('Error sending destination data to backend:', error);
    throw error;
  }
};

export const sendBookingToBackend = async (bookingData: {
  pickup_location_name: string;
  destination_location_name: string;
  start_location_id: number;
  destination_id: number;
  vehicle: string;
  distance: string;
  fare: string;
  booking_status: string;
}) => {
  try {
    const response = await fetch(`${apiUrl}/bookings`, {
      method: "POST", // ใช้ POST method
      headers: {
        "Content-Type": "application/json", // กำหนด Content-Type เป็น JSON
      },
      body: JSON.stringify(bookingData), // แปลงข้อมูล bookingData เป็น JSON
    });

    // ตรวจสอบว่า response สำเร็จหรือไม่
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create booking");
    }

    const data = await response.json(); // แปลง response เป็น JSON
    console.log("Booking response from backend:", data); // Log ข้อมูลที่ได้จาก backend
    return { success: true, data };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, message: error.message };
  }
};



// ฟังก์ชันสำหรับดึง booking ทั้งหมด
export const getBookings = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${apiUrl}/bookings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching bookings: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.success) {
      return data.data; // คืนค่าข้อมูลการจองทั้งหมด
    } else {
      throw new Error(`API Error: ${data.message}`);
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึง booking ตาม bookingId
export const getBookingById = async (bookingId: string): Promise<any> => {
  try {
    const response = await fetch(`${apiUrl}/bookings/${bookingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching booking by ID: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.success) {
      return data.data; // คืนค่าข้อมูล booking เดี่ยว
    } else {
      throw new Error(`API Error: ${data.message}`);
    }
  } catch (error) {
    console.error(`Error fetching booking by ID: ${bookingId}`, error);
    throw error;
  }
};


export 
{ sendMessageToBackend };
{fetchMessagesFromBackend};
