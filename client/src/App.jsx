import { Routes, Route } from "react-router-dom";
import DriversPage from "./pages/DriversPage.jsx";
import RegistrationsPage from "./pages/RegistrationsPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import VehiclesPage from "./pages/VehiclesPage.jsx";
import ViolationsPage from "./pages/ViolationsPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DriversPage />} />
      <Route path="/drivers" element={<DriversPage />} />
      <Route path="/registrations" element={<RegistrationsPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/vehicles" element={<VehiclesPage />} />
      <Route path="/violations" element={<ViolationsPage />} />
    </Routes>
  );
}

export default App;
