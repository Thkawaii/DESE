import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Home.css";

const Home: React.FC = () => {
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับการนำทาง

  const handleBooking = () => {
    navigate("/booking"); // ไปยังหน้า Booking
  };

  return (
    <div className="home-container">
      <Navbar />

      {/* Banner */}
      <div className="banner">
        <img
          src="รถ.jpeg"
          alt="Banner"
          className="banner-image"
        />
        <h1 className="banner-title">Cabana</h1>
      </div>

      {/* Promotion Section */}
      <div className="promotion-banner">
        <p>แบนเนอร์โปรโมชั่น</p>
      </div>

      {/* Content Section */}
      <div className="content">
        <img
          src="https://via.placeholder.com/600x400"
          alt="Car"
          className="car-image"
        />
        <div className="content-text">
          <h2>Cabana</h2>
          <p>
            "Safe and reliable pick-up and drop-off services. Comfort and
            punctuality guaranteed."
          </p>
          <button className="book-now-button" onClick={handleBooking}>
            Book now!
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
