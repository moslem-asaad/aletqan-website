import React, { useEffect, useState } from 'react';
import styles from "./TeacherLessons.module.css";
import { getAuthHeaders, getUserInfo } from '../../utils/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const headers = getAuthHeaders();

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

function TeacherLessons({id,course}) {
    const [lessons, setLessons] = useState([]);
    const [lessonsLoading, setLessonsLoading] = useState(true);
    const [lessonsError, setLessonsError] = useState(null);
    const [newResources, setNewResources] = useState({});
    const [activeLessonId, setActiveLessonId] = useState(null);

    const toggleResourceForm = (lessonId) => {
        setActiveLessonId(prev => prev === lessonId ? null : lessonId);
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


    const user = getUserInfo();

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
        <div className={styles.TeacherLessons}>
            <div className={styles.main}>
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

                                {activeLessonId === lesson.id && (
                                    <div className={styles.resourceForm}>
                                        <h4>إضافة مورد جديد</h4>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="اسم المورد"
                                            value={newResources[lesson.id]?.name || ''}
                                            onChange={(e) => handleResourceChange(e, lesson.id)}
                                        />
                                        <input
                                            type="text"
                                            name="url"
                                            placeholder="الرابط الكامل"
                                            value={newResources[lesson.id]?.url || ''}
                                            onChange={(e) => handleResourceChange(e, lesson.id)}
                                        />
                                        <input
                                            type="text"
                                            name="urlShort"
                                            placeholder="رابط مختصر"
                                            value={newResources[lesson.id]?.urlShort || ''}
                                            onChange={(e) => handleResourceChange(e, lesson.id)}
                                        />
                                        <select
                                            name="type"
                                            value={newResources[lesson.id]?.type || 'PDF'}
                                            onChange={(e) => handleResourceChange(e, lesson.id)}
                                        >
                                            <option value="PDF">PDF</option>
                                            <option value="IMAGE">صورة</option>
                                            <option value="VIDEO">فيديو</option>
                                            <option value="LINK">رابط</option>
                                        </select>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="internal"
                                                checked={newResources[lesson.id]?.internal || false}
                                                onChange={(e) => handleResourceChange(e, lesson.id)}
                                            />
                                            داخلي؟
                                        </label>
                                        <button onClick={() => addResourceToLesson(lesson.id)}>➕ أضف المورد</button>
                                    </div>
                                )}
                                <button
                                    onClick={() => toggleResourceForm(lesson.id)}
                                    className={activeLessonId === lesson.id ? styles.cancelButton : styles.addButton}
                                >
                                    {activeLessonId === lesson.id ? '❌ إلغاء' : '➕ إضافة مورد'}
                                </button>


                            </li>
                        ))}
                    </ul>

                )}
            </div>
        </div>
    );


}

export default TeacherLessons;

