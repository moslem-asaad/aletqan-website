import React, { useState } from "react";
import styles from "./TeacherHeadbar.module.css";
import { FaUserCircle, FaBell, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useUserName } from "../../utils/useUserName";
import { useNavigate } from "react-router-dom";

function TeacherHeadbar() {
  const userName = useUserName();
  const navigate = useNavigate();

  /* إشعارات تجريبية، استبدل بجلب من API */
  const [notifications] = useState([
    "تم إضافة درس جديد",
    "تذكير: موعد دورة التجويد",
    "تم تحديث معلومات الدورة",
    "طالب جديد انضم لدورتك",
    "تم رفع تقرير الحضور",
    "موعد دفع الأقساط الشهرية",
  ]);
  const [open, setOpen] = useState(false);

  const logout = () => {
    try{
      //logout from server
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }catch (error){

    }
  
  };

  return (
    <header className={styles.headbar}>
      <div className={styles["top-bar"]}>
        {/* يمين الرأس */}
        <div className={styles["right-side"]}>
          {/* إشعارات */}
          <div className={styles.notifWrapper}>
            <FaBell
              className={styles["bell-icon"]}
              onClick={() => setOpen(!open)}
            />
            {open && (
              <div className={styles.dropdown}>
                {notifications.slice(0, 6).map((n, i) => (
                  <div key={i} className={styles.notifItem}>
                    {n}
                  </div>
                ))}
                <a href="/teacher/notifications" className={styles.showMore}>
                  عرض المزيد
                </a>
              </div>
            )}
          </div>

          {/* أيقونة المستخدم */}
          <a href="/teacher">
            <FaUserCircle className={styles["user-icon"]} />
          </a>
          <span>{userName}</span>

          {/* خروج */}
          <button className={styles.logoutBtn} onClick={logout}>
            <FaSignOutAlt />
            <span>تسجيل الخروج</span>
          </button>
        </div>

        {/* اللوغو */}
        <a href="/">
          <img src={logo} className={styles["logo-logo"]} alt="logo" />
        </a>
      </div>
    </header>
  );
}

export default TeacherHeadbar;
