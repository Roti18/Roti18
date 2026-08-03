import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { writing, project, music, galleryPhoto, academicMaterial, user } from '$lib/server/db/schema';
import { count, eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	try {
		// Counts
		const [writingCountRes] = await db.select({ value: count() }).from(writing);
		const [publishedWritingCountRes] = await db.select({ value: count() }).from(writing).where(eq(writing.published, true));
		const [projectCountRes] = await db.select({ value: count() }).from(project);
		const [musicCountRes] = await db.select({ value: count() }).from(music);
		const [galleryCountRes] = await db.select({ value: count() }).from(galleryPhoto);
		const [academicsCountRes] = await db.select({ value: count() }).from(academicMaterial);
		const [userCountRes] = await db.select({ value: count() }).from(user);

		// Recent items
		const recentWritings = await db
			.select({ id: writing.id, title: writing.title, slug: writing.slug, year: writing.year, published: writing.published, createdAt: writing.createdAt })
			.from(writing)
			.orderBy(desc(writing.createdAt))
			.limit(5);

		const recentProjects = await db
			.select({ id: project.id, title: project.title, slug: project.slug, demoUrl: project.demoUrl, repoUrl: project.repoUrl, featuredOnHome: project.featuredOnHome, createdAt: project.createdAt })
			.from(project)
			.orderBy(desc(project.createdAt))
			.limit(5);

		const recentMusic = await db
			.select({ id: music.id, title: music.title, artist: music.artist, album: music.album, playedAt: music.playedAt })
			.from(music)
			.orderBy(desc(music.playedAt))
			.limit(5);

		const recentUsers = await db
			.select({ id: user.id, name: user.name, email: user.email, image: user.image, createdAt: user.createdAt })
			.from(user)
			.orderBy(desc(user.createdAt))
			.limit(5);

		return {
			stats: {
				writings: writingCountRes?.value || 0,
				publishedWritings: publishedWritingCountRes?.value || 0,
				projects: projectCountRes?.value || 0,
				music: musicCountRes?.value || 0,
				gallery: galleryCountRes?.value || 0,
				academics: academicsCountRes?.value || 0,
				users: userCountRes?.value || 0
			},
			recentWritings,
			recentProjects,
			recentMusic,
			recentUsers
		};
	} catch (err) {
		console.error('[dash/+page.server.ts] Error loading overview metrics:', err);
		return {
			stats: { writings: 0, publishedWritings: 0, projects: 0, music: 0, gallery: 0, academics: 0, users: 0 },
			recentWritings: [],
			recentProjects: [],
			recentMusic: [],
			recentUsers: []
		};
	}
};
