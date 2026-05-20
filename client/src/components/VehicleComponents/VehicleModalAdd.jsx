import { addVehicle } from "../../services/vehicle";

function VehicleModalAdd({ setShow, drivers = [], onSaved = () => {} }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    await addVehicle({
      ...data,
      manufacture_yr: data.manufacture_yr ? Number(data.manufacture_yr) : null,
      driver_id: data.driver_id ? Number(data.driver_id) : null,
    });

    setShow(false);
    onSaved();
  };

  return (
    <div className="add-form-container">
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <h3>VEHICLE DETAILS</h3>
          </div>

          <div>
            <label htmlFor="plate_no">Plate Number</label>
            <input type="text" name="plate_no" id="plate_no" required />
          </div>

          <div>
            <label htmlFor="engine_no">Engine Number</label>
            <input type="text" name="engine_no" id="engine_no" required />
          </div>

          <div>
            <label htmlFor="chassis_no">Chassis Number</label>
            <input type="text" name="chassis_no" id="chassis_no" required />
          </div>

          <div>
            <label htmlFor="vehicle_type">Vehicle Type</label>
            <select name="vehicle_type" id="vehicle_type">
              <option value="">Select type</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Private Car">Private Car</option>
              <option value="Public Utility Vehicle">Public Utility Vehicle</option>
            </select>
          </div>

          <div>
            <label htmlFor="make">Make</label>
            <input type="text" name="make" id="make" />
          </div>

          <div>
            <label htmlFor="model">Model</label>
            <input type="text" name="model" id="model" />
          </div>

          <div>
            <label htmlFor="manufacture_yr">Manufacture Year</label>
            <input
              type="number"
              name="manufacture_yr"
              id="manufacture_yr"
              min="1900"
              max="2100"
              defaultValue={new Date().getFullYear()}
            />
          </div>

          <div>
            <label htmlFor="color">Color</label>
            <input type="text" name="color" id="color" />
          </div>

          <div>
            <label htmlFor="driver_id">Owner (Driver)</label>
            <select name="driver_id" id="driver_id">
              <option value="">Unassigned</option>
              {drivers.map((d) => (
                <option value={d.driver_id} key={d.driver_id}>
                  {d.full_name} ({d.license_number})
                </option>
              ))}
            </select>
          </div>

          <div className="button-container">
            <button
              className="cancel button-behave"
              type="button"
              onClick={() => setShow(false)}
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

export default VehicleModalAdd;