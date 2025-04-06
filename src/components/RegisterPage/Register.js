import React, { useState } from "react";

import Footer from "../HomePage/Footer";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Headbar from "../HomePage/Headbar";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";


function Register() {
    const navigate = useNavigate();
   
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            name,
            email,
            password,
            phoneNumber,
            role: role === "teacher" ? "TEACHER" : "STUDENT"
        };

        try {
            const response = await fetch("http://localhost:8090/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("نجح التسجيل:", result);
                navigate("/login"); 
            } else {
                const error = await response.text();
                console.error("فشل التسجيل:", error);
                alert("فشل التسجيل: " + error);
            }
        } catch (error) {
            console.error("خطأ في الشبكة:", error);
            alert("حدث خطأ أثناء التسجيل.");
        }
    };

    return (
        <div className={styles.registerPage}>
            <Headbar />
            <main className={styles.registerContent}>
                <div className={styles.infoCard}>

                    <div className={styles.rightSide}>
                        <form onSubmit={handleSubmit}>
                            <label>الإسم الكامل</label>
                            <input 
                            type="text" 
                            value={name} onChange={(e)=>setName(e.target.value)}
                            required
                            />
                            <label>رقم الهاتف</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone" 
                                pattern="[0-9]{10}" 
                                value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)}
                                required/>
                            <label>البريد الإلكتروني</label>
                            <input 
                                type="email" 
                                placeholder="example@mail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            <div className={styles.typeCard}>
                                <span>إنشاء حساب ك</span>
                                <div className={styles.userTypeWrapper}>

                                    <div className={styles.userType}>
                                        <label>معلم</label>
                                        <input 
                                            type="radio"
                                            name="userType"
                                            value="teacher"
                                            checked={role === "teacher"}
                                            onChange={(e) => setRole(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className={styles.userType}>
                                        <label>طالب</label>
                                        <input 
                                            type="radio"
                                            name="userType"
                                            value="student"
                                            checked={role === "student"}
                                            onChange={(e) => setRole(e.target.value)}
                                            required
                                        />
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
