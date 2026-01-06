export const CACHE_KEYS = {
	PUBLIC_LANDING: 'public:landing',
	DASHBOARD: (userId: string) => `dashboard:${userId}`
} as const;

export const CACHE_TTL = {
	PUBLIC_LANDING: 30_000,
	DASHBOARD: 60_000,
	SESSIONS: 30_000
} as const;
