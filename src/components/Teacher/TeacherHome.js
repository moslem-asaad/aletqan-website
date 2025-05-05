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

function TeacherHome() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [user, setUser] = useState(null);

  const coursesPerPage = 16;
  const [currentPage, setCurrentPage] = useState(0);

  const [upcomingLessons] = useState([
    { id: 1, name: "اسم الدورة", date: "24.10" },
    { id: 2, name: "اسم الدورة", date: "30.10" },
    { id: 2, name: "اسم الدورة", date: "30.10" },
    { id: 2, name: "اسم الدورة", date: "30.10" },
  ]);
  const [notifications] = useState([
    "الإشعار الأول",
    "الإشعار الثاني",
    "الإشعار الثالث",
  ]);

  useEffect(() => setUser(getUserInfo()), []);

  useEffect(() => {
    if (!user) return;
    fetchCourses(user.userId).then(setCourses).catch(console.error);
  }, [user]);

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

  const addCourse = () =>
    setCourses([
      ...courses,
      { id: courses.length + 1, name: "دورة جديدة", numOfStudents: 0 },
    ]);

  const handleLessonClick = (lessonId) => {

  }

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
                <div key={l.id} className={styles.lessonRow} onClick={() => handleLessonClick(l.id)}>
                  <span className={styles.navArrow}>◄</span>
                  <span>{l.name}</span>
                  <span>{l.date}</span>
                </div>
              ))}
              <button className={styles.showAllBtn}>عرض الجميع</button>
            </div>
          </section>

          <button className={styles.goldBtn}>إنشاء دورة</button>
          <button className={styles.goldBtn}>إضافة درس</button>
          <button className={styles.goldBtn}>إرسال إشعار</button>
          <button className={styles.goldBtn}>إنشاء منظمة</button>

        </aside>
        <div className={styles.leftContent}>
          <div id="courses" className={styles.coursesSection}>
            <div className={styles.header}>
              <h2>دوراتي</h2>
              <button onClick={addCourse} className={styles.addCourseBtn}>
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
    </div>
  );
}

export default TeacherHome;
