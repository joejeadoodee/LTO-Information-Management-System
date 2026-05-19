import { useEffect, useState } from "react";
import {
  getAllViolations,
  deleteViolation,
} from "../services/violation.js";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import ViolationModalAdd from "../components/ViolationComponents/ViolationModalAdd.jsx";
import ViolationModalEdit from "../components/ViolationComponents/ViolationModalEdit.jsx";
import "../styles/drivers.css"; 


function ViolationsPage() {
  // Page/component states initialization
  const [violations, setViolations] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editContent, setEditContent] = useState({});

  // Fetch all violations on page load
  useEffect(() => {
    getAllViolations().then((data) => setViolations(data)); 
  }, []);

  // Loop through violations and create a row display for each
  const violationsDisplay = violations.map((violation) => {
    // Safely format date if it exists
    const violationDate = violation.violation_date_time
      ? new Date(violation.violation_date_time).toDateString().slice(4)
      : "";

    return (
      <>
        <div className="item">{violation.violation_id}</div>
        <div className="item">{violation.full_name}</div>
        <div className="item">{violation.plate_no ?? "N/A"}</div>
        <div className="item">{violation.violation_type}</div>
        <div className="item">{violationDate}</div>
        <div className="item">{violation.location}</div>
        <div className="item">{violation.fine_amount}</div>
        <div className="item">{violation.violation_status}</div>
        <div className="item">
          <button
            className="button-behave view"
            onClick={() => {
              setEditContent(violation);
              setShowEdit(true);
            }}
          >
            View
          </button>

          <button
            className="button-behave delete"
            onClick={() => {
              const deleteId = violation.violation_id;
              deleteViolation(deleteId); // DB delete

              // Remove from UI
              setViolations((prev) =>
                prev.filter(
                  (violation) => violation.violation_id !== deleteId,
                ),
              );
            }}
          >
            Delete
          </button>
        </div>
      </>
    );
  });

  return (
    <>
      <Header />
      <Sidebar page="violations" />

      <main className="main">
        {/* Only render edit modal if showEdit is true */}
        {showEdit ? (
          <ViolationModalEdit
            setShow={setShowEdit}
            data={editContent}
          />
        ) : undefined}

        {/* Only render add modal if showAdd is true */}
        {showAdd ? (
          <ViolationModalAdd setShow={setShowAdd} />
        ) : undefined}

        <button
          className="add-driver button-behave"
          onClick={() => setShowAdd(true)}
        >
          Add Violation
        </button>

        {/* Only render table if violations is not empty */}
        {violations.length > 0 ? (
          <div className="table-container">
            <div className="table header">
              <div className="item">ID</div>
              <div className="item">DRIVER</div>
              <div className="item">PLATE NO</div>
              <div className="item">TYPE</div>
              <div className="item">DATE</div>
              <div className="item">LOCATION</div>
              <div className="item">FINE</div>
              <div className="item">STATUS</div>
              <div className="item">ACTION</div>
            </div>

            <div className="table content">
              {violationsDisplay}
            </div>
          </div>
        ) : (
          <div className="no-results">No violations</div>
        )}
      </main>
    </>
  );
}

export default ViolationsPage;