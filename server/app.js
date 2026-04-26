import driverRoute from "./routes/driver.js";
import licenseRoute from "./routes/license.js";
import trafficViolationRoute from "./routes/trafficViolation.js";
import vehicleRoute from "./routes/vehicle.js";
import vehicleRegistrationRoute from "./routes/vehicleRegistration.js";
import express from "express";
import dotenv from "dotenv";
const app = express();
dotenv.config();

app.use(express.json());

app.use("/api/driver", driverRoute);
app.use("/api/license", licenseRoute);
app.use("/api/violation", trafficViolationRoute);
app.use("/api/vehicle", vehicleRoute);
app.use("/api/registration", vehicleRegistrationRoute);

const port = process.env.PORT;
const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
