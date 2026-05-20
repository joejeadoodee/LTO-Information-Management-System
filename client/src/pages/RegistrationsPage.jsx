import { useEffect, useState } from "react";
import {
  getVehicleRegistrations,
  deleteRegistration,
} from "../services/registration.js";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import RegistrationModalAdd from "../components/RegistrationComponents/RegistrationModalAdd.jsx";
import RegistrationModalEdit from "../components/RegistrationComponents/RegistrationModalEdit.jsx";
import RegistrationFilters from "../components/RegistrationComponents/RegistrationFilters.jsx";
import "../styles/registration.css";

function RegistrationsPage() {
  const getLocalTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [filter, setFilter] = useState({
    date: getLocalTodayString(),
    registration_status: "",
  });

  const [registrations, setRegistrations] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editContent, setEditContent] = useState(null);

  useEffect(() => {
    // Send a valid local calendar date string to satisfy backend conditions
    const targetDate = filter.date || getLocalTodayString();

    getVehicleRegistrations({ date: targetDate }).then((data) => {
      let processData = Array.isArray(data) ? data : [];

      if (filter.registration_status) {
        processData = processData.filter(
          (reg) =>
            reg.registration_status?.toLowerCase() ===
            filter.registration_status.toLowerCase(),
        );
      }
      setRegistrations(processData);
    });
  }, [filter]);

  return (
    <>
      <Header />
      <Sidebar page="registrations" />
      <main className="reg-main-container">
        {showEdit && editContent ? (
          <RegistrationModalEdit setShow={setShowEdit} data={editContent} />
        ) : showAdd ? (
          <RegistrationModalAdd setShow={setShowAdd} />
        ) : null}

        <button
          className="reg-add-action-btn reg-btn-behavior"
          onClick={() => setShowAdd(true)}
        >
          Add Registration
        </button>

        <RegistrationFilters setFilter={setFilter} />

        {registrations.length > 0 ? (
          <>
            <div className="reg-table reg-table-header">
              <div className="reg-item">PLATE NO</div>
              <div className="reg-item">MANUFACTURER</div>
              <div className="reg-item">MODEL</div>
              <div className="reg-item">TYPE</div>
              <div className="reg-item">COLOR</div>
              <div className="reg-item">EXPIRATION DATE</div>
              <div className="reg-item">ACTION</div>
            </div>

            <div className="reg-table reg-table-content">
              {registrations.map((reg, index) => {
                const rowId = reg.vehicle_reg_id || index;

                const displayDate =
                  reg.expiration_date instanceof Date &&
                  !isNaN(reg.expiration_date.getTime())
                    ? reg.expiration_date.toDateString().slice(4)
                    : String(reg.expiration_date || "N/A");

                return (
                  <div key={`reg-row-${rowId}`} style={{ display: "contents" }}>
                    <div className="reg-item">{reg.plate_no || "N/A"}</div>
                    <div className="reg-item">{reg.make || "N/A"}</div>
                    <div className="reg-item">{reg.model || "N/A"}</div>
                    <div className="reg-item">{reg.vehicle_type || "N/A"}</div>
                    <div className="reg-item">{reg.color || "N/A"}</div>
                    <div className="reg-item">{displayDate}</div>
                    <div className="reg-item">
                      <button
                        className="reg-btn-behavior reg-view-btn"
                        onClick={() => {
                          setEditContent(reg);
                          setShowEdit(true);
                        }}
                      >
                        View
                      </button>
                      <button
                        className="reg-btn-behavior reg-delete-btn"
                        onClick={async () => {
                          if (
                            window.confirm(
                              "Delete this vehicle registration record?",
                            )
                          ) {
                            const deleteId = reg.vehicle_reg_id;
                            await deleteRegistration(deleteId);
                            setRegistrations((prev) =>
                              prev.filter(
                                (item) => item.vehicle_reg_id !== deleteId,
                              ),
                            );
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="reg-no-results">No vehicle registrations found</div>
        )}
      </main>
    </>
  );
}

export default RegistrationsPage;
