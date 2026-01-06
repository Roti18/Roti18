import { getCache, setCache } from './memory';
import { db } from '$lib/server/db';
import { profile, projects } from '$lib/server/db/schema';

type DashboardData = {
	profile: typeof profile.$inferSelect | null;
	projects: (typeof projects.$inferSelect)[];
};

const TTL = 30 * 1000;

export async function getDashboardData(userId: string): Promise<DashboardData> {
	const key = `dashboard:${userId}`;

	const cached = getCache<DashboardData>(key);
	if (cached) return cached;

	const [userProfile] = await db.select().from(profile).limit(1);

	const allProjects = await db.select().from(projects);

	const data: DashboardData = {
		profile: userProfile ?? null,
		projects: allProjects
	};

	setCache(key, data, TTL);
	return data;
}
