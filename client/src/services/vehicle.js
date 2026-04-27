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

export { getVehiclesByDriver, getVehiclesByViolationLocation };
