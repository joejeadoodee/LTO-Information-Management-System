import { useEffect, useState } from "react";
import { getAllVehicles, updateRegistration } from "../../services/registration";

function RegistrationModalEdit({ setShow, data: reg }) {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    getAllVehicles().then((data) => setVehicles(data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentFields = Object.fromEntries(formData);
    
    // Explicitly binding the precise data shape your backend needs
    await updateRegistration({ 
      ...currentFields, 
      vehicle_reg_id: reg.vehicle_reg_id 
    });
    setShow(false);
    window.location.reload();
  };

  const safeFormatDate = (dateVal) => {
    if (!dateVal) return "";
    try {
      if (dateVal instanceof Date) {
        if (isNaN(dateVal.getTime())) return ""; 
        
        const year = dateVal.getFullYear();
        const month = String(dateVal.getMonth() + 1).padStart(2, '0'); 
        const day = String(dateVal.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      }
      
      // Fallback if it's passed down as a string
      const dateStr = String(dateVal);
      if (dateStr.includes("T")) {
        return dateStr.split("T")[0];
      }
      return dateStr.slice(0, 10);
    } catch (err) {
      console.error("Error formatting date:", err);
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
            <label htmlFor="vehicle_id">Associated Vehicle</label>
            <select name="vehicle_id" id="vehicle_id" defaultValue={reg.vehicle_id} required>
              {vehicles.map(v => (
                <option key={v.vehicle_id} value={v.vehicle_id}>
                  {v.plate_no} - {v.make || v.manufacturer} {v.model}
                </option>
              ))}
            </select>
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="color">Color</label>
            <input 
              type="text" 
              name="color" 
              id="color" 
              defaultValue={reg.color || ""} 
              required 
            />
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="registration_date">Registration Date</label>
            <input 
              type="date" 
              name="registration_date" 
              id="registration_date"
              defaultValue={safeFormatDate(reg.registration_date)} 
              required 
            />
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="expiration_date">Expiration Date</label>
            <input 
              type="date" 
              name="expiration_date" 
              id="expiration_date"
              defaultValue={safeFormatDate(reg.expiration_date)} 
              required 
            />
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="registration_status">Registration Status</label>
            {/* Standardizing capitalization parameters ("Active") to align with your option blocks */}
            <select name="registration_status" id="registration_status" defaultValue={reg.registration_status}>
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