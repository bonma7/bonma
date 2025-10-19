import type { AppRouter } from "@bonma/api";
import { createTRPCReact } from "@trpc/react-query";

/**
 * Create tRPC React hooks
 * This gives you type-safe hooks like:
 * - trpc.health.check.useQuery()
 * - trpc.health.ping.useQuery()
 */
export const trpc = createTRPCReact<AppRouter>();
