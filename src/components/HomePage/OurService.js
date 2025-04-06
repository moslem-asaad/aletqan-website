import React from "react";
import "../CSS/OurService.css";

function OurService() {
  return (
    <section className="our-service-section">
      <h1 className="title">ما نقدمه لك</h1>
      
      <div className="service-grid">
        <div className="service-card">دراسة مبنية وفق خطة علمية واضحة، يتم التدرج فيها بنظام وآلية مناسب لأغلب أحوال الناس</div>
        <div className="service-card">سرد لعلم التجويد بأصوله وفروعه بشكل بسيط ومُسهل</div>
        <div className="service-card">تحفيظ وبناء جيل متعلم ملتزم بالتربية الإسلامية الصحيحة</div>
        <div className="service-card">سرد لعلم القراءات القرآنية بشكل بسيط ومُسهل</div>
      </div>
    </section>
  );
}

export default OurService;
