import axios from "axios";

async function getVehiclesExpiredRegistration({ date }) {
  try {
    const {
      data: { data },
    } = await axios.get(`/api/vehicle/expired-registration?date=${date}`);

    const formatted = data.map((reg) => ({
      ...reg,
      registration_date: new Date(reg.registration_date), 
      expiration_date: new Date(reg.expiration_date),     
    }));

    return formatted;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Fetches the collection of existing vehicles to feed selection dropdowns
async function getAllVehicles() {
  try {
    const {
      data: { data },
    } = await axios.get("/api/vehicle"); // Target endpoint mapping to your vehicle lists
    return data || [];
  } catch (error) {
    console.log("Error pulling drop-down options:", error);
    return [];
  }
}

// Records a fresh vehicle registration log instance inside the schema
async function addRegistration(payload) {
  try {
    const { data } = await axios.post("/api/vehicle/registration", payload);
    return data;
  } catch (error) {
    console.log("Error posting registration data payload:", error);
  }
}

// Modifies an active historic log instance target by its primary auto-increment key
async function updateRegistration(payload) {
  try {
    const { data } = await axios.put(`/api/vehicle/registration/${payload.vehicle_reg_id}`, payload);
    return data;
  } catch (error) {
    console.log("Error updating registration row records:", error);
  }
}

// Drops a record row cleanly using standard route parameter patterns
async function deleteRegistration(id) {
  try {
    const { data } = await axios.delete(`/api/vehicle/registration/${id}`);
    return data;
  } catch (error) {
    console.log("Error invoking database row removal handler:", error);
  }
}

export { 
  getVehiclesExpiredRegistration, 
  getAllVehicles, 
  addRegistration, 
  updateRegistration, 
  deleteRegistration 
};