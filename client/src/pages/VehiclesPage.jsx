import { Fragment, useEffect, useState } from "react";
import { getAllVehicles, deleteVehicle } from "../services/vehicle.js";
import { getAllDrivers } from "../services/drivers.js";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import VehicleModalAdd from "../components/VehicleComponents/VehicleModalAdd.jsx";
import VehicleModalEdit from "../components/VehicleComponents/VehicleModalEdit.jsx";
import "../styles/drivers.css";
import "../styles/vehicles.css";

function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editContent, setEditContent] = useState({});

  useEffect(() => {
    getAllVehicles().then((data) => setVehicles(data));
    getAllDrivers().then((list) => setDrivers(list));
  }, []);

  const refreshVehicles = async () => {
    const data = await getAllVehicles();
    setVehicles(data);
  };

  const matchesQuery = (vehicle) => {
    const q = query.trim().toLowerCase();
    if (!q && !typeFilter) return true;

    if (
      typeFilter &&
      String(vehicle.vehicle_type ?? "").trim().toLowerCase() !==
        String(typeFilter ?? "").trim().toLowerCase()
    )
      return false;

    if (!q) return true;

    const driver = drivers.find((d) => d.driver_id === vehicle.driver_id);
    const driverName = driver ? driver.full_name.toLowerCase() : "";

    return (
      String(vehicle.plate_no ?? "").toLowerCase().includes(q) ||
      String(vehicle.engine_no ?? "").toLowerCase().includes(q) ||
      String(vehicle.chassis_no ?? "").toLowerCase().includes(q) ||
      String(vehicle.make ?? "").toLowerCase().includes(q) ||
      String(vehicle.model ?? "").toLowerCase().includes(q) ||
      String(vehicle.color ?? "").toLowerCase().includes(q) ||
      driverName.includes(q) ||
      String(vehicle.driver_id ?? "").includes(q)
    );
  };

  const filteredVehicles = vehicles.filter(matchesQuery);

  const vehiclesDisplay = filteredVehicles.map((vehicle) => (
    <Fragment key={vehicle.vehicle_id}>
      <div className="item">{vehicle.vehicle_id}</div>
      <div className="item">{vehicle.plate_no}</div>
      <div className="item">{vehicle.engine_no}</div>
      <div className="item">{vehicle.chassis_no}</div>
      <div className="item">{vehicle.vehicle_type ?? "N/A"}</div>
      <div className="item">{vehicle.model ?? "N/A"}</div>
      <div className="item">{vehicle.manufacture_yr ?? "N/A"}</div>
      <div className="item">{vehicle.color ?? "N/A"}</div>
      <div className="item">{vehicle.driver_id ?? "Unassigned"}</div>
      <div className="item">
        <button
          className="button-behave view"
          onClick={() => {
            setEditContent(vehicle);
            setShowEdit(true);
          }}
        >
          View
        </button>

        <button
          className="button-behave delete"
          onClick={async () => {
            const deleteId = vehicle.vehicle_id;
            await deleteVehicle(deleteId);

            // refresh UI list
            setVehicles((prev) => prev.filter((item) => item.vehicle_id !== deleteId));
          }}
        >
          Delete
        </button>
      </div>
    </Fragment>
  ));

  return (
    <>
      <Header />
      <Sidebar page="vehicles" />
      <main className="main">
        {showEdit ? (
          <VehicleModalEdit
            setShow={setShowEdit}
            data={editContent}
            drivers={drivers}
            onSaved={refreshVehicles}
          />
        ) : undefined}

        {showAdd ? (
          <VehicleModalAdd setShow={setShowAdd} drivers={drivers} onSaved={refreshVehicles} />
        ) : undefined}

        <div style={{ width: "100%", display: "flex", gap: 12, marginBottom: 12 }}>
          <input
            placeholder="Search by plate, make, model, color, or driver"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: "8px 12px", borderRadius: 8 }}
          />

          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8 }}>
            <option value="">All types</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="private car">Private Car</option>
            <option value="public utility vehicle">Public Utility Vehicle</option>
          </select>
        </div>

        <button
          className="add-vehicle button-behave"
          onClick={() => setShowAdd(true)}
        >
          Add Vehicle
        </button>

        {vehicles.length > 0 ? (
          <div className="table-container">
            <div className="table header vehicle-table">
                <div className="item">ID</div>
                <div className="item">PLATE NO</div>
                <div className="item">ENGINE NO</div>
                <div className="item">CHASSIS NO</div>
                <div className="item">VEHICLE TYPE</div>
                <div className="item">MODEL</div>
                <div className="item">MANUFACTURE YR</div>
                <div className="item">COLOR</div>
                <div className="item">DRIVER ID</div>
                <div className="item">ACTION</div>
            </div>

              <div className="table content vehicle-table">{vehiclesDisplay}</div>
          </div>
        ) : (
          <div className="no-results">No vehicles</div>
        )}
      </main>
    </>
  );
}

export default VehiclesPage;
