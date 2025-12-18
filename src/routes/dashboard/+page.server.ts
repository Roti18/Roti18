import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { hero, profile, projects } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const heroResult = await db.select().from(hero).limit(1);
	const profileResult = await db.select().from(profile).limit(1);

	const projectsResult = await db
		.select({
			id: projects.id,
			title: projects.title,
			subtitle: projects.subtitle
		})
		.from(projects)
		.orderBy(asc(projects.id))
		.limit(6);

	return {
		hero: heroResult[0] ?? null,
		profile: profileResult[0] ?? null,
		projects: projectsResult
	};
};
