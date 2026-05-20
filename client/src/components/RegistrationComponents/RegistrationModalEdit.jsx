import { useState, useEffect } from "react";
import { updateRegistration } from "../../services/registration";

function RegistrationModalEdit({ setShow, data }) {
  // CRITICAL PROTECTION: If data is missing or undefined, stop right here
  if (!data) {
    return (
      <div className="reg-add-form-overlay">
        <div className="reg-modal-wrapper-box">
          <p style={{ color: "red", padding: "20px" }}>
            Error: No row data passed to Edit Modal.
          </p>
          <button type="button" onClick={() => setShow(false)}>
            Close
          </button>
        </div>
      </div>
    );
  }

  // 1. Explicitly initialize your inputs with the clicked row data fields
  const [currentColor, setCurrentColor] = useState(data.color || "");
  const [regStatus, setRegStatus] = useState(
    data.registration_status || "Active",
  );

  // Safe calendar date converter (Handles raw strings or Date objects cleanly)
  const safeFormatDate = (dateVal) => {
    if (!dateVal) return "";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  const [regDate, setRegDate] = useState(
    safeFormatDate(data.registration_date),
  );
  const [expDate, setExpDate] = useState(safeFormatDate(data.expiration_date));

  // Sync state if the row selection dynamically changes
  useEffect(() => {
    if (data) {
      setCurrentColor(data.color || "");
      setRegStatus(data.registration_status || "Active");
      setRegDate(safeFormatDate(data.registration_date));
      setExpDate(safeFormatDate(data.expiration_date));
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const currentFields = Object.fromEntries(formData);

      const updatedPayload = {
        vehicle_reg_id: Number(data.vehicle_reg_id),
        registration_no: data.registration_no,
        registration_date: currentFields.registration_date,
        expiration_date: currentFields.expiration_date,
        registration_status: currentFields.registration_status,
        vehicle_id: Number(data.vehicle_id), // Keeps the structural relational key locked
      };

      await updateRegistration(updatedPayload);
      setShow(false);
      window.location.reload();
    } catch (err) {
      console.error("Edit form processing crash:", err);
    }
  };

  return (
    <div className="reg-add-form-overlay edit-modal-specific">
      <div className="reg-modal-wrapper-box">
        <form onSubmit={handleSubmit}>
          <div>
            {/* Changing heading to make sure you know exactly which modal is currently visible */}
            <h3 style={{ color: "#0056b3" }}>MODE: EDITING REGISTRATION</h3>
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="vehicle_display">Active Target Vehicle</label>
            <select id="vehicle_display" disabled value="current">
              <option value="current">
                {data.plate_no ? `${data.plate_no} — ` : ""}
                {data.make || data.manufacturer || "N/A"} {data.model || ""}
              </option>
            </select>
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="color">Color</label>
            <input
              type="text"
              name="color"
              id="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              required
            />
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="registration_date">Registration Date</label>
            <input
              type="date"
              name="registration_date"
              id="registration_date"
              value={regDate}
              onChange={(e) => setRegDate(e.target.value)}
              required
            />
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="expiration_date">Expiration Date</label>
            <input
              type="date"
              name="expiration_date"
              id="expiration_date"
              value={expDate}
              onChange={(e) => setExpDate(e.target.value)}
              required
            />
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="registration_status">Registration Status</label>
            <select
              name="registration_status"
              id="registration_status"
              value={regStatus}
              onChange={(e) => setRegStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="reg-modal-button-container">
            <button
              type="button"
              className="reg-cancel"
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
            <button type="submit" className="reg-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationModalEdit;
