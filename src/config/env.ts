export interface MicroserviceConfig {
  auth: string;
  users: string;
  modules: string;
  notifications: string;
  settings: string;
  reports: string;
  inventory: string;
  orders: string;
  payments: string;
}

export interface EnvironmentConfig {
  microservices: MicroserviceConfig;
  environment: "local" | "staging" | "production";
  debug: boolean;
  version: string;
  gateway?: string;
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const nodeEnv = process.env.NODE_ENV || "development";
  const isLocal = nodeEnv === "development";
  const isStaging = process.env.NEXT_PUBLIC_ENV === "staging";
  const isProduction = process.env.NEXT_PUBLIC_ENV === "production";

  // Default to local if no environment is specified
  const environment = isProduction
    ? "production"
    : isStaging
      ? "staging"
      : "local";

  const configs: Record<string, EnvironmentConfig> = {
    local: {
      microservices: {
        auth:
          process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:8061",
        users:
          process.env.NEXT_PUBLIC_USERS_SERVICE_URL || "http://localhost:8081",
        modules:
          process.env.NEXT_PUBLIC_MODULES_SERVICE_URL ||
          "http://localhost:8082",
        notifications:
          process.env.NEXT_PUBLIC_NOTIFICATIONS_SERVICE_URL ||
          "http://localhost:8083",
        settings:
          process.env.NEXT_PUBLIC_SETTINGS_SERVICE_URL ||
          "http://localhost:8084",
        reports:
          process.env.NEXT_PUBLIC_REPORTS_SERVICE_URL ||
          "http://localhost:8085",
        inventory:
          process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL ||
          "http://localhost:8086",
        orders:
          process.env.NEXT_PUBLIC_ORDERS_SERVICE_URL || "http://localhost:8087",
        payments:
          process.env.NEXT_PUBLIC_PAYMENTS_SERVICE_URL ||
          "http://localhost:8088",
      },
      environment: "local",
      debug: true,
      version: process.env.NEXT_PUBLIC_VERSION || "1.0.0-local",
      gateway:
        process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:3000/api",
    },
    staging: {
      microservices: {
        auth:
          process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ||
          "https://auth-staging.erp-admin.com",
        users:
          process.env.NEXT_PUBLIC_USERS_SERVICE_URL ||
          "https://users-staging.erp-admin.com",
        modules:
          process.env.NEXT_PUBLIC_MODULES_SERVICE_URL ||
          "https://modules-staging.erp-admin.com",
        notifications:
          process.env.NEXT_PUBLIC_NOTIFICATIONS_SERVICE_URL ||
          "https://notifications-staging.erp-admin.com",
        settings:
          process.env.NEXT_PUBLIC_SETTINGS_SERVICE_URL ||
          "https://settings-staging.erp-admin.com",
        reports:
          process.env.NEXT_PUBLIC_REPORTS_SERVICE_URL ||
          "https://reports-staging.erp-admin.com",
        inventory:
          process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL ||
          "https://inventory-staging.erp-admin.com",
        orders:
          process.env.NEXT_PUBLIC_ORDERS_SERVICE_URL ||
          "https://orders-staging.erp-admin.com",
        payments:
          process.env.NEXT_PUBLIC_PAYMENTS_SERVICE_URL ||
          "https://payments-staging.erp-admin.com",
      },
      environment: "staging",
      debug: true,
      version: process.env.NEXT_PUBLIC_VERSION || "1.0.0-staging",
      gateway:
        process.env.NEXT_PUBLIC_GATEWAY_URL ||
        "https://gateway-staging.erp-admin.com",
    },
    production: {
      microservices: {
        auth: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://165.22.212.8",
        users:
          process.env.NEXT_PUBLIC_USERS_SERVICE_URL ||
          "https://users.erp-admin.com",
        modules:
          process.env.NEXT_PUBLIC_MODULES_SERVICE_URL ||
          "https://modules.erp-admin.com",
        notifications:
          process.env.NEXT_PUBLIC_NOTIFICATIONS_SERVICE_URL ||
          "https://notifications.erp-admin.com",
        settings:
          process.env.NEXT_PUBLIC_SETTINGS_SERVICE_URL ||
          "https://settings.erp-admin.com",
        reports:
          process.env.NEXT_PUBLIC_REPORTS_SERVICE_URL ||
          "https://reports.erp-admin.com",
        inventory:
          process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL ||
          "https://inventory.erp-admin.com",
        orders:
          process.env.NEXT_PUBLIC_ORDERS_SERVICE_URL ||
          "https://orders.erp-admin.com",
        payments:
          process.env.NEXT_PUBLIC_PAYMENTS_SERVICE_URL ||
          "https://payments.erp-admin.com",
      },
      environment: "production",
      debug: false,
      version: process.env.NEXT_PUBLIC_VERSION || "1.0.0",
      gateway:
        process.env.NEXT_PUBLIC_GATEWAY_URL || "https://gateway.erp-admin.com",
    },
  };

  return configs[environment];
};

export const env = getEnvironmentConfig();

// Export individual config values for convenience
export const { microservices, environment, debug, version, gateway } = env;

// Export individual microservice URLs for convenience
export const {
  auth: authServiceUrl,
  users: usersServiceUrl,
  modules: modulesServiceUrl,
  notifications: notificationsServiceUrl,
  settings: settingsServiceUrl,
  reports: reportsServiceUrl,
  inventory: inventoryServiceUrl,
  orders: ordersServiceUrl,
  payments: paymentsServiceUrl,
} = microservices;

// Microservice-specific API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    BASE_URL: authServiceUrl,
    LOGIN: "/api/v1/auth/login",
    LOGOUT: "/api/v1/auth/logout",
    REFRESH: "/api/v1/auth/refresh",
    PROFILE: "/api/v1/auth/profile",
    REGISTER: "/api/v1/auth/register",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
    VERIFY_EMAIL: "/api/v1/auth/verify-email",
  },
  USERS: {
    BASE_URL: usersServiceUrl,
    LIST: "/users",
    CREATE: "/users",
    UPDATE: "/users/:id",
    DELETE: "/users/:id",
    BULK_DELETE: "/users/bulk-delete",
    EXPORT: "/users/export",
    ACTIVITY: "/users/:id/activity",
    TOGGLE_STATUS: "/users/:id/status",
    RESET_PASSWORD: "/users/:id/reset-password",
    LOGIN_AS: "/users/:id/login-as",
  },
  MODULES: {
    BASE_URL: modulesServiceUrl,
    LIST: "/modules",
    CREATE: "/modules",
    UPDATE: "/modules/:id",
    DELETE: "/modules/:id",
    PERMISSIONS: "/modules/:id/permissions",
    ACTIVATE: "/modules/:id/activate",
    DEACTIVATE: "/modules/:id/deactivate",
  },
  ROLES: {
    BASE_URL: usersServiceUrl, // Roles are managed by users service
    LIST: "/roles",
    CREATE: "/roles",
    UPDATE: "/roles/:id",
    DELETE: "/roles/:id",
    PERMISSIONS: "/roles/:id/permissions",
  },
  NOTIFICATIONS: {
    BASE_URL: notificationsServiceUrl,
    LIST: "/notifications",
    MARK_READ: "/notifications/:id/read",
    MARK_ALL_READ: "/notifications/mark-all-read",
    DELETE: "/notifications/:id",
    SEND: "/notifications/send",
    TEMPLATES: "/notifications/templates",
  },
  SETTINGS: {
    BASE_URL: settingsServiceUrl,
    GENERAL: "/settings/general",
    THEME: "/settings/theme",
    LANGUAGE: "/settings/language",
    NOTIFICATIONS: "/settings/notifications",
    COMPANY: "/settings/company",
    INTEGRATIONS: "/settings/integrations",
  },
  REPORTS: {
    BASE_URL: reportsServiceUrl,
    GENERATE: "/reports/generate",
    LIST: "/reports",
    DOWNLOAD: "/reports/:id/download",
    SCHEDULE: "/reports/schedule",
    TEMPLATES: "/reports/templates",
  },
  INVENTORY: {
    BASE_URL: inventoryServiceUrl,
    PRODUCTS: "/products",
    CATEGORIES: "/categories",
    STOCK: "/stock",
    MOVEMENTS: "/movements",
    SUPPLIERS: "/suppliers",
  },
  ORDERS: {
    BASE_URL: ordersServiceUrl,
    ORDERS: "/orders",
    CUSTOMERS: "/customers",
    QUOTATIONS: "/quotations",
    INVOICES: "/invoices",
    PAYMENTS: "/payments",
  },
  PAYMENTS: {
    BASE_URL: paymentsServiceUrl,
    TRANSACTIONS: "/transactions",
    METHODS: "/payment-methods",
    REFUNDS: "/refunds",
    RECONCILIATION: "/reconciliation",
  },
} as const;

// Helper function to get full URL for a microservice endpoint
export const getMicroserviceUrl = (
  service: keyof MicroserviceConfig,
  endpoint: string,
): string => {
  const baseUrl = microservices[service];
  return `${baseUrl}${endpoint}`;
};

// Helper function to get API endpoint with full URL
export const getApiUrl = (
  service: keyof typeof API_ENDPOINTS,
  endpoint: string,
): string => {
  const serviceConfig = API_ENDPOINTS[service];
  if ("BASE_URL" in serviceConfig) {
    return `${serviceConfig.BASE_URL}${endpoint}`;
  }
  throw new Error(`Service ${service} does not have a BASE_URL configured`);
};
