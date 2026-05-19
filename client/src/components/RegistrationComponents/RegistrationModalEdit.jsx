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

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="add-form-container" style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '450px', maxHeight: '90vh', overflowY: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <h3>REGISTRATION DETAILS</h3>
          
          <div style={{ marginBottom: "12px" }}>
            <label>Registration Number</label>
            <input type="text" name="registration_no" defaultValue={reg.registration_no} maxLength="9" required />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Associated Vehicle</label>
            <select name="vehicle_id" defaultValue={reg.vehicle_id} required>
              {vehicles.map(v => (
                <option key={v.vehicle_id} value={v.vehicle_id}>{v.plate_no} - {v.make} {v.model}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Registration Date</label>
            <input type="date" name="registration_date" defaultValue={reg.registration_date ? reg.registration_date.split("T")[0] : ""} required />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Expiration Date</label>
            <input type="date" name="expiration_date" defaultValue={reg.expiration_date ? reg.expiration_date.split("T")[0] : ""} required />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Registration Status</label>
            <select name="registration_status" defaultValue={reg.registration_status}>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="button-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="cancel button-behave" onClick={() => setShow(false)}>Cancel</button>
            <button type="submit" className="save button-behave">Edit Registration</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationModalEdit;