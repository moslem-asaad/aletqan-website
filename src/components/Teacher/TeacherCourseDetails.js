import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import TeacherHeadbar from "./TeacherHeadbar";
import Footer from "../HomePage/Footer";
import styles from "./TeacherCourseDetails.module.css";
import { getAuthHeaders, getUserInfo } from '../../utils/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TeacherLessons from '../Lesson/TeacherLessons';


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

  const [newResources, setNewResources] = useState({});
const [activeLessonId, setActiveLessonId] = useState(null);
const [editingLessonId, setEditingLessonId] = useState(null);
const [resourceEditStates, setResourceEditStates] = useState({});

  const toggleResourceForm = (lessonId) => {
    setActiveLessonId(prev => prev === lessonId ? null : lessonId);
  };

  const toggleEditResources = (lessonId) => {
    setEditingLessonId(prev => prev === lessonId ? null : lessonId);
  };

  const handleResourceChange = (e, lessonId) => {
    const { name, value, type, checked } = e.target;
    setNewResources(prev => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleEditResourceChange = (e, resourceId) => {
    const { name, value, type, checked } = e.target;
    setResourceEditStates(prev => ({
      ...prev,
      [resourceId]: {
        ...prev[resourceId],
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const confirmAndDeleteResource = async (resourceId, lessonId) => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذا المورد؟')) return;
    try {
      const response = await fetch(`http://localhost:8090/api/lessons/resources/${resourceId}`, {
        method: 'DELETE',
        headers
      });
      if (!response.ok) throw new Error("فشل الحذف");
      toast.success("🗑️ تم حذف المورد بنجاح!");
      setLessons(prev => prev.map(lesson =>
        lesson.id === lessonId
          ? { ...lesson, resources: lesson.resources.filter(r => r.id !== resourceId) }
          : lesson
      ));
    } catch (err) {
      toast.error(err.message || '❌ فشل الحذف');
    }
  };

  const confirmAndUpdateResource = async (resourceId, lessonId) => {
    if (!window.confirm('هل تريد حفظ التعديلات؟')) return;
    try {
      const response = await fetch(`http://localhost:8090/api/lessons/resources/${resourceId}`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceEditStates[resourceId])
      });
      if (!response.ok) throw new Error("فشل التحديث");
      const updatedLesson = await response.json();
      toast.success("✏️ تم تحديث المورد بنجاح!");
      setLessons(prev => prev.map(l => l.id === lessonId ? updatedLesson : l));
      setResourceEditStates(prev => ({ ...prev, [resourceId]: undefined }));
    } catch (err) {
      toast.error(err.message || '❌ فشل التحديث');
    }
  };

  const addResourceToLesson = async (lessonId) => {
    try {
      const resourceData = newResources[lessonId];
      const response = await fetch(`http://localhost:8090/api/lessons/${lessonId}/resources`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceData)
      });

      if (!response.ok) throw new Error("فشل إضافة المورد");
      const updatedLesson = await response.json();
      toast.success("✅ تم إضافة المورد بنجاح!");
      setLessons(prev =>
        prev.map(l => l.id === lessonId ? updatedLesson : l)
      );
      setActiveLessonId(null);
      setNewResources(prev => ({ ...prev, [lessonId]: {} }));
    } catch (err) {
      toast.error(err.message || '❌ فشل في الإضافة');
    }
  };

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
            
            {<TeacherLessons id={id} course={course} />}
            
          </>
        )}
      </div>
      <Footer className={styles["teacher-footer"]} />
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default TeacherCourseDetails;
