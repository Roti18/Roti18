import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params }) => {
	const id = Number(params.id);

	if (!id || Number.isNaN(id)) {
		throw error(400, 'Invalid project ID');
	}

	const deleted = await db
		.delete(projects)
		.where(eq(projects.id, id))
		.returning({ id: projects.id });

	if (deleted.length === 0) {
		throw error(404, 'Project not found');
	}

	return json({ success: true });
};
