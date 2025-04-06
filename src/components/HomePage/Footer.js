import React from "react";
import "../CSS/Footer.css";
import logo from '../assets/logo.png';
import { FaPhone, FaFacebookF, FaInstagram, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-right">
          <img src={logo} alt="شعار الجمعية" className="footer-logo" />
        </div>

        <div className="footer-left">
          <ul className="footer-links">
            <li>سياسة الخصوصية</li>
            <li>شروط الخدمة</li>
            <li>تواصل معنا</li>
          </ul>
          <div className="footer-icons">
            <FaPhone />
            <FaFacebookF />
            <FaInstagram />
            <FaEnvelope />
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
