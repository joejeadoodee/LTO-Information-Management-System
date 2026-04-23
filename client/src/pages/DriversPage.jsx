import { useEffect, useState } from "react";
import { getAllDrivers } from "../services/drivers.js";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import "../styles/drivers.css";

function DriversPage() {
  const [drivers, setDrivers] = useState([]);

  // On page render, getDrivers, then, setDrivers to result data
  useEffect(() => {
    getAllDrivers().then((data) => setDrivers(data));
  }, []);

  // Create set of divs for each driver item
  const driversDisplay = drivers.map((driver) => {
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
        <div className="item">{latestLicense.license_status}</div>
        <div className="item">{latestLicense.license_type}</div>
        <div className="item">
          {latestLicense.license_expiration_date.toDateString().slice(4)}
        </div>
        <div className="item">ACTION</div>
      </>
    );
  });

  // Only render table if drivers is not empty
  return (
    <>
      <Header />
      <Sidebar page="drivers" />
      <main>
        <button type="" className="add-driver button-behave">
          Add Driver
        </button>
        {drivers.length > 0 ? (
          <div className="table-container">
            <div className="table header">
              <div className="item">LICENSE NUMBER</div>
              <div className="item">FULL NAME</div>{" "}
              <div className="item">BIRTHDAY</div>{" "}
              <div className="item">SEX</div>
              <div className="item">ADDRESS</div>
              <div className="item">STATUS</div>
              <div className="item">TYPE</div>
              <div className="item">EXPIRATION DATE</div>
              <div className="item">ACTION</div>
            </div>
            <div className="table content">{driversDisplay}</div>
            <div className="table footer">tite</div>
          </div>
        ) : undefined}
      </main>
    </>
  );
}

export default DriversPage;
