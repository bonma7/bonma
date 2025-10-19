import { prisma } from "@bonma/db";
import { initTRPC } from "@trpc/server";

/**
 * Create context for tRPC procedures
 * This will be available in all your API routes
 */
export const createContext = () => {
	return {
		prisma,
	};
};

export type Context = Awaited<ReturnType<typeof createContext>>;

/**
 * Initialize tRPC with context
 */
const t = initTRPC.context<Context>().create();

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;
