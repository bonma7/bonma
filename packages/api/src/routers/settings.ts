import { z } from "zod";
import { publicProcedure, router } from "../trpc";

/**
 * Settings Router - Key-Value Store for App Preferences
 *
 * Endpoints:
 * - list: Get all settings
 * - get: Get a specific setting by key
 * - set: Create or update a setting (upsert)
 * - delete: Delete a setting
 */
export const settingsRouter = router({
	/**
	 * Get all settings
	 * GET /trpc/settings.list
	 */
	list: publicProcedure.query(async ({ ctx }) => {
		return ctx.prisma.setting.findMany({
			orderBy: { createdAt: "asc" },
		});
	}),

	/**
	 * Get a specific setting by key
	 * GET /trpc/settings.get?input={"key":"theme"}
	 */
	get: publicProcedure
		.input(z.object({ key: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.prisma.setting.findUnique({
				where: { key: input.key },
			});
		}),

	/**
	 * Create or update a setting (upsert)
	 * POST /trpc/settings.set
	 */
	set: publicProcedure
		.input(
			z.object({
				key: z.string().min(1, "Key is required"),
				value: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.prisma.setting.upsert({
				where: { key: input.key },
				update: { value: input.value },
				create: {
					key: input.key,
					value: input.value,
				},
			});
		}),

	/**
	 * Delete a setting
	 * POST /trpc/settings.delete
	 */
	delete: publicProcedure
		.input(z.object({ key: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.prisma.setting.delete({
				where: { key: input.key },
			});
		}),
});
