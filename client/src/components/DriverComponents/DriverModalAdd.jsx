import { addDriver } from "../../services/drivers";

function DriverModalAdd({ setShow }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get values from form
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    await addDriver(data);
    setShow(false); // hide modal
    window.location.reload(); // reload to update page
  };

  return (
    <div className="add-form-container">
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <h3>DRIVER DETAILS</h3>
          </div>
          <div>
            <label htmlFor="license_number">License Number</label>
            <input
              type="text"
              name="license_number"
              id="license_number"
              required
            />
          </div>
          <div>
            <label htmlFor="full_name">Full Name</label>
            <input type="text" name="full_name" id="full_name" required />
          </div>
          <div>
            <label htmlFor="date_of_birth">Birthday</label>
            <input
              type="date"
              name="date_of_birth"
              id="date_of_birth"
              required
            />
          </div>
          <div>
            <label htmlFor="sex">Sex</label>
            <select name="sex" id="sex">
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input type="text" name="address" id="address" required />
          </div>
          <div>
            <h3>LICENSE DETAILS</h3>
          </div>
          <div>
            <label htmlFor="license_issuance_date">License Issuance Date</label>
            <input
              type="date"
              name="license_issuance_date"
              id="license_issuance_date"
              required
            />
          </div>
          <div>
            <label htmlFor="license_expiration_date">
              License Expiration Date
            </label>
            <input
              type="date"
              name="license_expiration_date"
              id="license_expiration_date"
              required
            />
          </div>
          <div>
            <label htmlFor="license_status">License Status</label>
            <select name="license_status" id="license_status">
              <option value="Valid">Valid</option>
              <option value="Expired">Expired</option>
              <option value="Suspended">Suspended</option>
              <option value="Revoked">Revoked</option>
            </select>
          </div>
          <div>
            <label htmlFor="license_type">License Type</label>
            <select name="license_type" id="license_type">
              <option value="Professional">Professional</option>
              <option value="Non-Professional">Non-Professional</option>
              <option value="Student Permit">Student Permit</option>
            </select>
          </div>
          <div className="button-container">
            <button
              className="cancel button-behave"
              type="button"
              onClick={() => {
                setShow(false);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="save button-behave">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DriverModalAdd;
