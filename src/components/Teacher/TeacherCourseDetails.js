import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import TeacherHeadbar from "./TeacherHeadbar";
import Footer from "../HomePage/Footer";
import styles from "./TeacherCourseDetails.module.css";
import { getAuthHeaders, getUserInfo } from '../../utils/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TeacherLessons from '../Lesson/TeacherLessons';
import { server } from '../../utils/constants';
import { getArabicDay, formatTime } from '../../utils/date';






const fetchCourse = async (teacherId, courseId) => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(`${server}/api/courses/teacher/${teacherId}/${courseId}`, {
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
    const headers = getAuthHeaders();
    const response = await fetch(`${server}/api/lessons/teacher/${teacherId}/${courseId}`, {
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
    const headers = getAuthHeaders();
    const response = await fetch(`${server}/api/courses/teacher/${teacherId}/${courseId}`, {
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

  const days = [
    { value: "Sunday", label: "الأحد" },
    { value: "Monday", label: "الإثنين" },
    { value: "Tuesday", label: "الثلاثاء" },
    { value: "Wednesday", label: "الأربعاء" },
    { value: "Thursday", label: "الخميس" },
    { value: "Friday", label: "الجمعة" },
    { value: "Saturday", label: "السبت" },
  ];


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

      <div className={styles.mainGrid}>

        {/* Right Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.courseCard}>
            {editingField === 'name' ? (
              <>
                <input
                  type="text"
                  value={editedValue}
                  onChange={e => setEditedValue(e.target.value)}
                  onBlur={handleEditSubmit}
                  autoFocus
                  className={styles.inputField}
                />
                <div className={styles.buttonGroup}>
                  <button onClick={handleEditSubmit} className={styles.saveButton}>💾</button>
                  <button onClick={() => setEditingField(null)} className={styles.cancelButton}>✖️</button>
                </div>
              </>
            ) : (
              <>
                <h2 onClick={() => handleEdit('name')} className={styles.clickableTitle}>
                  {course.name}
                </h2>
              </>
            )}



          </div>
          {editingField === 'schedule' ? (
            <div className={styles.fieldRow}>
              <div className={styles.scheduleEditContainer}>
                {course.schedule.map((item, idx) => (
                  <div key={idx} className={styles.scheduleRow}>
                    <select
                      value={item.dayOfWeek}
                      onChange={(e) => {
                        const newSchedule = [...course.schedule];
                        newSchedule[idx].dayOfWeek = e.target.value;
                        setCourse({ ...course, schedule: newSchedule });
                      }}
                    >
                      {days.map(day => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="time"
                      value={item.startTime}
                      onChange={(e) => {
                        const newSchedule = [...course.schedule];
                        newSchedule[idx].startTime = e.target.value;
                        setCourse({ ...course, schedule: newSchedule });
                      }}
                    />
                    <input
                      type="time"
                      value={item.endTime}
                      onChange={(e) => {
                        const newSchedule = [...course.schedule];
                        newSchedule[idx].endTime = e.target.value;
                        setCourse({ ...course, schedule: newSchedule });
                      }}
                    />

                    <button
                      className={styles.deleteScheduleBtn}
                      onClick={() => {
                        const newSchedule = course.schedule.filter((_, i) => i !== idx);
                        setCourse({ ...course, schedule: newSchedule });
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}


                <button
                  onClick={() => {
                    const newSchedule = [...course.schedule, {
                      dayOfWeek: "Monday",
                      startTime: "10:00",
                      endTime: "12:00"
                    }];
                    setCourse({ ...course, schedule: newSchedule });
                  }}
                  className={styles.addButton}
                >
                  ➕ إضافة موعد
                </button>

                <div className={styles.buttonGroup}>
                  <button
                    onClick={async () => {
                      try {
                        const updated = await editCourse(user.userId, id, {
                          schedule: course.schedule,
                          teacherId: course.teacherId
                        });
                        setCourse(updated);
                        setEditingField(null);
                        toast.success("✅ تم حفظ المواعيد!");
                      } catch (err) {
                        toast.error(err.message || '❌ فشل التحديث');
                      }
                    }}
                    className={styles.saveButton}
                  >
                    💾 حفظ
                  </button>
                  <button onClick={() => setEditingField(null)} className={styles.cancelButton}>
                    ❌ إلغاء
                  </button>
                </div>
              </div>
            </div>
          ) : (

            <div className={styles.scheduleCard}>

              {course.schedule.map((item, i) => (
                <div key={i} className={styles.lessonRow}>
                  <span>{getArabicDay(item.dayOfWeek)}</span>
                  <span>{formatTime(item.startTime)} - {formatTime(item.endTime)}</span>
                </div>
              ))}
              <button onClick={() => handleEdit('schedule')} className={styles.showAllBtn}>
                ✏️ تعديل المواعيد
              </button>
            </div>

          )}

          <div className={styles.infoBox}>
            <p>عدد الطلاب</p>
            <strong>{course.numOfStudents}</strong>
          </div>

          <button className={styles.goldBtn}>إضافة درس</button>
          <button className={styles.goldBtn}>إضافة مورد عام</button>
          <button className={styles.goldBtn}>إنشاء وظيفة</button>
          <button className={styles.goldBtn}>إنشاء إختبار</button>
        </div>

        {/* Left Column -  Lessons */}
          <div className={styles.courseDetails}>
            <div className={styles.lessonSection}>
              {<TeacherLessons id={id} course={course} />}
            </div>
          </div>

      </div>

      <Footer className={styles["teacher-footer"]} />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );

}

export default TeacherCourseDetails;
