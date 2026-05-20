import axios from "axios";

async function getAllViolations() {
  try {
    // Equivalent to response.data.data (deconstructing)
    const {
      data: { data },
    } = await axios.get("/api/violation");

    // Format violation date/time to Date object
    const fixData = data.map((violation) => ({
      ...violation,
      violation_date_time: new Date(violation.violation_date_time),
    }));

    return fixData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function deleteViolation(id) {
  try {
    await axios.delete(`/api/violation/${id}`);
  } catch (error) {
    console.log(error);
  }
}

async function addViolation({
  violation_type,
  violation_date_time,
  location,
  fine_amount,
  violation_status,
  officer_name,
  driver_id,
  vehicle_id,
}) {
  try {
    const {
      data: { violation_id },
    } = await axios.post("/api/violation", {
      violation_type,
      violation_date_time,
      location,
      fine_amount,
      violation_status,
      officer_name,
      driver_id,
      vehicle_id,
    });

    return violation_id;
  } catch (error) {
    console.error("API ERROR:", error.response?.data || error.message);
    throw error;
  }
}

async function updateViolation({ violation_id, ...data }) {
  try {
    await axios.put(`/api/violation/${violation_id}`, data);
  } catch (error) {
    console.log(error);
  }
}

async function getViolationById(id) {
  try {
    const {
      data: { data },
    } = await axios.get(`/api/violation/${id}`);

    const fixData = {
      ...data,
      violation_date_time: new Date(data.violation_date_time),
    };

    return fixData;
  } catch (error) {
    console.log(error);
  }
}

async function getViolationsByYear({ year }) {
  try {
    const {
      data: { data },
    } = await axios.get(`/api/violation/by-year?year=${year}`);

    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export {
  getAllViolations,
  deleteViolation,
  addViolation,
  updateViolation,
  getViolationById,
  getViolationsByYear,
};
