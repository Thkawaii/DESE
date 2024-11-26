import React, { useState } from "react";
import "./advancebooking.css"; // นำเข้าไฟล์ CSS

interface BookingDetails {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  serviceType: "Standard" | "Premium";
}

const AdvanceBooking: React.FC = () => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    pickupTime: "",
    serviceType: "Standard",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setBookingDetails({
      ...bookingDetails,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Booking Details:", bookingDetails);
    setSubmitted(true);
  };

  return (
    <div className="advancebooking-container">
      <h2>จองบริการรับส่งผู้โดยสาร</h2>
      {submitted ? (
        <div className="confirmation-message">
          <p>การจองของคุณเสร็จสมบูรณ์แล้ว!</p>
          <p>ขอบคุณที่ใช้บริการกับเรา</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="pickupLocation">สถานที่รับ:</label>
            <input
              type="text"
              id="pickupLocation"
              name="pickupLocation"
              value={bookingDetails.pickupLocation}
              onChange={handleInputChange}
              placeholder="กรอกสถานที่รับ"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dropoffLocation">สถานที่ส่ง:</label>
            <input
              type="text"
              id="dropoffLocation"
              name="dropoffLocation"
              value={bookingDetails.dropoffLocation}
              onChange={handleInputChange}
              placeholder="กรอกสถานที่ส่ง"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pickupDate">วันที่:</label>
            <input
              type="date"
              id="pickupDate"
              name="pickupDate"
              value={bookingDetails.pickupDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pickupTime">เวลา:</label>
            <input
              type="time"
              id="pickupTime"
              name="pickupTime"
              value={bookingDetails.pickupTime}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="serviceType">ประเภทบริการ:</label>
            <select
              id="serviceType"
              name="serviceType"
              value={bookingDetails.serviceType}
              onChange={handleInputChange}
              required
            >
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <button type="submit" className="submit-button">
            จองเลย
          </button>
        </form>
      )}
    </div>
  );
};

export default AdvanceBooking;
