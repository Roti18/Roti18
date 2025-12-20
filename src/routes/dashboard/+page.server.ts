import { redirect, error } from '@sveltejs/kit';
import { getDashboardData } from '$lib/server/cache/dashboard';
import { db } from '$lib/server/db';
import { hero } from '$lib/server/db/schema';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	try {
		const dashboard = await getDashboardData(locals.user.id);
		const [heroData] = await db.select().from(hero).limit(1);

		return {
			hero: heroData ?? null,
			profile: dashboard.profile,
			projects: dashboard.projects
		};
	} catch (e) {
		console.error('Failed to load dashboard data:', e);
		throw error(500, 'Failed to load dashboard data.');
	}
};
