import axios from "axios";

async function getVehiclesExpiredRegistration({ date }) {
  try {
    const resReg = await axios.get(`/api/vehicle/expired-registration?date=${date}`);
    const regRecords = resReg.data?.data || [];
    const resVehicles = await axios.get("/api/vehicle");
    const vehicleRecords = resVehicles.data?.data || [];
    const formatted = regRecords.map((reg) => {
      // Find the car profile where the primary keys align perfectly
      const matchedCar = vehicleRecords.find(
        (v) => v && String(v.vehicle_id || v.id) === String(reg.vehicle_id)
      );

      return {
        ...reg,
        registration_date: reg.registration_date ? new Date(reg.registration_date) : null,
        expiration_date: reg.expiration_date ? new Date(reg.expiration_date) : null,
        plate_no: matchedCar?.plate_no || "Unknown",
        make: matchedCar?.make || matchedCar?.manufacturer || "N/A",
        model: matchedCar?.model || "N/A",
        vehicle_type: matchedCar?.vehicle_type || matchedCar?.type || "N/A",
        color: matchedCar?.color || reg.color || "N/A"
      };
    });

    return formatted;
  } catch (error) {
    console.error("Critical cross-wire mapping failed:", error);
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