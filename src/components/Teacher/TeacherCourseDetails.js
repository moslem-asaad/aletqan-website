import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import TeacherHeadbar from "./TeacherHeadbar";
import Footer from "../HomePage/Footer";
import styles from "./TeacherHome.module.css";
import { getAuthHeaders, getUserInfo } from '../../utils/auth';


const headers = getAuthHeaders();


const fetchCourse = async (teacherId, courseId) => {
  try {
    const response = await fetch(`http://localhost:8090/api/courses/teacher/${teacherId}/${courseId}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error('فشل تحميل بيانات الدورة');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("error feching courses: ", error);
    throw error;
  }
}

const fetchLessons = async (teacherId, courseId) => {
  try {
    const response = await fetch(`http://localhost:8090/api/lessons/teacher/${teacherId}/${courseId}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error('فشل تحميل بيانات الدورة');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("error feching courses: ", error);
    throw error;
  }
}


function TeacherCourseDetails() {
  const { id } = useParams();
  const location = useLocation();
  const user = getUserInfo();

  const [course, setCourse] = useState(location.state?.course || null);
  const [loading, setLoading] = useState(!location.state?.course);
  const [error, setError] = useState(null);

  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [lessonsError, setLessonsError] = useState(null);

  useEffect(() => {
    if (!course) {
      const fetchData = async () => {
        try {
          const data = await fetchCourse(user.userId, id);
          setCourse(data);
          setLoading(false);
        } catch (err) {
          setError(err.message || 'حدث خطأ');
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, [id, course, user.userId]);

  useEffect(() => {
    const fetchAndSetLessons = async () => {
      try {
        const lessonData = await fetchLessons(user.userId, id);
        setLessons(lessonData);
        setLessonsLoading(false);
      } catch (err) {
        setLessonsError(err.message || 'فشل تحميل الدروس');
        setLessonsLoading(false);
      }
    };

    if (course) {
      fetchAndSetLessons();
    }
  }, [course, id, user.userId]);

  return (
    <div className={styles.TeacherHomePage}>
      <TeacherHeadbar />

      <div className={styles.main}>
        <h2>تفاصيل الدورة</h2>
        {loading && <p>جاري تحميل بيانات الدورة...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && course && (
          <>
            <p><strong>رقم الدورة:</strong> {course.id}</p>
            <p><strong>اسم الدورة:</strong> {course.name}</p>
            <p><strong>عدد الطلاب:</strong> {course.numOfStudents}</p>
            <p><strong>المواعيد:</strong> {course.schedule}</p>

            <h3 style={{ marginTop: "20px" }}>الدروس</h3>
            {lessonsLoading && <p>جاري تحميل الدروس...</p>}
            {lessonsError && <p style={{ color: 'red' }}>{lessonsError}</p>}

            {!lessonsLoading && lessons.length === 0 && <p>لا توجد دروس لهذه الدورة.</p>}

            {!lessonsLoading && lessons.length > 0 && (
              <ul>
                {lessons.map((lesson, index) => (
                  <li key={index} style={{ marginBottom: "20px" }}>
                    <strong>{lesson.title}</strong><br />
                    <span>{lesson.description}</span>

                    {lesson.resources && lesson.resources.length > 0 ? (
                      <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                        {lesson.resources.map((res, i) => (
                          <li key={i}>
                            📁 <strong>{res.name}</strong><br />
                            🔗 <a href={res.url} target="_blank" rel="noopener noreferrer">{res.url}</a><br />
                            📄 النوع: {res.type} | داخلي: {res.internal ? 'نعم' : 'لا'}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontStyle: "italic", marginTop: "8px" }}>لا توجد موارد لهذا الدرس.</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <Footer className={styles["teacher-footer"]} />
    </div>
  );
}

export default TeacherCourseDetails;
