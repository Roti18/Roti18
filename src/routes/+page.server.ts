import { db } from '$lib/server/db';
import { hero, profile, projects, socialLinks } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function load() {
	try {
		const [heroPromise, profilePromise, projectsPromise, socialLinksPromise] = [
			db.select().from(hero).limit(1),
			db.select().from(profile).limit(1),
			db.select().from(projects).orderBy(desc(projects.id)),
			db.select().from(socialLinks)
		];

		const [heroResult, profileResult, projectData, socialLinkData] = await Promise.all([
			heroPromise,
			profilePromise,
			projectsPromise,
			socialLinksPromise
		]);

		return {
			hero: heroResult[0] ?? null,
			profile: profileResult[0] ?? null,
			projects: projectData,
			socialLinks: socialLinkData
		};
	} catch (e) {
		console.error('Failed to load homepage data:', e);
		throw error(500, 'Failed to load homepage data.');
	}
}
