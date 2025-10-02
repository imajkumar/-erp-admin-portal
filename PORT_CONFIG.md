# Port Configuration Guide

This document explains how to configure the application to run on different ports.

## Default Configuration

The application is configured to run on **port 3001** by default.

## Ways to Configure Port

### 1. Using npm scripts (Recommended)

The following npm scripts are available for different ports:

```bash
# Development server
npm run dev          # Runs on port 3001 (default)
npm run dev:3000     # Runs on port 3000
npm run dev:3001     # Runs on port 3001
npm run dev:3002     # Runs on port 3002
npm run dev:custom   # You can specify custom port: npm run dev:custom 4000

# Production server
npm run start        # Runs on port 3001 (default)
npm run start:3000   # Runs on port 3000
npm run start:3001   # Runs on port 3001
npm run start:3002   # Runs on port 3002
npm run start:custom # You can specify custom port: npm run start:custom 4000
```

### 2. Using Environment Variables

Create a `.env.local` file in the root directory:

```env
# Default port for development server
PORT=3001

# Alternative ports for different environments
DEV_PORT=3001
STAGING_PORT=3002
PRODUCTION_PORT=3000
```

### 3. Using Command Line Environment Variables

```bash
# Set port via environment variable
PORT=3002 npm run dev
PORT=3000 npm run start

# Or export the variable
export PORT=3002
npm run dev
```

### 4. Using Next.js CLI Directly

```bash
# Development
npx next dev --port 3001
npx next dev --port 3002

# Production
npx next start --port 3001
npx next start --port 3002
```

## Port Priority

The port configuration follows this priority order:

1. **Command line argument** (`--port` flag)
2. **Environment variable** (`PORT`)
3. **Default port** (3001)

## Common Port Configurations

### Development Environment
- **Port 3001**: Default development port
- **Port 3000**: Alternative development port
- **Port 3002**: Staging/QA environment

### Production Environment
- **Port 3000**: Standard production port
- **Port 80**: HTTP standard port (requires sudo)
- **Port 443**: HTTPS standard port (requires sudo)

## Microservice Integration

The application is configured to work with microservices on different ports:

- **Auth Service**: 8061
- **Users Service**: 8081
- **Modules Service**: 8082
- **Notifications Service**: 8083
- **Settings Service**: 8084
- **Reports Service**: 8085
- **Inventory Service**: 8086
- **Orders Service**: 8087
- **Payments Service**: 8088

## Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

```bash
# Find process using the port
lsof -i :3001

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or use a different port
npm run dev:3002
```

### Permission Issues

For ports below 1024 (like 80, 443), you may need sudo:

```bash
# Not recommended for development
sudo PORT=80 npm run start
```

## Examples

### Running Multiple Instances

```bash
# Terminal 1 - Development on port 3001
npm run dev

# Terminal 2 - Staging on port 3002
npm run dev:3002

# Terminal 3 - Production on port 3000
npm run start:3000
```

### Docker Configuration

```dockerfile
# Dockerfile
EXPOSE 3001
ENV PORT=3001

# docker-compose.yml
services:
  app:
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
```

### Environment-Specific Configuration

```bash
# Development
NODE_ENV=development PORT=3001 npm run dev

# Staging
NODE_ENV=production PORT=3002 npm run start

# Production
NODE_ENV=production PORT=3000 npm run start
```

## Notes

- The application will automatically restart when you change the port configuration
- Make sure the port is not being used by other applications
- Update any reverse proxy configurations (nginx, apache) when changing ports
- Update firewall rules if needed for the new port

