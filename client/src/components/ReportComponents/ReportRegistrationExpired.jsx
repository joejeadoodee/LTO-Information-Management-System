import { useState, useRef } from "react";
import { getVehiclesExpiredRegistration } from "../../services/registration.js";
import Modal from "./Modal.jsx";

function RegistrationExpired() {
  const [showModal, setShowModal] = useState(false);
  const [report, setReport] = useState([]);
  const dateInput = useRef(null);

  const registrations = report.map((reg) => {
    const itemCss = "pl-2 py-2 border-b border-gray-400";

    return (
      <>
        <div className={itemCss}>{reg.plate_no}</div>
        <div className={itemCss}>{reg.engine_no}</div>
        <div className={itemCss}>{reg.chassis_no}</div>
        <div className={itemCss}>{reg.vehicle_type}</div>
        <div className={itemCss}>{reg.make}</div>
        <div className={itemCss}>{reg.model}</div>
        <div className={itemCss}>{reg.manufacture_yr}</div>
        <div className={itemCss}>{reg.color}</div>
        <div className={itemCss}>{reg.registration_no}</div>
        <div className={itemCss}>
          {reg.registration_date.toDateString().slice(4)}
        </div>
        <div className={itemCss}>
          {reg.expiration_date.toDateString().slice(4)}
        </div>
        <div className={itemCss}>{reg.registration_status}</div>
      </>
    );
  });

  const handleClick = () => {
    const date = dateInput.current.value;
    if (!date) return;

    getVehiclesExpiredRegistration({ date }).then((data) => {
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
          <div className="grid grid-cols-[2fr_2fr_2fr_2fr_1fr_1fr_1fr_2fr_2fr_1fr_1fr_1fr]">
            <div className={headerCss}>PLATE NO</div>
            <div className={headerCss}>ENGINE NO </div>
            <div className={headerCss}>CHASSIS NO</div>
            <div className={headerCss}>VEHICLE TYPE</div>
            <div className={headerCss}>MAKE</div>
            <div className={headerCss}>MODEL</div>
            <div className={headerCss}>YEAR</div>
            <div className={headerCss}>COLOR</div>
            <div className={headerCss}>REG NO</div>
            <div className={headerCss}>REG DATE</div>
            <div className={headerCss}>EXP DATE</div>
            <div className={headerCss}>STATUS</div>
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
            Vehicle Registration Expired By
          </h3>
          <p className="text-[#64738A] font-semibold text-sm mb-1">Date</p>
          <input
            ref={dateInput}
            className="w-full bg-[#EDF4FF] text-[#5e6369] py-2 px-0.5 rounded-lg"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            required
          />
        </div>
        <button className="button-behave bg-[#3F5F92]" onClick={handleClick}>
          Generate Report
        </button>
      </div>
    </>
  );
}

export default RegistrationExpired;
