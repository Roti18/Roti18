import type { PageServerLoad } from './$types';
import { getDynamicSiteConfig } from '$lib/server/db/siteConfig';

export const load: PageServerLoad = async () => {
	const dynamicSite = await getDynamicSiteConfig();
	return { site: dynamicSite };
};
