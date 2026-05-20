import axios from "axios";

async function getVehiclesExpiredRegistration({ date }) {
  try {
    const response = await axios.get(`/api/vehicle/expired-registration?date=${date}`);
    const regRecords = response.data?.data || [];
    const resVehicles = await axios.get("/api/vehicle");
    const vehicleRecords = resVehicles.data?.data || [];
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
    console.error("Error mapping vehicle collections:", error);
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