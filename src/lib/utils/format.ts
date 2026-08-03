export function formatDate(date: Date | number | string): string {
	const d = new Date(date);
	return d.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
}

export function formatDateShort(date: Date | number | string): string {
	const d = new Date(date);
	return d.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric'
	});
}

export function groupWritingsByYear<T extends { year: number }>(
	writings: T[]
): { year: number; items: T[] }[] {
	const grouped = new Map<number, T[]>();
	for (const w of writings) {
		if (!grouped.has(w.year)) grouped.set(w.year, []);
		grouped.get(w.year)!.push(w);
	}
	return Array.from(grouped.entries())
		.sort(([a], [b]) => b - a)
		.map(([year, items]) => ({ year, items }));
}
