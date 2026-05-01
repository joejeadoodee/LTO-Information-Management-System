import axios from "axios";

async function addLicense(data) {
  try {
    await axios.post("/api/license", data);
  } catch (error) {
    console.log(error);
  }
}

async function editLicense(data) {
  try {
    await axios.put(`/api/license/${data.issue_id}`, data);
  } catch (error) {
    console.log(error);
  }
}

async function deleteLicense(id) {
  try {
    await axios.delete(`/api/license/${id}`);
  } catch (error) {
    console.log(error);
  }
}

export { addLicense, editLicense, deleteLicense };
