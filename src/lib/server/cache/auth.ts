import { getCache, setCache } from './memory';
import { validateSessionToken } from '$lib/server/auth';

type SessionResult = Awaited<ReturnType<typeof validateSessionToken>>;

const TTL = 60 * 1000;

export async function getCachedSession(token: string): Promise<SessionResult> {
	const key = `session:${token}`;

	const cached = getCache<SessionResult>(key);
	if (cached) return cached;

	const result = await validateSessionToken(token);

	if (result.session) {
		setCache(key, result, TTL);
	}

	return result;
}
