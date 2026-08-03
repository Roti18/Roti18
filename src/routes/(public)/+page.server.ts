import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { writing, project, music } from '$lib/server/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { getDynamicSiteConfig } from '$lib/server/db/siteConfig';

export const load: PageServerLoad = async () => {
	try {
		const dynamicSite = await getDynamicSiteConfig();

		const recentWritings = await db.query.writing.findMany({
			where: eq(writing.published, true),
			orderBy: [desc(writing.createdAt)],
			limit: 5
		});

		const featuredProjects = await db.query.project.findMany({
			where: eq(project.featuredOnHome, true),
			orderBy: [asc(project.sortOrder)]
		});

		const recentMusic = await db.query.music.findMany({
			orderBy: [asc(music.playedAt)],
			limit: 4
		});

		return {
			site: dynamicSite,
			recentWritings,
			projects: featuredProjects,
			recentMusic
		};
	} catch (err) {
		console.error('Failed to load home data from DB:', err);
		const dynamicSite = await getDynamicSiteConfig();
		return {
			site: dynamicSite,
			recentWritings: [],
			projects: [],
			recentMusic: []
		};
	}
};
