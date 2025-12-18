import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const allProjects = await db.select().from(projects);
	return {
		projects: allProjects
	};
};
