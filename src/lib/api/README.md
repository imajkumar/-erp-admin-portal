# API System Documentation

This document describes the centralized API system built with Axios for the ERP Admin Portal.

## Overview

The API system provides a standardized way to interact with microservices, with centralized header management, error handling, and authentication.

## Architecture

```
src/lib/api/
├── client.ts              # Main Axios client with interceptors
├── config.ts              # API configuration and constants
├── index.ts               # Main exports and service registry
├── services/              # Service-specific API classes
│   ├── authService.ts     # Authentication endpoints
│   ├── usersService.ts    # User management endpoints
│   ├── modulesService.ts  # Module management endpoints
│   └── notificationsService.ts # Notification endpoints
└── examples/
    └── usage.ts           # Usage examples
```

## Features

- **Centralized Header Management**: All headers are managed in one place
- **Automatic Authentication**: Tokens are automatically added to requests
- **Error Handling**: Comprehensive error handling with retry logic
- **Type Safety**: Full TypeScript support
- **Microservice Support**: Separate clients for each microservice
- **Request/Response Interceptors**: Automatic logging and error handling
- **File Upload/Download**: Built-in support for file operations
- **Caching**: Optional response caching
- **WebSocket Support**: Real-time notifications

## Quick Start

### 1. Using the useApi Hook (Recommended for React Components)

```typescript
import { useApi } from '@/hooks/useApi';

function MyComponent() {
  const { auth, users, apiCall } = useApi();

  const handleLogin = async () => {
    const result = await auth.login({
      email: 'user@example.com',
      password: 'password123'
    });
    
    if (result) {
      console.log('Login successful:', result);
    }
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### 2. Using Services Directly

```typescript
import { AuthService, UsersService } from '@/lib/api';

// Login
const response = await AuthService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Get users
const users = await UsersService.getUsers({
  search: 'john',
  status: 'active',
  page: 1,
  limit: 10
});
```

### 3. Custom API Calls

```typescript
import { apiClient } from '@/lib/api';

// Custom request
const response = await apiClient.get('users', '/users', {
  params: { search: 'john' }
});

// File upload
const formData = new FormData();
formData.append('file', file);
const uploadResponse = await apiClient.upload('users', '/upload', formData);
```

## Configuration

### Environment Variables

```env
# Microservice URLs
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8080
NEXT_PUBLIC_USERS_SERVICE_URL=http://localhost:8081
NEXT_PUBLIC_MODULES_SERVICE_URL=http://localhost:8082
NEXT_PUBLIC_NOTIFICATIONS_SERVICE_URL=http://localhost:8083

# WebSocket URL
NEXT_PUBLIC_WS_URL=ws://localhost:8083

# Environment
NEXT_PUBLIC_ENV=local
NEXT_PUBLIC_VERSION=1.0.0
```

### API Configuration

```typescript
import { API_CONFIG } from '@/lib/api/config';

// Timeout settings
API_CONFIG.TIMEOUT.DEFAULT // 30 seconds
API_CONFIG.TIMEOUT.UPLOAD  // 5 minutes

// Retry settings
API_CONFIG.RETRY.MAX_ATTEMPTS // 3 attempts
API_CONFIG.RETRY.DELAY        // 1 second delay

// Pagination defaults
API_CONFIG.PAGINATION.DEFAULT_PAGE  // 1
API_CONFIG.PAGINATION.DEFAULT_LIMIT // 20
```

## Services

### AuthService

Authentication and user profile management.

```typescript
// Login
await AuthService.login({ email, password });

// Get profile
await AuthService.getProfile();

// Update profile
await AuthService.updateProfile(profileData);

// 2FA
await AuthService.enable2FA();
await AuthService.verify2FA(token);
```

### UsersService

User management and role-based access control.

```typescript
// Get users
await UsersService.getUsers(filters);

// Create user
await UsersService.createUser(userData);

// Update user
await UsersService.updateUser(id, data);

// Role management
await UsersService.getRoles();
await UsersService.assignUserRoles(userId, roleIds);
```

### ModulesService

Module and permission management.

```typescript
// Get modules
await ModulesService.getModules(filters);

// Create module
await ModulesService.createModule(moduleData);

// Module permissions
await ModulesService.getModulePermissions(moduleId);
await ModulesService.createPermission(moduleId, permissionData);
```

### NotificationsService

Notification management and real-time updates.

```typescript
// Get notifications
await NotificationsService.getNotifications(filters);

// Send notification
await NotificationsService.sendNotification(data);

// Real-time subscription
const ws = NotificationsService.subscribeToNotifications(userId);
```

## Error Handling

### Automatic Error Handling

The API client automatically handles common errors:

- **401 Unauthorized**: Redirects to login page
- **403 Forbidden**: Shows access denied message
- **404 Not Found**: Shows not found message
- **5xx Server Errors**: Shows server error message
- **Network Errors**: Shows connection error message

### Custom Error Handling

```typescript
try {
  const result = await UsersService.getUsers();
} catch (error) {
  if (error.status === 401) {
    // Handle unauthorized
  } else if (error.status === 403) {
    // Handle forbidden
  } else {
    // Handle other errors
  }
}
```

## Headers

### Default Headers

All requests automatically include:

```typescript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {token}',
  'X-User-ID': '{userId}',
  'X-Request-ID': '{requestId}',
  'X-Timestamp': '{timestamp}',
  'X-Timezone': '{timezone}',
  'X-Language': '{language}',
  'X-Client-Version': '1.0.0',
  'X-Client-Platform': 'web',
  'X-Request-Source': 'admin-portal'
}
```

### Custom Headers

```typescript
// Add custom headers globally
apiClient.setGlobalHeaders({
  'X-Custom-Header': 'value'
});

// Add headers to specific request
await apiClient.get('users', '/users', {
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

## File Operations

### Upload

```typescript
const formData = new FormData();
formData.append('file', file);

const response = await apiClient.upload('users', '/upload', formData);
```

### Download

```typescript
const blob = await apiClient.download('users', '/export');
const url = window.URL.createObjectURL(blob);
// Create download link
```

## Caching

### Enable Caching

```typescript
import { ApiCache } from '@/lib/api/examples/usage';

const data = await ApiCache.get(
  'users',
  () => UsersService.getUsers(),
  5 * 60 * 1000 // 5 minutes TTL
);
```

## WebSocket Support

### Real-time Notifications

```typescript
const ws = NotificationsService.subscribeToNotifications(userId);

ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  // Handle notification
};
```

## Testing

### Mock API Calls

```typescript
// Mock the API client
jest.mock('@/lib/api', () => ({
  AuthService: {
    login: jest.fn().mockResolvedValue({
      success: true,
      data: { accessToken: 'mock-token' }
    })
  }
}));
```

## Best Practices

1. **Use the useApi hook** for React components
2. **Handle errors gracefully** with try-catch blocks
3. **Use TypeScript** for type safety
4. **Cache frequently accessed data** to improve performance
5. **Use pagination** for large datasets
6. **Implement retry logic** for critical operations
7. **Log API calls** in development mode
8. **Use WebSocket** for real-time updates

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure microservices have proper CORS configuration
2. **Authentication Issues**: Check token storage and refresh logic
3. **Network Timeouts**: Adjust timeout settings in config
4. **Memory Leaks**: Clear caches and close WebSocket connections

### Debug Mode

Enable debug logging:

```typescript
// In development
process.env.NODE_ENV = 'development';

// API calls will be logged to console
```

## Migration Guide

### From RTK Query

```typescript
// Old RTK Query
const { data, error, isLoading } = useGetUsersQuery(filters);

// New API system
const { users } = useApi();
const [data, setData] = useState(null);
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  const fetchUsers = async () => {
    setIsLoading(true);
    const result = await users.getUsers(filters);
    setData(result);
    setIsLoading(false);
  };
  fetchUsers();
}, [filters]);
```

## Contributing

When adding new services:

1. Create a new service file in `src/lib/api/services/`
2. Export the service in `src/lib/api/index.ts`
3. Add the service to the `services` registry
4. Update the `useApi` hook if needed
5. Add TypeScript interfaces for request/response types
6. Write tests for the new service
7. Update this documentation
