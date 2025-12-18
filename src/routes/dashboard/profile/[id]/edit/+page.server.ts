import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { profile } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const profileId = parseInt(params.id, 10);

	if (isNaN(profileId)) {
		return { profile: null };
	}

	const result = await db.select().from(profile).where(eq(profile.id, profileId)).limit(1);

	if (result.length === 0) {
		return { profile: null };
	}

	return {
		profile: result[0]
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const profileId = parseInt(params.id!, 10);
		if (isNaN(profileId)) {
			return fail(400, { error: 'Invalid profile ID' });
		}

		const data = await request.formData();

		const title = data.get('title')?.toString();
		const leftText = data.get('leftContent')?.toString();
		const rightText = data.get('rightContent')?.toString();

		if (!title || !leftText || !rightText) {
			return fail(400, { error: 'Semua field wajib diisi' });
		}

		await db
			.update(profile)
			.set({
				title,
				leftText,
				rightText
			})
			.where(eq(profile.id, profileId));

		throw redirect(303, '/dashboard/profile');
	}
};
