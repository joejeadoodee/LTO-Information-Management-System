import { useEffect, useState } from "react";
import { getFilteredDrivers, deleteDriver } from "../services/drivers.js";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import DriverModalAdd from "../components/DriverComponents/DriverModalAdd.jsx";
import DriverModalEdit from "../components/DriverComponents/DriverModalEdit.jsx";
import DriverFilters from "../components/DriverComponents/DriverFilters.jsx";
import "../styles/drivers.css";

function DriversPage() {
  // Page/component states initialization
  const [filter, setFilter] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editContent, setEditContent] = useState({});

  useEffect(() => {
    getFilteredDrivers(filter).then((data) => setDrivers(data));
  }, [filter]);

  // Loop through drivers and create a row display for each
  const driversDisplay = drivers.map((driver) => {
    // License is ordered from latest to oldest
    // There might be drivers with no license
    const latestLicense = driver.license_issuances[0];

    return (
      <>
        <div className="item">{driver.license_number}</div>
        <div className="item">{driver.full_name}</div>{" "}
        <div className="item">
          {driver.date_of_birth.toDateString().slice(4)}
        </div>
        <div className="item">{driver.sex}</div>
        <div className="item">{driver.address}</div>
        <div className="item">{latestLicense?.license_status}</div>
        <div className="item">{latestLicense?.license_type}</div>
        <div className="item">
          {latestLicense?.license_expiration_date.toDateString().slice(4)}
        </div>
        <div className="item">
          <button
            className="button-behave view"
            onClick={() => {
              setEditContent(driver);
              setShowEdit(true);
            }}
          >
            View
          </button>
          <button
            className="button-behave delete"
            onClick={() => {
              const deleteId = driver.driver_id;
              deleteDriver(deleteId); // db delete
              // Display delete
              setDrivers((prev) =>
                prev.filter((driver) => driver.driver_id !== deleteId),
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
      <Sidebar page="drivers" />
      <main className="main driver">
        {/* Only render edit modal if showEdit is true*/}
        {showEdit ? (
          <DriverModalEdit setShow={setShowEdit} data={editContent} />
        ) : undefined}

        {/* Only render add modal if showAdd is true*/}
        {showAdd ? <DriverModalAdd setShow={setShowAdd} /> : undefined}

        <button
          className="add-driver button-behave"
          onClick={() => setShowAdd(true)}
        >
          Add Driver
        </button>

        <DriverFilters setFilter={setFilter} />

        {/* Only render table if drivers is not empty */}
        {drivers.length > 0 ? (
          <div className="table-container">
            <div className="table header">
              <div className="item">LICENSE NUMBER</div>
              <div className="item">FULL NAME</div>
              <div className="item">BIRTHDAY</div>
              <div className="item">SEX</div>
              <div className="item">ADDRESS</div>
              <div className="item">STATUS</div>
              <div className="item">TYPE</div>
              <div className="item">EXPIRATION DATE</div>
              <div className="item">ACTION</div>
            </div>
            <div className="table content">{driversDisplay}</div>
          </div>
        ) : (
          <div className="no-results">No drivers</div>
        )}
      </main>
    </>
  );
}

export default DriversPage;
