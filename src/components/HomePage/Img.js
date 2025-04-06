import React from "react";
import "../CSS/Img.css";
import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import { useNavigate } from "react-router-dom";

import {

} from "react-icons/fa";

function Img() {
    const navigate = useNavigate();
    function Message() {
        return (
            <div className="message">
                <h1>رسالتنا</h1>
                <h4>إعداد وتأهيل الجيل حفظا وتجويدا وقراءات</h4>
            </div>
        )
    }

    return (
        <header className="imgbar">
            <div className="main-img">
                <img className="img" src={img1} alt="img1" />
                <img className="img" src={img2} alt="img2" />

                <div className="overlay-text">
                    <span>دورات عديدة</span>
                    <span className="sp2">تحفيظ وتجويد وبناء تربوي لجميع الأجيال </span>

                    <div className="overlay-buttons">
                        <button className="btn login-btn"  onClick={() => navigate('/login')}>تسجيل الدخول</button>
                        <button className="btn join-btn">ساهم معنا</button>
                    </div>

                </div>

            </div>
            <Message />
        </header>
    );
}



export default Img;

