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

export { getVehiclesExpiredRegistration };
