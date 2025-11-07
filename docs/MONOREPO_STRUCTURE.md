# Bonma Monorepo Structure

```
bonma/
├── apps/
│   ├── web/                          # Frontend application
│   │   ├── src/
│   │   │   ├── main.tsx              # Entry point
│   │   │   ├── App.tsx               # Root component
│   │   │   ├── routes/               # React Router routes
│   │   │   │   ├── index.tsx         # Dashboard home
│   │   │   │   ├── habits/           # Habits module routes
│   │   │   │   ├── todos/            # Todos module routes
│   │   │   │   ├── subscriptions/    # Subscriptions module routes
│   │   │   │   └── series/           # Series tracker routes
│   │   │   ├── components/           # Page-specific components
│   │   │   ├── lib/
│   │   │   │   ├── trpc.ts           # tRPC client setup
│   │   │   │   └── utils.ts          # Utility functions
│   │   │   └── styles/
│   │   │       └── globals.css       # Tailwind imports
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.js
│   │   └── package.json
│   │
│   └── server/                       # Backend application
│       ├── src/
│       │   ├── index.ts              # Fastify server entry
│       │   ├── app.ts                # Fastify app configuration
│       │   ├── trpc/
│       │   │   ├── context.ts        # tRPC context
│       │   │   ├── router.ts         # Root tRPC router
│       │   │   └── trpc.ts           # tRPC instance
│       │   ├── env.ts                # Environment validation
│       │   └── lib/
│       │       └── utils.ts
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── api/                          # tRPC API routers (shared)
│   │   ├── src/
│   │   │   ├── index.ts              # Export all routers
│   │   │   ├── routers/
│   │   │   │   ├── habits.ts         # Habits module API
│   │   │   │   ├── todos.ts          # Todos module API
│   │   │   │   ├── subscriptions.ts  # Subscriptions module API
│   │   │   │   ├── series.ts         # Series tracker API
│   │   │   │   └── health.ts         # Health check endpoint
│   │   │   └── types/
│   │   │       └── index.ts          # Shared types
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── db/                           # Database layer (Prisma)
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Main schema
│   │   │   ├── migrations/           # Migration files
│   │   │   └── seed.ts               # Seed data
│   │   ├── src/
│   │   │   ├── index.ts              # Export Prisma client
│   │   │   └── client.ts             # Prisma client singleton
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── ui/                           # Shared UI components (Shadcn)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/               # Shadcn base components
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   ├── checkbox.tsx
│   │   │   │   │   ├── input.tsx
│   │   │   │   │   └── ...
│   │   │   │   ├── habits/           # Habits module components
│   │   │   │   │   ├── HabitCard.tsx
│   │   │   │   │   ├── HabitList.tsx
│   │   │   │   │   └── HabitForm.tsx
│   │   │   │   ├── todos/            # Todos module components
│   │   │   │   │   ├── TodoItem.tsx
│   │   │   │   │   ├── TodoList.tsx
│   │   │   │   │   └── TodoForm.tsx
│   │   │   │   ├── subscriptions/    # Subscription components
│   │   │   │   │   └── ...
│   │   │   │   └── series/           # Series tracker components
│   │   │   │       └── ...
│   │   │   ├── hooks/                # Shared React hooks
│   │   │   │   └── use-toast.ts
│   │   │   └── lib/
│   │   │       └── utils.ts          # cn() helper, etc.
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.ts        # Shared Tailwind config
│   │   └── package.json
│   │
│   └── config/                       # Shared configs
│       ├── biome.json                # Biome config (linting/formatting)
│       ├── tsconfig.base.json        # Base TypeScript config
│       └── package.json
│
├── .env.example                      # Environment template
├── .env                              # Local environment (gitignored)
├── .gitignore
├── docker-compose.yml                # Docker orchestration
├── Dockerfile                        # Production build
├── package.json                      # Root workspace config
├── pnpm-workspace.yaml               # pnpm workspace definition
├── pnpm-lock.yaml
├── biome.json                        # Root Biome config
├── README.md
└── MONOREPO_STRUCTURE.md            # This file
```

## Key Design Principles

### 1. **Modular by Module Type**
Each feature (habits, todos, subscriptions, series) has code in:
- `packages/api/src/routers/` - Backend logic
- `packages/ui/src/components/` - Shared components
- `apps/web/src/routes/` - Page routing

### 2. **Shared Packages**
- **`@bonma/api`** - tRPC routers, business logic
- **`@bonma/db`** - Prisma client, database access
- **`@bonma/ui`** - Reusable React components
- **`@bonma/config`** - Shared configuration

### 3. **Type Safety Flow**
```
Prisma Schema (@bonma/db)
    ↓
tRPC Routers (@bonma/api)
    ↓
Frontend (apps/web) - Full type inference!
```

### 4. **Independent Deployments**
- `apps/web` → Static hosting (Vercel, Netlify, Nginx)
- `apps/server` → Node.js server (Docker, VPS, Railway)
- Can be deployed together or separately

## Package Dependencies

```
apps/web
├── @bonma/api
├── @bonma/ui
└── @bonma/config

apps/server
├── @bonma/api
├── @bonma/db
└── @bonma/config

packages/api
└── @bonma/db

packages/ui
└── @bonma/config

packages/db
└── (no internal deps)

packages/config
└── (no internal deps)
```

## Development Workflow

```bash
# Install all dependencies
pnpm install

# Run database migrations
pnpm --filter @bonma/db db:migrate

# Run dev servers (both frontend + backend)
pnpm dev

# Run only frontend
pnpm --filter web dev

# Run only backend
pnpm --filter server dev

# Format all code with Biome
pnpm format

# Lint all code with Biome
pnpm lint

# Build for production
pnpm build
```

## AI Agent Workflow

Each module can be developed independently:

1. **Database Schema** → `packages/db/prisma/schema.prisma`
2. **API Router** → `packages/api/src/routers/habits.ts`
3. **UI Components** → `packages/ui/src/components/habits/`
4. **Routes** → `apps/web/src/routes/habits/`

AI agents can work in parallel on different modules without conflicts!

## Module Toggle Strategy

Add a `modules` table in Prisma:

```prisma
model Module {
  id        String   @id
  name      String   // "habits", "todos", etc.
  enabled   Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Frontend checks module status before rendering.
