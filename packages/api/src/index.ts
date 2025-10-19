import { router } from "./trpc";
import { healthRouter } from "./routers/health";

/**
 * Root tRPC router
 * Compose all module routers here
 */
export const appRouter = router({
	health: healthRouter,
	// Add more routers as modules are developed:
	// habits: habitsRouter,
	// todos: todosRouter,
	// subscriptions: subscriptionsRouter,
	// series: seriesRouter,
});

/**
 * Export type for use in frontend
 * This enables full type safety across your app
 */
export type AppRouter = typeof appRouter;

/**
 * Re-export utilities for server setup
 */
export { createContext } from "./trpc";
export type { Context } from "./trpc";
