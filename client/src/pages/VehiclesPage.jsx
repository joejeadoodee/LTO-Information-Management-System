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
      String(vehicle.vehicle_type ?? "")
        .trim()
        .toLowerCase() !==
        String(typeFilter ?? "")
          .trim()
          .toLowerCase()
    )
      return false;

    if (!q) return true;

    const driver = drivers.find((d) => d.driver_id === vehicle.driver_id);
    const driverName = driver ? driver.full_name.toLowerCase() : "";

    return (
      String(vehicle.plate_no ?? "")
        .toLowerCase()
        .includes(q) ||
      String(vehicle.engine_no ?? "")
        .toLowerCase()
        .includes(q) ||
      String(vehicle.chassis_no ?? "")
        .toLowerCase()
        .includes(q) ||
      String(vehicle.make ?? "")
        .toLowerCase()
        .includes(q) ||
      String(vehicle.model ?? "")
        .toLowerCase()
        .includes(q) ||
      String(vehicle.color ?? "")
        .toLowerCase()
        .includes(q) ||
      driverName.includes(q) ||
      String(vehicle.driver_id ?? "").includes(q)
    );
  };

  const filteredVehicles = vehicles.filter(matchesQuery);

  const vehiclesDisplay = filteredVehicles.map((vehicle) => (
    <Fragment key={vehicle.vehicle_id}>
      <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
        {vehicle.vehicle_id}
      </div>
      <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
        {vehicle.plate_no}
      </div>
      <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
        {vehicle.engine_no}
      </div>
      <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
        {vehicle.chassis_no}
      </div>
      <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
        {vehicle.vehicle_type ?? "N/A"}
      </div>
      <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
        {vehicle.model ?? "N/A"}
      </div>
      <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
        {vehicle.manufacture_yr ?? "N/A"}
      </div>
      <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
        {vehicle.color ?? "N/A"}
      </div>
      <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
        {vehicle.driver_id ?? "Unassigned"}
      </div>
      <div className="text-[#4a5769] border-b border-[#e9e9e9] p-5">
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
            setVehicles((prev) =>
              prev.filter((item) => item.vehicle_id !== deleteId),
            );
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
      <main className="main vehicle">
        {showEdit ? (
          <VehicleModalEdit
            setShow={setShowEdit}
            data={editContent}
            drivers={drivers}
            onSaved={refreshVehicles}
          />
        ) : undefined}

        {showAdd ? (
          <VehicleModalAdd
            setShow={setShowAdd}
            drivers={drivers}
            onSaved={refreshVehicles}
          />
        ) : undefined}

        <div
          style={{ width: "100%", display: "flex", gap: 12, marginBottom: 12 }}
        >
          <input
            placeholder="Search by plate, make, model, color, or driver"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: "8px 12px", borderRadius: 8 }}
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8 }}
          >
            <option value="">All types</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="private car">Private Car</option>
            <option value="public utility vehicle">
              Public Utility Vehicle
            </option>
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
            <div className="grid grid-cols-[7fr_12fr_13fr_14fr_13fr_11fr_10fr_11fr_10fr_18fr] w-full bg-[#3d5f93] rounded-t-[20px] py-2.5">
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                ID
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                PLATE NO
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                ENGINE NO
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                CHASSIS NO
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                VEHICLE TYPE
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                MODEL
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                MANUFACTURE YR
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                COLOR
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                DRIVER ID
              </div>
              <div className="font-light pt-[5px] px-5 pb-[10px] text-white">
                ACTION
              </div>
            </div>

            <div className="grid grid-cols-[7fr_12fr_13fr_14fr_13fr_11fr_10fr_11fr_10fr_18fr] w-full bg-white">
              {vehiclesDisplay}
            </div>
          </div>
        ) : (
          <div className="no-results">No vehicles</div>
        )}
      </main>
    </>
  );
}

export default VehiclesPage;
