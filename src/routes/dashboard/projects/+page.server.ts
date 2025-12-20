import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		const allProjects = await db.select().from(projects).orderBy(desc(projects.id));

		return {
			projects: allProjects
		};
	} catch (e) {
		console.error('Load projects failed:', e);
		throw error(500, 'Failed to load projects. Please try again later.');
	}
};
