import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { del } from '@vercel/blob';

export const POST: RequestHandler = async ({ params }) => {
	const id = Number(params.id);

	if (!id || Number.isNaN(id)) {
		throw error(400, 'Invalid project ID');
	}

	const project = await db
		.select({ image: projects.image })
		.from(projects)
		.where(eq(projects.id, id))
		.limit(1);

	if (project.length === 0) {
		throw error(404, 'Project not found');
	}

	const imageUrl = project[0].image;

	if (imageUrl) {
		try {
			await del(imageUrl);
		} catch (err) {
			console.error('Failed to delete blob:', err);
		}
	}

	await db.delete(projects).where(eq(projects.id, id));

	return json({ success: true });
};
