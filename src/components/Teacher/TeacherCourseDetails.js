import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import TeacherHeadbar from "./TeacherHeadbar";
import Footer from "../HomePage/Footer";
import styles from "./TeacherCourseDetails.module.css";
import { getAuthHeaders, getUserInfo } from '../../utils/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
};

const fetchLessons = async (teacherId, courseId) => {
  try {
    const response = await fetch(`http://localhost:8090/api/lessons/teacher/${teacherId}/${courseId}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error('فشل تحميل بيانات الدروس');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("error feching lessons: ", error);
    throw error;
  }
};

const editCourse = async (teacherId, courseId, updatedData) => {
  try {
    const response = await fetch(`http://localhost:8090/api/courses/teacher/${teacherId}/${courseId}`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    });

    if (!response.ok) {
      throw new Error('فشل تحديث الدورة');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("error updating course: ", error);
    throw error;
  }
};

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

  const [editingField, setEditingField] = useState(null);
  const [editedValue, setEditedValue] = useState("");

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

  const handleEdit = (field) => {
    setEditingField(field);
    setEditedValue(course[field]);
  };

  const handleEditSubmit = async () => {
    const trimmed = editedValue.trim().toLowerCase();
    const original = course[editingField].trim().toLowerCase();
  
    if (trimmed === original) {
      toast.info("ℹ️ لا يوجد تغيير للحفظ.");
      setEditingField(null);
      return;
    }
  
    try {
      const updated = await editCourse(user.userId, id, {
        [editingField]: editedValue.trim(),
        teacherId: course.teacherId
      });
      setCourse(updated);
      setEditingField(null);
      toast.success("✅ تم حفظ التعديل بنجاح!");
    } catch (err) {
      toast.error(err.message || '❌ فشل التحديث');
    }
  };
  

  return (
    <div className={styles.TeacherCourseDetails}>
      <TeacherHeadbar />
      <div className={styles.main}>
        <h2>تفاصيل الدورة</h2>
        {loading && <p>جاري تحميل بيانات الدورة...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && course && (
          <>
            <p><strong>📘 رقم الدورة:</strong> {course.id}</p>

            {editingField === 'name' ? (
              <div className={styles.fieldRow}>
                <label className={styles.editLabel}>
                  📝 اسم الدورة:
                  <input
                    type="text"
                    value={editedValue}
                    onChange={e => setEditedValue(e.target.value)}
                    className={styles.inputField}
                  />
                </label>
                <div className={styles.buttonGroup}>
                  <button onClick={handleEditSubmit} className={styles.saveButton}>💾 حفظ</button>
                  <button onClick={() => setEditingField(null)} className={styles.cancelButton}>❌ إلغاء</button>
                </div>
              </div>
            ) : (
              <div className={styles.fieldRow}>
                <p><strong>📝 اسم الدورة:</strong> {course.name}</p>
                <button onClick={() => handleEdit('name')} className={styles.editButton}>✏️ تعديل الاسم</button>
              </div>
            )}

            {editingField === 'schedule' ? (
              <div className={styles.fieldRow}>
                <label className={styles.editLabel}>
                  📅 المواعيد:
                  <input
                    type="text"
                    value={editedValue}
                    onChange={e => setEditedValue(e.target.value)}
                    className={styles.inputField}
                  />
                </label>
                <div className={styles.buttonGroup}>
                  <button onClick={handleEditSubmit} className={styles.saveButton}>💾 حفظ</button>
                  <button onClick={() => setEditingField(null)} className={styles.cancelButton}>❌ إلغاء</button>
                </div>
              </div>
            ) : (
              <div className={styles.fieldRow}>
                <p><strong>📅 المواعيد:</strong> {course.schedule}</p>
                <button onClick={() => handleEdit('schedule')} className={styles.editButton}>✏️ تعديل المواعيد</button>
              </div>
            )}

            <p><strong>👥 عدد الطلاب:</strong> {course.numOfStudents}</p>
            <h3 style={{ marginTop: "20px" }}>📚 الدروس</h3>
            {lessonsLoading && <p>جاري تحميل الدروس...</p>}
            {lessonsError && <p style={{ color: 'red' }}>{lessonsError}</p>}

            {!lessonsLoading && lessons.length === 0 && <p>لا توجد دروس لهذه الدورة.</p>}

            {!lessonsLoading && lessons.length > 0 && (
              <ul>
                {lessons.map((lesson, index) => (
                  <li key={index} className={styles.lessonCard}>
                    <strong>{lesson.title}</strong><br />
                    <span>{lesson.description}</span>

                    {lesson.resources && lesson.resources.length > 0 ? (
                      <ul>
                        {lesson.resources.map((res, i) => (
                          <li key={i}>
                            📁 <strong>{res.name}</strong><br />
                            🔗 <a href={res.url} target="_blank" rel="noopener noreferrer">{res.urlShort}</a><br />
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
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default TeacherCourseDetails;
