import { db } from '$lib/server/db';
import { appSettings, aboutInfo } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { siteConfig as defaultSiteConfig } from '$lib/data/mock';

export async function getDynamicSiteConfig() {
	try {
		// Read site_config key from appSettings or fallback to default
		const [homeSetting] = await db.select().from(appSettings).where(eq(appSettings.key, 'site_home_config')).limit(1);
		const [aboutSetting] = await db.select().from(aboutInfo).where(eq(aboutInfo.id, 'default')).limit(1);

		let homeConfig = defaultSiteConfig;
		if (homeSetting && homeSetting.value) {
			try {
				homeConfig = { ...defaultSiteConfig, ...JSON.parse(homeSetting.value) };
			} catch (e) {
				console.error('Failed to parse homeSetting JSON:', e);
			}
		}

		const longDescription = aboutSetting?.bio || defaultSiteConfig.longDescription;
		const techStack = (aboutSetting?.skills && aboutSetting.skills.length > 0) ? aboutSetting.skills : defaultSiteConfig.techStack;

		return {
			...homeConfig,
			longDescription,
			techStack
		};
	} catch (err) {
		console.error('Error fetching dynamic site config:', err);
		return defaultSiteConfig;
	}
}
