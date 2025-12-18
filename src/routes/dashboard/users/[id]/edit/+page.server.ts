import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const userId = params.id;

	const result = await db.select().from(user).where(eq(user.id, userId)).limit(1);

	if (result.length === 0) {
		return {
			user: null
		};
	}

	return {
		user: result[0]
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const data = await request.formData();

		const email = data.get('email')?.toString();
		const name = data.get('name')?.toString();
		const image = data.get('image')?.toString();

		if (!email) {
			return fail(400, { message: 'Email is required' });
		}

		await db.update(user).set({ email, name, image }).where(eq(user.id, params.id!));

		throw redirect(303, '/dashboard/users');
	}
};
