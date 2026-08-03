import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { appSettings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ locals }) => {
	const adminEmails = (env.ADMIN_EMAILS || process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim());
	const webhookSecret = env.MUSIC_WEBHOOK_SECRET || process.env.MUSIC_WEBHOOK_SECRET || 'brian_music_secret_123';

	const [setting] = await db.select().from(appSettings).where(eq(appSettings.key, 'maintenance_mode')).limit(1);
	const maintenanceMode = setting ? setting.value === 'true' : false;

	return {
		user: locals.user,
		adminEmails,
		webhookSecret,
		maintenanceMode
	};
};

export const actions: Actions = {
	toggleMaintenanceMode: async ({ request }) => {
		const formData = await request.formData();
		const currentMode = formData.get('currentMode') === 'true';

		const newMode = !currentMode ? 'true' : 'false';

		await db
			.insert(appSettings)
			.values({
				key: 'maintenance_mode',
				value: newMode,
				updatedAt: new Date()
			})
			.onConflictDoUpdate({
				target: appSettings.key,
				set: {
					value: newMode,
					updatedAt: new Date()
				}
			});

		return { success: true, message: `Maintenance mode ${newMode === 'true' ? 'ENABLED' : 'DISABLED'}` };
	}
};
