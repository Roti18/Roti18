import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { project } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	try {
		const projects = await db.query.project.findMany({
			orderBy: [asc(project.sortOrder)]
		});

		return { projects };
	} catch (err) {
		console.error('Failed to load projects from DB:', err);
		return { projects: [] };
	}
};
