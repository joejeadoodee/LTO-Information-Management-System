import { updateViolation } from "../../services/violation";

function ViolationModalEdit({ setShow, data: violation }) {
  const handleViolationSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    await updateViolation({
      violation_id: violation.violation_id,

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

  const toLocalDatetimeInput = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <div className="add-form-container">
      <div>
        <form onSubmit={handleViolationSubmit}>
          <div>
            <h3>VIOLATION DETAILS</h3>
          </div>

          {/* READ-ONLY ID like license number in DriverModalEdit */}
          <div>
            <label>Violation ID</label>
            <div>{violation.violation_id}</div>
          </div>

          <div>
            <label>Violation Type</label>
            <input
              type="text"
              name="violation_type"
              defaultValue={violation.violation_type}
              required
            />
          </div>

          <div>
            <label>Date & Time</label>
            <input
              type="datetime-local"
              name="violation_date_time"
              defaultValue={toLocalDatetimeInput(violation.violation_date_time)}
              required
            />
          </div>

          <div>
            <label>Location</label>
            <input
              type="text"
              name="location"
              defaultValue={violation.location}
              required
            />
          </div>

          <div>
            <label>Fine Amount</label>
            <input
              type="number"
              name="fine_amount"
              defaultValue={violation.fine_amount}
              required
            />
          </div>

          <div>
            <label>Status</label>
            <select
              name="violation_status"
              defaultValue={violation.violation_status}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          <div>
            <label>Officer Name</label>
            <input
              type="text"
              name="officer_name"
              defaultValue={violation.officer_name}
              required
            />
          </div>

          <div>
            <label>Driver ID</label>
            <input
              type="number"
              name="driver_id"
              defaultValue={violation.driver_id}
              required
            />
          </div>

          <div>
            <label>Vehicle ID</label>
            <input
              type="number"
              name="vehicle_id"
              defaultValue={violation.vehicle_id}
              required
            />
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ViolationModalEdit;
