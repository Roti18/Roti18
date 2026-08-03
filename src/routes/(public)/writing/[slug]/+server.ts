import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params }) => {
	// In production: increment likes in DB
	// const result = await db.update(writing)...
	console.log(`Like received for: ${params.slug}`);
	return json({ success: true });
};
