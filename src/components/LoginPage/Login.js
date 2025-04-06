import React, { useState } from "react";
import Headbar from "../HomePage/Headbar";
import Footer from "../HomePage/Footer";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };
    return (
        <div className={styles.loginPage}>
            <Headbar />
            <main className={styles.loginContent}>
                <h1>تسجيل الدخول للخدمة المطلوبة</h1>
                <div className={styles.infoCard}>

                    <div className={styles.rightSide}>
                        <form>
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

                            <a href="#" className={styles.forgotPassword}>نسيت كلمة المرور؟</a>

                            <button type="submit" className={styles.loginBtn}>تسجيل الدخول</button>
                        </form>
                    </div>
                    <div className={styles.divider}></div>
                    <div className={styles.leftSide}>
                        <p>لا يوجد لك حساب ؟</p>
                        <button className={styles.registerBtn} onClick={() => navigate('/register')}>
                            اشترك
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Login;
