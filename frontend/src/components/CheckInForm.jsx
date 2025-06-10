import { useState } from "react";
import "../styles/CheckInForm.css";

export default function CheckInForm({ onSubmit, initialData = {}, onCancel }) {
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || "",
    last_name: initialData.last_name || "",
    passport: initialData.passport || "",
    room_number: initialData.room_number || "",
    check_out_date: initialData.check_out_date || "",
    notes: initialData.notes || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "first_name",
      "last_name",
      "passport",
      "room_number",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Заполните обязательные поля: ${missingFields.join(", ")}`);
      return;
    }

    onSubmit({
      ...formData,
      check_out_date: formData.check_out_date || null, // Преобразуем пустую дату в null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="checkin-form">
      <div className="form-grid">
        <div className="form-group">
          <label>Имя</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Фамилия</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Паспортные данные</label>
        <input
          type="text"
          name="passport"
          value={formData.passport}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Номер комнаты</label>
        <input
          type="text"
          name="room_number"
          value={formData.room_number}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Дата выезда</label>
        <input
          type="date"
          name="check_out_date"
          value={formData.check_out_date}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Примечания</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="cancel-btn">
            Отмена
          </button>
        )}
        <button type="submit" className="submit-btn">
          {initialData.id ? "Обновить" : "Добавить"}
        </button>
      </div>
    </form>
  );
}
