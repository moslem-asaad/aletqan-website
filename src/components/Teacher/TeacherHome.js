import React, { useState, useEffect } from "react";
import TeacherHeadbar from "./TeacherHeadbar";
import styles from "./TeacherHome.module.css";
import { FaUsers, FaEdit, FaSave, FaBell } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import q2 from "../assets/q2.png";
import etqanLogo from "../assets/logo.png";
import { getAuthHeaders, getUserInfo } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { server } from "../../utils/constants";
import Footer from "../HomePage/Footer";
import { ToastContainer, toast } from 'react-toastify';
import AddCourseForm from "./AddCourseForm";
import AddLessonForm from "./AddLessonForm";




const fetchCourses = async (userId) => {
  const headers = getAuthHeaders();
  const res = await fetch(`${server}/api/courses/teacher/${userId}`, { headers });
  if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
  return res.json();
};

const editCourse = async (userId, course) => {
  const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };
  const res = await fetch(
    `${server}/api/courses/teacher/${userId}/${course.id}`,
    { method: "PUT", headers, body: JSON.stringify(course) }
  );
  if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
  return res.json();
};

const createCourse = async (course) => {
  const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };
  const res = await fetch(
    `${server}/api/courses`,
    { method: "POST", headers, body: JSON.stringify(course) }
  );
  if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
  return res.json();
}

const fetchNextLessons = async (userId, page = 0) => {
  const headers = getAuthHeaders();
  const res = await fetch(`${server}/api/course-times/next?teacherId=${userId}&page=${page}`, { headers });
  if (res.status === 204) return [];
  if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
  return res.json();
};


const createLesson = async (lesson) => {
  const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };
  const res = await fetch(
    `${server}/api/lessons`,
    { method: "POST", headers, body: JSON.stringify(lesson) }
  );
  if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
  return res.json();
}


function TeacherHome() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [user, setUser] = useState(null);
  const [showAddCourseModal, setAddCourseShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", schedule: [], studentIds: "" });

  const [showAddLessonModal, setAddLessonShowModal] = useState(false);
  const [lessonform, setLessonForm] = useState({ title: "", description: "", courseId: "", resources: [] });
  const coursesPerPage = 16;
  const [currentPage, setCurrentPage] = useState(0);

  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [lessonPage, setLessonPage] = useState(0);
  const lessonsPerPage = 4;

  const [notifications] = useState([
    "الإشعار الأول",
    "الإشعار الثاني",
    "الإشعار الثالث",
  ]);

  useEffect(() => setUser(getUserInfo()), []);

  useEffect(() => {
    if (!user) return;
    fetchCourses(user.userId).then(setCourses).catch(console.error);
    fetchNextLessons(user.userId, 0).then(setUpcomingLessons).catch(console.error);
  }, [user]);


  const submitNewCourse = async () => {
    try {
      const payload = {
        name: form.name,
        schedule: form.schedule,
        teacherId: user.userId,
        studentIds:
          form.studentIds
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
      };
      const response = await createCourse(payload);
      toast.success("✅ تم إضافة الدورة بنجاح!");
      setCourses([...courses, response]);
      setForm({ name: "", schedule: "", studentIds: "" });
      setAddCourseShowModal(false);
    } catch (error) {
      toast.error(error.message || "❌ فشل في الإضافة");
    }
    setAddCourseShowModal(null);
  }

  const submitNewLesson = async () => {
    try {
      const payload = {
        title: lessonform.title,
        description: lessonform.description,
        courseId: lessonform.courseId,
        resources: lessonform.resources,
      };
      const response = await createLesson(payload)
      toast.success("✅ تم إضافة الدرس بنجاح!");
      setLessonForm({ title: "", description: "", courseId: "", resources: [] });
      setAddLessonShowModal(false);
    } catch (error) {
      toast.error(error.message || "❌ فشل في الإضافة");
    }
    setAddLessonShowModal(null);
  }

  const loadMoreLessons = async () => {
    try {
      const nextPage = lessonPage + 1;
      const moreLessons = await fetchNextLessons(user.userId, nextPage);
      if (moreLessons.length > 0) {
        setUpcomingLessons([...upcomingLessons, ...moreLessons]);
        setLessonPage(nextPage);
      } else {
        toast.info("لا يوجد دروس إضافية");
      }
    } catch (e) {
      toast.error("فشل تحميل الدروس الإضافية");
    }
  };



  const displayNumStudents = (n) =>
    n === 0
      ? "لا يوجد طلاب"
      : n === 1
        ? "طالب واحد"
        : n === 2
          ? "طالبان"
          : n <= 10
            ? `${n} طلاب`
            : `${n} طالب`;

  const totalStudents = courses.reduce((sum, c) => sum + c.numOfStudents, 0);

  const start = currentPage * coursesPerPage;
  const displayedCourses = courses.slice(start, start + coursesPerPage);
  const hasPrev = currentPage > 0;
  const hasNext = start + coursesPerPage < courses.length;

  /* CRUD */
  const startEditing = (c) => {
    setEditingCourseId(c.id);
    setEditedName(c.name);
  };

  const saveEditedName = async (id) => {
    if (!user) return;
    const updated = {
      ...courses.find((c) => c.id === id),
      name: editedName,
      teacherId: user.userId,
    };
    try {
      const res = await editCourse(user.userId, updated);
      setCourses(courses.map((c) => (c.id === id ? res : c)));
      setEditingCourseId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLessonClick = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      navigate(`/teacher/course/${courseId}`, { state: { course } });
    } else {
      toast.warn("لم يتم العثور على الدورة المرتبطة");
    }
  };


  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  /* render */
  return (
    <div className={styles.TeacherHomePage}>
      <TeacherHeadbar />

      <div className={styles.main}>
        <aside id="upcoming" className={styles.rightSidebar}>
          <section className={styles.upcomingSection}>
            <h2>
              <img
                src={require("../assets/books.png")}
                alt=""
                className={styles.sidebarIcon}
              />
              الدروس القادمة
            </h2>
            <div className={styles.upcomingCard}>
              {upcomingLessons.map((l) => (
                <div key={l.id} className={styles.lessonRow} onClick={() => handleLessonClick(l.courseId)}>
                  <span className={styles.navArrow}>◄</span>
                  <span>{l.name}</span>
                  <span>{new Date(l.nextLessonDate).toLocaleDateString("ar-EG", {
                    weekday: "short",
                    day: "numeric",
                    month: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}</span>

                </div>
              ))}
              <button className={styles.showAllBtn} onClick={loadMoreLessons}>عرض المزيد</button>
            </div>
          </section>

          <button onClick={() => setAddCourseShowModal(true)} className={styles.goldBtn}>إنشاء دورة</button>
          <button onClick={() => setAddLessonShowModal(true)} className={styles.goldBtn}>إضافة درس</button>
          <button className={styles.goldBtn}>إرسال إشعار</button>
          <button className={styles.goldBtn}>إنشاء منظمة</button>

        </aside>
        <div className={styles.leftContent}>
          <div id="courses" className={styles.coursesSection}>
            <div className={styles.header}>
              <h2>دوراتي</h2>
              <button onClick={() => setAddCourseShowModal(true)} className={styles.addCourseBtn}>
                إنشاء دورة +
              </button>
            </div>

            <div className={styles.courseCards}>
              {displayedCourses.map((course) => (
                <div
                  key={course.id}
                  className={styles.card}
                  onClick={() =>
                    editingCourseId !== course.id &&
                    navigate(`/teacher/course/${course.id}`, { state: { course } })
                  }
                  style={{
                    cursor: editingCourseId !== course.id ? "pointer" : "default",
                  }}
                >
                  <button
                    className={styles.editBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(course);
                    }}
                  >
                    <FaEdit />
                  </button>

                  <img src={q2} alt="دورة" className={styles.courseIcon} />

                  <div className={styles.courseData}>
                    {editingCourseId === course.id ? (
                      <>
                        <input
                          className={styles.editInput}
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                        />
                        <button
                          className={styles.saveBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            saveEditedName(course.id);
                          }}
                        >
                          <FaSave /> حفظ
                        </button>
                      </>
                    ) : (
                      <>
                        <h4>{course.name}</h4>
                        <p>{displayNumStudents(course.numOfStudents)}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={!hasPrev}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                ◄ السابق
              </button>
              <button
                className={styles.pageBtn}
                disabled={!hasNext}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                التالي ►
              </button>
            </div>
          </div>

          <div id="info" className={styles.generalInfo}>
            <h2>معلومات عامة</h2>
            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <img src={require("../assets/books.png")} alt="" width={48} />
                <p>
                  عدد الدورات الكلي
                  <br />
                  {courses.length} دورات
                </p>
              </div>
              <div className={styles.infoCard}>
                <FaUsers size={48} />
                <p>
                  عدد الطلاب الكلي
                  <br />
                  {totalStudents} طلاب
                </p>
              </div>
            </div>
          </div>
        </div>


      </div>
      <Footer className={styles["teacher-footer"]} />
      <nav className={styles.mobileNav}>
        <button onClick={() => scrollTo("upcoming")}>الدروس</button>
        <button onClick={() => scrollTo("courses")}>دوراتي</button>
        <button onClick={() => scrollTo("info")} >معلومات عامة</button>
      </nav>

      {showAddCourseModal && (
        <AddCourseForm
          setShowModal={setAddCourseShowModal}
          setForm={setForm}
          form={form}
          submitNewCourse={submitNewCourse}
        />
      )}

      {showAddLessonModal && (
        <AddLessonForm
          courses={courses}
          setShowModal={setAddLessonShowModal}
          setForm={setLessonForm}
          form={lessonform}
          submitNewLesson={submitNewLesson}
        />
      )}




      <ToastContainer rtl />

    </div>
  );


}

export default TeacherHome;
