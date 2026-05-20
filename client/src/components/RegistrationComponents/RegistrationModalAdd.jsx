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

  // 1. Load dynamic vehicle selection lists directly from your SQL backend
  useEffect(() => {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    setRegDate(formatDateToString(today));
    setExpDate(formatDateToString(nextYear));

    getAllVehicles().then((data) => setVehicles(data || []));
  }, []);

  // 2. Automatically update color input state when a vehicle is selected
  const handleVehicleChange = (e) => {
    const vehicleId = e.target.value;
    const matchingVehicle = vehicles.find(
      (v) => String(v.vehicle_id) === String(vehicleId)
    );
    if (matchingVehicle) {
      setSelectedColor(matchingVehicle.color || "");
    }
  };

  // 3. Dynamic year projection utility
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
    const rawData = Object.fromEntries(formData);
    
    // SANITIZATION payload construction targeting your server parameters precisely
    const cleanPayload = {
      registration_no: "REG-" + Math.floor(100000 + Math.random() * 900000),
      registration_date: rawData.registration_date,
      expiration_date: rawData.expiration_date,
      registration_status: rawData.registration_status,
      // Forces the value to a clear integer digit for database foreign key alignments
      vehicle_id: Number(rawData.vehicle_id)
    };

    await addRegistration(cleanPayload);
    setShow(false); 
    window.location.reload(); // Instantly triggers a complete reload to display the new table row
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
              {vehicles.map((v) => (
                // CRITICAL FIX: Explicitly binds to vehicle_id to resolve backend payload validation rejections
                <option key={`veh-opt-${v.vehicle_id}`} value={v.vehicle_id}>
                  {v.plate_no} — {v.model || v.make || "Vehicle Entry"}
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