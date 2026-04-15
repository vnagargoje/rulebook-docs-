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
  };
}
