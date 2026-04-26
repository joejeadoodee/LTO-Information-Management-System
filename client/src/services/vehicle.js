import axios from "axios";

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

export { getVehiclesByDriver };
