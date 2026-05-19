import { addRegistration } from "../../services/registration";

function RegistrationModalAdd({ setShow }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    await addRegistration(data);
    setShow(false); 
    window.location.reload(); 
  };

  // FIXED: Generates today's date using local calendar boundaries instead of UTC
  const getLocalTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
            <select name="vehicle_id" id="vehicle_id" required>
              <option value="" disabled selected hidden>
                Choose a vehicle...
              </option>
              <option value="1">Toyota Vios (JVA1206)</option>
              <option value="2">Mitsubishi Xpander (JCC1206)</option>
            </select>
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="color">Color</label>
            <input 
              type="text" 
              name="color" 
              id="color" 
              placeholder="e.g., Gold, Quartz White Pearl"
              required 
            />
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="registration_date">Registration Date</label>
            <input
              type="date"
              name="registration_date"
              id="registration_date"
              defaultValue={getLocalTodayString()} /* FIXED: Now tracks local time correctly */
              required
            />
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="expiration_date">Expiration Date</label>
            <input
              type="date"
              name="expiration_date"
              id="expiration_date"
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
              onClick={() => {
                setShow(false);
              }}
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