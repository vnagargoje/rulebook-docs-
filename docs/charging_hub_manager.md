## 1. Overview

The Hub Charging Station Manager module is responsible for managing **battery intake, charging operations, and redistribution** of batteries across the YUGO network.

This module ensures:

* Efficient handling of discharged batteries from swap stations
* Controlled charging lifecycle of batteries
* Timely distribution of charged batteries back to swap stations
* Accurate inventory tracking at the hub level

---

## 2. Authentication Flow (Hub Manager Application)

**Objective:** Secure access for hub managers.

**Flow:**

1. Manager opens the Hub Manager application
2. Enters registered mobile number
3. Receives OTP
4. Enters OTP
5. Clicks “Verify”

**Outcome:**

* On successful verification → Redirect to Dashboard
* On failure → Display error and allow retry

---

## 3. Dashboard

**Objective:** Provide access to all hub-level operations.

**Available Modules:**

* Battery Inward (from Swap Stations)
* Battery Charging & Inventory
* Battery Outward (to Swap Stations)

---

## 4. Battery Inward Flow (Receiving from Swap Station)

**Objective:** Receive discharged batteries from swap stations.

**Flow:**

1. Navigate to Battery Inward module
2. Select transport vehicle number (incoming from swap station)
3. Click “Load” or “Start Inward”
4. Scan battery QR codes one by one

**System Validation:**

* Battery is valid and registered in system
* Battery belongs to expected inventory flow

5. Click “Submit”

**Outcome:**

* Batteries are added to hub inventory
* Battery status is set to “Discharged”

---

## 5. Battery Charging Process

**Objective:** Convert discharged batteries into fully charged batteries.

**Flow:**

1. Navigate to Inventory / Charging module
2. View list of batteries
3. Identify discharged batteries
4. Update battery status:

   * Charging
   * Fully Charged

**Note:**

* Status updates may be manual or integrated with hardware systems

**Outcome:**

* Battery lifecycle progresses:

  * Discharged → Charging → Charged

---

## 6. Inventory Management (Hub Level)

**Objective:** Monitor and manage battery availability.

**Features:**

* View all batteries categorized by status:

  * Charged
  * Charging
  * Discharged
* Track:

  * Battery ID
  * Current status
  * Availability for dispatch

---

## 7. Battery Outward Flow (Sending to Swap Station)

**Objective:** Dispatch fully charged batteries to swap stations.

**Flow:**

### Step 1: Select Destination

* Select swap station (destination location)

### Step 2: Select Transport Vehicle

* Select vehicle number used for transportation

### Step 3: Start Loading

* Click “Load Battery”

### Step 4: Scan Batteries

* Scan charged battery QR codes one by one

**System Validation:**

* Battery is fully charged
* Battery is available in hub inventory

### Step 5: Submit Outward

* Click “Submit”

**Outcome:**

* Batteries are assigned to transport vehicle
* Inventory updated:

  * Hub stock decreases
  * In-transit stock increases

---

## 8. End-to-End Operational Flow (Hub Manager)

1. Manager logs into the system
2. Accesses dashboard
3. Receives batteries from swap stations:

   * Scan inward batteries
   * Add to inventory (discharged state)
4. Manages charging lifecycle:

   * Update battery status to charging and charged
5. Tracks inventory:

   * Monitor battery availability and status
6. Dispatches charged batteries:

   * Assign batteries to transport vehicles
   * Send to swap stations
7. System continuously updates:

   * Battery status
   * Inventory levels
   * Movement tracking