import { getCache, setCache, deleteCache } from './memory';
import { CACHE_KEYS, CACHE_TTL } from './cache-keys';
import { db } from '$lib/server/db';
import { hero, profile, projects, socialLinks } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export type PublicLandingData = {
    hero: (typeof hero.$inferSelect) | null;
    profile: (typeof profile.$inferSelect) | null;
    projects: (typeof projects.$inferSelect)[];
    socialLinks: (typeof socialLinks.$inferSelect)[];
};

export async function getPublicLandingData(): Promise<PublicLandingData> {
    const cached = getCache<PublicLandingData>(CACHE_KEYS.PUBLIC_LANDING);
    if (cached) return cached;

    const [heroData, profileData, projectsData, socialData] = await Promise.all([
        db.select().from(hero).limit(1),
        db.select().from(profile).limit(1),
        db.select().from(projects).orderBy(desc(projects.id)),
        db.select().from(socialLinks)
    ]);

    const data: PublicLandingData = {
        hero: heroData[0] ?? null,
        profile: profileData[0] ?? null,
        projects: projectsData,
        socialLinks: socialData
    };

    setCache(CACHE_KEYS.PUBLIC_LANDING, data, CACHE_TTL.PUBLIC_LANDING);
    return data;
}

export function invalidatePublicLanding() {
    deleteCache(CACHE_KEYS.PUBLIC_LANDING);
}
