import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { music } from '$lib/server/db/schema';
import { eq, desc, asc, sql } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const tracks = await db
		.select()
		.from(music)
		.orderBy(desc(music.playedAt), asc(music.sortOrder));

	return {
		tracks
	};
};

export const actions: Actions = {
	createTrack: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const artist = formData.get('artist')?.toString().trim();
		const album = formData.get('album')?.toString().trim() || null;
		const coverUrl = formData.get('coverUrl')?.toString().trim() || null;
		const musicUrl = formData.get('musicUrl')?.toString().trim() || null;

		if (!title || !artist) {
			return fail(400, { error: 'Title and Artist are required' });
		}

		await db.insert(music).values({
			id: crypto.randomUUID(),
			title,
			artist,
			album,
			coverUrl,
			musicUrl,
			playedAt: new Date(),
			sortOrder: 0
		});

		return { success: true, message: 'Track created successfully' };
	},

	updateTrack: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const title = formData.get('title')?.toString().trim();
		const artist = formData.get('artist')?.toString().trim();
		const album = formData.get('album')?.toString().trim() || null;
		const coverUrl = formData.get('coverUrl')?.toString().trim() || null;
		const musicUrl = formData.get('musicUrl')?.toString().trim() || null;

		if (!id || !title || !artist) {
			return fail(400, { error: 'ID, Title and Artist are required' });
		}

		await db
			.update(music)
			.set({
				title,
				artist,
				album,
				coverUrl,
				musicUrl
			})
			.where(eq(music.id, id));

		return { success: true, message: 'Track updated successfully' };
	},

	deleteTrack: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Missing track ID' });
		}

		await db.delete(music).where(eq(music.id, id));

		return { success: true, message: 'Track deleted successfully' };
	},

	syncLamentMetadata: async ({ request }) => {
		const formData = await request.formData();
		const jsonString = formData.get('metadataJson')?.toString().trim();
		const apiUrl = formData.get('apiUrl')?.toString().trim();

		let rawItems: any[] = [];

		if (apiUrl) {
			try {
				const res = await fetch(apiUrl);
				rawItems = await res.json();
			} catch (e: any) {
				return fail(400, { error: `Failed to fetch API: ${e.message}` });
			}
		} else if (jsonString) {
			try {
				rawItems = JSON.parse(jsonString);
			} catch {
				return fail(400, { error: 'Invalid JSON format for metadata' });
			}
		} else {
			return fail(400, { error: 'Please provide either an API URL or JSON array of song metadata' });
		}

		if (!Array.isArray(rawItems)) {
			return fail(400, { error: 'Expected an array of song objects' });
		}

		let insertedCount = 0;
		let updatedCount = 0;

		for (const item of rawItems) {
			const title = item.title?.trim();
			const artist = item.artist?.trim();
			if (!title || !artist) continue;

			const existingTracks = await db
				.select()
				.from(music)
				.where(sql`LOWER(${music.title}) = LOWER(${title}) AND LOWER(${music.artist}) = LOWER(${artist})`)
				.limit(1);

			if (existingTracks.length > 0) {
				await db
					.update(music)
					.set({
						album: item.album || existingTracks[0].album,
						coverUrl: item.coverUrl || existingTracks[0].coverUrl,
						musicUrl: item.musicUrl || existingTracks[0].musicUrl
					})
					.where(eq(music.id, existingTracks[0].id));
				updatedCount++;
			} else {
				// Initial sync: playedAt remains null until Brian actually plays the song!
				await db.insert(music).values({
					id: crypto.randomUUID(),
					title,
					artist,
					album: item.album || null,
					coverUrl: item.coverUrl || null,
					musicUrl: item.musicUrl || null,
					playedAt: null,
					sortOrder: 0
				});
				insertedCount++;
			}
		}

		return { success: true, message: `Lament Metadata Sync complete: ${insertedCount} added (last played empty), ${updatedCount} updated.` };
	}
};
