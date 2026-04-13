# YUGO APP – COMPLETE USER FLOW (START TO BATTERY SWAP)

## 1. App Launch Flow

* User opens the application
* System loads the Home Screen

**Navigation Structure:**

* Home
* Plans
* Booking
* Help/Support

---

## 2. Plan Selection Flow

* User navigates to the Plans tab
* System displays all available plans
* User selects a preferred plan

---

## 3. Location Selection Flow

* User selects the center location (vehicle pickup point)

---

## 4. Authentication Flow

**Case A: User Already Logged In**

* System will check weather User's KYC was done or not, if not user will redirect to Profile Completion and KYC Flow. 
* Profile Completion and KYC Flow is completed User is directly redirected to the Booking Confirmation page

**Case B: User Not Logged In**

* User initiates mobile login
* Enters mobile number
* Receives OTP
* Enters OTP for verification
* On successful verification → Redirect to next step

---

## 5. Profile Completion and KYC Flow

**Case A: Profile Already Completed**

* User proceeds directly to Booking Confirmation

**Case B: Profile Incomplete**

* User completes required details:

  * Basic personal information
  * Address details
  * Document upload (Aadhaar, PAN, Driving License)
* System performs KYC verification
* On successful verification → Proceed to Booking Confirmation

---

## 6. Booking Confirmation Flow

* System displays booking summary:

  * Selected plan
  * Selected location
  * User details
* User reviews details
* Clicks “Proceed to Payment”

---

## 7. Payment Flow

**Successful Payment:**

* Booking is created
* User is redirected to Booking section
* Booking appears under “Upcoming”
* Status is marked as “Confirmed”

**Failed Payment:**

* Booking is still created
* Status is marked as “Awaiting Payment”
* Retry payment option is displayed

---

## 8. Booking Management Flow

**Sections Available:**

* Upcoming
* Completed

**Upcoming Booking Details:**

* Plan information
* Center location
* Booking status
* Unique 4-digit OTP for pickup

---

## 9. Vehicle Pickup Flow

* User visits the selected center location
* Provides OTP to admin
* Admin verifies OTP
* Admin assigns vehicle to user

---

## 10. Ride Start Flow

* Booking status changes to “Ongoing”
* Ride begins

---

## 11. Home Screen During Ride

System displays real-time ride information:

* Active booking details
* Assigned vehicle details
* Current plan details
* Battery status
* QR code (for battery swap)
* Map preview

---

## 12. Low Battery Scenario

* System detects battery level below threshold
* User is prompted to perform battery swap

---

## 13. Battery Swap Station Discovery Flow

* User opens map view
* System displays:

  * Nearby battery swap stations
  * User’s current location
* User selects a station
* Navigation to selected station begins

---

# End-to-End Flow Summary

1. User launches the app
2. Selects a plan and location
3. Logs in and completes KYC
4. Confirms booking and completes payment
5. Picks up vehicle using OTP verification
6. Ride begins and is tracked in real time
7. User monitors battery status
8. On low battery, user finds and navigates to a swap station