import { useEffect, useState } from "react";
import { getAllVehicles, addRegistration } from "../../services/registration";

function RegistrationModalAdd({ setShow }) {
  const [vehicles, setVehicles] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [regDate, setRegDate] = useState("");
  const [expDate, setExpDate] = useState("");

  const formatDateToString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 1. Fetch dynamic vehicles from SQL on mount & initialize dates
  useEffect(() => {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    setRegDate(formatDateToString(today));
    setExpDate(formatDateToString(nextYear));

    getAllVehicles().then((data) => setVehicles(data || []));
  }, []);

  // 2. Auto-fill color when a vehicle is selected from the dropdown
  const handleVehicleChange = (e) => {
    const vehicleId = e.target.value;
    const matchingVehicle = vehicles.find(
      (v) => String(v.id || v.vehicle_id) === String(vehicleId)
    );
    if (matchingVehicle) {
      setSelectedColor(matchingVehicle.color || "");
    }
  };

  // 3. Auto-calculate expiration date (+1 year) when registration date changes
  const handleDateChange = (e) => {
    const newRegDateStr = e.target.value;
    setRegDate(newRegDateStr);

    if (newRegDateStr) {
      const currentRegDate = new Date(newRegDateStr);
      currentRegDate.setFullYear(currentRegDate.getFullYear() + 1);
      setExpDate(formatDateToString(currentRegDate));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // CRITICAL: Satisfies your backend controller's strict verification rule
    if (!data.registration_no) {
      data.registration_no = "REG-" + Math.floor(100000 + Math.random() * 900000);
    }

    await addRegistration(data);
    setShow(false); 
    window.location.reload(); 
  };

  return (
    <div className="reg-add-form-overlay">
      <div className="reg-modal-wrapper-box">
        <form onSubmit={handleSubmit}>
          <div>
            <h3>REGISTRATION DETAILS</h3>
          </div>
          
          <div className="reg-form-field-group">
            <label htmlFor="vehicle_id">Select Vehicle</label>
            <select 
              name="vehicle_id" 
              id="vehicle_id" 
              required 
              defaultValue="" 
              onChange={handleVehicleChange}
            >
              <option value="" disabled hidden>
                Choose a vehicle...
              </option>
              {/* DYNAMIC: Populates option items directly from your SQL vehicle table rows */}
              {vehicles.map((v) => (
                <option key={v.id || v.vehicle_id} value={v.id || v.vehicle_id}>
                  {v.plate_no} - {v.model || v.vehicle_type}
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
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              placeholder="Auto-fills on selection"
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
              onChange={handleDateChange}
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
            <select name="registration_status" id="registration_status">
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div className="reg-modal-button-container">
            <button
              className="reg-cancel"
              type="button"
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
            <button type="submit" className="reg-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationModalAdd;