import React from "react";
import styles from "./Lesson.module.css";

function EditResourceModal({ editFormData, setEditFormData, onSave, onCancel }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>تعديل المورد</h3>

        <input
          type="text"
          value={editFormData.name}
          onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="اسم المورد"
        />
        <input
          type="text"
          value={editFormData.url}
          onChange={(e) => setEditFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="الرابط الكامل"
        />
        <input
          type="text"
          value={editFormData.urlShort}
          onChange={(e) => setEditFormData(prev => ({ ...prev, urlShort: e.target.value }))}
          placeholder="رابط مختصر"
        />
        <select
          value={editFormData.type}
          onChange={(e) => setEditFormData(prev => ({ ...prev, type: e.target.value }))}
        >
          <option value="PDF">PDF</option>
          <option value="IMAGE">صورة</option>
          <option value="VIDEO">فيديو</option>
          <option value="LINK">رابط</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={editFormData.internal}
            onChange={(e) => setEditFormData(prev => ({ ...prev, internal: e.target.checked }))}
          />
          داخلي؟
        </label>

        <div className={styles.modalButtons}>
          <button onClick={onSave}>💾 حفظ التغييرات</button>
          <button onClick={onCancel}>❌ إلغاء</button>
        </div>
      </div>
    </div>
  );
}

export default EditResourceModal;
