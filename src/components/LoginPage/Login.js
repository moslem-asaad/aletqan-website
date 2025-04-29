import React, { useState } from "react";
import Headbar from "../HomePage/Headbar";
import Footer from "../HomePage/Footer";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useAuth } from "../../context/AuthContext ";
import { server } from "../../utils/constants";


function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { setUser } = useAuth();


    const translateError = (message) => {
        const translations = {
            "Invalid email or password": "المستخدم أو كلمة المرور غير صحيحة",
            "User not found": "المستخدم غير موجود",
            "Incorrect password": "كلمة المرور غير صحيحة",
            "Email is required": "البريد الإلكتروني مطلوب",
            "Password is required": "كلمة المرور مطلوبة",
            "Internal server error": "خطأ في الخادم الداخلي",
        };
    
        return translations[message] || "حدث خطأ غير متوقع. الرجاء المحاولة لاحقًا.";
    };


    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
        identifier,
        password,
    };

    try {
        const response = await fetch(`${server}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("نجح تسجيل الدخول:", result);

            const userInfo = {
                role: result.role,
                name: result.name,
                userName: result.userName,
                userId: result.id,
                gender: result.gender
            };

            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(userInfo));
            setUser(userInfo);

            const userType = result.role;
            if(userType === "TEACHER")
                navigate("/teacher");
            else 
                navigate("/student");
        } else {
            const error = await response.text();
            console.error("فشل الدخول:", error);

            const translated = translateError(error);
            setErrorMessage(translated);
        }
    } catch (error) {
        console.error("خطأ في الشبكة:", error);
        alert("حدث خطأ أثناء تسجيل الدخول.");
    }
};
    return (
        <div className={styles.loginPage}>
            <Headbar />
            <main className={styles.loginContent}>
                <h1>تسجيل الدخول للخدمة المطلوبة</h1>
                <div className={styles.infoCard}>

                    <div className={styles.rightSide}>
                        <form onSubmit={handleSubmit}>
                            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

                            <label>اسم المستخدم أو البريد الإلكتروني</label>
                            <input 
                                type="text" 
                                placeholder="اسم المستخدم أو example@mail.com"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                            
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
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
