import { useState, useEffect } from "react";
import { getAllDrivers } from "../services/drivers.js";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import ReportVehicleOwned from "../components/ReportComponents/ReportVehicleOwned.jsx";
import ReportRegistrationExpired from "../components/ReportComponents/ReportRegistrationExpired.jsx";
import ReportExpSuspLicense from "../components/ReportComponents/ReportExpSuspLicense.jsx";
import ReportDriverViolation from "../components/ReportComponents/ReportDriverViolation.jsx";
import ReportYearlyViolation from "../components/ReportComponents/ReportYearlyViolation.jsx";
import ReportLocationViolation from "../components/ReportComponents/ReportLocationViolation.jsx";

function ReportsPage() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    getAllDrivers().then((data) => setDrivers(data));
  }, []);

  return (
    <>
      <Header />
      <Sidebar page="reports" />
      <main className="main">
        {drivers.length !== 0 ? (
          <div className="grid grid-cols-3 gap-2 w-full">
            <ReportVehicleOwned drivers={drivers} />
            <ReportRegistrationExpired />
            <ReportExpSuspLicense />
            <ReportDriverViolation drivers={drivers} />
            <ReportYearlyViolation />
            <ReportLocationViolation />
          </div>
        ) : undefined}
      </main>
    </>
  );
}

export default ReportsPage;
