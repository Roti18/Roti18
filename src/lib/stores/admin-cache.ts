const MAX_ENTRIES = 100;

type CacheEntry<T> = {
    data: T;
    timestamp: number;
    ttl: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

function enforceLimit() {
    if (cache.size > MAX_ENTRIES) {
        const firstKey = cache.keys().next().value;
        if (firstKey) cache.delete(firstKey);
    }
}

export function getCached<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.timestamp + entry.ttl) {
        cache.delete(key);
        return null;
    }

    return entry.data as T;
}

export function setCached<T>(key: string, data: T, ttlMs: number = 60_000) {
    enforceLimit();
    cache.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
}

export function invalidateAdminCache(pattern?: string) {
    if (!pattern) {
        cache.clear();
        return;
    }

    for (const key of cache.keys()) {
        if (key.startsWith(pattern)) {
            cache.delete(key);
        }
    }
}

export function clearAdminCache() {
    cache.clear();
}
