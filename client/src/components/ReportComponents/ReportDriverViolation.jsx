import { useState, useRef } from "react";
import { getDriverViolations } from "../../services/drivers.js";
import Modal from "./Modal.jsx";

function ReportDriverViolation({ drivers }) {
  const [showModal, setShowModal] = useState(false);
  const [report, setReport] = useState([]);
  const idInput = useRef(null);
  const fromInput = useRef(null);
  const toInput = useRef(null);

  const options = drivers.map((driver) => (
    <option value={driver.driver_id} key={driver.driver_id}>
      {driver.full_name}
    </option>
  ));

  const registrations = report.map((violation) => {
    const itemCss = "pl-2 py-2 border-b border-gray-400";

    return (
      <>
        <div className={itemCss}>{violation.license_number}</div>
        <div className={itemCss}>{violation.full_name}</div>
        <div className={itemCss}>
          {violation.date_of_birth.toDateString().slice(4)}
        </div>
        <div className={itemCss}>{violation.sex}</div>
        <div className={itemCss}>{violation.address}</div>
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
    const id = idInput.current.value;
    const date_from = fromInput.current.value;
    const date_to = toInput.current.value;

    if (!id || !date_from || !date_to) return;

    getDriverViolations({ id, date_from, date_to }).then((data) => {
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
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_3fr_2fr_2fr_3fr_1fr_1fr_2fr]">
            <div className={headerCss}>LICENSE NO</div>
            <div className={headerCss}>FULL NAME</div>
            <div className={headerCss}>BIRTHDAY</div>
            <div className={headerCss}>SEX</div>
            <div className={headerCss}>ADDRESS</div>
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
            Driver Violations
          </h3>
          <p className="text-[#64738A] font-semibold text-sm mb-1">DRIVER</p>
          <select
            className="w-full bg-[#EDF4FF] text-[#5e6369] py-2 px-0.5 rounded-lg mb-3"
            name="owner"
            id="owner"
            ref={idInput}
          >
            <option value="" selected disabled hidden>
              Select driver
            </option>
            {options}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[#64738A] font-semibold text-sm mb-1">FROM</p>
              <input
                className="w-full bg-[#EDF4FF] text-[#5e6369] py-2 px-0.5 rounded-lg"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
                ref={fromInput}
              />
            </div>
            <div>
              <p className="text-[#64738A] font-semibold text-sm mb-1">TO</p>
              <input
                className="w-full bg-[#EDF4FF] text-[#5e6369] py-2 px-0.5 rounded-lg"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
                ref={toInput}
              />
            </div>
          </div>
        </div>
        <button className="button-behave bg-[#3F5F92]" onClick={handleClick}>
          Generate Report
        </button>
      </div>
    </>
  );
}

export default ReportDriverViolation;
