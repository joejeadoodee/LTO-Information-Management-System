import { useEffect, useState, Fragment } from "react";
import { getAllViolations, deleteViolation } from "../services/violation.js";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import ViolationModalAdd from "../components/ViolationComponents/ViolationModalAdd.jsx";
import ViolationModalEdit from "../components/ViolationComponents/ViolationModalEdit.jsx";
import "../styles/violation.css";

function ViolationsPage() {
  // State variables
  const [violations, setViolations] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editContent, setEditContent] = useState({});

  // Fetch all violations when component loads
  useEffect(() => {
    getAllViolations().then((data) => setViolations(data));
  }, []);

  // Render table rows
  const violationsDisplay = violations.map((violation) => {
    const violationDate = violation.violation_date_time
      ? new Date(violation.violation_date_time).toDateString().slice(4)
      : "";

    return (
      <Fragment key={violation.violation_id}>
        <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
          {violation.violation_id}
        </div>
        <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
          {violation.full_name}
        </div>
        <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
          {violation.plate_no ?? "N/A"}
        </div>
        <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
          {violation.violation_type}
        </div>
        <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
          {violationDate}
        </div>
        <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
          {violation.location}
        </div>
        <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
          {violation.fine_amount}
        </div>
        <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
          {violation.violation_status}
        </div>
        <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
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

              // Delete from database
              deleteViolation(deleteId);

              // Remove from UI
              setViolations((prev) =>
                prev.filter((item) => item.violation_id !== deleteId),
              );
            }}
          >
            Delete
          </button>
        </div>
      </Fragment>
    );
  });

  return (
    <>
      <Header />
      <Sidebar page="violations" />

      <main className="main">
        {/* Edit Modal */}
        {showEdit ? (
          <ViolationModalEdit setShow={setShowEdit} data={editContent} />
        ) : null}

        {/* Add Modal */}
        {showAdd ? <ViolationModalAdd setShow={setShowAdd} /> : null}

        {/* Add Button */}
        <button
          className="add-violation button-behave"
          onClick={() => setShowAdd(true)}
        >
          Add Violation
        </button>

        {/* Table */}
        {violations.length > 0 ? (
          <div className="table-container">
            {/* Header */}
            <div className="grid grid-cols-[7fr_16fr_12fr_14fr_12fr_16fr_10fr_11fr_18fr] w-full bg-[#3d5f93] rounded-t-[20px] py-2.5">
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                ID
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                DRIVER
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                PLATE NO
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                TYPE
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                DATE
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                LOCATION
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                FINE
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                STATUS
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                ACTION
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-[7fr_16fr_12fr_14fr_12fr_16fr_10fr_11fr_18fr] w-full bg-white">
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
