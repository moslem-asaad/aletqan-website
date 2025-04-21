import React, { useState, useEffect } from 'react';
import TeacherHeadbar from "./TeacherHeadbar";
import Footer from "../HomePage/Footer";
import styles from "./TeacherHome.module.css";
import { FaUsers, FaEdit, FaSave } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import q2 from "../assets/q2.png";
import { getAuthHeaders, getUserInfo } from '../../utils/auth';
import { useNavigate } from "react-router-dom";



const user = getUserInfo();
const headers = getAuthHeaders();

const fetchCourses = async () =>{
  try{
    const response = await fetch(`http://localhost:8090/api/courses/teacher/${user.userId}`, {
      method: 'GET',
      headers
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }catch(error){
    console.error("error feching courses: ", error);
    throw error;
  }
}

const editCourse = async (course) => {
  try {
    const response = await fetch(`http://localhost:8090/api/courses/teacher/${user.userId}/${course.id}`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: course.name,
        schedule: course.schedule,
        teacherId: user.userId,
        studentIds: course.studentIds || []
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error editing course: ", error);
    throw error;
  }
};

function TeacherHome() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editedName, setEditedName] = useState("");


  useEffect(() => {
    const fetchData = async () => {
        try {
            const courses = await fetchCourses();
            setCourses(courses);
        } catch (error) {
            console.error('Error fetching job data:', error);
        }
    };

    fetchData();
}, []);


  const displayNumStudents = (num) => {
    if (num == 0) return (<p>لا يوجد طلاب</p>); 
    else if (num  == 1) return (<p>طالب واحد</p>);
    else if (num == 2) return (<p>طالبان </p>); 
    else if (num <= 10) return (<p>{num} طلاب</p>); 
    else return (<p>{num} طالب</p>);  
  }

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

  const saveEditedName = async (id) => {
    const courseToEdit = courses.find(course => course.id === id);
    const updatedCourse = {
      ...courseToEdit,
      name: editedName,
      teacherId: user.userId,
    };

    try{
      const result = await editCourse(updatedCourse);
      const updatedCourses = courses.map(course =>
        course.id === id ? result : course
      );
      setCourses(updatedCourses);
      setEditingCourseId(null);
      setEditedName("");
    }catch (err) {
      console.error("Failed to update course", err);
    }
    
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
              <div
              key={course.id}
              className={styles.card}
              onClick={() => {
                if (editingCourseId !== course.id) {
                  navigate(`/teacher/course/${course.id}`);
                }
              }}
              style={{ cursor: editingCourseId !== course.id ? 'pointer' : 'default' }}
            >
              <button
                className={styles.editBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(course);
                }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        saveEditedName(course.id);
                      }}
                      className={styles.saveBtn}
                    >
                      <FaSave /> حفظ
                    </button>
                  </>
                ) : (
                  <>
                    <h4>{course.name}</h4>
                   {displayNumStudents(course.students)} 
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
