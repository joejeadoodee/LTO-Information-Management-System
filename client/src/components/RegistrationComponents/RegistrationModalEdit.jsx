import { useState, useEffect } from "react";
import { updateRegistration } from "../../services/registration";

function RegistrationModalEdit({ setShow, data, setFetchCounter, allRegistrations }) {
  if (!data) return null;

  const [currentColor, setCurrentColor] = useState(data.color || "");
  const [regStatus, setRegStatus] = useState(data.registration_status || "active");
  const [regNo, setRegNo] = useState(data.registration_no || "");

  const [isRenewing, setIsRenewing] = useState(false);
  const [renewalDate, setRenewalDate] = useState("");
  const [renewalExpDate, setRenewalExpDate] = useState("");

  // Calculate next global incremented ID for renewal flows
  const calculateNextRenewalId = () => {
    if (!allRegistrations || allRegistrations.length === 0) return "100000001";
    
    const numericIds = allRegistrations
      .map(r => parseInt(r.registration_no, 10))
      .filter(num => !isNaN(num));
      
    if (numericIds.length === 0) return "100000001";
    
    const maxId = Math.max(...numericIds);
    return String(maxId + 1);
  };

  const nextCalculatedRenewalId = calculateNextRenewalId();

  const safeFormatDate = (dateVal) => {
    if (!dateVal) return "";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return ""; 
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); 
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch { 
      return ""; 
    }
  };

  const [regDate, setRegDate] = useState(safeFormatDate(data.registration_date));
  const [expDate, setExpDate] = useState(safeFormatDate(data.expiration_date));

  useEffect(() => {
    if (data) {
      setCurrentColor(data.color || "");
      setRegStatus(data.registration_status || "active");
      setRegNo(data.registration_no || "");
      setRegDate(safeFormatDate(data.registration_date));
      setExpDate(safeFormatDate(data.expiration_date));
      
      setIsRenewing(false);
      setRenewalDate("");
      setRenewalExpDate("");
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalRegNo = regNo;
      let finalRegDate = regDate;
      let finalExpDate = expDate;
      let finalStatus = regStatus;

      if (isRenewing) {
        if (!renewalDate || !renewalExpDate) {
          alert("Please populate the Renewal Date and Expiration Date fields.");
          return;
        }
        finalRegNo = nextCalculatedRenewalId;
        finalRegDate = renewalDate;
        finalExpDate = renewalExpDate;
        finalStatus = "active"; 
      }

      const updatedPayload = {
        vehicle_reg_id: Number(data.vehicle_reg_id),
        registration_no: finalRegNo,
        registration_date: finalRegDate,
        expiration_date: finalExpDate,
        registration_status: finalStatus,
        vehicle_id: Number(data.vehicle_id)
      };

      await updateRegistration(updatedPayload);
      setFetchCounter((prev) => prev + 1);
      setShow(false);
    } catch (err) {
      console.error("Form execution lifecycle failure:", err);
    }
  };

  return (
    <div className="reg-add-form-overlay edit-modal-specific">
      <div className="reg-modal-wrapper-box" style={{ width: "550px", maxHeight: "90vh", overflowY: "auto" }}>
        <form onSubmit={handleSubmit}>
          <div>
            <h3>REGISTRATION DETAILS</h3>
          </div>
          
          <div className="reg-form-field-group">
            <label htmlFor="vehicle_display">Active Target Vehicle</label>
            <select id="vehicle_display" disabled value="current">
              <option value="current">
                {data.plate_no ? `${data.plate_no} — ` : ""}
                {data.make || data.manufacturer || "N/A"} {data.model || ""}
              </option>
            </select>
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="registration_no">Registration ID / Number</label>
            <input 
              type="text"
              id="registration_no"
              value={regNo}
              disabled // Locked by default for view/edit compliance
              style={{ backgroundColor: "#e9ecef" }}
            />
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="color">Color</label>
            <input 
              type="text" 
              id="color" 
              value={currentColor} 
              onChange={(e) => setCurrentColor(e.target.value)}
              required 
            />
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="registration_date">Registration Date</label>
            <input 
              type="date" 
              id="registration_date"
              value={regDate}
              onChange={(e) => setRegDate(e.target.value)}
              disabled={isRenewing}
              required 
            />
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="expiration_date">Expiration Date</label>
            <input 
              type="date" 
              id="expiration_date"
              value={expDate}
              onChange={(e) => setExpDate(e.target.value)}
              disabled={isRenewing}
              required 
            />
          </div>

          <div className="reg-form-field-group">
            <label htmlFor="registration_status">Registration Status</label>
            <select 
              id="registration_status" 
              value={isRenewing ? "active" : regStatus.toLowerCase()}
              onChange={(e) => setRegStatus(e.target.value)}
              disabled={isRenewing}
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* --- OPTIONAL RENEWAL AREA --- */}
          <div style={{ margin: "20px 0 10px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <input 
              type="checkbox" 
              id="renew_toggle" 
              checked={isRenewing} 
              onChange={(e) => setIsRenewing(e.target.checked)}
              style={{ width: "auto", cursor: "pointer" }}
            />
            <label htmlFor="renew_toggle" style={{ fontWeight: "bold", color: "#28a745", cursor: "pointer", margin: "0" }}>
              Process Renewal for this Vehicle
            </label>
          </div>

          {isRenewing && (
            <div style={{ borderLeft: "4px solid #28a745", paddingLeft: "15px", marginBottom: "20px", backgroundColor: "#f9f9f9", padding: "10px" }}>
              <div className="reg-form-field-group">
                <label style={{ color: "#28a745" }}>Registration ID</label>
                <input 
                  type="text" 
                  value={nextCalculatedRenewalId} 
                  disabled 
                  style={{ backgroundColor: "#e9ecef", fontWeight: "bold", color: "#28a745" }}
                />
              </div>

              <div className="reg-form-field-group">
                <label>New Renewal Date</label>
                <input 
                  type="date" 
                  value={renewalDate} 
                  onChange={(e) => setRenewalDate(e.target.value)} 
                  required={isRenewing}
                />
              </div>

              <div className="reg-form-field-group">
                <label>New Expiration Date</label>
                <input 
                  type="date" 
                  value={renewalExpDate} 
                  onChange={(e) => setRenewalExpDate(e.target.value)} 
                  required={isRenewing}
                />
              </div>
            </div>
          )}

          <div className="reg-modal-button-container">
            <button 
              type="button" 
              className="reg-cancel" 
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
            <button type="submit" className="reg-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationModalEdit;