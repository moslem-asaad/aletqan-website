import React from "react";
import "../CSS/Navbar.css";
import {
  FaChevronDown

} from "react-icons/fa";

function Navbar() {
  return (
    <header className="navbar">
      <div className="main-nav">
        <ul className="nav-links">
          <li>
            <a href="#">
              <div>البيت</div>
              <FaChevronDown className="down-arrow-icon" />
            </a>
          </li>
          <li className="dropdown">
            <a href="#">
              <div>من نحن</div>
              <FaChevronDown className="down-arrow-icon" />
            </a>
            <ul className="dropdown-menu">
              <li><a href="#">عن الجمعية</a></li>
              <li><a href="#">معلمينا</a></li>
            </ul>
          </li>

          <li className="dropdown">
            <a href="#">
              <div>الخدمات</div>
              <FaChevronDown className="down-arrow-icon" />
            </a>
            <ul className="dropdown-menu">
              <li><a href="#">قسم تجويد القرآن</a></li>
              <li><a href="#">قسم تحفيظ القرآن</a></li>
              <li><a href="#">قسم القراءات </a></li>
            </ul>
          </li>
          <li><a href="#">تواصل معنا</a></li>
        </ul>
      </div>
    </header>
  );
}

export default Navbar;

