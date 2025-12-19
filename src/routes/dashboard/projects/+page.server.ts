import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const allProjects = await db.select().from(projects).orderBy(desc(projects.id));

	return {
		projects: allProjects
	};
};
