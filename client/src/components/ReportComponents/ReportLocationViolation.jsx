import { useState, useRef } from "react";
import { getVehiclesByViolationLocation } from "../../services/vehicle.js";
import Modal from "./Modal.jsx";

function ReportLocationViolation() {
  const [showModal, setShowModal] = useState(false);
  const [report, setReport] = useState([]);
  const locationInput = useRef(null);

  const registrations = report.map((violation) => {
    const itemCss = "pl-2 py-2 border-b border-gray-400";

    return (
      <>
        <div className={itemCss}>{violation.plate_no}</div>
        <div className={itemCss}>{violation.vehicle_type}</div>
        <div className={itemCss}>{violation.make}</div>
        <div className={itemCss}>{violation.model}</div>
        <div className={itemCss}>{violation.manufacture_yr}</div>
        <div className={itemCss}>{violation.color}</div>
        <div className={itemCss}>{violation.violation_type}</div>
        <div className={itemCss}>
          {violation.violation_date_time.toLocaleString("en-PH", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>
        <div className={itemCss}>{violation.location}</div>
        <div className={itemCss}>{violation.fine_amount}</div>
        <div className={itemCss}>{violation.violation_status}</div>
        <div className={itemCss}>{violation.officer_name}</div>
      </>
    );
  });

  const handleClick = () => {
    const location = locationInput.current.value;

    if (!location) return;

    getVehiclesByViolationLocation({ location }).then((data) => {
      setReport(data);
      setShowModal(true);
    });
  };

  const headerCss =
    "bg-[#3d5f93] py-2 text-white pl-2 text-2x font-light text-xl";

  return (
    <>
      {showModal && report.length > 0 ? (
        <Modal setShow={setShowModal}>
          <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_2fr_2fr_3fr_1fr_1fr_2fr]">
            <div className={headerCss}>PLATE NO</div>
            <div className={headerCss}>VEHICLE TYPE</div>
            <div className={headerCss}>MAKE</div>
            <div className={headerCss}>MODEL</div>
            <div className={headerCss}>MANUFACTURE YEAR</div>
            <div className={headerCss}>COLOR</div>
            <div className={headerCss}>TYPE</div>
            <div className={headerCss}>DATE&TIME</div>
            <div className={headerCss}>LOCATION</div>
            <div className={headerCss}>FINE</div>
            <div className={headerCss}>STATUS</div>
            <div className={headerCss}>OFFICER</div>
            {registrations}
          </div>
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
            Violations on Location
          </h3>
          <p className="text-[#64738A] font-semibold text-sm mb-1">LOCATION</p>
          <input
            className="w-full bg-[#EDF4FF] text-[#5e6369] py-2 px-3 rounded-lg"
            type="text"
            id="location"
            name="location"
            placeholder="Enter a city or a region"
            required
            ref={locationInput}
          />
        </div>
        <button className="button-behave bg-[#3F5F92]" onClick={handleClick}>
          Generate Report
        </button>
      </div>
    </>
  );
}

export default ReportLocationViolation;
