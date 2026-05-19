import { useEffect, useState } from "react";
import { getAllVehicles, addRegistration } from "../../services/registration";

function RegistrationModalAdd({ setShow }) {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    getAllVehicles().then((data) => setVehicles(data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    await addRegistration(data);
    setShow(false);
    window.location.reload();
  };

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="add-form-container" style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '450px', maxHeight: '90vh', overflowY: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <h3>REGISTRATION DETAILS</h3>
          
          <div style={{ marginBottom: "12px" }}>
            <label>Registration Number</label>
            <input type="text" name="registration_no" maxLength="9" required />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Select Vehicle</label>
            <select name="vehicle_id" required defaultValue="">
              <option value="" disabled hidden>Choose a vehicle...</option>
              {vehicles.map(v => (
                <option key={v.vehicle_id} value={v.vehicle_id}>{v.plate_no} - {v.make} {v.model}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Registration Date</label>
            <input type="date" name="registration_date" defaultValue={new Date().toISOString().split("T")[0]} required />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Expiration Date</label>
            <input type="date" name="expiration_date" required />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Registration Status</label>
            <select name="registration_status">
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="button-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="cancel button-behave" onClick={() => setShow(false)}>Cancel</button>
            <button type="submit" className="save button-behave">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationModalAdd;