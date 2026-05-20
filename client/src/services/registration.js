import axios from "axios";

async function getVehiclesExpiredRegistration({ date }) {
  try {
    const response = await axios.get(
      `/api/vehicle/expired-registration?date=${date}`,
    );
    const regRecords = response.data?.data || response.data || [];

    const formatted = regRecords.map((reg) => ({
      ...reg,
      registration_date: reg.registration_date
        ? new Date(reg.registration_date)
        : null,
      expiration_date: reg.expiration_date
        ? new Date(reg.expiration_date)
        : null,
    }));

    return formatted;
  } catch (error) {
    console.error("Error in getVehiclesExpiredRegistration:", error);
    return [];
  }
}

async function getVehicleRegistrations() {
  try {
    const response = await axios.get(`/api/registration/vehicle`);
    const regRecords = response.data?.data || response.data || [];

    const formatted = regRecords.map((reg) => ({
      ...reg,
      registration_date: reg.registration_date
        ? new Date(reg.registration_date)
        : null,
      expiration_date: reg.expiration_date
        ? new Date(reg.expiration_date)
        : null,
    }));

    return formatted;
  } catch (error) {
    console.error("Error in getVehiclesExpiredRegistration:", error);
    return [];
  }
}

async function getAllVehicles() {
  try {
    const response = await axios.get("/api/vehicle");
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Error pulling drop-down options:", error);
    return [];
  }
}

async function addRegistration(payload) {
  try {
    const response = await axios.post("/api/registration", payload);
    return response.data;
  } catch (error) {
    console.error("Error posting registration data payload:", error);
    return null;
  }
}

async function updateRegistration(payload) {
  try {
    const response = await axios.put(
      `/api/registration/${payload.vehicle_reg_id}`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.log("Error updating registration row records:", error);
    return null;
  }
}

async function deleteRegistration(id) {
  try {
    const response = await axios.delete(`/api/registration/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error invoking database row removal handler:", error);
    return null;
  }
}

export {
  getVehiclesExpiredRegistration,
  getVehicleRegistrations,
  getAllVehicles,
  addRegistration,
  updateRegistration,
  deleteRegistration,
};
