import { appRouter, createContext } from "@bonma/api";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import Fastify from "fastify";

// Configuration from environment variables
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// Create Fastify instance
const server = Fastify({
	logger: {
		level: process.env.LOG_LEVEL || "info",
		transport:
			process.env.NODE_ENV === "development"
				? {
						target: "pino-pretty",
						options: {
							translateTime: "HH:MM:ss Z",
							ignore: "pid,hostname",
						},
					}
				: undefined,
	},
	maxParamLength: 5000,
});

// Enable CORS
await server.register(cors, {
	origin: CORS_ORIGIN,
	credentials: true,
});

// Register tRPC with Fastify
server.register(fastifyTRPCPlugin, {
	prefix: "/trpc",
	trpcOptions: {
		router: appRouter,
		createContext,
	},
});

// Simple HTTP health check (non-tRPC)
// This is useful for load balancers that don't support tRPC
server.get("/health", async () => {
	return {
		status: "ok",
		timestamp: new Date().toISOString(),
	};
});

// Root endpoint
server.get("/", async () => {
	return {
		name: "Bonma API",
		version: "0.0.1",
		endpoints: {
			health: "/health",
			trpc: "/trpc",
			healthCheck: "/trpc/health.check",
		},
	};
});

// Start server
try {
	await server.listen({ port: PORT, host: HOST });
	console.log(`
╔════════════════════════════════════════════╗
║   🚀 Bonma Server Ready                   ║
╟────────────────────────────────────────────╢
║   API:     http://${HOST}:${PORT}           ║
║   tRPC:    http://${HOST}:${PORT}/trpc     ║
║   Health:  http://${HOST}:${PORT}/health   ║
╚════════════════════════════════════════════╝
  `);
} catch (err) {
	server.log.error(err);
	process.exit(1);
}
