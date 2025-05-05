import React, { useEffect, useState } from 'react';
import styles from "./TeacherLessons.module.css";
import { getAuthHeaders, getUserInfo } from '../../utils/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lesson from './Lesson';
import { server } from '../../utils/constants';






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

