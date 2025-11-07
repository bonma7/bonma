# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bonma** is a Modular Daily Assistant - a customizable personal dashboard built as a full-stack TypeScript monorepo using Bun workspaces. The architecture emphasizes type safety, modern tooling, and clean separation of concerns.

**Tech Stack:**
- **Runtime:** Bun (with Node.js compatibility)
- **Backend:** Fastify + tRPC for type-safe RPC
- **Database:** SQLite with Prisma ORM
- **Frontend:** React 19 + Vite + Tailwind CSS 4
- **UI Components:** shadcn/ui with Radix UI primitives
- **Tooling:** Biome for linting/formatting, TypeScript strict mode

## Common Commands

### Development

Start both server and web app in separate terminals:

```bash
# Terminal 1 - Start backend server (port 3001)
cd apps/server
bun dev

# Terminal 2 - Start frontend dev server (port 5173)
cd apps/web
bun dev
```

### Database Operations

```bash
cd packages/db

# Generate Prisma client (run after schema changes)
bun generate

# Create and apply migrations
bun migrate

# Push schema without creating migrations (for prototyping)
bun push

# Open Prisma Studio GUI
bun studio
```

### Building

```bash
# Build server for production
cd apps/server
bun build

# Build web app for production
cd apps/web
bun build

# Preview production build
cd apps/web
bun preview
```

### Code Quality

```bash
# Format and lint entire codebase (from root)
bunx @biomejs/biome format --write .
bunx @biomejs/biome check --write .

# Type check specific packages
cd apps/server && bun type-check
cd packages/db && bun type-check
```

## Architecture

### Monorepo Structure

```
bonma/
├── apps/
│   ├── server/     # Fastify backend (port 3001)
│   └── web/        # React frontend (port 5173)
└── packages/
    ├── api/        # tRPC router definitions
    ├── db/         # Prisma database layer
    ├── ui/         # Shared React components (shadcn/ui)
    └── config/     # Shared TypeScript configs
```

### Type-Safe Data Flow

The project achieves end-to-end type safety through tRPC:

1. **Database Schema** (`packages/db/prisma/schema.prisma`): Define data models
2. **API Procedures** (`packages/api/src/routers/*.ts`): Define tRPC procedures with Zod validation
3. **Router Composition** (`packages/api/src/index.ts`): Combine routers and export `AppRouter` type
4. **Frontend Client** (`apps/web/src/lib/trpc.ts`): Create typed tRPC client from `AppRouter`
5. **React Components**: Use type-safe hooks like `trpc.settings.list.useQuery()`

**Important:** When adding new API endpoints:
- Create/update router in `packages/api/src/routers/`
- Add to `appRouter` in `packages/api/src/index.ts`
- Types automatically flow to frontend - no code generation needed

### Request Flow

```
Frontend Component
  ↓ trpc.settings.list.useQuery()
  ↓ HTTP POST → http://localhost:3001/trpc/settings.list
Backend (apps/server)
  ↓ Fastify receives request
  ↓ tRPC routes to procedure
API Layer (packages/api)
  ↓ settingsRouter.list({ ctx })
  ↓ ctx.prisma.setting.findMany()
Database (packages/db)
  ↓ Prisma query to SQLite
  ↓ Return typed response
```

### Package Dependencies

```
apps/web → @bonma/ui (components)
         → (infers types from @bonma/api via tRPC)

apps/server → @bonma/api (router + context)

packages/api → @bonma/db (Prisma client)
```

All internal dependencies use `workspace:*` protocol.

### tRPC Context Pattern

The tRPC context provides shared resources to all procedures:

```typescript
// packages/api/src/trpc.ts
export const createContext = async () => ({ prisma });

// Used in procedures as:
settingsRouter.list.query(async ({ ctx }) => {
  return ctx.prisma.setting.findMany();
});
```

When adding new context dependencies, update `createContext()` in `packages/api/src/trpc.ts`.

### Prisma Singleton Pattern

The database client uses a singleton pattern to prevent multiple instances during hot-reload (`packages/db/src/client.ts`). Always import from `@bonma/db` rather than creating new PrismaClient instances.

### shadcn/ui Component Architecture

The `@bonma/ui` package follows shadcn/ui's "copy-paste" pattern:
- Components are copied into the repository (not npm packages)
- Customizable via variants (class-variance-authority)
- Styled with Tailwind CSS variables for theming
- Configuration in `apps/web/components.json`

To add new shadcn components, use the CLI in the web app directory.

## Key Implementation Patterns

### Adding a New Database Model

1. Update schema: `packages/db/prisma/schema.prisma`
2. Generate Prisma client: `cd packages/db && bun generate`
3. Create migration: `bun migrate`
4. Create tRPC router: `packages/api/src/routers/your-model.ts`
5. Add to app router: `packages/api/src/index.ts`
6. Use in frontend: `trpc.yourModel.list.useQuery()`

### Adding a New API Endpoint

1. Define procedure in appropriate router (`packages/api/src/routers/`)
2. Use Zod for input validation
3. Access database via `ctx.prisma`
4. Types automatically available in frontend

Example:
```typescript
export const settingsRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.setting.findMany();
  }),
});
```

### Environment Configuration

The server uses environment variables with defaults:
- `PORT` (default: 3001)
- `HOST` (default: 0.0.0.0)
- `CORS_ORIGIN` (default: http://localhost:5173)
- `LOG_LEVEL` (default: info)
- `DATABASE_URL` (default: file:./dev.db)

Set these in `apps/server/.env` or as environment variables.

## Development Notes

### Bun-Specific Patterns

- Use `bun --watch` for hot-reload in development
- Bun's native bundler for server builds
- Bun workspaces manage monorepo dependencies

### TypeScript Configuration

All packages extend `packages/config/tsconfig.base.json` which enforces:
- Strict mode enabled
- `@tsconfig/bun` and `@tsconfig/strictest` presets
- Module detection forced
- Skip lib check enabled for faster builds

### Styling System

- Tailwind CSS 4.x with CSS variables for theming
- Theme tokens defined in `apps/web/src/index.css`
- Dark mode support via CSS variables
- Component variants managed with class-variance-authority

### Database Location

SQLite database file location is controlled by `DATABASE_URL` in `packages/db/.env` (defaults to `file:./dev.db`). The database is gitignored.

### Future Module Placeholders

The codebase has comments indicating planned features:
- Habits tracking
- Todos management
- Subscriptions
- Series tracking

When implementing these, follow the existing router pattern in `packages/api/src/routers/`.
