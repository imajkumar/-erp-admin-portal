import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { microservices } from "@/config/env";

// API Response interface
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  status: "success" | "error";
  statusCode: number;
  timestamp: string;
}

// Paginated Response interface
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// API Error interface
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
  timestamp: string;
}

// Request interceptor type
export type RequestInterceptor = (config: any) => any;

// Response interceptor type
export type ResponseInterceptor = {
  onFulfilled?: (
    response: AxiosResponse,
  ) => AxiosResponse | Promise<AxiosResponse>;
  onRejected?: (error: AxiosError) => any;
};

// Base API client class
export class ApiClient {
  private instances: Map<string, AxiosInstance> = new Map();
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor() {
    this.setupDefaultInterceptors();
  }

  // Get or create axios instance for a microservice
  public getInstance(service: keyof typeof microservices): AxiosInstance {
    if (!this.instances.has(service)) {
      const instance = axios.create({
        baseURL: microservices[service],
        timeout: 30000, // 30 seconds
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      // Apply request interceptors
      this.requestInterceptors.forEach((interceptor) => {
        instance.interceptors.request.use(interceptor);
      });

      // Apply response interceptors
      this.responseInterceptors.forEach((interceptor) => {
        instance.interceptors.response.use(
          interceptor.onFulfilled,
          interceptor.onRejected,
        );
      });

      this.instances.set(service, instance);
    }

    return this.instances.get(service)!;
  }

  // Add request interceptor
  public addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);

    // Apply to existing instances
    this.instances.forEach((instance) => {
      instance.interceptors.request.use(interceptor);
    });
  }

  // Add response interceptor
  public addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);

    // Apply to existing instances
    this.instances.forEach((instance) => {
      instance.interceptors.response.use(
        interceptor.onFulfilled,
        interceptor.onRejected,
      );
    });
  }

  // Setup default interceptors
  private setupDefaultInterceptors(): void {
    // Request interceptor for authentication
    this.addRequestInterceptor((config) => {
      // Get token from localStorage or Redux store
      const token = this.getAuthToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      // Add request ID for tracking
      config.headers = {
        ...config.headers,
        "X-Request-ID": this.generateRequestId(),
      };

      // Add timestamp
      config.headers = {
        ...config.headers,
        "X-Timestamp": new Date().toISOString(),
      };

      return config;
    });

    // Response interceptor for error handling
    this.addResponseInterceptor({
      onFulfilled: (response) => {
        // Log successful requests in development
        if (process.env.NODE_ENV === "development") {
          console.log(
            `✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`,
            response.data,
          );
        }
        return response;
      },
      onRejected: (error: AxiosError) => {
        // Handle different error types
        if (error.response) {
          // Server responded with error status
          const apiError: ApiError = {
            message: (error.response.data as any)?.message || error.message,
            status: error.response.status,
            code: (error.response.data as any)?.code,
            details: (error.response.data as any)?.details,
            timestamp: new Date().toISOString(),
          };

          // Log error in development
          if (process.env.NODE_ENV === "development") {
            console.error(
              `❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
              apiError,
            );
          }

          // Handle specific error codes
          if (error.response.status === 401) {
            this.handleUnauthorized();
          } else if (error.response.status === 403) {
            this.handleForbidden();
          } else if (error.response.status >= 500) {
            this.handleServerError();
          }

          return Promise.reject(apiError);
        } else if (error.request) {
          // Network error
          const networkError: ApiError = {
            message: "Network error - please check your connection",
            status: 0,
            code: "NETWORK_ERROR",
            timestamp: new Date().toISOString(),
          };

          console.error("🌐 Network Error:", networkError);
          return Promise.reject(networkError);
        } else {
          // Other error
          const unknownError: ApiError = {
            message: error.message || "Unknown error occurred",
            status: 0,
            code: "UNKNOWN_ERROR",
            timestamp: new Date().toISOString(),
          };

          console.error("❓ Unknown Error:", unknownError);
          return Promise.reject(unknownError);
        }
      },
    });
  }

  // Get authentication token
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Handle unauthorized (401)
  private handleUnauthorized(): void {
    // Clear tokens
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }

    // Redirect to login or dispatch logout action
    // This can be customized based on your routing setup
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  // Handle forbidden (403)
  private handleForbidden(): void {
    // Show access denied message or redirect
    console.warn("Access denied - insufficient permissions");
  }

  // Handle server error (5xx)
  private handleServerError(): void {
    // Show server error message
    console.error("Server error - please try again later");
  }

  // Generic request method
  public async request<T = any>(
    service: keyof typeof microservices,
    config: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const instance = this.getInstance(service);
    console.log("Request config:", config);
    try {
      const response = await instance.request<ApiResponse<T>>(config);
      console.log("Request response:", response);
      return response.data;
    } catch (error) {
      console.error("Request error:", error);
      throw error;
    }
  }

  // HTTP methods
  public async get<T = any>(
    service: keyof typeof microservices,
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(service, { ...config, method: "GET", url });
  }

  // Paginated GET method
  public async getPaginated<T = any>(
    service: keyof typeof microservices,
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<PaginatedResponse<T>> {
    console.log(`getPaginated - service: ${service}, url: ${url}`);
    console.log(`getPaginated - base URL: ${microservices[service]}`);
    const instance = this.getInstance(service);
    console.log(`getPaginated - full URL: ${instance.defaults.baseURL}${url}`);
    
    try {
      const response = await instance.request<PaginatedResponse<T>>({
        ...config,
        method: "GET",
        url,
      });
      console.log("getPaginated - response:", response.data);
      return response.data;
    } catch (error) {
      console.error("getPaginated - error:", error);
      throw error;
    }
  }

  public async post<T = any>(
    service: keyof typeof microservices,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    console.log(
      `Making POST request to service: ${service}, URL: ${url}, Data:`,
      data,
    );
    console.log(`Base URL for ${service}:`, microservices[service]);
    return this.request<T>(service, { ...config, method: "POST", url, data });
  }

  public async put<T = any>(
    service: keyof typeof microservices,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(service, { ...config, method: "PUT", url, data });
  }

  public async patch<T = any>(
    service: keyof typeof microservices,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(service, { ...config, method: "PATCH", url, data });
  }

  public async delete<T = any>(
    service: keyof typeof microservices,
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(service, { ...config, method: "DELETE", url });
  }

  // File upload method
  public async upload<T = any>(
    service: keyof typeof microservices,
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(service, {
      ...config,
      method: "POST",
      url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
    });
  }

  // File download method
  public async download(
    service: keyof typeof microservices,
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<Blob> {
    const instance = this.getInstance(service);
    const response = await instance.request({
      ...config,
      method: "GET",
      url,
      responseType: "blob",
    });
    return response.data;
  }

  // Set custom headers for all requests
  public setGlobalHeaders(headers: Record<string, string>): void {
    this.instances.forEach((instance) => {
      Object.entries(headers).forEach(([key, value]) => {
        instance.defaults.headers.common[key] = value;
      });
    });
  }

  // Remove global headers
  public removeGlobalHeaders(headerKeys: string[]): void {
    this.instances.forEach((instance) => {
      headerKeys.forEach((key) => {
        delete instance.defaults.headers.common[key];
      });
    });
  }

  // Clear all instances (useful for testing)
  public clearInstances(): void {
    this.instances.clear();
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export convenience methods
export const {
  get,
  post,
  put,
  patch,
  delete: del,
  upload,
  download,
} = apiClient;
