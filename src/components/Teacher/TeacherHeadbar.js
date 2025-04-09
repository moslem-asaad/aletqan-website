import React, { useState } from "react";
import styles from "./TeacherHeadbar.module.css";
import {
  FaUserCircle,
} from "react-icons/fa";
import logo from '../assets/logo.png';
import { useAuth } from "../../context/AuthContext ";


function TeacherHeadbar() {
  const [userName,setUserName] = useState("الأستاذ مسلم أسعد")
  const { user } = useAuth();

  return (
    <header className={styles.headbar}>
      <div className={styles["top-bar"]}>
        <div className={styles["right-side"]}>
          <a href="#"><FaUserCircle className={styles["user-icon"]} /></a>
          <span>{user?.userName}</span>
        </div>

        <a href="/">
          <img src={logo} className={styles["logo-logo"]} alt="logo" />
        </a>
      </div>
    </header>
  );
}

export default TeacherHeadbar;
