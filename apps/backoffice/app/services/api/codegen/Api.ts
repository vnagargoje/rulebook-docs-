/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface V1AuthSignInResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

export interface V1AuthSignInBody {
  /** @format email */
  email: string;
  password: string;
}

export interface V1AuthSendOtpResponse {
  mobilenumber: string;
  method: "sms";
  otpSent: boolean;
}

export interface V1AuthSendOtpBody {
  mobilenumber: string;
}

export interface V1AuthVerifyOtpResponse {
  verified: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export interface V1AuthVerifyOtpBody {
  mobilenumber: string;
  otp: string;
}

export interface AadhaarConnectResponse {
  sessionId: string;
  captcha: string;
}

export interface AadhaarGenerateOtpResponse {
  success: boolean;
  message: string;
}

export interface AadhaarGenerateOtpBody {
  sessionId: string;
  captcha: string;
  aadhaarNumber: string;
}

export interface AadhaarVerifyOtpResponse {
  success: boolean;
  message: string;
}

export interface AadhaarVerifyOtpBody {
  sessionId: string;
  otp: string;
  aadhaarNumber: string;
}

export interface AadhaarReloadCaptchaResponse {
  captcha: string;
}

export interface PanVerifyResponse {
  success: boolean;
  message: string;
}

export interface PanVerifyBody {
  pan: string;
}

export interface LicenseInitiateResponse {
  requestId: string;
}

export interface LicenseInitiateBody {
  dlNumber: string;
  dateOfBirth: string;
}

export interface LicenseGetResultResponse {
  success: boolean;
  message: string;
}

export interface KycGetStatusResponse {
  aadhaar: {
    id: string;
    documentId: string;
    type: string;
    status: string;
    verifiedAt: string | null;
    notes: string | null;
  } | null;
  pan: {
    id: string;
    documentId: string;
    type: string;
    status: string;
    verifiedAt: string | null;
    notes: string | null;
  } | null;
  license: {
    id: string;
    documentId: string;
    type: string;
    status: string;
    verifiedAt: string | null;
    notes: string | null;
  } | null;
}

export interface V1StatesListManyStatesResponse {
  data: {
    id: string;
    code: string;
    name: string;
    latitude: number;
    longitude: number;
  }[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, "ASC" | "DESC"][];
    searchBy: string[];
    search: string;
    filter?: object;
  };
  links: {
    first?: string;
    last?: string;
    current: string;
    previous?: string;
    next?: string;
  };
}

export interface V1CitiesListManyCitiesResponse {
  data: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, "ASC" | "DESC"][];
    searchBy: string[];
    search: string;
    filter?: object;
  };
  links: {
    first?: string;
    last?: string;
    current: string;
    previous?: string;
    next?: string;
  };
}

export interface V1UsersGetManyUsersResponse {
  data: {
    id: string;
    /** @format email */
    email?: string;
    mobilenumber?: string;
    firstName?: string;
    lastName?: string;
    gender?: "male" | "female" | "other";
    properties?: any;
    /** @format date */
    dateOfBirth?: string;
    roles?: {
      name: string;
    }[];
    addresses?: {
      id: string;
      lineOne: string;
      lineTwo?: string;
      pincode: string;
      city?: {
        id: string;
        name: string;
        state?: {
          id: string;
          name: string;
          code: string;
        };
      };
      type?: "current" | "permanent";
    }[];
    stationId?: string;
  }[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, "ASC" | "DESC"][];
    searchBy: string[];
    search: string;
    filter?: object;
  };
  links: {
    first?: string;
    last?: string;
    current: string;
    previous?: string;
    next?: string;
  };
}

export interface V1UsersCreateOneUserResponse {
  id: string;
  /** @format email */
  email?: string;
  mobilenumber?: string;
  firstName?: string;
  lastName?: string;
  gender?: "male" | "female" | "other";
  properties?: any;
  /** @format date */
  dateOfBirth?: string;
  roles?: {
    name: string;
  }[];
  addresses?: {
    id: string;
    lineOne: string;
    lineTwo?: string;
    pincode: string;
    city?: {
      id: string;
      name: string;
      state?: {
        id: string;
        name: string;
        code: string;
      };
    };
    type?: "current" | "permanent";
  }[];
  stationId?: string;
}

export interface V1UsersCreateOneUserBody {
  /** @format email */
  email?: string;
  mobilenumber: string;
  firstName?: string;
  lastName?: string;
  gender?: "male" | "female" | "other";
  role?:
    | "customer"
    | "swap_manager"
    | "hub_manager"
    | "system_admin"
    | "system_user";
  properties?: any;
  /** @format date */
  dateOfBirth?: string;
  address?: {
    lineOne: string;
    lineTwo?: string;
    pincode: string;
    cityId?: string;
  };
  stationId?: string;
}

export interface V1UsersGetOneUserResponse {
  id: string;
  /** @format email */
  email?: string;
  mobilenumber?: string;
  firstName?: string;
  lastName?: string;
  gender?: "male" | "female" | "other";
  properties?: any;
  /** @format date */
  dateOfBirth?: string;
  roles?: {
    name: string;
  }[];
  addresses?: {
    id: string;
    lineOne: string;
    lineTwo?: string;
    pincode: string;
    city?: {
      id: string;
      name: string;
      state?: {
        id: string;
        name: string;
        code: string;
      };
    };
    type?: "current" | "permanent";
  }[];
  stationId?: string;
}

export interface V1UsersPatchOneUserResponse {
  id: string;
  /** @format email */
  email?: string;
  mobilenumber?: string;
  firstName?: string;
  lastName?: string;
  gender?: "male" | "female" | "other";
  properties?: any;
  /** @format date */
  dateOfBirth?: string;
  roles?: {
    name: string;
  }[];
  addresses?: {
    id: string;
    lineOne: string;
    lineTwo?: string;
    pincode: string;
    city?: {
      id: string;
      name: string;
      state?: {
        id: string;
        name: string;
        code: string;
      };
    };
    type?: "current" | "permanent";
  }[];
  stationId?: string;
}

export interface V1UsersPatchOneUserBody {
  /** @format email */
  email?: string;
  mobilenumber?: string;
  firstName?: string;
  lastName?: string;
  gender?: "male" | "female" | "other";
  role?:
    | "customer"
    | "swap_manager"
    | "hub_manager"
    | "system_admin"
    | "system_user";
  properties?: any;
  /** @format date */
  dateOfBirth?: string;
  address?: {
    lineOne: string;
    lineTwo?: string;
    pincode: string;
    cityId?: string;
  };
  stationId?: string;
}

export interface V1UsersUpdateAddressesResponse {
  id: string;
  /** @format email */
  email?: string;
  mobilenumber?: string;
  firstName?: string;
  lastName?: string;
  gender?: "male" | "female" | "other";
  properties?: any;
  /** @format date */
  dateOfBirth?: string;
  roles?: {
    name: string;
  }[];
  addresses?: {
    id: string;
    lineOne: string;
    lineTwo?: string;
    pincode: string;
    city?: {
      id: string;
      name: string;
      state?: {
        id: string;
        name: string;
        code: string;
      };
    };
    type?: "current" | "permanent";
  }[];
  stationId?: string;
}

export interface V1UsersUpdateAddressesBody {
  current?: {
    lineOne: string;
    lineTwo?: string;
    pincode: string;
    cityId?: string;
  };
  permanent?: {
    lineOne: string;
    lineTwo?: string;
    pincode: string;
    cityId?: string;
  };
}

export interface V1PlansGetPlansResponse {
  data: {
    id: string;
    name: string;
    description: string | null;
    validityDays: number;
    kmLimit: number;
    price: number;
    deposit: number;
    gst: number;
    registrationFee: number;
    totalAmount: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, "ASC" | "DESC"][];
    searchBy: string[];
    search: string;
    filter?: object;
  };
  links: {
    first?: string;
    last?: string;
    current: string;
    previous?: string;
    next?: string;
  };
}

export interface V1PlansGetPlanByIdResponse {
  id: string;
  name: string;
  description: string | null;
  validityDays: number;
  kmLimit: number;
  price: number;
  deposit: number;
  gst: number;
  registrationFee: number;
  totalAmount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface V1PlansAdminCreatePlanResponse {
  id: string;
  name: string;
  description: string | null;
  validityDays: number;
  kmLimit: number;
  price: number;
  deposit: number;
  gst: number;
  registrationFee: number;
  totalAmount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface V1PlansAdminCreatePlanBody {
  name: string;
  description?: string;
  validityDays: number;
  kmLimit: number;
  price: number;
  deposit: number;
  gst: number;
  registrationFee?: number;
  active?: boolean;
}

export interface V1PlansAdminUpdatePlanResponse {
  id: string;
  name: string;
  description: string | null;
  validityDays: number;
  kmLimit: number;
  price: number;
  deposit: number;
  gst: number;
  registrationFee: number;
  totalAmount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface V1PlansAdminUpdatePlanBody {
  name?: string;
  description?: string;
  validityDays?: number;
  kmLimit?: number;
  price?: number;
  deposit?: number;
  gst?: number;
  registrationFee?: number;
  active?: boolean;
}

export interface V1TopUpsGetTopUpsResponse {
  data: {
    id: string;
    name: string;
    description: string | null;
    validityDays: number;
    kmLimit: number;
    price: number;
    gst: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, "ASC" | "DESC"][];
    searchBy: string[];
    search: string;
    filter?: object;
  };
  links: {
    first?: string;
    last?: string;
    current: string;
    previous?: string;
    next?: string;
  };
}

export interface V1TopUpsGetTopUpByIdResponse {
  id: string;
  name: string;
  description: string | null;
  validityDays: number;
  kmLimit: number;
  price: number;
  gst: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface V1TopUpsAdminCreateTopUpResponse {
  id: string;
  name: string;
  description: string | null;
  validityDays: number;
  kmLimit: number;
  price: number;
  gst: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface V1TopUpsAdminCreateTopUpBody {
  name: string;
  description?: string;
  validityDays: number;
  kmLimit: number;
  price: number;
  gst: number;
  active?: boolean;
}

export interface V1TopUpsAdminUpdateTopUpResponse {
  id: string;
  name: string;
  description: string | null;
  validityDays: number;
  kmLimit: number;
  price: number;
  gst: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface V1TopUpsAdminUpdateTopUpBody {
  name?: string;
  description?: string;
  validityDays?: number;
  kmLimit?: number;
  price?: number;
  gst?: number;
  active?: boolean;
}

export interface V1UserPlansGetMyPlansResponse {
  data: {
    id: string;
    userId: string;
    planId: string;
    planSnapshot: any;
    status: string;
    startsAt: string | null;
    expiresAt: string | null;
    remainingKm: number;
    totalKm: number;
    qrCodeId: string | null;
    qrCode?: {
      id: string;
      path: string;
    };
    createdAt: string;
    updatedAt: string;
    topUps?: {
      id: string;
      topUpId: string;
      topUpSnapshot: any;
      status: string;
      appliedAt: string | null;
    }[];
  }[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, "ASC" | "DESC"][];
    searchBy: string[];
    search: string;
    filter?: object;
  };
  links: {
    first?: string;
    last?: string;
    current: string;
    previous?: string;
    next?: string;
  };
}

export interface V1UserPlansGetMyPlanByIdResponse {
  id: string;
  userId: string;
  planId: string;
  planSnapshot: any;
  status: string;
  startsAt: string | null;
  expiresAt: string | null;
  remainingKm: number;
  totalKm: number;
  qrCodeId: string | null;
  qrCode?: {
    id: string;
    path: string;
  };
  createdAt: string;
  updatedAt: string;
  topUps?: {
    id: string;
    topUpId: string;
    topUpSnapshot: any;
    status: string;
    appliedAt: string | null;
  }[];
}

export interface V1UserPlansPurchasePlanResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  key: string;
  userPlanId: string;
}

export interface V1UserPlansPurchasePlanBody {
  planId: string;
}

export interface V1UserPlansVerifyPaymentResponse {
  id: string;
  userId: string;
  planId: string;
  planSnapshot: any;
  status: string;
  startsAt: string | null;
  expiresAt: string | null;
  remainingKm: number;
  totalKm: number;
  qrCodeId: string | null;
  qrCode?: {
    id: string;
    path: string;
  };
  createdAt: string;
  updatedAt: string;
  topUps?: {
    id: string;
    topUpId: string;
    topUpSnapshot: any;
    status: string;
    appliedAt: string | null;
  }[];
}

export interface V1UserPlansVerifyPaymentBody {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface V1UserPlansApplyTopUpResponse {
  id: string;
  userId: string;
  planId: string;
  planSnapshot: any;
  status: string;
  startsAt: string | null;
  expiresAt: string | null;
  remainingKm: number;
  totalKm: number;
  qrCodeId: string | null;
  qrCode?: {
    id: string;
    path: string;
  };
  createdAt: string;
  updatedAt: string;
  topUps?: {
    id: string;
    topUpId: string;
    topUpSnapshot: any;
    status: string;
    appliedAt: string | null;
  }[];
}

export interface V1UserPlansApplyTopUpBody {
  topUpId: string;
  userPlanId: string;
}

export interface V1UserPlansPurchaseTopUpResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  key: string;
  userPlanId: string;
}

export interface V1UserPlansPurchaseTopUpBody {
  topUpId: string;
  userPlanId: string;
}

export interface V1UserPlansVerifyTopUpPaymentResponse {
  id: string;
  userId: string;
  planId: string;
  planSnapshot: any;
  status: string;
  startsAt: string | null;
  expiresAt: string | null;
  remainingKm: number;
  totalKm: number;
  qrCodeId: string | null;
  qrCode?: {
    id: string;
    path: string;
  };
  createdAt: string;
  updatedAt: string;
  topUps?: {
    id: string;
    topUpId: string;
    topUpSnapshot: any;
    status: string;
    appliedAt: string | null;
  }[];
}

export interface V1UserPlansVerifyTopUpPaymentBody {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  topUpId: string;
  userPlanId: string;
}

export interface V1UserPlansScanQrResponse {
  userPlan: {
    id: string;
    status: string;
    planSnapshot: any;
    remainingKm: number;
    startsAt: string | null;
    expiresAt: string | null;
    qrCodeUrl: string | null;
  };
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    mobilenumber: string | null;
    email: string | null;
  } | null;
  plan: {
    id: string;
    name: string;
  } | null;
  booking: {
    id: string;
    status: string;
    stationId: string;
    vehicleId: string | null;
    batteryId: string | null;
    pickupOtp: string;
    startedAt: string | null;
    completedAt: string | null;
  } | null;
}

export interface V1BookingsGetAllBookingsResponse {
  data: {
    id: string;
    userPlanId: string;
    userPlan: {
      id: string;
      userId: string;
      planId: string;
      status: string;
      planSnapshot: any;
      startsAt: string | null;
      expiresAt: string | null;
      remainingKm: number;
      totalKm: number;
      qrCodeId: string | null;
      createdAt: string;
      updatedAt: string;
      user?: {
        id: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        mobilenumber?: string;
      };
      plan?: {
        id: string;
        name: string;
        description?: string;
        validityDays: number;
        kmLimit: number;
        price: number;
        deposit: number;
        gst?: number;
        registrationFee?: number;
        totalAmount: number;
      };
      qrCode?: {
        id: string;
        filename?: string;
        path: string;
        mimeType?: string;
      };
      topUps?: {
        id: string;
        topUpId: string;
        topUpSnapshot: any;
        status: string;
        appliedAt: string | null;
      }[];
    };
    stationId?: string;
    station?: {
      id: string;
      name: string;
      type: string;
      latitude?: number;
      longitude?: number;
      active: boolean;
    };
    vehicleId?: string;
    vehicle?: {
      id: string;
      vehicleNumber?: string;
      rcNumber?: string;
      chassisNumber?: string;
    };
    batteryId?: string;
    battery?: {
      id: string;
      batteryQrId: string;
    };
    status: string;
    pickupOtp: string;
    createdAt: string;
    updatedAt: string;
  }[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, "ASC" | "DESC"][];
    searchBy: string[];
    search: string;
    filter?: object;
  };
  links: {
    first?: string;
    last?: string;
    current: string;
    previous?: string;
    next?: string;
  };
}

export interface V1BookingsGetBookingByIdResponse {
  id: string;
  userPlanId: string;
  userPlan: {
    id: string;
    userId: string;
    planId: string;
    status: string;
    planSnapshot: any;
    startsAt: string | null;
    expiresAt: string | null;
    remainingKm: number;
    totalKm: number;
    qrCodeId: string | null;
    createdAt: string;
    updatedAt: string;
    user?: {
      id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      mobilenumber?: string;
    };
    plan?: {
      id: string;
      name: string;
      description?: string;
      validityDays: number;
      kmLimit: number;
      price: number;
      deposit: number;
      gst?: number;
      registrationFee?: number;
      totalAmount: number;
    };
    qrCode?: {
      id: string;
      filename?: string;
      path: string;
      mimeType?: string;
    };
    topUps?: {
      id: string;
      topUpId: string;
      topUpSnapshot: any;
      status: string;
      appliedAt: string | null;
    }[];
  };
  stationId?: string;
  station?: {
    id: string;
    name: string;
    type: string;
    latitude?: number;
    longitude?: number;
    active: boolean;
  };
  vehicleId?: string;
  vehicle?: {
    id: string;
    vehicleNumber?: string;
    rcNumber?: string;
    chassisNumber?: string;
  };
  batteryId?: string;
  battery?: {
    id: string;
    batteryQrId: string;
  };
  status: string;
  pickupOtp: string;
  createdAt: string;
  updatedAt: string;
}

export interface V1BookingsAdminAssignVehicleResponse {
  id: string;
  userPlanId: string;
  userPlan: {
    id: string;
    userId: string;
    planId: string;
    status: string;
    planSnapshot: any;
    startsAt: string | null;
    expiresAt: string | null;
    remainingKm: number;
    totalKm: number;
    qrCodeId: string | null;
    createdAt: string;
    updatedAt: string;
    user?: {
      id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      mobilenumber?: string;
    };
    plan?: {
      id: string;
      name: string;
      description?: string;
      validityDays: number;
      kmLimit: number;
      price: number;
      deposit: number;
      gst?: number;
      registrationFee?: number;
      totalAmount: number;
    };
    qrCode?: {
      id: string;
      filename?: string;
      path: string;
      mimeType?: string;
    };
    topUps?: {
      id: string;
      topUpId: string;
      topUpSnapshot: any;
      status: string;
      appliedAt: string | null;
    }[];
  };
  stationId?: string;
  station?: {
    id: string;
    name: string;
    type: string;
    latitude?: number;
    longitude?: number;
    active: boolean;
  };
  vehicleId?: string;
  vehicle?: {
    id: string;
    vehicleNumber?: string;
    rcNumber?: string;
    chassisNumber?: string;
  };
  batteryId?: string;
  battery?: {
    id: string;
    batteryQrId: string;
  };
  status: string;
  pickupOtp: string;
  createdAt: string;
  updatedAt: string;
}

export interface V1BookingsAdminAssignVehicleBody {
  vehicleId: string;
  batteryId: string;
  /**
   * @minLength 4
   * @maxLength 4
   */
  otp: string;
}

export interface V1StationsGetManyStationsResponse {
  data: {
    id: string;
    type: "swap_station" | "hub_station";
    name: string;
    longitude?: number;
    latitude?: number;
    active: boolean;
    address?: {
      id: string;
      lineOne: string;
      lineTwo?: string;
      pincode: string;
      city?: {
        id: string;
        name: string;
        state?: {
          id: string;
          name: string;
          code: string;
        };
      };
    };
    managers?: {
      id: string;
      /** @format email */
      email?: string;
      mobilenumber?: string;
      firstName?: string;
      lastName?: string;
    }[];
  }[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, "ASC" | "DESC"][];
    searchBy: string[];
    search: string;
    filter?: object;
  };
  links: {
    first?: string;
    last?: string;
    current: string;
    previous?: string;
    next?: string;
  };
}

export interface V1StationsCreateOneStationResponse {
  id: string;
  type: "swap_station" | "hub_station";
  name: string;
  longitude?: number;
  latitude?: number;
  active: boolean;
  address?: {
    id: string;
    lineOne: string;
    lineTwo?: string;
    pincode: string;
    city?: {
      id: string;
      name: string;
      state?: {
        id: string;
        name: string;
        code: string;
      };
    };
  };
  managers?: {
    id: string;
    /** @format email */
    email?: string;
    mobilenumber?: string;
    firstName?: string;
    lastName?: string;
  }[];
}

export interface V1StationsCreateOneStationBody {
  type: "swap_station" | "hub_station";
  name: string;
  longitude?: number;
  latitude?: number;
  /** @default true */
  active: boolean;
  address?: {
    lineOne: string;
    lineTwo?: string;
    pincode: string;
    cityId?: string;
  };
  managerId?: string;
}

export interface V1StationsGetOneStationResponse {
  id: string;
  type: "swap_station" | "hub_station";
  name: string;
  longitude?: number;
  latitude?: number;
  active: boolean;
  address?: {
    id: string;
    lineOne: string;
    lineTwo?: string;
    pincode: string;
    city?: {
      id: string;
      name: string;
      state?: {
        id: string;
        name: string;
        code: string;
      };
    };
  };
  managers?: {
    id: string;
    /** @format email */
    email?: string;
    mobilenumber?: string;
    firstName?: string;
    lastName?: string;
  }[];
}

export interface V1StationsUpdateOneStationResponse {
  id: string;
  type: "swap_station" | "hub_station";
  name: string;
  longitude?: number;
  latitude?: number;
  active: boolean;
  address?: {
    id: string;
    lineOne: string;
    lineTwo?: string;
    pincode: string;
    city?: {
      id: string;
      name: string;
      state?: {
        id: string;
        name: string;
        code: string;
      };
    };
  };
  managers?: {
    id: string;
    /** @format email */
    email?: string;
    mobilenumber?: string;
    firstName?: string;
    lastName?: string;
  }[];
}

export interface V1StationsUpdateOneStationBody {
  type: "swap_station" | "hub_station";
  name: string;
  longitude?: number;
  latitude?: number;
  /** @default true */
  active: boolean;
  address?: {
    lineOne: string;
    lineTwo?: string;
    pincode: string;
    cityId?: string;
  };
  managerId?: string;
}

export interface V1VehiclesGetManyVehiclesResponse {
  data: {
    id: string;
    type?: string;
    vehicleNumber?: string;
    rcNumber?: string;
    chassisNumber?: string;
    gpsId?: string;
    properties?: {
      brand?: string;
      model?: string;
      insuranceExpiry?: string;
    };
    stationId?: string;
    station?: {
      id: string;
      name?: string;
      type?: string;
    };
    status: "in_use" | "available" | "unavailable";
    createdAt?: string;
    updatedAt?: string;
  }[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, "ASC" | "DESC"][];
    searchBy: string[];
    search: string;
    filter?: object;
  };
  links: {
    first?: string;
    last?: string;
    current: string;
    previous?: string;
    next?: string;
  };
}

export interface V1VehiclesCreateOneVehicleResponse {
  id: string;
  type?: string;
  vehicleNumber?: string;
  rcNumber?: string;
  chassisNumber?: string;
  gpsId?: string;
  properties?: {
    brand?: string;
    model?: string;
    insuranceExpiry?: string;
  };
  stationId?: string;
  station?: {
    id: string;
    name?: string;
    type?: string;
  };
  status: "in_use" | "available" | "unavailable";
  createdAt?: string;
  updatedAt?: string;
}

export interface V1VehiclesCreateOneVehicleBody {
  type?: "rental" | "transport";
  vehicleNumber?: string;
  rcNumber?: string;
  chassisNumber?: string;
  gpsId?: string;
  properties?: {
    brand?: string;
    model?: string;
    insuranceExpiry?: string;
  };
  stationId?: string;
  /** @default "available" */
  status: "in_use" | "available" | "unavailable";
}

export interface V1VehiclesGetOneVehicleResponse {
  id: string;
  type?: string;
  vehicleNumber?: string;
  rcNumber?: string;
  chassisNumber?: string;
  gpsId?: string;
  properties?: {
    brand?: string;
    model?: string;
    insuranceExpiry?: string;
  };
  stationId?: string;
  station?: {
    id: string;
    name?: string;
    type?: string;
  };
  status: "in_use" | "available" | "unavailable";
  createdAt?: string;
  updatedAt?: string;
}

export interface V1VehiclesUpdateOneVehicleResponse {
  id: string;
  type?: string;
  vehicleNumber?: string;
  rcNumber?: string;
  chassisNumber?: string;
  gpsId?: string;
  properties?: {
    brand?: string;
    model?: string;
    insuranceExpiry?: string;
  };
  stationId?: string;
  station?: {
    id: string;
    name?: string;
    type?: string;
  };
  status: "in_use" | "available" | "unavailable";
  createdAt?: string;
  updatedAt?: string;
}

export interface V1VehiclesUpdateOneVehicleBody {
  type?: "rental" | "transport";
  vehicleNumber?: string;
  rcNumber?: string;
  chassisNumber?: string;
  gpsId?: string;
  properties?: {
    brand?: string;
    model?: string;
    insuranceExpiry?: string;
  };
  stationId?: string;
  /** @default "available" */
  status?: "in_use" | "available" | "unavailable";
}

export interface V1BatteriesGetManyBatteriesResponse {
  data: {
    id: string;
    batteryQrId: string;
    status:
      | "available"
      | "charged"
      | "charging"
      | "drained"
      | "in_transit"
      | "in_use";
    gpsId?: string;
    properties?: {
      mfgDate?: string;
      capacity?: string;
      range?: string;
      lifecycle?: string;
      chargingTime?: string;
      weight?: string;
      warranty?: string;
      removableOption?: boolean;
    };
    stationId?: string;
    station?: {
      id: string;
      name?: string;
      type?: string;
    };
    qrCode?: {
      id: string;
      path: string;
    };
    createdAt?: string;
    updatedAt?: string;
  }[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, "ASC" | "DESC"][];
    searchBy: string[];
    search: string;
    filter?: object;
  };
  links: {
    first?: string;
    last?: string;
    current: string;
    previous?: string;
    next?: string;
  };
}

export interface V1BatteriesCreateOneBatteryResponse {
  id: string;
  batteryQrId: string;
  status:
    | "available"
    | "charged"
    | "charging"
    | "drained"
    | "in_transit"
    | "in_use";
  gpsId?: string;
  properties?: {
    mfgDate?: string;
    capacity?: string;
    range?: string;
    lifecycle?: string;
    chargingTime?: string;
    weight?: string;
    warranty?: string;
    removableOption?: boolean;
  };
  stationId?: string;
  station?: {
    id: string;
    name?: string;
    type?: string;
  };
  qrCode?: {
    id: string;
    path: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface V1BatteriesCreateOneBatteryBody {
  batteryQrId: string;
  gpsId?: string;
  properties?: {
    mfgDate?: string;
    capacity?: string;
    range?: string;
    lifecycle?: string;
    chargingTime?: string;
    weight?: string;
    warranty?: string;
    removableOption?: boolean;
  };
  stationId?: string;
}

export interface V1BatteriesGetOneBatteryResponse {
  id: string;
  batteryQrId: string;
  status:
    | "available"
    | "charged"
    | "charging"
    | "drained"
    | "in_transit"
    | "in_use";
  gpsId?: string;
  properties?: {
    mfgDate?: string;
    capacity?: string;
    range?: string;
    lifecycle?: string;
    chargingTime?: string;
    weight?: string;
    warranty?: string;
    removableOption?: boolean;
  };
  stationId?: string;
  station?: {
    id: string;
    name?: string;
    type?: string;
  };
  qrCode?: {
    id: string;
    path: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface V1BatteriesUpdateOneBatteryResponse {
  id: string;
  batteryQrId: string;
  status:
    | "available"
    | "charged"
    | "charging"
    | "drained"
    | "in_transit"
    | "in_use";
  gpsId?: string;
  properties?: {
    mfgDate?: string;
    capacity?: string;
    range?: string;
    lifecycle?: string;
    chargingTime?: string;
    weight?: string;
    warranty?: string;
    removableOption?: boolean;
  };
  stationId?: string;
  station?: {
    id: string;
    name?: string;
    type?: string;
  };
  qrCode?: {
    id: string;
    path: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface V1BatteriesUpdateOneBatteryBody {
  batteryQrId?: string;
  gpsId?: string;
  properties?: {
    mfgDate?: string;
    capacity?: string;
    range?: string;
    lifecycle?: string;
    chargingTime?: string;
    weight?: string;
    warranty?: string;
    removableOption?: boolean;
  };
  stationId?: string;
}

export interface V1BatterySwapsVerifyInwardBatteryResponse {
  verified: boolean;
  bookingId: string;
  batteryId: string;
  batteryQrId: string;
}

export interface V1BatterySwapsVerifyInwardBatteryBody {
  bookingId: string;
  /** Physical battery ID from QR scan */
  batteryQrId: string;
}

export interface V1BatterySwapsExecuteSwapResponse {
  swapHistoryId: string;
  bookingId: string;
  vehicleId?: string;
  oldBatteryId: string;
  oldBatteryQrId: string;
  newBatteryId: string;
  newBatteryQrId: string;
  fromStationId?: string;
  toStationId?: string;
  swappedById: string;
  swappedAt?: string;
}

export interface V1BatterySwapsExecuteSwapBody {
  bookingId: string;
  /** Physical battery ID from QR scan */
  newBatteryQrId: string;
  /** Station where the swap is happening */
  stationId: string;
}

export interface V1BatterySwapsGetSwapHistoryResponse {
  data: {
    id: string;
    userPlanId: string;
    bookingId: string;
    vehicleId: string;
    oldBatteryId: string;
    oldBattery?: {
      id: string;
      batteryQrId: string;
    };
    userPlan?: {
      userId: string;
      user: {
        mobilenumber: string;
        firstName: string;
        lastName: string;
      };
    };
    newBatteryId: string;
    newBattery?: {
      id: string;
      batteryQrId: string;
    };
    fromStationId?: string;
    fromStation?: {
      id: string;
      name: string;
      type: string;
    };
    toStationId?: string;
    toStation?: {
      id: string;
      name: string;
      type: string;
    };
    swappedById: string;
    createdAt: string;
  }[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, "ASC" | "DESC"][];
    searchBy: string[];
    search: string;
    filter?: object;
  };
  links: {
    first?: string;
    last?: string;
    current: string;
    previous?: string;
    next?: string;
  };
}

export interface V1BatteryTransportsDispatchBatteriesResponse {
  id: string;
  fromStationId: string;
  fromStation?: {
    id: string;
    name?: string;
    type?: string;
  };
  toStationId: string;
  toStation?: {
    id: string;
    name?: string;
    type?: string;
  };
  vehicleId: string;
  vehicle?: {
    id: string;
    vehicleNumber?: string;
  };
  initiatedById: string;
  receivedById?: string;
  batteryIds: string[];
  status: "in_transit" | "delivered";
  receivedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface V1BatteryTransportsDispatchBatteriesBody {
  /** Source station ID */
  fromStationId: string;
  /** Destination station ID */
  toStationId: string;
  /** Vehicle carrying the batteries */
  vehicleId: string;
  /**
   * List of battery QR IDs to dispatch
   * @minItems 1
   */
  batteryQrIds: string[];
}

export interface V1BatteryTransportsReceiveBatteriesResponse {
  id: string;
  fromStationId: string;
  fromStation?: {
    id: string;
    name?: string;
    type?: string;
  };
  toStationId: string;
  toStation?: {
    id: string;
    name?: string;
    type?: string;
  };
  vehicleId: string;
  vehicle?: {
    id: string;
    vehicleNumber?: string;
  };
  initiatedById: string;
  receivedById?: string;
  batteryIds: string[];
  status: "in_transit" | "delivered";
  receivedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface V1BatteryTransportsReceiveBatteriesBody {
  /**
   * List of battery QR IDs being received
   * @minItems 1
   */
  batteryQrIds: string[];
}

export interface V1BatteryTransportsUpdateBatteryStatusResponse {
  id: string;
  batteryQrId: string;
  status:
    | "available"
    | "charged"
    | "charging"
    | "drained"
    | "in_transit"
    | "in_use";
  stationId?: string;
  station?: {
    id: string;
    name?: string;
    type?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface V1BatteryTransportsUpdateBatteryStatusBody {
  /** New battery status (only drained→charging and charging→charged allowed) */
  status:
    | "available"
    | "charged"
    | "charging"
    | "drained"
    | "in_transit"
    | "in_use";
}

export interface V1BatteryTransportsGetManyMovementsResponse {
  data: {
    id: string;
    fromStationId: string;
    fromStation?: {
      id: string;
      name?: string;
      type?: string;
    };
    toStationId: string;
    toStation?: {
      id: string;
      name?: string;
      type?: string;
    };
    vehicleId: string;
    vehicle?: {
      id: string;
      vehicleNumber?: string;
    };
    initiatedById: string;
    receivedById?: string;
    batteryIds: string[];
    status: "in_transit" | "delivered";
    receivedAt?: string;
    createdAt?: string;
    updatedAt?: string;
  }[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, "ASC" | "DESC"][];
    searchBy: string[];
    search: string;
    filter?: object;
  };
  links: {
    first?: string;
    last?: string;
    current: string;
    previous?: string;
    next?: string;
  };
}

export interface V1BatteryTransportsGetOneMovementResponse {
  id: string;
  fromStationId: string;
  fromStation?: {
    id: string;
    name?: string;
    type?: string;
  };
  toStationId: string;
  toStation?: {
    id: string;
    name?: string;
    type?: string;
  };
  vehicleId: string;
  vehicle?: {
    id: string;
    vehicleNumber?: string;
  };
  initiatedById: string;
  receivedById?: string;
  batteryIds: string[];
  status: "in_transit" | "delivered";
  receivedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface V1BatteryTransportsGetMovementBatteriesResponse {
  id: string;
  batteryQrId: string;
  status:
    | "available"
    | "charged"
    | "charging"
    | "drained"
    | "in_transit"
    | "in_use";
  stationId?: string;
  station?: {
    id: string;
    name?: string;
    type?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface V1VehicleSurrenderGetAllSurrendersResponse {
  data: {
    id: string;
    bookingId: string;
    vehicleId: string;
    penalty: number;
    miscCharges: number;
    refundAmount: number;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    vehicle?: {
      id: string;
      vehicleNumber: string;
    } | null;
    booking?: {
      id: string;
      userPlanId: string;
      userId: string;
      status: string;
    } | null;
  }[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, "ASC" | "DESC"][];
    searchBy: string[];
    search: string;
    filter?: object;
  };
  links: {
    first?: string;
    last?: string;
    current: string;
    previous?: string;
    next?: string;
  };
}

export interface V1VehicleSurrenderGetSurrenderDetailsResponse {
  customerId: string;
  customerName: string | null;
  depositAmount: number;
  rtoPenalty: number;
  refundAmount: number;
}

export interface V1VehicleSurrenderSurrenderVehicleResponse {
  id: string;
  bookingId: string;
  userPlanId: string;
  vehicleId: string;
  vehicle: {
    id: string;
    vehicleNumber: string;
  };
  penalty: number;
  miscCharges: number;
  refundAmount: number;
  notes: string | null;
}

export interface V1VehicleSurrenderSurrenderVehicleBody {
  /**
   * @min 0
   * @default 0
   */
  penalty: number;
  /**
   * @min 0
   * @default 0
   */
  miscCharges: number;
  /**
   * @min 0
   * @default 0
   */
  refundAmount: number;
  notes?: string | null;
}

export interface V1TransactionsGetTransactionsResponse {
  data: {
    id: string;
    razorpayOrderId: string;
    razorpayPaymentId: string | null;
    amount: number;
    currency: string;
    status: string;
    notes: string | null;
    userPlanId: string;
    userPlan?: {
      id: string;
      userId: string;
      planId: string;
      planSnapshot: any;
      status: string;
      startsAt: string | null;
      expiresAt: string | null;
      remainingKm: number;
      user?: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        mobilenumber: string | null;
      };
    };
    userTopUpId: string | null;
    userTopUp?: {
      id: string;
      topUpId: string;
      topUpSnapshot: any;
      appliedAt: string | null;
    };
    createdAt: string;
    updatedAt: string;
  }[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, "ASC" | "DESC"][];
    searchBy: string[];
    search: string;
    filter?: object;
  };
  links: {
    first?: string;
    last?: string;
    current: string;
    previous?: string;
    next?: string;
  };
}

export interface V1TransactionsGetTransactionByIdResponse {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  amount: number;
  currency: string;
  status: string;
  notes: string | null;
  userPlanId: string;
  userPlan?: {
    id: string;
    userId: string;
    planId: string;
    planSnapshot: any;
    status: string;
    startsAt: string | null;
    expiresAt: string | null;
    remainingKm: number;
    user?: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string | null;
      mobilenumber: string | null;
    };
  };
  userTopUpId: string | null;
  userTopUp?: {
    id: string;
    topUpId: string;
    topUpSnapshot: any;
    appliedAt: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

import type {
  HeadersDefaults,
  ResponseType,
  XiorInstance,
  XiorRequestConfig,
  XiorResponse,
} from "xior";
import xior from "xior";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<XiorRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<XiorRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<XiorRequestConfig | void> | XiorRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: XiorInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...xiorConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = xior.create({
      ...xiorConfig,
      baseURL: xiorConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: XiorRequestConfig,
    params2?: XiorRequestConfig,
  ): XiorRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<XiorResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Yugo Api
 * @version 1.0
 * @contact
 *
 * Yugo REST Api.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  v1 = {
    /**
     * No description
     *
     * @tags auth
     * @name V1AuthSignIn
     * @request POST:/v1/auth/signin
     */
    v1AuthSignIn: (data: V1AuthSignInBody, params: RequestParams = {}) =>
      this.request<V1AuthSignInResponse, any>({
        path: `/v1/auth/signin`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name V1AuthSendOtp
     * @request POST:/v1/auth/otp/send
     */
    v1AuthSendOtp: (data: V1AuthSendOtpBody, params: RequestParams = {}) =>
      this.request<V1AuthSendOtpResponse, any>({
        path: `/v1/auth/otp/send`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name V1AuthVerifyOtp
     * @request POST:/v1/auth/otp/verify
     */
    v1AuthVerifyOtp: (data: V1AuthVerifyOtpBody, params: RequestParams = {}) =>
      this.request<V1AuthVerifyOtpResponse, any>({
        path: `/v1/auth/otp/verify`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags kyc
     * @name AadhaarConnect
     * @request GET:/v1/kyc/aadhaar/connect
     * @secure
     */
    aadhaarConnect: (params: RequestParams = {}) =>
      this.request<AadhaarConnectResponse, any>({
        path: `/v1/kyc/aadhaar/connect`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags kyc
     * @name AadhaarGenerateOtp
     * @request POST:/v1/kyc/aadhaar/generate/otp
     * @secure
     */
    aadhaarGenerateOtp: (
      data: AadhaarGenerateOtpBody,
      params: RequestParams = {},
    ) =>
      this.request<AadhaarGenerateOtpResponse, any>({
        path: `/v1/kyc/aadhaar/generate/otp`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags kyc
     * @name AadhaarVerifyOtp
     * @request POST:/v1/kyc/aadhaar/verify/otp
     * @secure
     */
    aadhaarVerifyOtp: (
      data: AadhaarVerifyOtpBody,
      params: RequestParams = {},
    ) =>
      this.request<AadhaarVerifyOtpResponse, any>({
        path: `/v1/kyc/aadhaar/verify/otp`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags kyc
     * @name AadhaarReloadCaptcha
     * @request GET:/v1/kyc/aadhaar/reload-captcha
     * @secure
     */
    aadhaarReloadCaptcha: (
      query: {
        sessionId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AadhaarReloadCaptchaResponse, any>({
        path: `/v1/kyc/aadhaar/reload-captcha`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags kyc
     * @name PanVerify
     * @request POST:/v1/kyc/pan/verify
     * @secure
     */
    panVerify: (data: PanVerifyBody, params: RequestParams = {}) =>
      this.request<PanVerifyResponse, any>({
        path: `/v1/kyc/pan/verify`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags kyc
     * @name LicenseInitiate
     * @request POST:/v1/kyc/license/initiate
     * @secure
     */
    licenseInitiate: (data: LicenseInitiateBody, params: RequestParams = {}) =>
      this.request<LicenseInitiateResponse, any>({
        path: `/v1/kyc/license/initiate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags kyc
     * @name LicenseGetResult
     * @request GET:/v1/kyc/license/result
     * @secure
     */
    licenseGetResult: (
      query: {
        requestId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<LicenseGetResultResponse, any>({
        path: `/v1/kyc/license/result`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags kyc
     * @name KycGetStatus
     * @request GET:/v1/kyc/status
     * @secure
     */
    kycGetStatus: (params: RequestParams = {}) =>
      this.request<KycGetStatusResponse, any>({
        path: `/v1/kyc/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags geographic data
     * @name V1StatesListManyStates
     * @request GET:/v1/states
     */
    v1StatesListManyStates: (
      query?: {
        /**
         * Page number to retrieve. If you provide invalid value the default page number will applied
         *
         * **Example:** 1
         *
         *
         * **Default Value:** 1
         *
         */
        page?: number;
        /**
         * Number of records per page.
         *
         *
         * **Example:** 20
         *
         *
         *
         * **Default Value:** 20
         *
         *
         *
         * **Max Value:** 100
         *
         *
         * If provided value is greater than max value, max value will be applied.
         */
        limit?: number;
        /**
         * Filter by country.code query param.
         *
         * **Format:** filter.country.code={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.country.code=$eq:John Doe&filter.country.code=$in:John Doe
         *
         * **Available Operations**
         * - $in
         *
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.country.code"?: string[];
        /**
         * Parameter to sort by.
         * To sort by multiple fields, just provide query param multiple types. The order in url defines an order of sorting
         *
         * **Format:** {fieldName}:{DIRECTION}
         *
         *
         * **Example:** sortBy=id:DESC&sortBy=name:DESC
         *
         *
         * **Default Value:** No default sorting specified, the result order is not guaranteed if not provided
         *
         * **Available Fields**
         * - id
         *
         * - name
         */
        sortBy?: ("id:ASC" | "id:DESC" | "name:ASC" | "name:DESC")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<V1StatesListManyStatesResponse, any>({
        path: `/v1/states`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags geographic data
     * @name V1CitiesListManyCities
     * @request GET:/v1/cities
     */
    v1CitiesListManyCities: (
      query?: {
        /**
         * Page number to retrieve. If you provide invalid value the default page number will applied
         *
         * **Example:** 1
         *
         *
         * **Default Value:** 1
         *
         */
        page?: number;
        /**
         * Number of records per page.
         *
         *
         * **Example:** 20
         *
         *
         *
         * **Default Value:** 20
         *
         *
         *
         * **Max Value:** 100
         *
         *
         * If provided value is greater than max value, max value will be applied.
         */
        limit?: number;
        /**
         * Filter by state.id query param.
         *
         * **Format:** filter.state.id={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.state.id=$eq:John Doe&filter.state.id=$in:John Doe
         *
         * **Available Operations**
         * - $in
         *
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.state.id"?: string[];
        /**
         * Parameter to sort by.
         * To sort by multiple fields, just provide query param multiple types. The order in url defines an order of sorting
         *
         * **Format:** {fieldName}:{DIRECTION}
         *
         *
         * **Example:** sortBy=id:DESC&sortBy=name:DESC
         *
         *
         * **Default Value:** No default sorting specified, the result order is not guaranteed if not provided
         *
         * **Available Fields**
         * - id
         *
         * - name
         */
        sortBy?: ("id:ASC" | "id:DESC" | "name:ASC" | "name:DESC")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<V1CitiesListManyCitiesResponse, any>({
        path: `/v1/cities`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name V1UsersGetManyUsers
     * @request GET:/v1/users
     * @secure
     */
    v1UsersGetManyUsers: (
      query?: {
        /**
         * Page number to retrieve. If you provide invalid value the default page number will applied
         *
         * **Example:** 1
         *
         *
         * **Default Value:** 1
         *
         */
        page?: number;
        /**
         * Number of records per page.
         *
         *
         * **Example:** 20
         *
         *
         *
         * **Default Value:** 50
         *
         *
         *
         * **Max Value:** 100
         *
         *
         * If provided value is greater than max value, max value will be applied.
         */
        limit?: number;
        /**
         * Filter by firstName query param.
         *
         * **Format:** filter.firstName={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.firstName=$ilike:John Doe
         *
         * **Available Operations**
         * - $ilike
         *
         * - $and
         *
         * - $or
         */
        "filter.firstName"?: string[];
        /**
         * Filter by lastName query param.
         *
         * **Format:** filter.lastName={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.lastName=$ilike:John Doe
         *
         * **Available Operations**
         * - $ilike
         *
         * - $and
         *
         * - $or
         */
        "filter.lastName"?: string[];
        /**
         * Filter by email query param.
         *
         * **Format:** filter.email={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.email=$eq:John Doe&filter.email=$ilike:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $ilike
         *
         * - $and
         *
         * - $or
         */
        "filter.email"?: string[];
        /**
         * Filter by mobilenumber query param.
         *
         * **Format:** filter.mobilenumber={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.mobilenumber=$eq:John Doe&filter.mobilenumber=$ilike:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $ilike
         *
         * - $and
         *
         * - $or
         */
        "filter.mobilenumber"?: string[];
        /**
         * Filter by roles.name query param.
         *
         * **Format:** filter.roles.name={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.roles.name=$eq:John Doe&filter.roles.name=$in:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $in
         *
         * - $and
         *
         * - $or
         */
        "filter.roles.name"?: string[];
        /**
         * Parameter to sort by.
         * To sort by multiple fields, just provide query param multiple types. The order in url defines an order of sorting
         *
         * **Format:** {fieldName}:{DIRECTION}
         *
         *
         * **Example:** sortBy=id:DESC&sortBy=firstName:DESC
         *
         *
         * **Default Value:** createdAt:DESC
         *
         * **Available Fields**
         * - id
         *
         * - firstName
         *
         * - lastName
         *
         * - createdAt
         */
        sortBy?: (
          | "id:ASC"
          | "id:DESC"
          | "firstName:ASC"
          | "firstName:DESC"
          | "lastName:ASC"
          | "lastName:DESC"
          | "createdAt:ASC"
          | "createdAt:DESC"
        )[];
        /**
         * Search term to filter result values
         *
         * **Example:** John
         *
         *
         * **Default Value:** No default value
         *
         */
        search?: string;
        /**
         * List of fields to search by term to filter result values
         *
         * **Example:** firstName,lastName,email,mobilenumber
         *
         *
         * **Default Value:** By default all fields mentioned below will be used to search by term
         *
         * **Available Fields**
         * - firstName
         *
         * - lastName
         *
         * - email
         *
         * - mobilenumber
         */
        searchBy?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<V1UsersGetManyUsersResponse, any>({
        path: `/v1/users`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name V1UsersCreateOneUser
     * @request POST:/v1/users
     * @secure
     */
    v1UsersCreateOneUser: (
      data: V1UsersCreateOneUserBody,
      params: RequestParams = {},
    ) =>
      this.request<V1UsersCreateOneUserResponse, any>({
        path: `/v1/users`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name V1UsersGetOneUser
     * @request GET:/v1/users/{id}
     * @secure
     */
    v1UsersGetOneUser: (id: string, params: RequestParams = {}) =>
      this.request<V1UsersGetOneUserResponse, any>({
        path: `/v1/users/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name V1UsersPatchOneUser
     * @request PATCH:/v1/users/{id}
     * @secure
     */
    v1UsersPatchOneUser: (
      id: string,
      data: V1UsersPatchOneUserBody,
      params: RequestParams = {},
    ) =>
      this.request<V1UsersPatchOneUserResponse, any>({
        path: `/v1/users/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name V1UsersUpdateAddresses
     * @request PUT:/v1/users/{id}/addresses
     * @secure
     */
    v1UsersUpdateAddresses: (
      id: string,
      data: V1UsersUpdateAddressesBody,
      params: RequestParams = {},
    ) =>
      this.request<V1UsersUpdateAddressesResponse, any>({
        path: `/v1/users/${id}/addresses`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags plans
     * @name V1PlansGetPlans
     * @request GET:/v1/plans
     * @secure
     */
    v1PlansGetPlans: (
      query?: {
        /**
         * Page number to retrieve. If you provide invalid value the default page number will applied
         *
         * **Example:** 1
         *
         *
         * **Default Value:** 1
         *
         */
        page?: number;
        /**
         * Number of records per page.
         *
         *
         * **Example:** 20
         *
         *
         *
         * **Default Value:** 50
         *
         *
         *
         * **Max Value:** 100
         *
         *
         * If provided value is greater than max value, max value will be applied.
         */
        limit?: number;
        /**
         * Filter by active query param.
         *
         * **Format:** filter.active={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.active=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.active"?: string[];
        /**
         * Filter by price query param.
         *
         * **Format:** filter.price={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.price=$gte:John Doe&filter.price=$lte:John Doe
         *
         * **Available Operations**
         * - $gte
         *
         * - $lte
         *
         * - $and
         *
         * - $or
         */
        "filter.price"?: string[];
        /**
         * Parameter to sort by.
         * To sort by multiple fields, just provide query param multiple types. The order in url defines an order of sorting
         *
         * **Format:** {fieldName}:{DIRECTION}
         *
         *
         * **Example:** sortBy=id:DESC&sortBy=name:DESC
         *
         *
         * **Default Value:** createdAt:DESC
         *
         * **Available Fields**
         * - id
         *
         * - name
         *
         * - price
         *
         * - createdAt
         */
        sortBy?: (
          | "id:ASC"
          | "id:DESC"
          | "name:ASC"
          | "name:DESC"
          | "price:ASC"
          | "price:DESC"
          | "createdAt:ASC"
          | "createdAt:DESC"
        )[];
        /**
         * Search term to filter result values
         *
         * **Example:** John
         *
         *
         * **Default Value:** No default value
         *
         */
        search?: string;
        /**
         * List of fields to search by term to filter result values
         *
         * **Example:** name,description
         *
         *
         * **Default Value:** By default all fields mentioned below will be used to search by term
         *
         * **Available Fields**
         * - name
         *
         * - description
         */
        searchBy?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<V1PlansGetPlansResponse, any>({
        path: `/v1/plans`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags plans
     * @name V1PlansGetPlanById
     * @request GET:/v1/plans/{id}
     * @secure
     */
    v1PlansGetPlanById: (id: string, params: RequestParams = {}) =>
      this.request<V1PlansGetPlanByIdResponse, any>({
        path: `/v1/plans/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags plans
     * @name V1PlansAdminCreatePlan
     * @request POST:/v1/admin/plans
     * @secure
     */
    v1PlansAdminCreatePlan: (
      data: V1PlansAdminCreatePlanBody,
      params: RequestParams = {},
    ) =>
      this.request<V1PlansAdminCreatePlanResponse, any>({
        path: `/v1/admin/plans`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags plans
     * @name V1PlansAdminUpdatePlan
     * @request PATCH:/v1/admin/plans/{id}
     * @secure
     */
    v1PlansAdminUpdatePlan: (
      id: string,
      data: V1PlansAdminUpdatePlanBody,
      params: RequestParams = {},
    ) =>
      this.request<V1PlansAdminUpdatePlanResponse, any>({
        path: `/v1/admin/plans/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags top-ups
     * @name V1TopUpsGetTopUps
     * @request GET:/v1/top-ups
     * @secure
     */
    v1TopUpsGetTopUps: (
      query?: {
        /**
         * Page number to retrieve. If you provide invalid value the default page number will applied
         *
         * **Example:** 1
         *
         *
         * **Default Value:** 1
         *
         */
        page?: number;
        /**
         * Number of records per page.
         *
         *
         * **Example:** 20
         *
         *
         *
         * **Default Value:** 50
         *
         *
         *
         * **Max Value:** 100
         *
         *
         * If provided value is greater than max value, max value will be applied.
         */
        limit?: number;
        /**
         * Filter by active query param.
         *
         * **Format:** filter.active={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.active=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.active"?: string[];
        /**
         * Filter by price query param.
         *
         * **Format:** filter.price={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.price=$gte:John Doe&filter.price=$lte:John Doe
         *
         * **Available Operations**
         * - $gte
         *
         * - $lte
         *
         * - $and
         *
         * - $or
         */
        "filter.price"?: string[];
        /**
         * Parameter to sort by.
         * To sort by multiple fields, just provide query param multiple types. The order in url defines an order of sorting
         *
         * **Format:** {fieldName}:{DIRECTION}
         *
         *
         * **Example:** sortBy=id:DESC&sortBy=name:DESC
         *
         *
         * **Default Value:** createdAt:DESC
         *
         * **Available Fields**
         * - id
         *
         * - name
         *
         * - price
         *
         * - createdAt
         */
        sortBy?: (
          | "id:ASC"
          | "id:DESC"
          | "name:ASC"
          | "name:DESC"
          | "price:ASC"
          | "price:DESC"
          | "createdAt:ASC"
          | "createdAt:DESC"
        )[];
        /**
         * Search term to filter result values
         *
         * **Example:** John
         *
         *
         * **Default Value:** No default value
         *
         */
        search?: string;
        /**
         * List of fields to search by term to filter result values
         *
         * **Example:** name,description
         *
         *
         * **Default Value:** By default all fields mentioned below will be used to search by term
         *
         * **Available Fields**
         * - name
         *
         * - description
         */
        searchBy?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<V1TopUpsGetTopUpsResponse, any>({
        path: `/v1/top-ups`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags top-ups
     * @name V1TopUpsGetTopUpById
     * @request GET:/v1/top-ups/{id}
     * @secure
     */
    v1TopUpsGetTopUpById: (id: string, params: RequestParams = {}) =>
      this.request<V1TopUpsGetTopUpByIdResponse, any>({
        path: `/v1/top-ups/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags top-ups
     * @name V1TopUpsAdminCreateTopUp
     * @request POST:/v1/admin/top-ups
     * @secure
     */
    v1TopUpsAdminCreateTopUp: (
      data: V1TopUpsAdminCreateTopUpBody,
      params: RequestParams = {},
    ) =>
      this.request<V1TopUpsAdminCreateTopUpResponse, any>({
        path: `/v1/admin/top-ups`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags top-ups
     * @name V1TopUpsAdminUpdateTopUp
     * @request PATCH:/v1/admin/top-ups/{id}
     * @secure
     */
    v1TopUpsAdminUpdateTopUp: (
      id: string,
      data: V1TopUpsAdminUpdateTopUpBody,
      params: RequestParams = {},
    ) =>
      this.request<V1TopUpsAdminUpdateTopUpResponse, any>({
        path: `/v1/admin/top-ups/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-plans
     * @name V1UserPlansGetMyPlans
     * @request GET:/v1/user-plans
     * @secure
     */
    v1UserPlansGetMyPlans: (
      query?: {
        /**
         * Page number to retrieve. If you provide invalid value the default page number will applied
         *
         * **Example:** 1
         *
         *
         * **Default Value:** 1
         *
         */
        page?: number;
        /**
         * Number of records per page.
         *
         *
         * **Example:** 20
         *
         *
         *
         * **Default Value:** 50
         *
         *
         *
         * **Max Value:** 100
         *
         *
         * If provided value is greater than max value, max value will be applied.
         */
        limit?: number;
        /**
         * Filter by status query param.
         *
         * **Format:** filter.status={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.status=$eq:John Doe&filter.status=$in:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $in
         *
         * - $and
         *
         * - $or
         */
        "filter.status"?: string[];
        /**
         * Parameter to sort by.
         * To sort by multiple fields, just provide query param multiple types. The order in url defines an order of sorting
         *
         * **Format:** {fieldName}:{DIRECTION}
         *
         *
         * **Example:** sortBy=id:DESC&sortBy=status:DESC
         *
         *
         * **Default Value:** createdAt:DESC
         *
         * **Available Fields**
         * - id
         *
         * - status
         *
         * - createdAt
         */
        sortBy?: (
          | "id:ASC"
          | "id:DESC"
          | "status:ASC"
          | "status:DESC"
          | "createdAt:ASC"
          | "createdAt:DESC"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<V1UserPlansGetMyPlansResponse, any>({
        path: `/v1/user-plans`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-plans
     * @name V1UserPlansGetMyPlanById
     * @request GET:/v1/user-plans/{id}
     * @secure
     */
    v1UserPlansGetMyPlanById: (id: string, params: RequestParams = {}) =>
      this.request<V1UserPlansGetMyPlanByIdResponse, any>({
        path: `/v1/user-plans/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-plans
     * @name V1UserPlansPurchasePlan
     * @request POST:/v1/user-plans/purchase
     * @secure
     */
    v1UserPlansPurchasePlan: (
      data: V1UserPlansPurchasePlanBody,
      params: RequestParams = {},
    ) =>
      this.request<V1UserPlansPurchasePlanResponse, any>({
        path: `/v1/user-plans/purchase`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-plans
     * @name V1UserPlansVerifyPayment
     * @request POST:/v1/user-plans/verify-payment
     * @secure
     */
    v1UserPlansVerifyPayment: (
      data: V1UserPlansVerifyPaymentBody,
      params: RequestParams = {},
    ) =>
      this.request<V1UserPlansVerifyPaymentResponse, any>({
        path: `/v1/user-plans/verify-payment`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-plans
     * @name V1UserPlansApplyTopUp
     * @request POST:/v1/user-plans/top-up
     * @secure
     */
    v1UserPlansApplyTopUp: (
      data: V1UserPlansApplyTopUpBody,
      params: RequestParams = {},
    ) =>
      this.request<V1UserPlansApplyTopUpResponse, any>({
        path: `/v1/user-plans/top-up`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-plans
     * @name V1UserPlansPurchaseTopUp
     * @request POST:/v1/user-plans/top-up/purchase
     * @secure
     */
    v1UserPlansPurchaseTopUp: (
      data: V1UserPlansPurchaseTopUpBody,
      params: RequestParams = {},
    ) =>
      this.request<V1UserPlansPurchaseTopUpResponse, any>({
        path: `/v1/user-plans/top-up/purchase`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-plans
     * @name V1UserPlansVerifyTopUpPayment
     * @request POST:/v1/user-plans/top-up/verify-payment
     * @secure
     */
    v1UserPlansVerifyTopUpPayment: (
      data: V1UserPlansVerifyTopUpPaymentBody,
      params: RequestParams = {},
    ) =>
      this.request<V1UserPlansVerifyTopUpPaymentResponse, any>({
        path: `/v1/user-plans/top-up/verify-payment`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-plans
     * @name V1UserPlansScanQr
     * @request GET:/v1/user-plans/{id}/scan
     * @secure
     */
    v1UserPlansScanQr: (id: string, params: RequestParams = {}) =>
      this.request<V1UserPlansScanQrResponse, any>({
        path: `/v1/user-plans/${id}/scan`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags bookings
     * @name V1BookingsGetAllBookings
     * @request GET:/v1/bookings
     * @secure
     */
    v1BookingsGetAllBookings: (
      query?: {
        /**
         * Page number to retrieve. If you provide invalid value the default page number will applied
         *
         * **Example:** 1
         *
         *
         * **Default Value:** 1
         *
         */
        page?: number;
        /**
         * Number of records per page.
         *
         *
         * **Example:** 20
         *
         *
         *
         * **Default Value:** 50
         *
         *
         *
         * **Max Value:** 100
         *
         *
         * If provided value is greater than max value, max value will be applied.
         */
        limit?: number;
        /**
         * Filter by status query param.
         *
         * **Format:** filter.status={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.status=$eq:John Doe&filter.status=$in:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $in
         *
         * - $and
         *
         * - $or
         */
        "filter.status"?: string[];
        /**
         * Parameter to sort by.
         * To sort by multiple fields, just provide query param multiple types. The order in url defines an order of sorting
         *
         * **Format:** {fieldName}:{DIRECTION}
         *
         *
         * **Example:** sortBy=id:DESC&sortBy=status:DESC
         *
         *
         * **Default Value:** createdAt:DESC
         *
         * **Available Fields**
         * - id
         *
         * - status
         *
         * - createdAt
         */
        sortBy?: (
          | "id:ASC"
          | "id:DESC"
          | "status:ASC"
          | "status:DESC"
          | "createdAt:ASC"
          | "createdAt:DESC"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<V1BookingsGetAllBookingsResponse, any>({
        path: `/v1/bookings`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags bookings
     * @name V1BookingsGetBookingById
     * @request GET:/v1/bookings/{id}
     * @secure
     */
    v1BookingsGetBookingById: (id: string, params: RequestParams = {}) =>
      this.request<V1BookingsGetBookingByIdResponse, any>({
        path: `/v1/bookings/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags bookings
     * @name V1BookingsAdminAssignVehicle
     * @request PATCH:/v1/admin/bookings/{id}/assign-vehicle
     * @secure
     */
    v1BookingsAdminAssignVehicle: (
      id: string,
      data: V1BookingsAdminAssignVehicleBody,
      params: RequestParams = {},
    ) =>
      this.request<V1BookingsAdminAssignVehicleResponse, any>({
        path: `/v1/admin/bookings/${id}/assign-vehicle`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags stations
     * @name V1StationsGetManyStations
     * @request GET:/v1/stations
     * @secure
     */
    v1StationsGetManyStations: (
      query?: {
        /**
         * Page number to retrieve. If you provide invalid value the default page number will applied
         *
         * **Example:** 1
         *
         *
         * **Default Value:** 1
         *
         */
        page?: number;
        /**
         * Number of records per page.
         *
         *
         * **Example:** 20
         *
         *
         *
         * **Default Value:** 20
         *
         *
         *
         * **Max Value:** 100
         *
         *
         * If provided value is greater than max value, max value will be applied.
         */
        limit?: number;
        /**
         * Filter by type query param.
         *
         * **Format:** filter.type={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.type=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.type"?: string[];
        /**
         * Filter by name query param.
         *
         * **Format:** filter.name={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.name=$ilike:John Doe
         *
         * **Available Operations**
         * - $ilike
         *
         * - $and
         *
         * - $or
         */
        "filter.name"?: string[];
        /**
         * Filter by managers.firstName query param.
         *
         * **Format:** filter.managers.firstName={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.managers.firstName=$ilike:John Doe
         *
         * **Available Operations**
         * - $ilike
         *
         * - $and
         *
         * - $or
         */
        "filter.managers.firstName"?: string[];
        /**
         * Filter by managers.lastName query param.
         *
         * **Format:** filter.managers.lastName={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.managers.lastName=$ilike:John Doe
         *
         * **Available Operations**
         * - $ilike
         *
         * - $and
         *
         * - $or
         */
        "filter.managers.lastName"?: string[];
        /**
         * Filter by managers.id query param.
         *
         * **Format:** filter.managers.id={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.managers.id=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.managers.id"?: string[];
        /**
         * Parameter to sort by.
         * To sort by multiple fields, just provide query param multiple types. The order in url defines an order of sorting
         *
         * **Format:** {fieldName}:{DIRECTION}
         *
         *
         * **Example:** sortBy=id:DESC&sortBy=name:DESC
         *
         *
         * **Default Value:** createdAt:DESC
         *
         * **Available Fields**
         * - id
         *
         * - name
         *
         * - createdAt
         */
        sortBy?: (
          | "id:ASC"
          | "id:DESC"
          | "name:ASC"
          | "name:DESC"
          | "createdAt:ASC"
          | "createdAt:DESC"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<V1StationsGetManyStationsResponse, any>({
        path: `/v1/stations`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags stations
     * @name V1StationsCreateOneStation
     * @request POST:/v1/stations
     * @secure
     */
    v1StationsCreateOneStation: (
      data: V1StationsCreateOneStationBody,
      params: RequestParams = {},
    ) =>
      this.request<V1StationsCreateOneStationResponse, any>({
        path: `/v1/stations`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags stations
     * @name V1StationsGetOneStation
     * @request GET:/v1/stations/{id}
     * @secure
     */
    v1StationsGetOneStation: (id: string, params: RequestParams = {}) =>
      this.request<V1StationsGetOneStationResponse, any>({
        path: `/v1/stations/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags stations
     * @name V1StationsUpdateOneStation
     * @request PATCH:/v1/stations/{id}
     * @secure
     */
    v1StationsUpdateOneStation: (
      id: string,
      data: V1StationsUpdateOneStationBody,
      params: RequestParams = {},
    ) =>
      this.request<V1StationsUpdateOneStationResponse, any>({
        path: `/v1/stations/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehicles
     * @name V1VehiclesGetManyVehicles
     * @request GET:/v1/vehicles
     * @secure
     */
    v1VehiclesGetManyVehicles: (
      query?: {
        /**
         * Page number to retrieve. If you provide invalid value the default page number will applied
         *
         * **Example:** 1
         *
         *
         * **Default Value:** 1
         *
         */
        page?: number;
        /**
         * Number of records per page.
         *
         *
         * **Example:** 20
         *
         *
         *
         * **Default Value:** 20
         *
         *
         *
         * **Max Value:** 100
         *
         *
         * If provided value is greater than max value, max value will be applied.
         */
        limit?: number;
        /**
         * Filter by type query param.
         *
         * **Format:** filter.type={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.type=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.type"?: string[];
        /**
         * Filter by vehicleNumber query param.
         *
         * **Format:** filter.vehicleNumber={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.vehicleNumber=$ilike:John Doe
         *
         * **Available Operations**
         * - $ilike
         *
         * - $and
         *
         * - $or
         */
        "filter.vehicleNumber"?: string[];
        /**
         * Filter by gpsId query param.
         *
         * **Format:** filter.gpsId={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.gpsId=$ilike:John Doe
         *
         * **Available Operations**
         * - $ilike
         *
         * - $and
         *
         * - $or
         */
        "filter.gpsId"?: string[];
        /**
         * Filter by stationId query param.
         *
         * **Format:** filter.stationId={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.stationId=$eq:John Doe&filter.stationId=$null:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $null
         *
         * - $and
         *
         * - $or
         */
        "filter.stationId"?: string[];
        /**
         * Filter by station.name query param.
         *
         * **Format:** filter.station.name={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.station.name=$ilike:John Doe
         *
         * **Available Operations**
         * - $ilike
         *
         * - $and
         *
         * - $or
         */
        "filter.station.name"?: string[];
        /**
         * Filter by status query param.
         *
         * **Format:** filter.status={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.status=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.status"?: string[];
        /**
         * Parameter to sort by.
         * To sort by multiple fields, just provide query param multiple types. The order in url defines an order of sorting
         *
         * **Format:** {fieldName}:{DIRECTION}
         *
         *
         * **Example:** sortBy=id:DESC&sortBy=vehicleNumber:DESC
         *
         *
         * **Default Value:** createdAt:DESC
         *
         * **Available Fields**
         * - id
         *
         * - vehicleNumber
         *
         * - createdAt
         */
        sortBy?: (
          | "id:ASC"
          | "id:DESC"
          | "vehicleNumber:ASC"
          | "vehicleNumber:DESC"
          | "createdAt:ASC"
          | "createdAt:DESC"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<V1VehiclesGetManyVehiclesResponse, any>({
        path: `/v1/vehicles`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehicles
     * @name V1VehiclesCreateOneVehicle
     * @request POST:/v1/vehicles
     * @secure
     */
    v1VehiclesCreateOneVehicle: (
      data: V1VehiclesCreateOneVehicleBody,
      params: RequestParams = {},
    ) =>
      this.request<V1VehiclesCreateOneVehicleResponse, any>({
        path: `/v1/vehicles`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehicles
     * @name V1VehiclesGetOneVehicle
     * @request GET:/v1/vehicles/{id}
     * @secure
     */
    v1VehiclesGetOneVehicle: (id: string, params: RequestParams = {}) =>
      this.request<V1VehiclesGetOneVehicleResponse, any>({
        path: `/v1/vehicles/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehicles
     * @name V1VehiclesUpdateOneVehicle
     * @request PATCH:/v1/vehicles/{id}
     * @secure
     */
    v1VehiclesUpdateOneVehicle: (
      id: string,
      data: V1VehiclesUpdateOneVehicleBody,
      params: RequestParams = {},
    ) =>
      this.request<V1VehiclesUpdateOneVehicleResponse, any>({
        path: `/v1/vehicles/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags batteries
     * @name V1BatteriesGetManyBatteries
     * @request GET:/v1/batteries
     * @secure
     */
    v1BatteriesGetManyBatteries: (
      query?: {
        /**
         * Page number to retrieve. If you provide invalid value the default page number will applied
         *
         * **Example:** 1
         *
         *
         * **Default Value:** 1
         *
         */
        page?: number;
        /**
         * Number of records per page.
         *
         *
         * **Example:** 20
         *
         *
         *
         * **Default Value:** 20
         *
         *
         *
         * **Max Value:** 100
         *
         *
         * If provided value is greater than max value, max value will be applied.
         */
        limit?: number;
        /**
         * Filter by batteryQrId query param.
         *
         * **Format:** filter.batteryQrId={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.batteryQrId=$ilike:John Doe
         *
         * **Available Operations**
         * - $ilike
         *
         * - $and
         *
         * - $or
         */
        "filter.batteryQrId"?: string[];
        /**
         * Filter by gpsId query param.
         *
         * **Format:** filter.gpsId={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.gpsId=$ilike:John Doe
         *
         * **Available Operations**
         * - $ilike
         *
         * - $and
         *
         * - $or
         */
        "filter.gpsId"?: string[];
        /**
         * Filter by stationId query param.
         *
         * **Format:** filter.stationId={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.stationId=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.stationId"?: string[];
        /**
         * Filter by station.name query param.
         *
         * **Format:** filter.station.name={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.station.name=$ilike:John Doe
         *
         * **Available Operations**
         * - $ilike
         *
         * - $and
         *
         * - $or
         */
        "filter.station.name"?: string[];
        /**
         * Filter by station.managers.id query param.
         *
         * **Format:** filter.station.managers.id={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.station.managers.id=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.station.managers.id"?: string[];
        /**
         * Filter by status query param.
         *
         * **Format:** filter.status={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.status=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.status"?: string[];
        /**
         * Parameter to sort by.
         * To sort by multiple fields, just provide query param multiple types. The order in url defines an order of sorting
         *
         * **Format:** {fieldName}:{DIRECTION}
         *
         *
         * **Example:** sortBy=id:DESC&sortBy=batteryQrId:DESC
         *
         *
         * **Default Value:** createdAt:DESC
         *
         * **Available Fields**
         * - id
         *
         * - batteryQrId
         *
         * - createdAt
         *
         * - stationId
         */
        sortBy?: (
          | "id:ASC"
          | "id:DESC"
          | "batteryQrId:ASC"
          | "batteryQrId:DESC"
          | "createdAt:ASC"
          | "createdAt:DESC"
          | "stationId:ASC"
          | "stationId:DESC"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<V1BatteriesGetManyBatteriesResponse, any>({
        path: `/v1/batteries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags batteries
     * @name V1BatteriesCreateOneBattery
     * @request POST:/v1/batteries
     * @secure
     */
    v1BatteriesCreateOneBattery: (
      data: V1BatteriesCreateOneBatteryBody,
      params: RequestParams = {},
    ) =>
      this.request<V1BatteriesCreateOneBatteryResponse, any>({
        path: `/v1/batteries`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags batteries
     * @name V1BatteriesGetOneBattery
     * @request GET:/v1/batteries/{id}
     * @secure
     */
    v1BatteriesGetOneBattery: (id: string, params: RequestParams = {}) =>
      this.request<V1BatteriesGetOneBatteryResponse, any>({
        path: `/v1/batteries/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags batteries
     * @name V1BatteriesUpdateOneBattery
     * @request PATCH:/v1/batteries/{id}
     * @secure
     */
    v1BatteriesUpdateOneBattery: (
      id: string,
      data: V1BatteriesUpdateOneBatteryBody,
      params: RequestParams = {},
    ) =>
      this.request<V1BatteriesUpdateOneBatteryResponse, any>({
        path: `/v1/batteries/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags battery-swaps
     * @name V1BatterySwapsVerifyInwardBattery
     * @request POST:/v1/battery-swaps/verify-inward
     * @secure
     */
    v1BatterySwapsVerifyInwardBattery: (
      data: V1BatterySwapsVerifyInwardBatteryBody,
      params: RequestParams = {},
    ) =>
      this.request<V1BatterySwapsVerifyInwardBatteryResponse, any>({
        path: `/v1/battery-swaps/verify-inward`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags battery-swaps
     * @name V1BatterySwapsExecuteSwap
     * @request POST:/v1/battery-swaps/execute
     * @secure
     */
    v1BatterySwapsExecuteSwap: (
      data: V1BatterySwapsExecuteSwapBody,
      params: RequestParams = {},
    ) =>
      this.request<V1BatterySwapsExecuteSwapResponse, any>({
        path: `/v1/battery-swaps/execute`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags battery-swaps
     * @name V1BatterySwapsGetSwapHistory
     * @request GET:/v1/battery-swaps/history
     * @secure
     */
    v1BatterySwapsGetSwapHistory: (
      query?: {
        /**
         * Page number to retrieve. If you provide invalid value the default page number will applied
         *
         * **Example:** 1
         *
         *
         * **Default Value:** 1
         *
         */
        page?: number;
        /**
         * Number of records per page.
         *
         *
         * **Example:** 20
         *
         *
         *
         * **Default Value:** 20
         *
         *
         *
         * **Max Value:** 100
         *
         *
         * If provided value is greater than max value, max value will be applied.
         */
        limit?: number;
        /**
         * Filter by bookingId query param.
         *
         * **Format:** filter.bookingId={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.bookingId=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.bookingId"?: string[];
        /**
         * Filter by userPlanId query param.
         *
         * **Format:** filter.userPlanId={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.userPlanId=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.userPlanId"?: string[];
        /**
         * Filter by swappedById query param.
         *
         * **Format:** filter.swappedById={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.swappedById=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.swappedById"?: string[];
        /**
         * Parameter to sort by.
         * To sort by multiple fields, just provide query param multiple types. The order in url defines an order of sorting
         *
         * **Format:** {fieldName}:{DIRECTION}
         *
         *
         * **Example:** sortBy=id:DESC&sortBy=createdAt:DESC
         *
         *
         * **Default Value:** createdAt:DESC
         *
         * **Available Fields**
         * - id
         *
         * - createdAt
         */
        sortBy?: ("id:ASC" | "id:DESC" | "createdAt:ASC" | "createdAt:DESC")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<V1BatterySwapsGetSwapHistoryResponse, any>({
        path: `/v1/battery-swaps/history`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags battery-transports
     * @name V1BatteryTransportsDispatchBatteries
     * @request POST:/v1/battery-transports/dispatch
     * @secure
     */
    v1BatteryTransportsDispatchBatteries: (
      data: V1BatteryTransportsDispatchBatteriesBody,
      params: RequestParams = {},
    ) =>
      this.request<V1BatteryTransportsDispatchBatteriesResponse, any>({
        path: `/v1/battery-transports/dispatch`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags battery-transports
     * @name V1BatteryTransportsReceiveBatteries
     * @request POST:/v1/battery-transports/{id}/receive
     * @secure
     */
    v1BatteryTransportsReceiveBatteries: (
      id: string,
      data: V1BatteryTransportsReceiveBatteriesBody,
      params: RequestParams = {},
    ) =>
      this.request<V1BatteryTransportsReceiveBatteriesResponse, any>({
        path: `/v1/battery-transports/${id}/receive`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags battery-transports
     * @name V1BatteryTransportsUpdateBatteryStatus
     * @request PATCH:/v1/battery-transports/batteries/{batteryId}/status
     * @secure
     */
    v1BatteryTransportsUpdateBatteryStatus: (
      batteryId: string,
      data: V1BatteryTransportsUpdateBatteryStatusBody,
      params: RequestParams = {},
    ) =>
      this.request<V1BatteryTransportsUpdateBatteryStatusResponse, any>({
        path: `/v1/battery-transports/batteries/${batteryId}/status`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags battery-transports
     * @name V1BatteryTransportsGetManyMovements
     * @request GET:/v1/battery-transports
     * @secure
     */
    v1BatteryTransportsGetManyMovements: (
      query?: {
        /**
         * Page number to retrieve. If you provide invalid value the default page number will applied
         *
         * **Example:** 1
         *
         *
         * **Default Value:** 1
         *
         */
        page?: number;
        /**
         * Number of records per page.
         *
         *
         * **Example:** 20
         *
         *
         *
         * **Default Value:** 20
         *
         *
         *
         * **Max Value:** 100
         *
         *
         * If provided value is greater than max value, max value will be applied.
         */
        limit?: number;
        /**
         * Filter by fromStationId query param.
         *
         * **Format:** filter.fromStationId={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.fromStationId=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.fromStationId"?: string[];
        /**
         * Filter by toStationId query param.
         *
         * **Format:** filter.toStationId={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.toStationId=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.toStationId"?: string[];
        /**
         * Filter by vehicleId query param.
         *
         * **Format:** filter.vehicleId={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.vehicleId=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.vehicleId"?: string[];
        /**
         * Filter by status query param.
         *
         * **Format:** filter.status={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.status=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.status"?: string[];
        /**
         * Parameter to sort by.
         * To sort by multiple fields, just provide query param multiple types. The order in url defines an order of sorting
         *
         * **Format:** {fieldName}:{DIRECTION}
         *
         *
         * **Example:** sortBy=id:DESC&sortBy=createdAt:DESC
         *
         *
         * **Default Value:** createdAt:DESC
         *
         * **Available Fields**
         * - id
         *
         * - createdAt
         *
         * - status
         */
        sortBy?: (
          | "id:ASC"
          | "id:DESC"
          | "createdAt:ASC"
          | "createdAt:DESC"
          | "status:ASC"
          | "status:DESC"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<V1BatteryTransportsGetManyMovementsResponse, any>({
        path: `/v1/battery-transports`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags battery-transports
     * @name V1BatteryTransportsGetOneMovement
     * @request GET:/v1/battery-transports/{id}
     * @secure
     */
    v1BatteryTransportsGetOneMovement: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<V1BatteryTransportsGetOneMovementResponse, any>({
        path: `/v1/battery-transports/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags battery-transports
     * @name V1BatteryTransportsGetMovementBatteries
     * @request GET:/v1/battery-transports/{id}/batteries
     * @secure
     */
    v1BatteryTransportsGetMovementBatteries: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<V1BatteryTransportsGetMovementBatteriesResponse, any>({
        path: `/v1/battery-transports/${id}/batteries`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehicle-surrender
     * @name V1VehicleSurrenderGetAllSurrenders
     * @request GET:/v1/vehicle-surrender
     * @secure
     */
    v1VehicleSurrenderGetAllSurrenders: (
      query?: {
        /**
         * Page number to retrieve. If you provide invalid value the default page number will applied
         *
         * **Example:** 1
         *
         *
         * **Default Value:** 1
         *
         */
        page?: number;
        /**
         * Number of records per page.
         *
         *
         * **Example:** 20
         *
         *
         *
         * **Default Value:** 50
         *
         *
         *
         * **Max Value:** 100
         *
         *
         * If provided value is greater than max value, max value will be applied.
         */
        limit?: number;
        /**
         * Filter by vehicleId query param.
         *
         * **Format:** filter.vehicleId={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.vehicleId=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.vehicleId"?: string[];
        /**
         * Filter by bookingId query param.
         *
         * **Format:** filter.bookingId={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.bookingId=$eq:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $and
         *
         * - $or
         */
        "filter.bookingId"?: string[];
        /**
         * Parameter to sort by.
         * To sort by multiple fields, just provide query param multiple types. The order in url defines an order of sorting
         *
         * **Format:** {fieldName}:{DIRECTION}
         *
         *
         * **Example:** sortBy=createdAt:DESC
         *
         *
         * **Default Value:** createdAt:DESC
         *
         * **Available Fields**
         * - createdAt
         */
        sortBy?: ("createdAt:ASC" | "createdAt:DESC")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<V1VehicleSurrenderGetAllSurrendersResponse, any>({
        path: `/v1/vehicle-surrender`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehicle-surrender
     * @name V1VehicleSurrenderGetSurrenderDetails
     * @request GET:/v1/vehicle-surrender/{vehicleNumber}
     * @secure
     */
    v1VehicleSurrenderGetSurrenderDetails: (
      vehicleNumber: string,
      params: RequestParams = {},
    ) =>
      this.request<V1VehicleSurrenderGetSurrenderDetailsResponse, any>({
        path: `/v1/vehicle-surrender/${vehicleNumber}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehicle-surrender
     * @name V1VehicleSurrenderSurrenderVehicle
     * @request POST:/v1/vehicle-surrender/{vehicleNumber}/surrender
     * @secure
     */
    v1VehicleSurrenderSurrenderVehicle: (
      vehicleNumber: string,
      data: V1VehicleSurrenderSurrenderVehicleBody,
      params: RequestParams = {},
    ) =>
      this.request<V1VehicleSurrenderSurrenderVehicleResponse, any>({
        path: `/v1/vehicle-surrender/${vehicleNumber}/surrender`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags transactions
     * @name V1TransactionsGetTransactions
     * @request GET:/v1/transactions
     * @secure
     */
    v1TransactionsGetTransactions: (
      query?: {
        /**
         * Page number to retrieve. If you provide invalid value the default page number will applied
         *
         * **Example:** 1
         *
         *
         * **Default Value:** 1
         *
         */
        page?: number;
        /**
         * Number of records per page.
         *
         *
         * **Example:** 20
         *
         *
         *
         * **Default Value:** 20
         *
         *
         *
         * **Max Value:** 100
         *
         *
         * If provided value is greater than max value, max value will be applied.
         */
        limit?: number;
        /**
         * Filter by status query param.
         *
         * **Format:** filter.status={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.status=$eq:John Doe&filter.status=$in:John Doe
         *
         * **Available Operations**
         * - $eq
         *
         * - $in
         *
         * - $and
         *
         * - $or
         */
        "filter.status"?: string[];
        /**
         * Parameter to sort by.
         * To sort by multiple fields, just provide query param multiple types. The order in url defines an order of sorting
         *
         * **Format:** {fieldName}:{DIRECTION}
         *
         *
         * **Example:** sortBy=id:DESC&sortBy=status:DESC
         *
         *
         * **Default Value:** createdAt:DESC
         *
         * **Available Fields**
         * - id
         *
         * - status
         *
         * - amount
         *
         * - createdAt
         */
        sortBy?: (
          | "id:ASC"
          | "id:DESC"
          | "status:ASC"
          | "status:DESC"
          | "amount:ASC"
          | "amount:DESC"
          | "createdAt:ASC"
          | "createdAt:DESC"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<V1TransactionsGetTransactionsResponse, any>({
        path: `/v1/transactions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags transactions
     * @name V1TransactionsGetTransactionById
     * @request GET:/v1/transactions/{id}
     * @secure
     */
    v1TransactionsGetTransactionById: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<V1TransactionsGetTransactionByIdResponse, any>({
        path: `/v1/transactions/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
