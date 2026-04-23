import axios from "axios";

async function getAllDrivers() {
  try {
    // Equivalent to response.data.data
    const {
      data: { data },
    } = await axios.get("/api/driver");

    // Format the bday of each driver to Date object
    const fixData = data.map((driver) => ({
      ...driver,
      date_of_birth: new Date(driver.date_of_birth),

      // Format the issuance and expiration of each license to Date object
      license_issuances: driver.license_issuances.map((license) => ({
        ...license,
        license_issuance_date: new Date(license.license_issuance_date),
        license_expiration_date: new Date(license.license_expiration_date),
      })),
    }));

    return fixData;
  } catch (error) {
    console.log(error);
  }
}

export { getAllDrivers };
