import axios from "axios";

async function getVehiclesExpiredRegistration({ date }) {
  try {
    // 1. Fetch from your original, active backend endpoint path
    const response = await axios.get(`/api/vehicle/expired-registration?date=${date}`);
    
    // Unpack using the exact same structural layout your drivers system uses
    const regRecords = response.data?.data || [];

    // 2. Fetch the corresponding vehicles to link columns
    const resVehicles = await axios.get("/api/vehicle");
    const vehicleRecords = resVehicles.data?.data || [];

    // 3. Complete data join reconciliation
    const formatted = regRecords.map((reg) => {
      const matchedCar = vehicleRecords.find(
        (v) => v && String(v.vehicle_id || v.id) === String(reg.vehicle_id)
      );

      return {
        ...reg,
        registration_date: reg.registration_date ? new Date(reg.registration_date) : null,
        expiration_date: reg.expiration_date ? new Date(reg.expiration_date) : null,
        
        plate_no: matchedCar?.plate_no || "N/A",
        make: matchedCar?.make || matchedCar?.manufacturer || "N/A",
        model: matchedCar?.model || "N/A",
        vehicle_type: matchedCar?.vehicle_type || matchedCar?.type || "N/A",
        color: matchedCar?.color || reg.color || "N/A"
      };
    });

    return formatted;
  } catch (error) {
    console.error("Service layer fetch transaction crashed:", error);
    return [];
  }
}

async function getAllVehicles() {
  try {
    const response = await axios.get("/api/vehicle");
    return response.data?.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function addRegistration(payload) {
  try {
    const response = await axios.post("/api/vehicle/registration", payload);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function updateRegistration(payload) {
  try {
    const response = await axios.put(`/api/vehicle/registration/${payload.vehicle_reg_id}`, payload);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function deleteRegistration(id) {
  try {
    const response = await axios.delete(`/api/vehicle/registration/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export { 
  getVehiclesExpiredRegistration, 
  getAllVehicles, 
  addRegistration, 
  updateRegistration, 
  deleteRegistration 
};