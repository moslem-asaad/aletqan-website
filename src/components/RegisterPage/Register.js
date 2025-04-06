import React, { useState } from "react";

import Footer from "../HomePage/Footer";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Headbar from "../HomePage/Headbar";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";


function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };
    return (
        <div className={styles.registerPage}>
            <Headbar />
            <main className={styles.registerContent}>
                <div className={styles.infoCard}>

                    <div className={styles.rightSide}>
                        <form>
                            <label>الإسم الكامل</label>
                            <input type="text" />
                            <label>رقم الهاتف</label>
                            <input type="tel" id="phone" name="phone" pattern="[0-9]{10}" />
                            <label>البريد الإلكتروني</label>
                            <input type="email" placeholder="example@mail.com" />

                            <div className={styles.passwordWrapper}>
                                <label>كلمة المرور</label>
                                <div className={styles.togglePassword} onClick={togglePassword}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    <span>إظهار كلمة المرور</span>
                                </div>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••"
                            />
                            <div className={styles.typeCard}>
                                <span>إنشاء حساب ك</span>
                                <div className={styles.userTypeWrapper}>

                                    <div className={styles.userType}>
                                        <label>معلم</label>
                                        <input type="radio" name="userType" value="teacher"/>
                                    </div>

                                    <div className={styles.userType}>
                                        <label>طالب</label>
                                        <input type="radio" name="userType" value="student" />
                                    </div>

                                </div>
                            </div>
                            <button type="submit" className={styles.registerBtn}>إنشاء حساب</button>
                        </form>
                    </div>
                    <div className={styles.divider}></div>
                    <div className={styles.leftSide}>
                        <p>مشترك سابق ؟</p>
                        <button className={styles.loginBtn}onClick={() => navigate('/login')} >تسجيل الدخول</button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Register;
