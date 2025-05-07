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

```