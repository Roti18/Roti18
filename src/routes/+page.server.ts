import { error } from '@sveltejs/kit';
import { getPublicLandingData } from '$lib/server/cache/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	try {
		setHeaders({
			'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
			'CDN-Cache-Control': 'max-age=1800'
		});

		return await getPublicLandingData();
	} catch (e) {
		console.error('Failed to load homepage data:', e);
		throw error(500, 'Failed to load homepage data.');
	}
};
