import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const [notifications, setNotifications] = useState<number>(5); // จำนวนแจ้งเตือนเริ่มต้น

  const handleNotificationClick = () => {
    alert("You clicked the notification icon!");
    setNotifications(0); // รีเซ็ตจำนวนแจ้งเตือน
  };

  return (
    <nav className="navbar">
      <div className="logo">cabana</div>
      <ul className="nav-links">
        <li>
          <Link to="/DriverChat">Home</Link>
        </li>
        <li>
          <Link to="/RideHistory">Rides</Link>
        </li>
        <li>
          <Link to="/Promotion">Promotion</Link>
        </li>
        <li className="notification">
          <div className="icon-wrapper" onClick={handleNotificationClick}>
            <i className="fi fi-rs-bell"></i>
            {notifications > 0 && (
              <span className="badge">{notifications}</span>
            )}
          </div>
        </li>
        <li>
            <img src="user-profile.png" alt="Profile" className="profile-icon" />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
