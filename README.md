# Task Manager

A Next.js 14 App Router project organized under `src/` with Vitest for testing.

## Directory Structure

Top-level layout (selected):

```text
task-manager/
└─ task-manager/                  # Next.js app root
   ├─ src/                        # All source code
   │  ├─ app/                     # App Router pages, layouts, routes
   │  │  ├─ layout.tsx
   │  │  └─ page.tsx
   │  └─ lib/                     # Shared types and data utilities
   │     ├─ data.ts
   │     └─ types.ts
   ├─ __tests__/                  # Tests (unit, integration, e2e)
   │  ├─ setup.ts
   │  ├─ unit/
   │  ├─ integration/
   │  └─ e2e/
   ├─ next.config.js
   ├─ tsconfig.json
   ├─ vitest.config.ts
   ├─ package.json
   └─ package-lock.json
```

Path alias `@/*` points to `src/*` (see `tsconfig.json` and `vitest.config.ts`).

## Prerequisites

- Node.js 18+
- npm 9+ (or a compatible package manager)

## Install Dependencies

```bash
cd task-manager/task-manager
npm install
```

## Run the App (Development)

```bash
npm run dev
# or specify a port
npm run dev -- -p 3001
```

## Build and Start (Production)

```bash
npm run build
npm start
# or on a different port
npm start -- -p 3001
# alternatively
PORT=3001 npm start
```

If you see "EADDRINUSE: address already in use :::3000", free the port:

```bash
lsof -iTCP:3000 -sTCP:LISTEN -n -P | awk 'NR>1 {print $2}' | xargs -r kill -15
# or
npx kill-port 3000
```

## Testing

Vitest is configured with jsdom and Testing Library.

```bash
npm test              # run tests in watch mode
npm run test:run      # run tests once (CI)
npm run test:ui       # Vitest UI
npm run test:coverage # with coverage
```

## Notes

- App Router features (layouts, nested routes, server components) live under `src/app`.
- Shared utilities and types live under `src/lib`.