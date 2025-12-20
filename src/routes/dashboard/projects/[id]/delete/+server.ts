import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { del } from '@vercel/blob';

export const POST: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const id = Number(params.id);
	if (isNaN(id)) {
		throw error(400, 'Invalid project ID');
	}

	try {
		const project = await db
			.select({ image: projects.image })
			.from(projects)
			.where(eq(projects.id, id))
			.limit(1);

		if (project.length === 0) {
			throw error(404, 'Project not found');
		}

		const imageUrl = project[0].image;

		// Best-effort deletion for the image blob
		if (imageUrl) {
			await del(imageUrl).catch((err) => {
				console.error('Failed to delete blob, continuing with project deletion.', err);
			});
		}

		await db.delete(projects).where(eq(projects.id, id));

		return json({ success: true });
	} catch (e) {
		if (e instanceof Error && 'status' in e && typeof e.status === 'number') {
			throw e; // Re-throw SvelteKit's own errors
		}
		console.error('Failed to delete project:', e);
		throw error(500, 'Failed to delete project due to a server error.');
	}
};
