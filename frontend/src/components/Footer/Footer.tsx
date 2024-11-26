import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaGoogle } from "react-icons/fa";
import "./footer.css";

const Footer = () => {
  return (
    <div className="foot">
      <footer className="footer">
        <div className="container">
          <div className="row">
            {/* About Section */}
            <div className="col">
              <h5>About Us</h5>
              <p>
                Welcome to Cabana! We provide reliable, safe, and comfortable
                transportation services for all your travel needs.
              </p>
              <p>© 2024 Cabana Co. All rights reserved.</p>
            </div>

            {/* Links Section */}
            <div className="col">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Rides</a>
                </li>
                <li>
                  <a href="#">Promotion</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
              </ul>
            </div>

            {/* Customer Service Section */}
            <div className="col">
              <h5>Customer Service</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#">FAQs</a>
                </li>
                <li>
                  <a href="#">Refund Policy</a>
                </li>
                <li>
                  <a href="#">Accessibility</a>
                </li>
                <li>
                  <a href="#">Terms & Conditions</a>
                </li>
              </ul>
            </div>

            {/* Social Media Section */}
            <div className="col">
              <h5>Follow Us</h5>
              <ul className="social-icons">
                <li>
                  <a href="https://facebook.com">
                    <FaFacebookF />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com">
                    <FaTwitter />
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com">
                    <FaInstagram />
                  </a>
                </li>
                <li>
                  <a href="https://google.com">
                    <FaGoogle />
                  </a>
                </li>
              </ul>
              <p>Stay connected with us for updates and offers.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
