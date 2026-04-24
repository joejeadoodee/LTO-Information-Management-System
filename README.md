Some notes first. Most of the content of the server are AI generated boiler plate, further testing is required. The client side front-end still needs to be done.

```
Sorry guys magulo code ko huhu chat na lang kayo if may tanong kau

Syntax Notes

function funcName({foo, bar, bazz}){}
-- Basically, if the function input is an object, object.foo, object.bar, and object.bazz are automatically accessible as variables

const {objItem} = obj;
-- If obj has an item, it is decontructed
-- Example: const obj = {objItem: "Hellow", objItem2: "not gonna be accessed"}

            const {objItem} = obj;
            console.log(objItem); // Output: Hellow

const obj = {foo: "foo", bar: "bar"}
const copy = {...obj}
-- Deconstructing all items of an object
-- Continuation of the code above:
            console.log(copy); //{foo: "foo", bar: "bar"}

// Continuation from code above
const objCopyWithDifferentFoo = {...obj, foo: "changedFoo"}
-- Equivalent to:
            objCopyWithDifferentFoo = {...obj}
            objCopyWithDifferentFoo.foo = "changedFoo"

const newArray = array.map((arrayItem) => returnValue);
-- Loops through each values of an array and creates a new array of the return values

```

# Requirements for testing

1. Nodejs/ npm
2. EchoAPI VS Code Extension

First, clone the repository

    git clone https://github.com/joejeadoodee/LTO-Information-Management-System.git
    cd LTO-Information-Management-System

# HOW TO RUN FRONT END

    cd client
    npm install
    npm run dev

leave the terminal running, then open [localhost:5173](http://localhost:5173) on any browser

to access backend from frontend, axios was used. See client/src/services/drivers.js. [Axios API Docs](https://axios-http.com/docs/api_intro)

# HOW TO RUN BACKEND

From the base folder, login to mariadb as root, run the setup file, and open the lto database.

    mariadb -uroot -p<your password> < server-setup.sql
    mariadb -ultoadmin -p1234 lto

While the database is running, open another terminal. From the base folder, cd into server folder and create a .env file.

    cd server
    touch .env

Open the .env file, and copy paste the contents of .env from our [googledoc](https://docs.google.com/document/d/1wTY-sH54kdFzBtOOGXVgrUBhvm2t0pgBeNCptt6Q4Vs/edit?usp=sharing)

While still in the server folder, install the dependencies, and run the database.

    npm install
    npm run dev

Make sure that both the mariadb instance and server instance are both active. You can now reaccess [localhost:5173](http://localhost:5173) and see the data displayed.

### For API Testing

Now, open EchoAPI from vscode, or any API Tester.

1. Click HTTP1/2 Request
2. Select the correct http method
3. Type in the URL to be tested. _http://localhost:5000/api_ is our base URL
4. Observe the server responses

### Additional notes

For requests requiring a body, in EchoAPI, click _Body > raw > JSON_ then type in the body for the request.

---

## 1. Driver Routes `/api/driver`

### GET `/api/driver`

Fetch all drivers.

- **Method:** GET
- **URL:** `http://localhost:5000/api/driver`
- **Body:** none
- **Expected:** `200 { success: true, data: [...] }`

---

### POST `/api/driver`

Create a new driver.

- **Method:** POST
- **URL:** `http://localhost:5000/api/driver`
- **Body (JSON):**

```json
{
  "license_number": "LIC-00001",
  "full_name": "Juan Dela Cruz",
  "date_of_birth": "1990-05-15",
  "sex": "M",
  "address": "123 Rizal St, Manila"
}
```

- **Expected:** `201 { success: true, msg: "Driver created", driver_id: 1 }`
- **Error cases:**
  - Missing required fields → `400`
  - Duplicate `license_number` → `500` (MySQL unique constraint)

---

### GET `/api/driver/:id`

Fetch a single driver by ID.

- **Method:** GET
- **URL:** `http://localhost:5000/api/driver/1`
- **Body:** none
- **Expected:** `200 { success: true, data: { ... } }`
- **Error:** ID not found → `404`

---

### PUT `/api/driver/:id`

Update a driver.

- **Method:** PUT
- **URL:** `http://localhost:5000/api/driver/1`
- **Body (JSON):**

```json
{
  "license_number": "LIC-00001",
  "full_name": "Juan Dela Cruz Updated",
  "date_of_birth": "1990-05-15",
  "sex": "M",
  "address": "456 Mabini St, Quezon City"
}
```

- **Expected:** `200 { success: true, msg: "Driver updated" }`
- **Error:** ID not found → `404`

---

### DELETE `/api/driver/:id`

Delete a driver.

- **Method:** DELETE
- **URL:** `http://localhost:5000/api/driver/1`
- **Body:** none
- **Expected:** `200 { success: true, msg: "Driver 1 deleted" }`
- **Error:** ID not found → `404`

---

### GET `/api/driver/filter`

Filter drivers by license type, status, sex, and/or age range. All query params are optional.

- **Method:** GET
- **URL:** `http://localhost:5000/api/driver/filter`
- **Query Params:**
  | Param | Values | Example |
  |-------|--------|---------|
  | `license_type` | `Student Permit`, `Non-Professional`, `Professional` | `Professional` |
  | `license_status` | `Valid`, `Expired`, `Suspended`, `Revoked` | `Valid` |
  | `sex` | `M`, `F` | `M` |
  | `age_min` | number | `20` |
  | `age_max` | number | `40` |

- **Example URL:** `http://localhost:5000/api/driver/filter?license_type=Professional&license_status=Valid&sex=M&age_min=20&age_max=40`
- **Expected:** `200 { success: true, data: [...] }`

---

### GET `/api/driver/expired-suspended`

Fetch all drivers with expired or suspended licenses.

- **Method:** GET
- **URL:** `http://localhost:5000/api/driver/expired-suspended`
- **Body:** none
- **Expected:** `200 { success: true, data: [...] }`

---

### GET `/api/driver/:id/violations`

Fetch all violations by a specific driver within a date range.

- **Method:** GET
- **URL:** `http://localhost:5000/api/driver/1/violations`
- **Query Params:**
  | Param | Format | Example |
  |-------|--------|---------|
  | `date_from` | `YYYY-MM-DD` | `2025-01-01` |
  | `date_to` | `YYYY-MM-DD` | `2025-12-31` |

- **Example URL:** `http://localhost:5000/api/driver/1/violations?date_from=2025-01-01&date_to=2025-12-31`
- **Expected:** `200 { success: true, data: [...] }`
- **Error:** Missing date params → `400`, driver not found → `404`

---

## 2. License Routes `/api/license`

### GET `/api/license`

Fetch all licenses.

- **Method:** GET
- **URL:** `http://localhost:5000/api/license`
- **Expected:** `200 { success: true, data: [...] }`

---

### POST `/api/license`

Create a new license.

- **Method:** POST
- **URL:** `http://localhost:5000/api/license`
- **Body (JSON):**

```json
{
  "license_issuance_date": "2023-01-01",
  "license_expiration_date": "2026-01-01",
  "license_status": "Valid",
  "license_type": "Professional",
  "driver_id": 1
}
```

- **Expected:** `201 { success: true, msg: "License created", issue_id: 1 }`
- **Notes:**
  - `license_status` defaults to `Valid` if omitted
  - `expiration_date` must be after `issuance_date` (DB constraint)
  - `driver_id` must exist in the `driver` table

---

### GET `/api/license/:id`

Fetch a single license.

- **Method:** GET
- **URL:** `http://localhost:5000/api/license/1`
- **Expected:** `200 { success: true, data: { ... } }`
- **Error:** ID not found → `404`

---

### PUT `/api/license/:id`

Update a license.

- **Method:** PUT
- **URL:** `http://localhost:5000/api/license/1`
- **Body (JSON):**

```json
{
  "license_issuance_date": "2023-01-01",
  "license_expiration_date": "2027-01-01",
  "license_status": "Expired",
  "license_type": "Non-Professional",
  "driver_id": 1
}
```

- **Expected:** `200 { success: true, msg: "License updated" }`

---

### DELETE `/api/license/:id`

Delete a license.

- **Method:** DELETE
- **URL:** `http://localhost:5000/api/license/1`
- **Expected:** `200 { success: true, msg: "License 1 deleted" }`

---

## 3. Traffic Violation Routes `/api/violation`

### GET `/api/violation`

Fetch all violations.

- **Method:** GET
- **URL:** `http://localhost:5000/api/violation`
- **Expected:** `200 { success: true, data: [...] }`

---

### POST `/api/violation`

Create a new violation.

- **Method:** POST
- **URL:** `http://localhost:5000/api/violation`
- **Body (JSON):**

```json
{
  "violation_type": "Reckless Driving",
  "violation_date_time": "2025-06-15 10:30:00",
  "location": "EDSA, Manila",
  "fine_amount": 2000.0,
  "violation_status": "unpaid",
  "officer_name": "Officer Santos",
  "driver_id": 1,
  "vehicle_id": 1
}
```

- **Expected:** `201 { success: true, msg: "Violation created", violation_id: 1 }`
- **Notes:**
  - `violation_status` defaults to `unpaid` if omitted
  - `vehicle_id` is optional (can be null)

---

### GET `/api/violation/:id`

Fetch a single violation.

- **Method:** GET
- **URL:** `http://localhost:5000/api/violation/1`
- **Expected:** `200 { success: true, data: { ... } }`

---

### PUT `/api/violation/:id`

Update a violation.

- **Method:** PUT
- **URL:** `http://localhost:5000/api/violation/1`
- **Body (JSON):**

```json
{
  "violation_type": "Reckless Driving",
  "violation_date_time": "2025-06-15 10:30:00",
  "location": "EDSA, Manila",
  "fine_amount": 2000.0,
  "violation_status": "paid",
  "officer_name": "Officer Santos",
  "driver_id": 1,
  "vehicle_id": 1
}
```

- **Expected:** `200 { success: true, msg: "Violation updated" }`

---

### DELETE `/api/violation/:id`

Delete a violation.

- **Method:** DELETE
- **URL:** `http://localhost:5000/api/violation/1`
- **Expected:** `200 { success: true, msg: "Violation 1 deleted" }`

---

### GET `/api/violation/by-year`

Get total violations grouped by type for a given year.

- **Method:** GET
- **URL:** `http://localhost:5000/api/violation/by-year`
- **Query Params:**
  | Param | Format | Example |
  |-------|--------|---------|
  | `year` | `YYYY` | `2025` |

- **Example URL:** `http://localhost:5000/api/violation/by-year?year=2025`
- **Expected:** `200 { success: true, data: [{ violation_type: "...", total_violations: 5 }, ...] }`
- **Error:** Missing `year` → `400`

---

## 4. Vehicle Routes `/api/vehicle`

### GET `/api/vehicle`

Fetch all vehicles.

- **Method:** GET
- **URL:** `http://localhost:5000/api/vehicle`
- **Expected:** `200 { success: true, data: [...] }`

---

### POST `/api/vehicle`

Create a new vehicle.

- **Method:** POST
- **URL:** `http://localhost:5000/api/vehicle`
- **Body (JSON):**

```json
{
  "plate_no": "ABC1234",
  "engine_no": "ENG-00001",
  "chassis_no": "CHS-00001",
  "vehicle_type": "Sedan",
  "make": "Toyota",
  "model": "Vios",
  "manufacture_yr": 2020,
  "color": "White",
  "driver_id": 1
}
```

- **Expected:** `201 { success: true, msg: "Vehicle created", vehicle_id: 1 }`
- **Notes:**
  - `driver_id` is optional
  - `plate_no`, `engine_no`, `chassis_no` must be unique

---

### GET `/api/vehicle/:id`

Fetch a single vehicle.

- **Method:** GET
- **URL:** `http://localhost:5000/api/vehicle/1`
- **Expected:** `200 { success: true, data: { ... } }`

---

### PUT `/api/vehicle/:id`

Update a vehicle.

- **Method:** PUT
- **URL:** `http://localhost:5000/api/vehicle/1`
- **Body (JSON):**

```json
{
  "plate_no": "ABC1234",
  "engine_no": "ENG-00001",
  "chassis_no": "CHS-00001",
  "vehicle_type": "SUV",
  "make": "Toyota",
  "model": "Fortuner",
  "manufacture_yr": 2022,
  "color": "Black",
  "driver_id": 1
}
```

- **Expected:** `200 { success: true, msg: "Vehicle updated" }`

---

### DELETE `/api/vehicle/:id`

Delete a vehicle.

- **Method:** DELETE
- **URL:** `http://localhost:5000/api/vehicle/1`
- **Expected:** `200 { success: true, msg: "Vehicle 1 deleted" }`

---

### GET `/api/vehicle/by-driver`

Fetch all vehicles owned by a driver (by name).

- **Method:** GET
- **URL:** `http://localhost:5000/api/vehicle/by-driver`
- **Query Params:**
  | Param | Example |
  |-------|---------|
  | `full_name` | `Juan Dela Cruz` |

- **Example URL:** `http://localhost:5000/api/vehicle/by-driver?full_name=Juan Dela Cruz`
- **Expected:** `200 { success: true, data: [...] }`
- **Error:** Missing `full_name` → `400`, no vehicles found → `404`

---

### GET `/api/vehicle/expired-registration`

Fetch all vehicles with expired or flagged registrations.

- **Method:** GET
- **URL:** `http://localhost:5000/api/vehicle/expired-registration`
- **Body:** none
- **Expected:** `200 { success: true, data: [...] }`

---

### GET `/api/vehicle/by-violation-location`

Fetch all vehicles involved in violations at a given location.

- **Method:** GET
- **URL:** `http://localhost:5000/api/vehicle/by-violation-location`
- **Query Params:**
  | Param | Example |
  |-------|---------|
  | `location` | `Manila` |

- **Example URL:** `http://localhost:5000/api/vehicle/by-violation-location?location=Manila`
- **Expected:** `200 { success: true, data: [...] }`
- **Error:** Missing `location` → `400`

---

## 5. Vehicle Registration Routes `/api/registration`

### GET `/api/registration`

Fetch all registrations.

- **Method:** GET
- **URL:** `http://localhost:5000/api/registration`
- **Expected:** `200 { success: true, data: [...] }`

---

### POST `/api/registration`

Create a new registration.

- **Method:** POST
- **URL:** `http://localhost:5000/api/registration`
- **Body (JSON):**

```json
{
  "registration_no": "REG-00001",
  "registration_date": "2024-01-01",
  "expiration_date": "2025-01-01",
  "registration_status": "active",
  "vehicle_id": 1
}
```

- **Expected:** `201 { success: true, msg: "Registration created", vehicle_reg_id: 1 }`
- **Notes:**
  - `registration_status` accepts: `active`, `expired`, `suspended`
  - `vehicle_id` must exist in the `vehicle` table

---

### GET `/api/registration/:id`

Fetch a single registration.

- **Method:** GET
- **URL:** `http://localhost:5000/api/registration/1`
- **Expected:** `200 { success: true, data: { ... } }`

---

### PUT `/api/registration/:id`

Update a registration.

- **Method:** PUT
- **URL:** `http://localhost:5000/api/registration/1`
- **Body (JSON):**

```json
{
  "registration_no": "REG-00001",
  "registration_date": "2024-01-01",
  "expiration_date": "2026-01-01",
  "registration_status": "active",
  "vehicle_id": 1
}
```

- **Expected:** `200 { success: true, msg: "Registration updated" }`

---

### DELETE `/api/registration/:id`

Delete a registration.

- **Method:** DELETE
- **URL:** `http://localhost:5000/api/registration/1`
- **Expected:** `200 { success: true, msg: "Registration 1 deleted" }`
