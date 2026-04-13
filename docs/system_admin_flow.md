## 1. Admin Authentication Flow

The system begins with the admin login process.

**Flow:**

* Admin enters email and password
* System validates credentials

  * If valid → Redirect to dashboard
  * If invalid → Show error and retry

---

## 2. User and Employee Management Flow

**Objective:** Manage platform users and internal employees.

**Flow:**

1. Admin navigates to User Management
2. System displays all users in table format

**Create User Flow:**

* Click “Create New User”
* Fill form:

  * Employee type (Hub Manager / Swap Station Manager)
  * Assign station
  * Personal details (Name, Mobile, Email, Gender, DOB)
  * Address details
* Submit form → User is created

**View/Edit Flow:**

* Select a user from list
* View user details
* Edit required fields
* Save changes

**Disable User Flow:**

* Select user
* Click “Disable”
* Confirm action → User is deactivated

---

## 3. Station Management Flow

**Objective:** Manage swap and charging stations.

**Flow:**

1. Admin navigates to Station Management
2. View all stations in table format

**Create Station Flow:**

* Click “Create New Station”
* Fill form:

  * Station name
  * Address details
  * Latitude and longitude
  * Active/Inactive status
* Submit form → Station is created

**Edit Station Flow:**

* Select station
* Modify details
* Save changes

---

## 4. Plan Management Flow

**Objective:** Create and manage subscription plans.

**Flow:**

1. Admin navigates to Plans
2. View all plans

**Create Plan Flow:**

* Click “Create New Plan”
* Fill form:

  * Plan name and description
  * Validity (days)
  * KM range
  * Price and deposit
  * Active/Inactive status
* Submit form → Plan is created

**Edit Plan Flow:**

* Select plan
* Update details
* Save changes

---

## 5. Top-Up Plan Management Flow

**Objective:** Manage additional usage plans.

**Flow:**

1. Admin navigates to Top-Up Plans
2. View all top-up plans

**Create Top-Up Flow:**

* Click “Create New Top-Up Plan”
* Fill form (same structure as plan)
* Submit form

**Edit Top-Up Flow:**

* Select top-up plan
* Modify details
* Save changes

---

## 6. Vehicle Management Flow

### 6.1 Vehicle Registration

**Flow:**

1. Navigate to Vehicle Management
2. View all vehicles

**Create Vehicle Flow:**

* Click “Add New Vehicle”
* Fill details:

  * RC number, chassis number
  * Brand and model
  * GPS ID
  * Insurance expiry
* Submit form → Vehicle is registered

**Edit Flow:**

* Select vehicle
* Update details
* Save changes

---

### 6.2 Vehicle Maintenance

**Flow:**

1. Navigate to Maintenance section
2. View all maintenance records

**Create Maintenance Record:**

* Click “Add Maintenance”
* Fill:

  * Reported date
  * Vehicle selection
  * Issue description
  * Technician name
  * Expected fix date
  * Status
* Submit form

**Edit Flow:**

* Select record
* Update details
* Save changes

---

### 6.3 Inactive Vehicle Management

**Flow:**

1. Navigate to Inactive Vehicles
2. View all inactive records

**Create Record:**

* Click “Add Inactive Vehicle”
* Fill:

  * Reported date
  * Vehicle number
  * Description
  * Status
* Submit form

**Edit Flow:**

* Update record
* Save changes

---

### 6.4 Vehicle Assignment to Station

**Flow:**

1. Navigate to Vehicle Assignment
2. View assigned vehicles

**Assign Vehicle:**

* Click “Assign Vehicle”
* Select vehicle
* Select station
* Submit → Vehicle assigned

---

### 6.5 Vehicle Assignment to Customer

**Flow:**

1. Navigate to Vehicle Assignment
2. View assigned vehicles and new requests

**Assign Vehicle:**

* Click “Assign Vehicle to customer”
* view all customer details. 
* Select vehicle
* Submit → Vehicle assigned to customer 

---

## 7. Battery Management Flow

**Objective:** Manage battery inventory and allocation.

**Add Battery Flow:**

* Navigate to Battery Management
* Click “Add Battery”
* Fill:

  * Battery ID
  * Manufacturing date
  * GPS ID
  * Capacity, range, lifecycle
  * Charging time, weight
  * Warranty
  * Removable option
* Submit form

**Assign Battery to Station:**

* Select station
* Select multiple batteries
* Submit assignment

---

## 8. Vehicle Surrender Flow

**Objective:** Handle vehicle return and closure process.

**Flow:**

1. Navigate to Surrender Vehicle
2. Fill details:

* Vehicle number
* Customer ID (auto-fetched)
* Customer name
* Remarks or damage notes
* Penalty/charges (if applicable)
* Deposit return amount

3. Submit form → Vehicle surrender completed

---

# Consolidated System Flow

1. Admin logs into the system
2. Sets up stations and plans
3. Registers users and employees
4. Adds vehicles and batteries
5. Assigns vehicles and batteries to stations
6. Manages operations (maintenance, inactive vehicles)
7. Handles vehicle surrender and closure