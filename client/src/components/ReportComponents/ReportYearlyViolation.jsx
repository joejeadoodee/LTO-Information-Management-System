import { useState, useRef } from "react";
import { getViolationsByYear } from "../../services/violation.js";
import Modal from "./Modal.jsx";

function ReportYearlyViolation() {
  const [showModal, setShowModal] = useState(false);
  const [report, setReport] = useState([]);
  const yearInput = useRef(null);

  const registrations = report.map((violation) => {
    return (
      <>
        <div className="bg-[#415F91] text-white px-5 py-2">
          {violation.violation_type}
        </div>
        <div className="flex justify-center bg-[#e9e9e9] py-2 text-[#616161]">
          {violation.total_violations}
        </div>
      </>
    );
  });

  const handleClick = () => {
    const year = yearInput.current.value;

    if (!year) return;

    getViolationsByYear({ year }).then((data) => {
      setReport(data);
      setShowModal(true);
    });
  };

  return (
    <>
      {showModal && report.length > 0 ? (
        <Modal setShow={setShowModal}>
          <div className="grid grid-cols-2 gap-y-2">{registrations}</div>
        </Modal>
      ) : showModal && report.length === 0 ? (
        <Modal setShow={setShowModal}>
          <div className="w-full h-full flex items-center justify-center">
            Nothing Found
          </div>
        </Modal>
      ) : undefined}

      <div className="bg-white flex flex-col p-5 h-70 justify-between">
        <div>
          <h3 className="font-bold text-2xl mb-5 text-[#293747]">
            Total Violations on Year
          </h3>
          <p className="text-[#64738A] font-semibold text-sm mb-1">YEAR</p>
          <input
            className="w-full bg-[#EDF4FF] text-[#5e6369] py-2 px-3 rounded-lg"
            type="number"
            id="year"
            name="year"
            min="1900"
            max="2099"
            step="1"
            defaultValue={new Date().getFullYear()}
            required
            ref={yearInput}
          />
        </div>
        <button className="button-behave bg-[#3F5F92]" onClick={handleClick}>
          Generate Report
        </button>
      </div>
    </>
  );
}

export default ReportYearlyViolation;
