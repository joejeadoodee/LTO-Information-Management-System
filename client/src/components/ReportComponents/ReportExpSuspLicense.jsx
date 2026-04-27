import { useState } from "react";
import { getExpiredOrSuspendedDrivers } from "../../services/drivers.js";
import Modal from "./Modal.jsx";

function ReportExpSuspLicense() {
  const [showModal, setShowModal] = useState(false);
  const [report, setReport] = useState([]);

  const registrations = report.map((driver) => {
    const itemCss = "pl-2 py-2 border-b border-gray-400";

    return (
      <>
        <div className={itemCss}>{driver.license_number}</div>
        <div className={itemCss}>{driver.full_name}</div>
        <div className={itemCss}>
          {driver.date_of_birth.toDateString().slice(4)}
        </div>
        <div className={itemCss}>{driver.sex}</div>
        <div className={itemCss}>{driver.address}</div>
        <div className={itemCss}>
          {driver.license_issuance_date.toDateString().slice(4)}
        </div>
        <div className={itemCss}>
          {driver.license_expiration_date.toDateString().slice(4)}
        </div>
        <div className={itemCss}>{driver.license_status}</div>
        <div className={itemCss}>{driver.license_type}</div>
      </>
    );
  });

  const handleClick = () => {
    getExpiredOrSuspendedDrivers().then((data) => {
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
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_3fr_2fr_2fr_1fr_1fr]">
            <div className={headerCss}>LICENSE NO</div>
            <div className={headerCss}>FULL NAME</div>
            <div className={headerCss}>BIRTHDAY</div>
            <div className={headerCss}>SEX</div>
            <div className={headerCss}>ADDRESS</div>
            <div className={headerCss}>ISSUANCE DATE</div>
            <div className={headerCss}>EXPIRATION DATE</div>
            <div className={headerCss}>STATUS</div>
            <div className={headerCss}>TYPE</div>
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
            Expired and Suspended Licenses
          </h3>
        </div>
        <button className="button-behave bg-[#3F5F92]" onClick={handleClick}>
          Generate Report
        </button>
      </div>
    </>
  );
}

export default ReportExpSuspLicense;
