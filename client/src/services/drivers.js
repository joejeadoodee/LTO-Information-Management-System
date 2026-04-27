import axios from "axios";
import { addLicense } from "./license";

async function getAllDrivers() {
  try {
    // Equivalent to response.data.data (deconstructing)
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

async function deleteDriver(id) {
  try {
    await axios.delete(`/api/driver/${id}`);
  } catch (error) {
    console.log(error);
  }
}

async function addDriver({
  license_number,
  full_name,
  date_of_birth,
  sex,
  address,
  license_status,
  license_expiration_date,
  license_issuance_date,
  license_type,
}) {
  try {
    // Fetch the driver id form new created driver
    const {
      data: { driver_id },
    } = await axios.post("/api/driver", {
      license_number,
      full_name,
      sex,
      address,
      date_of_birth,
    });

    // Use driver id as part of new license
    await addLicense({
      license_status,
      license_type,
      license_expiration_date,
      license_issuance_date,
      driver_id,
    });
  } catch (error) {
    console.log(error);
  }
}

async function updateDriver({ driver_id, ...data }) {
  try {
    await axios.put(`/api/driver/${driver_id}`, data);
  } catch (error) {
    console.log(error);
  }
}

async function getFilteredDrivers({
  license_type,
  license_status,
  sex,
  age_min,
  age_max,
}) {
  try {
    const {
      data: { data },
    } = await axios.get(
      `/api/driver/filter?license_type=${license_type ?? ""}&license_status=${license_status ?? ""}&sex=${sex ?? ""}&age_min=${age_min ?? ""}&age_max=${age_max ?? ""}`,
    );

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

async function getExpiredOrSuspendedDrivers() {
  try {
    const {
      data: { data },
    } = await axios.get(`/api/driver/expired-suspended`);

    // Format the bday, issuance, and expiration of each driver to Date object
    const fixData = data.map((driver) => ({
      ...driver,
      date_of_birth: new Date(driver.date_of_birth),
      license_issuance_date: new Date(driver.license_issuance_date),
      license_expiration_date: new Date(driver.license_expiration_date),
    }));

    return fixData;
  } catch (error) {
    console.log(error);
  }
}

async function getDriverViolations({ id, date_from, date_to }) {
  try {
    const {
      data: { data },
    } = await axios.get(
      `/api/driver/${id}/violations?date_from=${date_from}&date_to=${date_to}`,
    );

    const fixData = data.map((violation) => ({
      ...violation,
      date_of_birth: new Date(violation.date_of_birth),
      violation_date_time: new Date(violation.violation_date_time),
    }));

    return fixData;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export {
  getAllDrivers,
  deleteDriver,
  addDriver,
  updateDriver,
  getFilteredDrivers,
  getExpiredOrSuspendedDrivers,
  getDriverViolations,
};
