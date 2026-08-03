import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { aboutInfo, appSettings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { getDynamicSiteConfig } from '$lib/server/db/siteConfig';

export const load: PageServerLoad = async ({ locals }) => {
	const site = await getDynamicSiteConfig();
	const [info] = await db.select().from(aboutInfo).where(eq(aboutInfo.id, 'default')).limit(1);

	return {
		user: locals.user,
		site,
		about: info || {
			bio: site.longDescription,
			skills: site.techStack,
			experience: []
		}
	};
};

export const actions: Actions = {
	saveAbout: async ({ request }) => {
		const formData = await request.formData();
		const bio = formData.get('bio')?.toString().trim();
		const skillsRaw = formData.get('skills')?.toString().trim();
		const experienceRaw = formData.get('experience')?.toString().trim();

		if (!bio) {
			return { error: 'Bio description cannot be empty' };
		}

		let skills: string[] = [];
		if (skillsRaw) {
			try {
				skills = JSON.parse(skillsRaw);
			} catch {
				skills = skillsRaw.split(',').map((s) => s.trim()).filter(Boolean);
			}
		}

		let experience: any[] = [];
		if (experienceRaw) {
			try {
				experience = JSON.parse(experienceRaw);
			} catch (e) {
				console.error('Failed to parse experience JSON:', e);
			}
		}

		await db
			.insert(aboutInfo)
			.values({
				id: 'default',
				bio,
				skills,
				experience,
				updatedAt: new Date()
			})
			.onConflictDoUpdate({
				target: aboutInfo.id,
				set: {
					bio,
					skills,
					experience,
					updatedAt: new Date()
				}
			});

		const currentSite = await getDynamicSiteConfig();
		const avatarUrl = formData.get('avatarUrl')?.toString().trim() || currentSite.avatarUrl;

		const updatedConfig = {
			...currentSite,
			avatarUrl,
			longDescription: bio,
			techStack: skills
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

		return { success: true, message: 'Public About Page Biography & Stack updated successfully!' };
	}
};
