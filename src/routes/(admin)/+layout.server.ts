import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (!user) {
		throw redirect(303, '/?error=unauthorized_admin');
	}

	if (!user.isAdmin) {
		throw error(403, {
			message: 'Access Restricted: Admin dashboard (/dash) is restricted to authorized admin emails.'
		});
	}

	return {
		user
	};
};
