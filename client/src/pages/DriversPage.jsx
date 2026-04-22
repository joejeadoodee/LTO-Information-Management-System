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
  const driversDisplay = drivers.map((driver, ind) => (
    <>
      <div className="item">{driver.license_number}</div>
      <div className="item">{driver.full_name}</div>{" "}
      <div className="item">{driver.date_of_birth.toDateString().slice(4)}</div>
      <div className="item">{driver.sex}</div>
      <div className="item">{driver.address}</div>
      <div className="item">ACTION</div>
    </>
  ));

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
          <div className="table">
            <div className="header">LICENSE NUMBER</div>
            <div className="header">FULL NAME</div>{" "}
            <div className="header">DATE OF BIRTH</div>{" "}
            <div className="header">SEX</div>
            <div className="header">ADDRESS</div>
            <div className="header">ACTION</div>
            {driversDisplay}
            <div className="header">LICENSE NUMBER</div>
            <div className="header">FULL NAME</div>{" "}
            <div className="header">DATE OF BIRTH</div>{" "}
            <div className="header">SEX</div>
            <div className="header">ADDRESS</div>
            <div className="header">ACTION</div>
          </div>
        ) : undefined}
      </main>
    </>
  );
}

export default DriversPage;
