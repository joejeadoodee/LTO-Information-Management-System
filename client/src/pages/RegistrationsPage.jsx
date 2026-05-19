import { useEffect, useState } from "react";
import { getVehiclesExpiredRegistration, deleteRegistration } from "../services/registration.js";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import RegistrationModalAdd from "../components/RegistrationComponents/RegistrationModalAdd.jsx";
import RegistrationModalEdit from "../components/RegistrationComponents/RegistrationModalEdit.jsx";
import RegistrationFilters from "../components/RegistrationComponents/RegistrationFilters.jsx";
import "../styles/registration.css"; 

function RegistrationsPage() {
  const [filter, setFilter] = useState({ date: new Date().toISOString().split("T")[0], registration_status: "" });
  const [registrations, setRegistrations] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editContent, setEditContent] = useState(null);

  useEffect(() => {
    const targetDate = filter.date || new Date().toISOString().split("T")[0];

    getVehiclesExpiredRegistration({ date: targetDate }).then((data) => {
      let processData = Array.isArray(data) ? data : [];

      if (filter.registration_status) {
        processData = processData.filter(
          (reg) => reg.registration_status?.toLowerCase() === filter.registration_status.toLowerCase()
        );
      }
      setRegistrations(processData);
    });
  }, [filter]);

  return (
    <>
      <Header />
      <Sidebar page="registrations" />
      <main className="main">
        {showEdit ? (
          <RegistrationModalEdit setShow={setShowEdit} data={editContent} />
        ) : undefined}

        {showAdd ? <RegistrationModalAdd setShow={setShowAdd} /> : undefined}

        <button
          className="add-driver button-behave"
          onClick={() => setShowAdd(true)}
        >
          Add Registration
        </button>

        <RegistrationFilters setFilter={setFilter} />

        {registrations.length > 0 ? (
          /* FIXED: Removed the .reg-table-container wrapper element completely! 
             The table divs now sit directly under <main className="main"> exactly like DriversPage */
          <>
            <div className="table header reg-7-col">
              <div className="item">PLATE NO</div>
              <div className="item">MANUFACTURER</div>
              <div className="item">MODEL</div>
              <div className="item">TYPE</div>
              <div className="item">COLOR</div>
              <div className="item">EXPIRATION DATE</div>
              <div className="item">ACTION</div>
            </div>
            
            <div className="table content reg-7-col">
              {registrations.map((reg, index) => {
                const rowId = reg.vehicle_reg_id || index;
                return (
                  <div key={`reg-row-${rowId}`} style={{ display: "contents" }}>
                    <div className="item">{reg.plate_no || "N/A"}</div>
                    <div className="item">{reg.make || "N/A"}</div>
                    <div className="item">{reg.model || "N/A"}</div>
                    <div className="item">{reg.vehicle_type || "N/A"}</div>
                    <div className="item">{reg.color || "N/A"}</div>
                    <div className="item">
                      {reg.expiration_date && typeof reg.expiration_date.toDateString === "function"
                        ? reg.expiration_date.toDateString().slice(4)
                        : String(reg.expiration_date || "No Date")}
                    </div>
                    <div className="item">
                      <button
                        className="button-behave view"
                        onClick={() => {
                          setEditContent(reg);
                          setShowEdit(true);
                        }}
                      >
                        View
                      </button>
                      <button
                        className="button-behave delete"
                        onClick={async () => {
                          if (window.confirm("Delete this vehicle registration record?")) {
                            const deleteId = reg.vehicle_reg_id;
                            await deleteRegistration(deleteId); 
                            setRegistrations((prev) => prev.filter((item) => item.vehicle_reg_id !== deleteId));
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
          <div className="no-results">No vehicle registrations found</div>
        )}
      </main>
    </>
  );
}

export default RegistrationsPage;