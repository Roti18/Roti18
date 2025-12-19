import { db } from '$lib/server/db';
import { socialLinks } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params }) => {
	const id = Number(params.id);

	if (!id || Number.isNaN(id)) {
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

	return json({ success: true });
};
