import { z } from "zod";
import { publicProcedure, router } from "../trpc";

/**
 * Health check router
 * Used by Docker healthcheck and monitoring
 */
export const healthRouter = router({
	/**
	 * Basic health check
	 * GET /trpc/health.check
	 *
	 * Returns: { status: "ok", timestamp: "2024-10-19T00:00:00.000Z" }
	 */
	check: publicProcedure.query(() => {
		return {
			status: "ok",
			timestamp: new Date().toISOString(),
		};
	}),

	/**
	 * Ping endpoint with optional message
	 * GET /trpc/health.ping?input={"message":"hello"}
	 *
	 * Returns: { pong: true, message: "hello" }
	 */
	ping: publicProcedure
		.input(
			z.object({
				message: z.string().optional(),
			}),
		)
		.query(({ input }) => {
			return {
				pong: true,
				message: input.message || "pong",
			};
		}),

	/**
	 * Detailed health check (future: check DB connection, etc.)
	 * GET /trpc/health.detailed
	 *
	 * Returns: { status: "healthy", uptime: 123.45, ... }
	 */
	detailed: publicProcedure.query(() => {
		return {
			status: "healthy",
			uptime: process.uptime(),
			timestamp: new Date().toISOString(),
			// Future: Add database connectivity check
			// database: await prisma.$queryRaw`SELECT 1`,
		};
	}),
});
