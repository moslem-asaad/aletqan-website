import React from 'react';
import Headbar from "../HomePage/Headbar";
import Footer from "../HomePage/Footer";
import styles from "./TeacherHome.module.css";




function TeacherHome() {
  return (
    <div className={styles.TeacherHomePage}>
        <Headbar/>
    </div>
  );
}

export default TeacherHome;
