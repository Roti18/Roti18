import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { appSettings, aboutInfo } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { getDynamicSiteConfig } from '$lib/server/db/siteConfig';

export const load: PageServerLoad = async () => {
	const site = await getDynamicSiteConfig();

	return {
		site
	};
};

export const actions: Actions = {
	updateHomeProfile: async ({ request }) => {
		const formData = await request.formData();
		const fullName = formData.get('fullName')?.toString().trim();
		const name = formData.get('name')?.toString().trim();
		const title = formData.get('title')?.toString().trim();
		const description = formData.get('description')?.toString().trim();
		const avatarUrl = formData.get('avatarUrl')?.toString().trim();
		const socialLinksRaw = formData.get('socialLinks')?.toString().trim();

		let socialLinks: { platform: string; url: string; icon: string }[] = [];
		if (socialLinksRaw) {
			try {
				socialLinks = JSON.parse(socialLinksRaw);
			} catch (e) {
				console.error('[dash/home] Error parsing socialLinks JSON:', e);
			}
		}

		const currentSite = await getDynamicSiteConfig();
		const finalAvatarUrl = avatarUrl || currentSite.avatarUrl;

		const updatedConfig = {
			...currentSite,
			fullName: fullName || currentSite.fullName,
			name: name || currentSite.name,
			title: title || currentSite.title,
			description: description || currentSite.description,
			avatarUrl: finalAvatarUrl,
			socialLinks
		};

		await db
			.insert(appSettings)
			.values({
				key: 'site_home_config',
				value: JSON.stringify(updatedConfig),
				updatedAt: new Date()
			})
			.onConflictDoUpdate({
				target: appSettings.key,
				set: {
					value: JSON.stringify(updatedConfig),
					updatedAt: new Date()
				}
			});

		// Also sync about_info table if avatarUrl is present
		if (finalAvatarUrl) {
			const [existingAbout] = await db.select().from(aboutInfo).where(eq(aboutInfo.id, 'default')).limit(1);
			if (existingAbout) {
				await db
					.update(aboutInfo)
					.set({ updatedAt: new Date() })
					.where(eq(aboutInfo.id, 'default'));
			}
		}

		return { success: true, message: 'Home Profile & Shared Avatar updated successfully!' };
	}
};
