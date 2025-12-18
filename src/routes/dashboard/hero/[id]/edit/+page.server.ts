import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { hero } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id, 10);
	if (isNaN(id)) {
		throw fail(404, { message: 'Not found' });
	}

	const result = await db.select().from(hero).where(eq(hero.id, id)).limit(1);

	if (result.length === 0) {
		throw fail(404, { message: 'Not found' });
	}

	return {
		hero: result[0]
	};
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = parseInt(params.id, 10);
		if (isNaN(id)) {
			throw fail(400, { message: 'Invalid ID' });
		}

		const data = await request.formData();
		const name = data.get('name')?.toString();
		const role = data.get('role')?.toString();
		const tagline = data.get('tagline')?.toString();

		if (!name || !role || !tagline) {
			return fail(400, { message: 'All fields are required' });
		}

		await db
			.update(hero)
			.set({
				name,
				role,
				tagline
			})
			.where(eq(hero.id, id));

		throw redirect(303, '/dashboard/hero');
	}
};
