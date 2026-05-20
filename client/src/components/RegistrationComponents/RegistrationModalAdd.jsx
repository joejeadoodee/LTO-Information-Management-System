import { useEffect, useState } from "react";
import { getAllVehicles, addRegistration } from "../../services/registration";

function RegistrationModalAdd({ setShow }) {
  const [vehicles, setVehicles] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [regDate, setRegDate] = useState("");
  const [expDate, setExpDate] = useState("");

  const formatDateToString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    setRegDate(formatDateToString(today));
    setExpDate(formatDateToString(nextYear));

    getAllVehicles().then((data) => setVehicles(data || []));
  }, []);

  const handleVehicleChange = (e) => {
    const vehicleId = e.target.value;
    const matchingVehicle = vehicles.find(
      (v) => String(v.vehicle_id || v.id) === String(vehicleId),
    );
    if (matchingVehicle) {
      setSelectedColor(matchingVehicle.color || "");
    }
  };

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

    // Pass raw form elements directly to allow your backend body-parser to extract values
    const cleanPayload = {
      registration_no: "REG-" + Math.floor(10000 + Math.random() * 90000),
      registration_date: rawData.registration_date,
      expiration_date: rawData.expiration_date,
      registration_status: rawData.registration_status,
      vehicle_id: rawData.vehicle_id, // Sent as standard form field value string
    };

    await addRegistration(cleanPayload);
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
              {vehicles.map((v) => {
                const actualId = v.vehicle_id || v.id;
                return (
                  <option key={`veh-opt-${actualId}`} value={actualId}>
                    {v.plate_no || "Unknown Plate"} -{" "}
                    {v.model || v.make || "Vehicle Entry"}
                  </option>
                );
              })}
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
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
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
