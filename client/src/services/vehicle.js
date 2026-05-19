import axios from "axios";

async function getAllVehicles() {
  try {
    const {
      data: { data },
    } = await axios.get("/api/vehicle");

    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function addVehicle(data) {
  try {
    await axios.post("/api/vehicle", data);
  } catch (error) {
    console.log(error);
  }
}

async function updateVehicle({ vehicle_id, ...data }) {
  try {
    await axios.put(`/api/vehicle/${vehicle_id}`, data);
  } catch (error) {
    console.log(error);
  }
}

async function deleteVehicle(id) {
  try {
    await axios.delete(`/api/vehicle/${id}`);
  } catch (error) {
    console.log(error);
  }
}

async function getVehiclesByDriver({ id }) {
  try {
    const {
      data: { data },
    } = await axios.get(`/api/vehicle/by-driver?id=${id}`);

    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getVehiclesByViolationLocation({ location }) {
  try {
    const {
      data: { data },
    } = await axios.get(
      `/api/vehicle/by-violation-location?location=${location}`,
    );

    const formattedData = data.map((vehicle) => ({
      ...vehicle,
      violation_date_time: new Date(vehicle.violation_date_time),
    }));

    return formattedData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export {
  getAllVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByDriver,
  getVehiclesByViolationLocation,
};
