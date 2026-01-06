import { db } from '$lib/server/db';
import { socialLinks } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { invalidatePublicLanding } from '$lib/server/cache/public';

export const POST: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const id = Number(params.id);

		if (isNaN(id)) {
			throw error(400, 'Invalid social link ID');
		}

		const socialLink = await db
			.select({ id: socialLinks.id })
			.from(socialLinks)
			.where(eq(socialLinks.id, id))
			.limit(1);

		if (socialLink.length === 0) {
			throw error(404, 'Social link not found');
		}

		await db.delete(socialLinks).where(eq(socialLinks.id, id));

		invalidatePublicLanding();
		return json({ success: true });
	} catch (e) {
		if (e instanceof Error && 'status' in e && typeof e.status === 'number') {
			throw e; // Re-throw SvelteKit's own errors
		}
		console.error('Failed to delete social link:', e);
		throw error(500, 'Failed to delete social link due to a server error.');
	}
};
