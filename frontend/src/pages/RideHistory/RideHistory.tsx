import React, { useEffect, useState } from "react";
import { getBookings } from "../../services/https/index"; // นำเข้าฟังก์ชัน
import "./RideHistory.css";

type Booking = {
  id: number;
  beginning: string;
  terminus: string;
  start_time: string;
  end_time: string | null;
  distance: number;
  total_price: number;
  booking_status: string;
  vehicle: string;
};

const RideHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsData = await getBookings(); // เรียกใช้ฟังก์ชัน getBookings
        console.log("Fetched bookings:", bookingsData); // Debug
        setBookings(bookingsData); // อัปเดต state ด้วยข้อมูลการจอง
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div>กำลังโหลดข้อมูลการเดินทาง...</div>;
  }

  return (
    <div className="ride-history">
      <div className="header">ประวัติการเดินทาง</div>

      <table className="ride-table">
        <thead>
          <tr>
            <th>#</th>
            <th>เส้นทาง</th>
            <th>วันที่เริ่มต้น</th>
            <th>ยานพาหนะ</th>
            <th>ระยะทาง (กม.)</th>
            <th>ค่าโดยสาร (บาท)</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={booking.id}>
              <td>{index + 1}</td>
              <td>{`${booking.beginning} - ${booking.terminus}`}</td>
              <td>{new Date(booking.start_time).toLocaleDateString()}</td>
              <td>{booking.vehicle}</td>
              <td>{booking.distance}</td>
              <td>{booking.total_price.toFixed(2)}</td>
              <td>
                <span className={`status ${booking.booking_status}`}>
                  {booking.booking_status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">© 2024 Cabana Travel. All rights reserved.</div>
    </div>
  );
};

export default RideHistory;
