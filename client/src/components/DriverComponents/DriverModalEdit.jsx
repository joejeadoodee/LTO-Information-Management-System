import { updateDriver } from "../../services/drivers";
import { addLicense } from "../../services/license";

function DriverModalEdit({ setShow, data: driver }) {
  const handleDriverSubmit = async (e) => {
    e.preventDefault();

    // Get data from driver form
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Add driver id and license number to data
    await updateDriver({
      ...data,
      driver_id: driver.driver_id,
      license_number: driver.license_number,
    });
    setShow(false);
    window.location.reload();
  };

  const handleLicenseSubmit = async (e) => {
    e.preventDefault();

    // Get data from license form
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    await addLicense({ ...data, driver_id: driver.driver_id }); // Add driver id to data
    setShow(false);
    window.location.reload();
  };

  // Loop through driver licenses and create a row for each
  const issuances = driver.license_issuances.map((issuance) => (
    <>
      <div className="item">
        {issuance.license_issuance_date.toDateString().slice(4)}
      </div>
      <div className="item">
        {issuance.license_expiration_date.toDateString().slice(4)}
      </div>
      <div className="item">{issuance.license_status}</div>
      <div className="item">{issuance.license_type}</div>
    </>
  ));

  return (
    <div className="add-form-container">
      <div>
        <form onSubmit={handleDriverSubmit}>
          <div>
            <h3>DRIVER DETAILS</h3>
          </div>
          <div>
            <label htmlFor="license_number">License Number</label>
            {driver.license_number}
          </div>
          <div>
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              name="full_name"
              id="full_name"
              defaultValue={driver.full_name}
              required
            />
          </div>
          <div>
            <label htmlFor="date_of_birth">Birthday</label>
            <input
              type="date"
              name="date_of_birth"
              id="date_of_birth"
              defaultValue={driver.date_of_birth.toISOString().split("T")[0]}
              required
            />
          </div>
          <div>
            <label htmlFor="sex">Sex</label>
            <select name="sex" id="sex" defaultValue={driver.sex}>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              defaultValue={driver.address}
              required
            />
          </div>

          <div className="button-container">
            <button type="submit" className="save button-behave">
              Edit Driver
            </button>
          </div>
        </form>

        <form onSubmit={handleLicenseSubmit}>
          <div>
            <h3>LICENSE ISSUANCES</h3>
          </div>
          <div className="license-grid">
            <div className="license-grid header">
              <div className="item">Issuance Date</div>
              <div className="item">Expiration Date</div>
              <div className="item">Status</div>
              <div className="item">Type</div>
            </div>
            <div className="license-grid content">{issuances}</div>
          </div>
          <div>
            <label htmlFor="license_issuance_date">License Issuance Date</label>
            <input
              type="date"
              name="license_issuance_date"
              id="license_issuance_date"
              defaultValue={new Date().toISOString().split("T")[0]}
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
            <button className="button-behave" type="submit">
              Add Issuance
            </button>
          </div>
          <div className="button-container center">
            <button
              className="cancel button-behave"
              type="button"
              onClick={() => {
                setShow(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DriverModalEdit;
