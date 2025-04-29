import React, { useEffect, useState } from 'react';
import styles from "./TeacherLessons.module.css";
import { getAuthHeaders, getUserInfo } from '../../utils/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lesson from './Lesson';



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

function TeacherLessons({ id, course }) {
    const [lessons, setLessons] = useState([]);
    const [lessonsLoading, setLessonsLoading] = useState(true);
    const [lessonsError, setLessonsError] = useState(null);
    const [newResources, setNewResources] = useState({});
    const [activeLessonId, setActiveLessonId] = useState(null);

    const updateLesson = (updatedLesson) => {
        setLessons(prevLessons =>
            prevLessons.map(l => (l.id === updatedLesson.id ? updatedLesson : l))
        );
    };

    const deleteResource = (resourceId,lessonId) => {
        setLessons(prev => prev.map(lesson =>
            lesson.id === lessonId
                ? { ...lesson, resources: lesson.resources.filter(r => r.id !== resourceId) }
                : lesson
        ));
    }


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
                            <Lesson  key={lesson.id || index} lesson={lesson} index={index} onLessonUpdate={updateLesson} onResourceDeleted={deleteResource} />

                        ))}
                    </ul>

                )}
            </div>
        </div>
    );


}

export default TeacherLessons;

