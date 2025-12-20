import { redirect } from '@sveltejs/kit';
import { getDashboardData } from '$lib/server/cache/dashboard';
import { db } from '$lib/server/db';
import { hero } from '$lib/server/db/schema';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const dashboard = await getDashboardData(locals.user.id);

	const [heroData] = await db.select().from(hero).limit(1);

	return {
		hero: heroData ?? null,
		profile: dashboard.profile,
		projects: dashboard.projects
	};
};
