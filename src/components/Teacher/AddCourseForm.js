// AddCourseForm.jsx
import React, { useState, useEffect, useRef } from "react";
import styles from "./TeacherHome.module.css";
import styles2 from "./AddCourseForm.module.css";
import { validateField } from "../../utils/validation";


const days = [
    { value: "Sunday", label: "الأحد" },
    { value: "Monday", label: "الإثنين" },
    { value: "Tuesday", label: "الثلاثاء" },
    { value: "Wednesday", label: "الأربعاء" },
    { value: "Thursday", label: "الخميس" },
    { value: "Friday", label: "الجمعة" },
    { value: "Saturday", label: "السبت" },
];

export default function AddCourseForm({
    setShowModal,
    form,
    setForm,
    submitNewCourse
}) {

    const [name, setName] = useState(form.name);
    const [schedule, setSchedule] = useState(form.schedule ?? []);
    const [studentIds, setStudentIds] = useState(form.studentIds ?? "");

    const [tempDay, setTempDay] = useState("Sunday");
    const [tempStart, setTempStart] = useState("");
    const [tempEnd, setTempEnd] = useState("");

    const [showErrors, setErrors] = useState(false);
    const { isValid: isNameValid, errors: nameErrors } = validateField(name);


    const nameRegex = /^[\p{L}].{0,59}$/u;
    //const isNameValid = nameRegex.test(name);


    const isTempValid =
        tempStart &&
        tempEnd &&
        tempStart < tempEnd;

    const parsedStudentIds = studentIds
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
        .map(Number)
        .filter(n => Number.isInteger(n) && n > 0);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = e => { if (e.key === "Escape") cancel(); };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, []);

    const nameRef = useRef(null);
    useEffect(() => nameRef.current?.focus(), []);

    const addEntry = () => {
        if (!isTempValid) return;
        setSchedule([...schedule, { day: tempDay, start: tempStart, end: tempEnd }]);
        setTempStart(""); setTempEnd("");
    };

    const removeEntry = idx => setSchedule(schedule.filter((_, i) => i !== idx));

    const saveCourse = () => {
        if (!isNameValid || schedule.length === 0) {
            setErrors(true);
            return;
        }
        setForm({
            name,
            schedule: schedule.map(({ day, start, end }) => ({
                dayOfWeek: day.toUpperCase(),
                startTime: start,
                endTime: end,
            })),
            studentIds: parsedStudentIds,
        });
        submitNewCourse();
    };

    const cancel = () => {
        setForm({ name: "", schedule: [], studentIds: "" });
        setShowModal(false);
    };

    return (
        <div className={styles.modalOverlay} onClick={cancel}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h3>إضافة دورة جديدة</h3>

                <label>
                    اسم الدورة
                    <input
                        ref={nameRef}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={!isNameValid ? styles2.invalid : ""}
                        placeholder="مثال: تجويد متقدم"
                    />
                </label>
                {showErrors && nameErrors.map((msg, i) => (
                    <p key={i} className={styles2.errorMsg}>{msg}</p>
                ))}


                <fieldset className={styles2.scheduleBuilder}>
                    <legend>الموعد (أضف أيامًا وساعات)</legend>

                    <div className={styles2.scheduleRow}>
                        <select value={tempDay} onChange={e => setTempDay(e.target.value)}>
                            {days.map(d => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                        </select>

                        <input
                            type="time"
                            value={tempStart}
                            onChange={e => setTempStart(e.target.value)}
                        />
                        <span>—</span>
                        <input
                            type="time"
                            value={tempEnd}
                            onChange={e => setTempEnd(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && addEntry()}
                        />

                        <button
                            type="button"
                            onClick={addEntry}
                            disabled={!isTempValid}
                            className={styles2.addBtn}
                        >
                            أضف
                        </button>
                    </div>

                    {schedule.length > 0 && (
                        <ul className={styles2.entriesList}>
                            {schedule.map((s, idx) => (
                                <li key={idx} className={styles2.entryChip}>
                                    {days.find(d => d.value === s.day)?.label} {s.start}-{s.end}
                                    <button
                                        type="button"
                                        onClick={() => removeEntry(idx)}
                                        className={styles2.closeBtn}
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {schedule.length === 0 && (
                        <p className={styles2.hint}>أضف يومًا واحدًا على الأقل - تستطيع تعديله لاحقًا</p>
                    )}
                </fieldset>


                <label>
                    أرقام الطلاب (اختياري، مفصولة بفواصل)
                    <input
                        value={studentIds}
                        onChange={e => setStudentIds(e.target.value)}
                        placeholder="مثال: 3, 15, 22"
                    />
                </label>

                <div className={styles.modalActions}>
                    <button
                        onClick={saveCourse}
                        className={styles.saveBtn}
                    >
                        حفظ
                    </button>
                    <button onClick={cancel} className={styles.cancelBtn}>
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
}
