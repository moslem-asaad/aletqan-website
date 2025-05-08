import React, { useEffect, useState } from 'react';
import styles from "./Lesson.module.css";
import { getAuthHeaders, getUserInfo } from '../../utils/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditResourceModal from './EditResourceModal';
import AddResourceModal from './AddResourceModal';
import { server } from '../../utils/constants';




function Lesson({ lesson, index, onLessonUpdate, onResourceDeleted, onDeleteLesson }) {
    const headers = getAuthHeaders();

    const [newResources, setNewResources] = useState({});
    const [activeLessonId, setActiveLessonId] = useState(null);
    const [hoveredResourceIndex, setHoveredResourceIndex] = useState(null);
    const [resourceEditStates, setResourceEditStates] = useState({});
    const [editingResource, setEditingResource] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [showAddResourceModal, setShowAddResourceModal] = useState(null);
    const [addFormData, setAddFormData] = useState({});


    const addResourceToLesson = async (lessonId) => {
        try {
            const resourceData = addFormData;
            const response = await fetch(`${server}/api/lessons/${lessonId}/resources`, {
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
            onLessonUpdate(updatedLesson);
            setActiveLessonId(null);
            setNewResources(prev => ({ ...prev, [lessonId]: {} }));
        } catch (err) {
            toast.error(err.message || '❌ فشل في الإضافة');
        }
        setShowAddResourceModal(null);
    };

    const confirmAndDeleteResource = async (resourceId, lessonId) => {
        if (!window.confirm('هل أنت متأكد أنك تريد حذف هذا المورد؟')) return;
        try {
            const response = await fetch(`${server}/api/lessons/resources/${resourceId}`, {
                method: 'DELETE',
                headers
            });
            if (!response.ok) throw new Error("فشل الحذف");
            toast.success("🗑️ تم حذف المورد بنجاح!");
            onResourceDeleted(resourceId, lessonId);
        } catch (err) {
            toast.error(err.message || '❌ فشل الحذف');
        }
    };

    const openEditForm = (resource) => {
        setEditingResource(resource);
        setEditFormData({
            name: resource.name,
            url: resource.url,
            urlShort: resource.urlShort,
            type: resource.type,
            internal: resource.internal
        });
    };

    const saveResourceChanges = async () => {
        if (!editingResource) return;

        if (!window.confirm('هل تريد حفظ التعديلات؟')) return;

        try {
            const response = await fetch(`${server}/api/lessons/resources/${editingResource.id}`, {
                method: 'PUT',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editFormData)
            });

            if (!response.ok) throw new Error("فشل التحديث");
            const updatedResource = await response.json();

            const updatedLesson = {
                ...lesson,
                resources: lesson.resources.map(res => res.id === updatedResource.id ? updatedResource : res)
            };
            onLessonUpdate(updatedLesson);

            toast.success("✏️ تم تحديث المورد بنجاح!");
            setEditingResource(null);
        } catch (err) {
            toast.error(err.message || '❌ فشل التحديث');
        }
    };





    return (
        <div className={styles.lessonCard}>
            <div
                className={styles.lessonHeader}
                onClick={() =>
                    setActiveLessonId(activeLessonId === lesson.id ? null : lesson.id)
                }
            >

                <strong>📘 الدرس {index + 1}:</strong> {lesson.title}
                <span className={styles.arrow}>{activeLessonId === lesson.id ? "▾" : "▸"}</span>
            </div>

            {activeLessonId === lesson.id && (

                <div className={styles.lessonContent}>
                    <button
                        className={styles.deleteLessonBtn}
                        onClick={() => {
                            console.log(lesson.id);
                                onDeleteLesson(lesson.id);
                        }}
                    >
                        🗑️ حذف الدرس
                    </button>

                    <p className={styles.lessonDescription}>{lesson.description}</p>

                    {lesson.resources?.length > 0 ? (
                        <ul className={styles.resourceList}>
                            {lesson.resources.map((res, i) => (
                                <li
                                    key={res.id}
                                    className={styles.resourceItem}
                                    onMouseEnter={() => setHoveredResourceIndex(i)}
                                    onMouseLeave={() => setHoveredResourceIndex(null)}
                                >
                                    <div className={styles.resourceText}>
                                        <span className={styles.badge}>
                                            {res.type === "PDF" ? "📄 PDF" : "🎥 فيديو"}
                                        </span>
                                        <strong>{res.name}</strong>
                                        <a
                                            className={styles.resourceLink}
                                            href={res.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {res.urlShort}
                                        </a>
                                    </div>

                                    {hoveredResourceIndex === i && (
                                        <div className={styles.resourceActions}>
                                            <button onClick={() => openEditForm(res)} className={styles.editButton}>
                                                ✏️
                                            </button>
                                            <button onClick={() => confirmAndDeleteResource(res.id, lesson.id)} className={styles.deleteButton}>
                                                ❌
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.noResources}>لا توجد موارد لهذا الدرس.</p>
                    )}

                    <button
                        className={styles.addButton}
                        onClick={() => {
                            setAddFormData({
                                name: "",
                                url: "",
                                urlShort: "",
                                type: "PDF",
                                internal: false,
                            });
                            setShowAddResourceModal(true);
                        }}
                    >
                        ➕ إضافة مورد
                    </button>
                </div>
            )}

            {showAddResourceModal && (
                <AddResourceModal
                    newResourceData={addFormData}
                    setNewResourceData={setAddFormData}
                    onAdd={() => addResourceToLesson(lesson.id)}
                    onCancel={() => setShowAddResourceModal(false)}
                />
            )}

            {editingResource && (
                <EditResourceModal
                    editFormData={editFormData}
                    setEditFormData={setEditFormData}
                    onSave={saveResourceChanges}
                    onCancel={() => setEditingResource(null)}
                />
            )}
        </div>

    );


    function ShowResources() {
        return (
            <ul>
                {lesson.resources.map((res, i) => (
                    <li
                        key={res.id}
                        className={styles.resourceItem}
                        onMouseEnter={() => setHoveredResourceIndex(i)}
                        onMouseLeave={() => setHoveredResourceIndex(null)}
                    >
                        <div className={styles.resourceContent}>
                            <div>
                                📁 <strong>{res.name}</strong><br />
                                🔗 <a href={res.url} target="_blank" rel="noopener noreferrer">{res.urlShort}</a><br />
                            </div>
                            {hoveredResourceIndex === i && (
                                <div className={styles.resourceActions}>
                                    <button className={styles.editButton} onClick={() => openEditForm(res)}>✏️</button>
                                    <button className={styles.deleteButton} onClick={() => confirmAndDeleteResource(res.id, lesson.id)}>❌</button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

}

export default Lesson;