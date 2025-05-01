import React, { useEffect, useState } from "react";
import styles from "./TeacherHeadbar.module.css";
import { FaUserCircle } from "react-icons/fa";
import logo from '../assets/logo.png';
import { useUserName } from "../../utils/useUserName";


function TeacherHeadbar() {
  const userName = useUserName();
  return (
    <header className={styles.headbar}>
      <div className={styles["top-bar"]}>
        <div className={styles["right-side"]}>
          <a href="/teacher"><FaUserCircle className={styles["user-icon"]} /></a>
          <span>{userName}</span>
        </div>

        <a href="/">
          <img src={logo} className={styles["logo-logo"]} alt="logo" />
        </a>
      </div>
    </header>
  );
}

export default TeacherHeadbar;
