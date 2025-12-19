import { db } from '$lib/server/db';
import { hero, profile, projects } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export async function load() {
	const [heroData] = await db.select().from(hero).limit(1);
	const [profileData] = await db.select().from(profile).limit(1);
	const projectData = await db.select().from(projects).orderBy(desc(projects.id));

	return {
		hero: heroData,
		profile: profileData,
		projects: projectData
	};
}
