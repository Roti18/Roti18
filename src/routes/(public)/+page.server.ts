import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { writing, project, music } from '$lib/server/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { getDynamicSiteConfig } from '$lib/server/db/siteConfig';
import { CV_URL_EN } from '$env/static/private';

export const load: PageServerLoad = async () => {
	try {
		const [dynamicSite, recentWritings, projects, recentMusic] = await Promise.all([
			getDynamicSiteConfig(),
			db.query.writing.findMany({
				where: eq(writing.published, true),
				orderBy: [desc(writing.createdAt)],
				limit: 5
			}),
			db.query.project.findMany({
				where: eq(project.featuredOnHome, true),
				orderBy: [asc(project.sortOrder), desc(project.createdAt)]
			}),
			db.query.music.findMany({
				orderBy: [desc(music.playedAt)],
				limit: 4
			})
		]);

		return {
			site: dynamicSite,
			recentWritings,
			projects,
			recentMusic,
			cvUrlEn: CV_URL_EN
		};
	} catch (err) {
		console.error('Failed to load home data from DB:', err);
		const dynamicSite = await getDynamicSiteConfig();
		return {
			site: dynamicSite,
			recentWritings: [],
			projects: [],
			recentMusic: [],
			cvUrlEn: CV_URL_EN
		};
	}
};
