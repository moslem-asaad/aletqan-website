import React, { useState } from 'react';
import TeacherHeadbar from "./TeacherHeadbar";
import Footer from "../HomePage/Footer";
import styles from "./TeacherHome.module.css";
import { FaUsers, FaEdit, FaSave } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import q2 from "../assets/q2.png";

function TeacherHome() {
  const [courses, setCourses] = useState([
    { id: 1, name: "دورة التجويد 2", students: 4 },
    { id: 2, name: "دورة التجويد الجديدة", students: 15 },
    { id: 3, name: "دورة التجويد المتقدمة", students: 10 },
  ]);

  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editedName, setEditedName] = useState("");

  const addCourse = () => {
    const newId = courses.length + 1;
    setCourses([
      ...courses,
      { id: newId, name: `دورة جديدة ${newId}`, students: 0 }
    ]);
  };

  const startEditing = (course) => {
    setEditingCourseId(course.id);
    setEditedName(course.name);
  };

  const saveEditedName = (id) => {
    const updatedCourses = courses.map(course =>
      course.id === id ? { ...course, name: editedName } : course
    );
    setCourses(updatedCourses);
    setEditingCourseId(null);
    setEditedName("");
  };

  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);

  return (
    <div className={styles.TeacherHomePage}>
      <TeacherHeadbar />

      <div className={styles.main}>
        {/* قسم الدورات */}
        <div className={styles.coursesSection}>
          <div className={styles.header}>
            <h2>دوراتي</h2>
            <button onClick={addCourse} className={styles.addCourseBtn}>إنشاء دورة +</button>
          </div>

          <div className={styles.courseCards}>
            {courses.map((course) => (
              <div key={course.id} className={styles.card}>
              <button
                className={styles.editBtn}
                onClick={() => startEditing(course)}
              >
                <FaEdit />
              </button>
            
              <img src={q2} alt="دورة" className={styles.courseIcon} />
            
              <div className={styles.courseData}>
                {editingCourseId === course.id ? (
                  <>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className={styles.editInput}
                    />
                    <button
                      onClick={() => saveEditedName(course.id)}
                      className={styles.saveBtn}
                    >
                      <FaSave /> حفظ
                    </button>
                  </>
                ) : (
                  <>
                    <h4>{course.name}</h4>
                    <p>{course.students} طلاب</p>
                  </>
                )}
              </div>            
              </div>
            ))}
          </div>
        </div>

        {/* معلومات عامة */}
        <div className={styles.generalInfo}>
          <h2>معلومات عامة</h2>
          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <GiBookshelf size={32} />
              <p>عدد الدورات الكلي<br />{courses.length} دورات</p>
            </div>
            <div className={styles.infoCard}>
              <FaUsers size={32} />
              <p>عدد الطلاب الكلي<br />{totalStudents} طلاب</p>
            </div>
          </div>
        </div>
      </div>

      <Footer className={styles["teacher-footer"]} />
    </div>
  );
}

export default TeacherHome;
