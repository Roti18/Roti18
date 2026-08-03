import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { academicSemester, academicCourse, academicMaterial } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	try {
		const semesters = await db.query.academicSemester.findMany({
			orderBy: [asc(academicSemester.sortOrder)],
			with: {
				courses: {
					orderBy: [asc(academicCourse.sortOrder)],
					with: {
						materials: {
							orderBy: [asc(academicMaterial.sortOrder)]
						}
					}
				}
			}
		});

		return { semesters };
	} catch (err) {
		console.error('Failed to load academics tree from DB:', err);
		return { semesters: [] };
	}
};
