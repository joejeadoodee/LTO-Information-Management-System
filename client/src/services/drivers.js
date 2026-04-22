import axios from "axios";

async function getAllDrivers() {
  try {
    // equivalent to response.data.data
    const {
      data: { data },
    } = await axios.get("/api/driver");

    // format the bday of each driver to Date object
    const fixData = data.map((driver) => ({
      ...driver,
      date_of_birth: new Date(driver.date_of_birth),
    }));

    return fixData;
  } catch (error) {
    console.log(error);
  }
}

export { getAllDrivers };
