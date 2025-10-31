// Export API client and types
export { apiClient } from "./client";
export type {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  RequestInterceptor,
  ResponseInterceptor,
} from "./client";

// Export all services
export { AuthService } from "./services/authService";
export { UsersService } from "./services/usersService";
export { ModulesService } from "./services/modulesService";
export { NotificationsService } from "./services/notificationsService";

// Re-export convenience methods
export { get, post, put, patch, del, upload, download } from "./client";

// Import services for registry
import { AuthService } from "./services/authService";
import { UsersService } from "./services/usersService";
import { ModulesService } from "./services/modulesService";
import { NotificationsService } from "./services/notificationsService";

// Service registry for easy access
export const services = {
  auth: AuthService,
  users: UsersService,
  modules: ModulesService,
  notifications: NotificationsService,
} as const;

// Type for service names
export type ServiceName = keyof typeof services;

// Helper function to get service by name
export function getService<T extends ServiceName>(
  serviceName: T,
): (typeof services)[T] {
  return services[serviceName];
}
