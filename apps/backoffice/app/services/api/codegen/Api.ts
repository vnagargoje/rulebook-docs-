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
    v1AuthSignIn: (
      data: {
        /** @format email */
        email: string;
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          accessToken: string;
          refreshToken: string;
          user: {
            id: string;
            email: string;
            roles: string[];
          };
        },
        any
      >({
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
    v1AuthSendOtp: (
      data: {
        mobilenumber: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          mobilenumber: string;
          method: "sms";
          otpSent: boolean;
        },
        any
      >({
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
    v1AuthVerifyOtp: (
      data: {
        mobilenumber: string;
        otp: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          verified: boolean;
          accessToken?: string;
          refreshToken?: string;
        },
        any
      >({
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
      this.request<
        {
          sessionId: string;
          captcha: string;
        },
        any
      >({
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
      data: {
        sessionId: string;
        captcha: string;
        aadhaarNumber: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          success: boolean;
          message: string;
        },
        any
      >({
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
      data: {
        sessionId: string;
        otp: string;
        aadhaarNumber: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          success: boolean;
          message: string;
        },
        any
      >({
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
      this.request<
        {
          captcha: string;
        },
        any
      >({
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
    panVerify: (
      data: {
        pan: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          success: boolean;
          message: string;
        },
        any
      >({
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
    licenseInitiate: (
      data: {
        dlNumber: string;
        dateOfBirth: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          requestId: string;
        },
        any
      >({
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
      this.request<
        {
          success: boolean;
          message: string;
        },
        any
      >({
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
      this.request<
        {
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
        },
        any
      >({
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
      this.request<
        {
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
        },
        any
      >({
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
      this.request<
        {
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
        },
        any
      >({
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
      this.request<
        {
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
        },
        any
      >({
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
      data: {
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
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
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
          }[];
        },
        any
      >({
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
      this.request<
        {
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
          }[];
        },
        any
      >({
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
      data: {
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
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
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
          }[];
        },
        any
      >({
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
      this.request<
        {
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
        },
        any
      >({
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
      this.request<
        {
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
        },
        any
      >({
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
      data: {
        name: string;
        description?: string;
        validityDays: number;
        kmLimit: number;
        price: number;
        deposit: number;
        gst: number;
        registrationFee?: number;
        active?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
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
        },
        any
      >({
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
      data: {
        name?: string;
        description?: string;
        validityDays?: number;
        kmLimit?: number;
        price?: number;
        deposit?: number;
        gst?: number;
        registrationFee?: number;
        active?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
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
        },
        any
      >({
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
      this.request<
        {
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
        },
        any
      >({
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
      this.request<
        {
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
        },
        any
      >({
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
      data: {
        name: string;
        description?: string;
        validityDays: number;
        kmLimit: number;
        price: number;
        gst: number;
        active?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
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
        },
        any
      >({
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
      data: {
        name?: string;
        description?: string;
        validityDays?: number;
        kmLimit?: number;
        price?: number;
        gst?: number;
        active?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
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
        },
        any
      >({
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
      this.request<
        {
          data: {
            id: string;
            userId: string;
            planId: string;
            planSnapshot: any;
            status: string;
            startsAt: string | null;
            expiresAt: string | null;
            remainingKm: number;
            qrCodeId: string | null;
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
        },
        any
      >({
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
     * @name V1UserPlansPurchasePlan
     * @request POST:/v1/user-plans
     * @secure
     */
    v1UserPlansPurchasePlan: (
      data: {
        planId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: string;
          userId: string;
          planId: string;
          planSnapshot: any;
          status: string;
          startsAt: string | null;
          expiresAt: string | null;
          remainingKm: number;
          qrCodeId: string | null;
          createdAt: string;
          updatedAt: string;
        },
        any
      >({
        path: `/v1/user-plans`,
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
     * @name V1UserPlansGetMyPlanById
     * @request GET:/v1/user-plans/{id}
     * @secure
     */
    v1UserPlansGetMyPlanById: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          id: string;
          userId: string;
          planId: string;
          planSnapshot: any;
          status: string;
          startsAt: string | null;
          expiresAt: string | null;
          remainingKm: number;
          qrCodeId: string | null;
          createdAt: string;
          updatedAt: string;
        },
        any
      >({
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
     * @name V1UserPlansApplyTopUp
     * @request POST:/v1/user-plans/top-up
     * @secure
     */
    v1UserPlansApplyTopUp: (
      data: {
        topUpId: string;
        userPlanId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: string;
          userId: string;
          planId: string;
          planSnapshot: any;
          status: string;
          startsAt: string | null;
          expiresAt: string | null;
          remainingKm: number;
          qrCodeId: string | null;
          createdAt: string;
          updatedAt: string;
        },
        any
      >({
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
     * @name V1UserPlansScanQr
     * @request GET:/v1/user-plans/{id}/scan
     * @secure
     */
    v1UserPlansScanQr: (id: string, params: RequestParams = {}) =>
      this.request<
        {
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
        },
        any
      >({
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
     * @name V1BookingsGetMyBookings
     * @request GET:/v1/bookings
     * @secure
     */
    v1BookingsGetMyBookings: (
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
      this.request<
        {
          data: {
            id: string;
            userId: string;
            userPlanId: string;
            stationId: string;
            vehicleId: string | null;
            batteryId: string | null;
            status: string;
            pickupOtp: string;
            startedAt: string | null;
            completedAt: string | null;
            cancelledAt: string | null;
            cancellationReason: string | null;
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
        },
        any
      >({
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
     * @name V1BookingsCreateBooking
     * @request POST:/v1/bookings
     * @secure
     */
    v1BookingsCreateBooking: (
      data: {
        userPlanId: string;
        stationId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: string;
          userId: string;
          userPlanId: string;
          stationId: string;
          vehicleId: string | null;
          batteryId: string | null;
          status: string;
          pickupOtp: string;
          startedAt: string | null;
          completedAt: string | null;
          cancelledAt: string | null;
          cancellationReason: string | null;
          createdAt: string;
          updatedAt: string;
        },
        any
      >({
        path: `/v1/bookings`,
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
     * @tags bookings
     * @name V1BookingsGetBookingById
     * @request GET:/v1/bookings/{id}
     * @secure
     */
    v1BookingsGetBookingById: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          id: string;
          userId: string;
          userPlanId: string;
          stationId: string;
          vehicleId: string | null;
          batteryId: string | null;
          status: string;
          pickupOtp: string;
          startedAt: string | null;
          completedAt: string | null;
          cancelledAt: string | null;
          cancellationReason: string | null;
          createdAt: string;
          updatedAt: string;
        },
        any
      >({
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
      data: {
        vehicleId: string;
        batteryId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: string;
          userId: string;
          userPlanId: string;
          stationId: string;
          vehicleId: string | null;
          batteryId: string | null;
          status: string;
          pickupOtp: string;
          startedAt: string | null;
          completedAt: string | null;
          cancelledAt: string | null;
          cancellationReason: string | null;
          createdAt: string;
          updatedAt: string;
        },
        any
      >({
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
         * Filter by manager.firstName query param.
         *
         * **Format:** filter.manager.firstName={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.manager.firstName=$ilike:John Doe
         *
         * **Available Operations**
         * - $ilike
         *
         * - $and
         *
         * - $or
         */
        "filter.manager.firstName"?: string[];
        /**
         * Filter by manager.lastName query param.
         *
         * **Format:** filter.manager.lastName={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.manager.lastName=$ilike:John Doe
         *
         * **Available Operations**
         * - $ilike
         *
         * - $and
         *
         * - $or
         */
        "filter.manager.lastName"?: string[];
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
      this.request<
        {
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
            managerId?: string;
            manager?: {
              id: string;
              /** @format email */
              email?: string;
              mobilenumber?: string;
              firstName?: string;
              lastName?: string;
            };
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
        },
        any
      >({
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
      data: {
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
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
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
          managerId?: string;
          manager?: {
            id: string;
            /** @format email */
            email?: string;
            mobilenumber?: string;
            firstName?: string;
            lastName?: string;
          };
        },
        any
      >({
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
      this.request<
        {
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
          managerId?: string;
          manager?: {
            id: string;
            /** @format email */
            email?: string;
            mobilenumber?: string;
            firstName?: string;
            lastName?: string;
          };
        },
        any
      >({
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
      data: {
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
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
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
          managerId?: string;
          manager?: {
            id: string;
            /** @format email */
            email?: string;
            mobilenumber?: string;
            firstName?: string;
            lastName?: string;
          };
        },
        any
      >({
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
      this.request<
        {
          data: {
            id: string;
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
        },
        any
      >({
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
      data: {
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
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: string;
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
          createdAt?: string;
          updatedAt?: string;
        },
        any
      >({
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
      this.request<
        {
          id: string;
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
          createdAt?: string;
          updatedAt?: string;
        },
        any
      >({
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
      data: {
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
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: string;
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
          createdAt?: string;
          updatedAt?: string;
        },
        any
      >({
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
         * Filter by batteryId query param.
         *
         * **Format:** filter.batteryId={$not}:OPERATION:VALUE
         *
         *
         *
         * **Example:** filter.batteryId=$ilike:John Doe
         *
         * **Available Operations**
         * - $ilike
         *
         * - $and
         *
         * - $or
         */
        "filter.batteryId"?: string[];
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
         * Parameter to sort by.
         * To sort by multiple fields, just provide query param multiple types. The order in url defines an order of sorting
         *
         * **Format:** {fieldName}:{DIRECTION}
         *
         *
         * **Example:** sortBy=id:DESC&sortBy=batteryId:DESC
         *
         *
         * **Default Value:** createdAt:DESC
         *
         * **Available Fields**
         * - id
         *
         * - batteryId
         *
         * - createdAt
         */
        sortBy?: (
          | "id:ASC"
          | "id:DESC"
          | "batteryId:ASC"
          | "batteryId:DESC"
          | "createdAt:ASC"
          | "createdAt:DESC"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            id: string;
            batteryId: string;
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
        },
        any
      >({
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
      data: {
        batteryId: string;
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
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: string;
          batteryId: string;
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
          createdAt?: string;
          updatedAt?: string;
        },
        any
      >({
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
      this.request<
        {
          id: string;
          batteryId: string;
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
          createdAt?: string;
          updatedAt?: string;
        },
        any
      >({
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
      data: {
        batteryId?: string;
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
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: string;
          batteryId: string;
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
          createdAt?: string;
          updatedAt?: string;
        },
        any
      >({
        path: `/v1/batteries/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
