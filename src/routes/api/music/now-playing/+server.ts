import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { music } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

// CORS is enforced by the browser BEFORE the POST is sent (preflight OPTIONS).
// Without this handler, Vercel returns 405 for the preflight and the browser
// blocks the request entirely — the webhook would never reach this route.
const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Max-Age': '86400'
};

export const OPTIONS: RequestHandler = async () => {
	return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const POST: RequestHandler = async ({ request }) => {
	// Webhook calls originate cross-origin (lament.rynds.my.id). Success responses
	// must carry the same CORS headers or the browser discards the response.
	const cors = CORS_HEADERS;
	try {
		const body = await request.json();
		// No hardcoded fallback: the webhook secret must come from Vercel env
		// (MUSIC_WEBHOOK_SECRET). A missing value must fail loudly, never silently
		// accept requests with a known default.
		const expectedSecret = env.MUSIC_WEBHOOK_SECRET || process.env.MUSIC_WEBHOOK_SECRET || '';

		if (!body.secret || body.secret !== expectedSecret) {
			return json({ success: false, message: 'Invalid or missing webhook secret key' }, { status: 401, headers: cors });
		}

		const title = body.title?.trim();
		const artist = body.artist?.trim();

		if (!title || !artist) {
			return json({ success: false, message: 'Title and Artist are required' }, { status: 400, headers: cors });
		}

		const album = body.album?.trim() || null;
		const coverUrl = body.coverUrl?.trim() || null;
		const spotifyUrl = body.spotifyUrl?.trim() || null;
		const playedAt = new Date();

		// Check if song already exists in music database table (case-insensitive match)
		const existingTracks = await db
			.select()
			.from(music)
			.where(sql`LOWER(${music.title}) = LOWER(${title}) AND LOWER(${music.artist}) = LOWER(${artist})`)
			.limit(1);

		let targetTrack = null;

		if (existingTracks.length > 0) {
			// Update timestamp and optional metadata
			const existing = existingTracks[0];
			await db
				.update(music)
				.set({
					album: album || existing.album,
					coverUrl: coverUrl || existing.coverUrl,
					spotifyUrl: spotifyUrl || existing.spotifyUrl,
					playedAt
				})
				.where(eq(music.id, existing.id));

			targetTrack = { ...existing, album, coverUrl, spotifyUrl, playedAt };
		} else {
			// Insert new track entry
			const newTrackId = crypto.randomUUID();
			await db.insert(music).values({
				id: newTrackId,
				title,
				artist,
				album,
				coverUrl,
				spotifyUrl,
				playedAt,
				sortOrder: 0
			});

			targetTrack = { id: newTrackId, title, artist, album, coverUrl, spotifyUrl, playedAt, sortOrder: 0 };
		}

		return json(
			{
				success: true,
				message: 'Track playback registered successfully',
				track: targetTrack
			},
			{ headers: cors }
		);
	} catch (err: any) {
		console.error('[API music/now-playing] Error handling webhook:', err);
		return json({ success: false, message: err?.message || 'Server error processing webhook' }, { status: 500, headers: cors });
	}
};
