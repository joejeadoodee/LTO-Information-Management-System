import { useState, useRef } from "react";
import { getVehiclesByDriver } from "../../services/vehicle.js";
import Modal from "./Modal.jsx";

function ReportVehicleOwned({ drivers }) {
  const [showModal, setShowModal] = useState(false);
  const [report, setReport] = useState([]);
  const select = useRef(null);

  const options = drivers.map((driver) => (
    <option value={driver.driver_id} key={driver.driver_id}>
      {driver.full_name}
    </option>
  ));

  const vehicles = report.map((vehicle) => {
    const itemCss = "pl-2 py-2 border-b border-gray-400";

    return (
      <>
        <div className={itemCss}>{vehicle.plate_no}</div>
        <div className={itemCss}>{vehicle.engine_no}</div>
        <div className={itemCss}>{vehicle.chassis_no}</div>
        <div className={itemCss}>{vehicle.vehicle_type}</div>
        <div className={itemCss}>{vehicle.make}</div>
        <div className={itemCss}>{vehicle.model}</div>
        <div className={itemCss}>{vehicle.manufacture_yr}</div>
        <div className={itemCss}>{vehicle.color}</div>
      </>
    );
  });

  const handleClick = () => {
    const driver_id = select.current.value;
    if (!driver_id) return;

    getVehiclesByDriver({ id: driver_id }).then((data) => {
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
          <div className="grid grid-cols-[2fr_2fr_2fr_2fr_1fr_1fr_1fr_2fr]">
            <div className={headerCss}>PLATE NO</div>
            <div className={headerCss}>ENGINE NO </div>
            <div className={headerCss}>CHASSIS NO</div>
            <div className={headerCss}>VEHICLE TYPE</div>
            <div className={headerCss}>MAKE</div>
            <div className={headerCss}>MODEL</div>
            <div className={headerCss}>YEAR</div>
            <div className={headerCss}>COLOR</div>
            {vehicles}
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
            Vehicles Owned By
          </h3>
          <p className="text-[#64738A] font-semibold text-sm mb-1">DRIVER</p>
          <select
            className="w-full bg-[#EDF4FF] text-[#5e6369] py-2 px-0.5 rounded-lg"
            name="owner"
            id="owner"
            ref={select}
          >
            <option value="" selected disabled hidden>
              Select driver
            </option>
            {options}
          </select>
        </div>
        <button className="button-behave bg-[#3F5F92]" onClick={handleClick}>
          Generate Report
        </button>
      </div>
    </>
  );
}

export default ReportVehicleOwned;
