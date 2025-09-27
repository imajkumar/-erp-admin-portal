// API Configuration
export const API_CONFIG = {
  // Timeout settings
  TIMEOUT: {
    DEFAULT: 30000, // 30 seconds
    UPLOAD: 300000, // 5 minutes for file uploads
    DOWNLOAD: 600000, // 10 minutes for file downloads
  },

  // Retry settings
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 second
    BACKOFF_MULTIPLIER: 2,
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  // File upload settings
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ],
  },

  // Cache settings
  CACHE: {
    ENABLED: true,
    TTL: 5 * 60 * 1000, // 5 minutes
    MAX_ENTRIES: 100,
  },

  // Request/Response logging
  LOGGING: {
    ENABLED: process.env.NODE_ENV === "development",
    LEVEL: process.env.NODE_ENV === "development" ? "debug" : "error",
  },
} as const;

// Default headers that will be sent with every request
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Client-Version": process.env.NEXT_PUBLIC_VERSION || "1.0.0",
  "X-Client-Platform": "web",
  "X-Request-Source": "admin-portal",
} as const;

// Headers that can be dynamically set
export const DYNAMIC_HEADERS = {
  Authorization: "Bearer {token}",
  "X-User-ID": "{userId}",
  "X-Request-ID": "{requestId}",
  "X-Timestamp": "{timestamp}",
  "X-Timezone": "{timezone}",
  "X-Language": "{language}",
} as const;

// Environment-specific configurations
export const getApiConfig = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isStaging = process.env.NEXT_PUBLIC_ENV === "staging";
  const isProduction = process.env.NEXT_PUBLIC_ENV === "production";

  return {
    timeout: isProduction
      ? API_CONFIG.TIMEOUT.DEFAULT
      : API_CONFIG.TIMEOUT.DEFAULT * 2,
    retry: {
      maxAttempts: isProduction ? API_CONFIG.RETRY.MAX_ATTEMPTS : 1,
      delay: API_CONFIG.RETRY.DELAY,
    },
    logging: {
      enabled: isDevelopment || isStaging,
      level: isDevelopment ? "debug" : "info",
    },
    cache: {
      enabled: !isDevelopment,
      ttl: isProduction ? API_CONFIG.CACHE.TTL : API_CONFIG.CACHE.TTL / 2,
    },
  };
};

// Helper function to build headers
export const buildHeaders = (
  customHeaders: Record<string, string> = {},
): Record<string, string> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const language =
    typeof window !== "undefined"
      ? localStorage.getItem("language") || "en"
      : "en";
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const dynamicHeaders = {
    ...DEFAULT_HEADERS,
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(userId && { "X-User-ID": userId }),
    ...(language && { "X-Language": language }),
    "X-Timezone": timezone,
    "X-Request-ID": `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    "X-Timestamp": new Date().toISOString(),
    ...customHeaders,
  };

  return dynamicHeaders;
};

// Helper function to get service-specific headers
export const getServiceHeaders = (
  service: string,
  customHeaders: Record<string, string> = {},
): Record<string, string> => {
  const baseHeaders = buildHeaders();

  // Add service-specific headers
  const serviceHeaders = {
    ...baseHeaders,
    "X-Service": service,
    ...customHeaders,
  };

  return serviceHeaders;
};

// Error codes and messages
export const API_ERRORS = {
  NETWORK_ERROR: {
    code: "NETWORK_ERROR",
    message: "Network error - please check your connection",
    status: 0,
  },
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    message: "Authentication required",
    status: 401,
  },
  FORBIDDEN: {
    code: "FORBIDDEN",
    message: "Access denied - insufficient permissions",
    status: 403,
  },
  NOT_FOUND: {
    code: "NOT_FOUND",
    message: "Resource not found",
    status: 404,
  },
  VALIDATION_ERROR: {
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    status: 422,
  },
  SERVER_ERROR: {
    code: "SERVER_ERROR",
    message: "Internal server error",
    status: 500,
  },
  SERVICE_UNAVAILABLE: {
    code: "SERVICE_UNAVAILABLE",
    message: "Service temporarily unavailable",
    status: 503,
  },
} as const;

// Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;
