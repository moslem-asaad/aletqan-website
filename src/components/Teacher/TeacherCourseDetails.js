import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TeacherHeadbar from "./TeacherHeadbar";
import Footer from "../HomePage/Footer";
import styles from "./TeacherHome.module.css";
import { FaUsers, FaEdit, FaSave } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import q2 from "../assets/q2.png";
import { getAuthHeaders, getUserInfo } from '../../utils/auth';


function TeacherCourseDetails() {
const { id } = useParams();
  return (
    <div className={styles.TeacherHomePage}>
      <TeacherHeadbar />
      <div>Course ID: {id}</div>
      </div>
  );
}

export default TeacherCourseDetails;
