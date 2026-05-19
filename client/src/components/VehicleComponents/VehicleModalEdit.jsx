import { updateVehicle } from "../../services/vehicle";

function VehicleModalEdit({ setShow, data: vehicle, drivers = [], onSaved = () => {} }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Get data from vehicle form
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    //Add vehicle id to data and update vehicle
    await updateVehicle({
      vehicle_id: vehicle.vehicle_id,
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
            <label>Vehicle ID</label>
            <div>{vehicle.vehicle_id}</div>
          </div>

          <div>
            <label htmlFor="plate_no">Plate Number</label>
            <input
              type="text"
              name="plate_no"
              id="plate_no"
              defaultValue={vehicle.plate_no}
              required
            />
          </div>

          <div>
            <label htmlFor="engine_no">Engine Number</label>
            <input
              type="text"
              name="engine_no"
              id="engine_no"
              defaultValue={vehicle.engine_no}
              required
            />
          </div>

          <div>
            <label htmlFor="chassis_no">Chassis Number</label>
            <input
              type="text"
              name="chassis_no"
              id="chassis_no"
              defaultValue={vehicle.chassis_no}
              required
            />
          </div>

          <div>
            <label htmlFor="vehicle_type">Vehicle Type</label>
            <select name="vehicle_type" id="vehicle_type" defaultValue={vehicle.vehicle_type ?? ""}>
              <option value="">Select type</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="private car">Private Car</option>
              <option value="public utility vehicle">Public Utility Vehicle</option>
            </select>
          </div>

          <div>
            <label htmlFor="make">Make</label>
            <input
              type="text"
              name="make"
              id="make"
              defaultValue={vehicle.make ?? ""}
            />
          </div>

          <div>
            <label htmlFor="model">Model</label>
            <input
              type="text"
              name="model"
              id="model"
              defaultValue={vehicle.model ?? ""}
            />
          </div>

          <div>
            <label htmlFor="manufacture_yr">Manufacture Year</label>
            <input
              type="number"
              name="manufacture_yr"
              id="manufacture_yr"
              min="1900"
              max="2100"
              defaultValue={vehicle.manufacture_yr ?? new Date().getFullYear()}
            />
          </div>

          <div>
            <label htmlFor="color">Color</label>
            <input
              type="text"
              name="color"
              id="color"
              defaultValue={vehicle.color ?? ""}
            />
          </div>

          <div>
            <label htmlFor="driver_id">Owner (Driver)</label>
            <select name="driver_id" id="driver_id" defaultValue={vehicle.driver_id ?? ""}>
              <option value="">Unassigned</option>
              {drivers.map((d) => (
                <option value={d.driver_id} key={d.driver_id}>
                  {d.full_name} ({d.license_number})
                </option>
              ))}
            </select>
          </div>

          <div className="button-container">
            <button type="submit" className="save button-behave">
              Save Changes
            </button>
          </div>

          <div className="button-container center">
            <button
              className="cancel button-behave"
              type="button"
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VehicleModalEdit;
