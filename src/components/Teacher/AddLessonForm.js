import React, { useState, useEffect, useRef } from "react";
import styles from "./TeacherHome.module.css";
import styles2 from "./AddLessonForm.module.css";
import { validateField } from "../../utils/validation";


/**
 * @param courses
 */
function AddLessonForm({ courses, setShowModal, form, setForm, submitNewLesson }) {

  /* ================ Resource builder ================ */
  const [resName, setResName] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [resType, setResType] = useState("VIDEO");
  const [resInternal, setResInternal] = useState(false);
  const [showErrors, setErrors] = useState(false);



  const { isValid: isTitleValid, errors: nameErrors } = validateField(form.title);


  const isCourseChosen = courses.length === 1 || Boolean(form.courseId);
  const isFormValid = isTitleValid && isCourseChosen;


  const addResource = () => {
    if (!resName || !resUrl) return;
    const newRes = {
      id: 0,
      name: resName,
      url: resUrl,
      type: resType,
      internal: resInternal,
    };
    setForm(f => ({ ...f, resources: [...f.resources, newRes] }));
    setResName(""); setResUrl("");
  };

  const removeResource = (idx) =>
    setForm(f => ({
      ...f,
      resources: f.resources.filter((_, i) => i !== idx),
    }));

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prevOverflow);
  }, []);

  useEffect(() => {
    if (courses.length === 1 && !form.courseId) {
      console.log(courses[0].id);
      setForm(f => ({ ...f, courseId: courses[0].id }));
    }
  }, [courses, form.courseId, setForm]);

  return (
    <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3>إضافة درس جديد</h3>

        <label>
          عنوان الدرس
          <input
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
            className={!isTitleValid ? styles2.invalid : ""}
            placeholder="مثال: الدرس الأول – أحكام النون الساكنة"
          />
        </label>

        {showErrors && nameErrors.map((msg, i) => (
          <p key={i} className={styles2.errorMsg}>{msg}</p>
        ))}

        <label>
          الوصف
          <textarea
            className={styles2.descArea}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </label>

        {courses.length > 1 ? (
          <label>
            اختر الدورة
            <select
              value={form.courseId}
              onChange={e => setForm({ ...form, courseId: Number(e.target.value) })}
              required
            >
              <option value="">— اختر —</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          // No need to show selection, only one course is passed
          <input type="hidden" value={courses[0]?.id} />
        )}

        <fieldset className={styles2.resBuilder}>
          <legend>الموارد</legend>

          <div className={styles2.resRow}>
            <input
              type="text"
              placeholder="اسم المورد"
              value={resName}
              onChange={e => setResName(e.target.value)}
            />
            <input
              type="text"
              placeholder="الرابط URL"
              value={resUrl}
              onChange={e => setResUrl(e.target.value)}
            />
            <select value={resType} onChange={e => setResType(e.target.value)}>
              <option value="VIDEO">فيديو</option>
              <option value="IMAGE">صورة</option>
              <option value="FILE">ملف</option>
              <option value="LINK">رابط خارجي</option>
            </select>
            <label className={styles2.checkLabel}>
              داخلي؟
              <input
                type="checkbox"
                checked={resInternal}
                onChange={e => setResInternal(e.target.checked)}
              />
            </label>
            <button type="button" onClick={addResource} className={styles2.addBtn}>
              أضف
            </button>
          </div>

          {form.resources.length > 0 && (
            <ul className={styles2.resList}>
              {form.resources.map((r, idx) => (
                <li key={idx} className={styles2.resChip}>
                  <span>{r.name}</span>
                  <button
                    type="button"
                    onClick={() => removeResource(idx)}
                    className={styles2.closeBtn}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        <div className={styles.modalActions}>
          <button
            onClick={() => isFormValid ? submitNewLesson() : setErrors(true)}
            className={styles.saveBtn}
          >
            حفظ
          </button>
          <button
            onClick={() => {
              setForm({ title: "", description: "", courseId: "", resources: [] });
              setShowModal(false);
            }}
            className={styles.cancelBtn}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddLessonForm;
