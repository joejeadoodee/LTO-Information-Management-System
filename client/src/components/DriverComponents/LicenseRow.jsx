import { useState } from "react";
import { editLicense, deleteLicense } from "../../services/license";

function LicenseRow({ issuance, driverId }) {
  const [editable, setEditable] = useState(false);
  const [newIssuanceDate, setNewIssuanceDate] = useState(
    issuance.license_issuance_date.toISOString().split("T")[0],
  );
  const [newExpirationDate, setNewExpirationDate] = useState(
    issuance.license_expiration_date.toISOString().split("T")[0],
  );
  const [newLicenseStatus, setNewLicenseStatus] = useState(
    issuance.license_status,
  );
  const [newLicenseType, setNewLicenseType] = useState(issuance.license_type);

  const handleLicenseEdit = async () => {
    await editLicense({
      driver_id: driverId,
      issue_id: issuance.issue_id,
      license_issuance_date: newIssuanceDate,
      license_expiration_date: newExpirationDate,
      license_status: newLicenseStatus,
      license_type: newLicenseType,
    });

    setEditable(false);
    window.location.reload();
  };

  return (
    <form className="license-grid content" onSubmit={handleLicenseEdit}>
      <div className="item">
        <input
          type="date"
          name="new_issuance_date"
          id="new_issuance_date"
          defaultValue={
            issuance.license_issuance_date.toISOString().split("T")[0]
          }
          required
          disabled={!editable}
          onChange={(e) => setNewIssuanceDate(e.target.value)}
        />
      </div>
      <div className="item">
        <input
          type="date"
          name="new_expiration_date"
          id="new_expiration_date"
          defaultValue={
            issuance.license_expiration_date.toISOString().split("T")[0]
          }
          required
          disabled={!editable}
          onChange={(e) => setNewExpirationDate(e.target.value)}
        />
      </div>
      <div className="item">
        <select
          name="new_license_status"
          id="new_license_status"
          disabled={!editable}
          defaultValue={issuance.license_status}
          onChange={(e) => setNewLicenseStatus(e.target.value)}
        >
          <option value="Valid">Valid</option>
          <option value="Expired">Expired</option>
          <option value="Suspended">Suspended</option>
          <option value="Revoked">Revoked</option>
        </select>
      </div>
      <div className="item">
        <select
          name="new_license_type"
          id="new_license_type"
          disabled={!editable}
          defaultValue={issuance.license_type}
          onChange={(e) => setNewLicenseType(e.target.value)}
        >
          <option value="Professional">Professional</option>
          <option value="Non-Professional">Non-Professional</option>
          <option value="Student Permit">Student Permit</option>
        </select>
      </div>
      <div className="item">
        {editable ? (
          <button
            type="button"
            className="button-behave edit"
            onClick={() => handleLicenseEdit()}
          >
            Save
          </button>
        ) : (
          <button
            type="button"
            className="button-behave edit"
            onClick={() => {
              setEditable((prev) => !prev);
            }}
          >
            Edit
          </button>
        )}

        <button
          type="button"
          className="button-behave edit"
          onClick={async () => {
            await deleteLicense(issuance.issue_id);
            window.location.reload();
          }}
        >
          Delete
        </button>
      </div>
    </form>
  );
}

export default LicenseRow;
