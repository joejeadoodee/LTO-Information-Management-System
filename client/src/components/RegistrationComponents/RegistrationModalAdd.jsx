import { useEffect, useState } from "react";
import { getAllVehicles, updateRegistration } from "../../services/registration";

function RegistrationModalEdit({ setShow, data: reg }) {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    getAllVehicles().then((data) => setVehicles(data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentFields = Object.fromEntries(new FormData(e.target));
    await updateRegistration({ ...currentFields, vehicle_reg_id: reg.vehicle_reg_id });
    setShow(false);
    window.location.reload();
  };

  // Safe date helper to completely prevent splitting/string errors on undefined or raw database strings
  const safeFormatDate = (dateVal) => {
    if (!dateVal) return "";
    try {
      const dateStr = String(dateVal);
      // Handles standard ISO formats "YYYY-MM-DDTHH:mm:ss..."
      if (dateStr.includes("T")) {
        return dateStr.split("T")[0];
      }
      // If it's already "YYYY-MM-DD" from the database, slice just the first 10 characters safely
      return dateStr.slice(0, 10);
    } catch (err) {
      console.error("Date formatting error:", err);
      return "";
    }
  };

  return (
    <div className="reg-add-form-overlay">
      <div className="reg-modal-wrapper-box">
        <form onSubmit={handleSubmit}>
          <div>
            <h3>REGISTRATION DETAILS</h3>
          </div>
          
          <div className="reg-form-field-group">
            <label>Plate Number</label>
            <div className="reg-static-text-display">
              {reg.plate_no || "N/A"}
            </div>
          </div>

          <div className="reg-form-field-group">
            <label>Associated Vehicle</label>
            <select name="vehicle_id" defaultValue={reg.vehicle_id} required>
              {vehicles.map(v => (
                <option key={v.vehicle_id} value={v.vehicle_id}>
                  {v.plate_no} - {v.make} {v.model}
                </option>
              ))}
            </select>
          </div>

          <div className="reg-form-field-group">
            <label>Color</label>
            <input 
              type="text" 
              name="color" 
              id="color" 
              defaultValue={reg.color || ""}
              required 
            />
          </div>

          <div className="reg-form-field-group">
            <label>Registration Date</label>
            <input 
              type="date" 
              name="registration_date" 
              defaultValue={safeFormatDate(reg.registration_date)} 
              required 
            />
          </div>

          <div className="reg-form-field-group">
            <label>Expiration Date</label>
            <input 
              type="date" 
              name="expiration_date" 
              defaultValue={safeFormatDate(reg.expiration_date)} 
              required 
            />
          </div>

          <div className="reg-form-field-group">
            <label>Registration Status</label>
            <select name="registration_status" defaultValue={reg.registration_status}>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Suspended">Suspended</option>
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
              Edit Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationModalEdit;