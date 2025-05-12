# Serenity Server

## Description

A Node.js web application server built with modern practices and clean architecture.

## Prerequisites

- Node.js >= 22.14.0
- pnpm >= 10.10.0
- Podman >= 4.0.0
- Podman Compose >= 1.0.0

## Installation

```bash
pnpm install
```

## Development

1. Start the development dependencies (PostgreSQL):
```bash
podman-compose up -d
```

2. Start the development server with auto-reload:
```bash
pnpm dev
```

Start with specific log level:
```bash
LOG_LEVEL=debug pnpm dev
```

To stop the development dependencies:
```bash
podman-compose down
```

## Scripts

- `pnpm start` - Start the production server
- `pnpm dev` - Start the development server with auto-reload
- `pnpm test` - Run all tests
- `pnpm test --watch` - Run tests in watch mode, automatically re-running tests on file changes


## Debugging the container build

```
podman build -t my-node-app .
```

ensure keys directory exists
```
mkdir keys
```

```
podman run -p 5680:5680 \
    -e PORT=5680 \
    -e HOST=0.0.0.0 \
    -e DOMAIN=localhost:5680 \
    -e POSTGRES_USER=user \
    -e POSTGRES_PASSWORD=password \
    -e POSTGRES_HOST=host.containers.internal \
    -e POSTGRES_PORT=7891 \
    -e POSTGRES_DB=serenity \
    -e LOG_LEVEL=debug \
    -e LOG_PII=true \
    -e ENVIRONMENT=Development \
    -e PRIV_KEY_PATH=/keys/private.pem \
    -e PUB_KEY_PATH=/keys/public.pem \
    -v $(pwd)/keys:/keys:z \
    my-node-app
```