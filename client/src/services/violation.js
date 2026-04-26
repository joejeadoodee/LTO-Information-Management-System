import axios from "axios";

async function getViolationsByYear({ year }) {
  try {
    const {
      data: { data },
    } = await axios.get(`api/violation/by-year?year=${year}`);

    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export { getViolationsByYear };
