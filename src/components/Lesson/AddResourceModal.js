import React from 'react';
import styles from './Lesson.module.css';

function AddResourceModal({ newResourceData, setNewResourceData, onAdd, onCancel }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>إضافة مورد جديد</h3>

        <input
          type="text"
          name="name"
          placeholder="اسم المورد"
          value={newResourceData.name || ''}
          onChange={(e) => setNewResourceData(prev => ({ ...prev, name: e.target.value }))}
        />
        <input
          type="text"
          name="url"
          placeholder="الرابط الكامل"
          value={newResourceData.url || ''}
          onChange={(e) => setNewResourceData(prev => ({ ...prev, url: e.target.value }))}
        />
        <input
          type="text"
          name="urlShort"
          placeholder="رابط مختصر"
          value={newResourceData.urlShort || ''}
          onChange={(e) => setNewResourceData(prev => ({ ...prev, urlShort: e.target.value }))}
        />
        <select
          name="type"
          value={newResourceData.type || 'PDF'}
          onChange={(e) => setNewResourceData(prev => ({ ...prev, type: e.target.value }))}
        >
          <option value="PDF">PDF</option>
          <option value="IMAGE">صورة</option>
          <option value="VIDEO">فيديو</option>
          <option value="LINK">رابط</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={newResourceData.internal || false}
            onChange={(e) => setNewResourceData(prev => ({ ...prev, internal: e.target.checked }))}
          />
          داخلي؟
        </label>

        <div className={styles.modalButtons}>
          <button onClick={onAdd}>➕ إضافة المورد</button>
          <button onClick={onCancel}>❌ إلغاء</button>
        </div>
      </div>
    </div>
  );
}

export default AddResourceModal;
