import axios from "axios";

async function addLicense(data) {
  console.log(data);
  try {
    await axios.post("/api/license", data);
  } catch (error) {
    console.log(error);
  }
}

export { addLicense };
