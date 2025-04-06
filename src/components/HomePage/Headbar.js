import React, { useState } from "react";
import "../CSS/Headbar.css";
import {
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaUserCircle,
  FaBars,
  FaTimes
} from "react-icons/fa";
import logo from '../assets/logo.png';
import { FaLocationDot } from "react-icons/fa6";


function Headbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="headbar">
      <div className="top-bar">
        <a href="/">
      <img src={logo} className="logo-logo" alt="logo" />
      </a>
        <div className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </div>
        

        <div className={`right-info`} >
          <div className="right-side">
            <a className="location-section" href="#">
              <FaLocationDot className="location-icon" />
              <div>جمعية الإتقان</div>
            </a>

            <a className="email-section" href="#">
              <FaEnvelope className="envelope-icon" />
              <div className="email-text">
                <div>للتواصل عبر البريد الإلكتروني</div>
                <div>etqan@mail.com</div>
              </div>
            </a>

            <a className="call-section" href="#">
              <FaPhone className="phone-icon" />
              <div className="call-text">
                <div>للتواصل معنا عبر الهاتف</div>
                <div>050-5819644</div>
              </div>
            </a>
          </div>
        </div>

        <div className={`left-icons`}>
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaUserCircle className="user-icon" /></a>

        </div>

        {/* Drawer menu */}
      <div className={`side-drawer ${menuOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <FaTimes className="close-button" onClick={() => setMenuOpen(false)} />
        </div>

        <div className="drawer-content">
          <a className="location-section" href="#">
            <FaLocationDot className="location-icon" />
            <div>جمعية الإتقان</div>
          </a>

          <a className="email-section" href="#">
            <FaEnvelope className="envelope-icon" />
            <div className="email-text">
              <div>للتواصل عبر البريد الإلكتروني</div>
              <div>etqan@mail.com</div>
            </div>
          </a>

          <a className="call-section" href="#">
            <FaPhone className="phone-icon" />
            <div className="call-text">
              <div>للتواصل معنا عبر الهاتف</div>
              <div>050-5819644</div>
            </div>
          </a>

          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaUserCircle className="user-icon" /></a>
          </div>
        </div>
        </div>
      </div>
    </header>

  );
}

export default Headbar;

