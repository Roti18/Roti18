import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ locals }) => {
	// The webhook secret must never reach the public client bundle.
	// This endpoint is admin-only; the dashboard reveals it on demand.
	if (!locals.user?.isAdmin) {
		return json({ success: false, message: 'Unauthorized' }, { status: 401 });
	}

	const secret = env.MUSIC_WEBHOOK_SECRET || process.env.MUSIC_WEBHOOK_SECRET || '';

	if (!secret) {
		return json({ success: false, message: 'MUSIC_WEBHOOK_SECRET is not configured' }, { status: 500 });
	}

	return json({ success: true, secret });
};
