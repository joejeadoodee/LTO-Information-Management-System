import { addViolation } from "../../services/violation";

function ViolationModalAdd({ setShow }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Same pattern as DriverModalAdd
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    await addViolation({
      violation_type: data.violation_type,
      violation_date_time: data.violation_date_time,
      location: data.location,
      fine_amount: Number(data.fine_amount),
      violation_status: data.violation_status,
      officer_name: data.officer_name,
      driver_id: Number(data.driver_id),
      vehicle_id: Number(data.vehicle_id),
    });

    setShow(false);
    window.location.reload();
  };

  return (
    <div className="add-form-container">
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <h3>VIOLATION DETAILS</h3>
          </div>

          <div>
            <label>Violation Type</label>
            <input type="text" name="violation_type" required />
          </div>

          <div>
            <label>Date & Time</label>
            <input type="datetime-local" name="violation_date_time" required />
          </div>

          <div>
            <label>Location</label>
            <input type="text" name="location" required />
          </div>

          <div>
            <label>Fine Amount</label>
            <input type="number" name="fine_amount" required />
          </div>

          <div>
            <label>Status</label>
            <select name="violation_status">
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          <div>
            <label>Officer Name</label>
            <input type="text" name="officer_name" required />
          </div>

          <div>
            <label>Driver ID</label>
            <input type="number" name="driver_id" required />
          </div>

          <div>
            <label>Vehicle ID</label>
            <input type="number" name="vehicle_id" required />
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

export default ViolationModalAdd;