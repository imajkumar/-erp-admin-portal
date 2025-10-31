# Environment Configuration

This document describes how to configure the application for different environments.

## Environment Files

Create the following environment files in the root directory:

### .env.local (Local Development)
```bash
NODE_ENV=development
NEXT_PUBLIC_ENV=local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_VERSION=1.0.0-local
NEXT_PUBLIC_DEBUG=true
```

### .env.staging (Staging Environment)
```bash
NODE_ENV=production
NEXT_PUBLIC_ENV=staging
NEXT_PUBLIC_API_URL=https://staging-api.erp-admin.com/api
NEXT_PUBLIC_VERSION=1.0.0-staging
NEXT_PUBLIC_DEBUG=true
```

### .env.production (Production Environment)
```bash
NODE_ENV=production
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_API_URL=https://api.erp-admin.com/api
NEXT_PUBLIC_VERSION=1.0.0
NEXT_PUBLIC_DEBUG=false
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Node.js environment | `development` | Yes |
| `NEXT_PUBLIC_ENV` | Application environment | `local` | Yes |
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:3000/api` | Yes |
| `NEXT_PUBLIC_VERSION` | Application version | `1.0.0` | No |
| `NEXT_PUBLIC_DEBUG` | Debug mode | `true` | No |

## Usage

The environment configuration is automatically loaded from the appropriate `.env` file based on the `NEXT_PUBLIC_ENV` variable.

```typescript
import { env, apiUrl, environment, debug } from '@/config/env';

console.log('Current environment:', environment);
console.log('API URL:', apiUrl);
console.log('Debug mode:', debug);
```

## API Endpoints

All API endpoints are defined in `src/config/env.ts` under the `API_ENDPOINTS` constant:

- **Auth**: Login, logout, refresh token, profile management
- **Users**: User CRUD operations, bulk operations, export
- **Modules**: Module management and permissions
- **Roles**: Role management and permissions
- **Notifications**: Notification management
- **Settings**: Application settings

## Redux Store Structure

```
src/store/
├── index.ts              # Store configuration
├── hooks.ts              # Typed Redux hooks
├── types/
│   └── index.ts          # TypeScript types
├── slices/
│   ├── authSlice.ts      # Authentication state
│   └── settingsSlice.ts  # Settings state
└── api/
    ├── authApi.ts        # Authentication API
    └── usersApi.ts       # Users API
```

## Getting Started

1. Copy the appropriate environment file to your project root
2. Update the API URLs and other configuration as needed
3. The application will automatically use the correct configuration based on the environment
