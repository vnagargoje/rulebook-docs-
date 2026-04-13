## 1. Overview

The Battery Swap Station Manager module is responsible for managing **battery swap operations** and **battery inventory movement** at the station level.

This module ensures:

* Seamless battery swapping for active users
* Accurate tracking of battery lifecycle and movement
* Real-time synchronization of inventory between swap stations and charging hubs

---

## 2. Authentication Flow (Station Manager Application)

**Objective:** Enable secure access for station managers.

**Flow:**

1. Manager opens the Station Manager application
2. Enters registered mobile number
3. Clicks “Send OTP”
4. Receives OTP on mobile device
5. Enters OTP
6. Clicks “Verify”

**Outcome:**

* On successful verification → Redirect to Dashboard
* On failure → Display error message and allow retry

---

## 3. Dashboard

**Objective:** Provide access to all operational modules.

**Available Modules:**

* Battery Swap
* Battery Inventory Management

---

## 4. Battery Swap Flow (Core Operation)

### 4.1 Customer Identification

**Flow:**

1. Manager selects “Battery Swap” module
2. Scans QR code from the customer application

---

### 4.2 Subscription Validation

**System Checks:**

* Booking status (must be active/ongoing)
* Subscription validity

**Outcomes:**

* If invalid:

  * Display error message
  * Terminate process
* If valid:

  * Enable “Inward” action

---

### 4.3 Inward Flow (Old Battery Collection)

**Objective:** Collect and verify the returned battery.

**Flow:**

1. Manager clicks “Inward”
2. Scans old battery QR code

**System Validation:**

* Verify that the scanned battery matches the battery assigned to the vehicle/user

**Outcomes:**

* If mismatch:

  * Display error message
* If valid:

  * Enable “Outward” action

---

### 4.4 Outward Flow (New Battery Assignment)

**Objective:** Issue a fully charged battery.

**Flow:**

1. Manager clicks “Outward”
2. Scans QR code of charged battery

**System Actions:**

* Replace old battery with new battery
* Update mapping between battery, vehicle, and user

---

### 4.5 Swap Completion

**Outcome:**

* Display “Swap Successful” confirmation
* Booking status remains “Ongoing”
* Battery mapping is updated in the system

---

## 5. Battery Inventory Management

### 5.1 Overview

This module manages battery movement between:

* **Swap Station → Charging Hub (Outward)**
* **Charging Hub → Swap Station (Inward)**

This ensures continuous availability of charged batteries at swap stations.

---

## 6. Battery Outward Flow (Swap Station to Charging Hub)

**Objective:** Transfer batteries from swap station to charging hub for charging.

**Flow:**

1. Navigate to Inventory → Battery Outward
2. Select Charging Hub location
3. Select transport vehicle number
4. Click “Load Battery”
5. Scan battery QR codes (multiple batteries supported)
6. Click “Send Outward”

**Outcome:**

* Batteries assigned to transport vehicle
* Inventory updated:

  * Swap station stock decreases
  * Vehicle stock increases

---

## 7. Battery Inward Flow (Charging Hub to Swap Station)

**Objective:** Receive charged batteries back to swap station.

**Flow:**

1. Navigate to Inventory → Battery Inward
2. Select transport vehicle number
3. Click “Load”
4. View assigned batteries or scan returned batteries
5. Scan battery QR codes individually

**System Validation:**

* Battery belongs to the selected vehicle
* Battery is valid and recognized

6. Click “Submit”

**Outcome:**

* Batteries received at swap station
* Inventory updated:

  * Vehicle stock decreases
  * Swap station stock increases

---

## 8. End-to-End Operational Flow (Station Manager)

1. Manager logs into the system
2. Accesses dashboard
3. Executes battery swap operations:

   * Scan customer QR
   * Validate subscription
   * Perform inward (old battery)
   * Perform outward (new battery)
4. Manages battery logistics:

   * Sends batteries to charging hub
   * Receives charged batteries back
5. System continuously updates:

   * Battery tracking
   * Inventory levels
   * User-vehicle-battery mapping