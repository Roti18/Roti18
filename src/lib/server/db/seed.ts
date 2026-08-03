import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import {
	mockWritings,
	mockProjects,
	mockMusic,
	mockGalleryPhotos,
	mockAcademics
} from '../../data/mock';

// Parse .env if variables not set
if (!process.env.DATABASE_URL) {
	try {
		const envPath = path.resolve(process.cwd(), '.env');
		if (fs.existsSync(envPath)) {
			const envFile = fs.readFileSync(envPath, 'utf8');
			for (const line of envFile.split('\n')) {
				const trimmed = line.trim();
				if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
					const [key, ...vals] = trimmed.split('=');
					let val = vals.join('=').trim();
					if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
						val = val.slice(1, -1);
					}
					process.env[key.trim()] = val;
				}
			}
		}
	} catch (e) {
		console.warn('Could not parse .env file:', e);
	}
}

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) {
	console.error('DATABASE_URL is missing in .env');
	process.exit(1);
}

const client = createClient({ url, authToken });
const db = drizzle(client, { schema });

async function seed() {
	console.log('🌱 Starting database seed to Turso...');

	try {
		// 1. Seed Writings
		console.log('  - Seeding writings...');
		for (const item of mockWritings) {
			await db.insert(schema.writing).values({
				id: item.id,
				slug: item.slug,
				title: item.title,
				excerpt: item.excerpt,
				content: item.content || item.contentHtml,
				contentHtml: item.contentHtml,
				year: item.year,
				likes: item.likes,
				published: item.published,
				createdAt: item.createdAt,
				updatedAt: new Date()
			}).onConflictDoNothing();
		}

		// 2. Seed Projects
		console.log('  - Seeding projects...');
		for (const item of mockProjects) {
			await db.insert(schema.project).values({
				id: item.id,
				slug: item.slug,
				title: item.title,
				shortDesc: item.shortDesc,
				content: item.content,
				contentHtml: item.contentHtml,
				thumbnailUrl: item.thumbnailUrl,
				repoUrl: item.repoUrl,
				repoIsPublic: item.repoIsPublic,
				demoUrl: item.demoUrl,
				demoIsLive: item.demoIsLive,
				featuredOnHome: item.featuredOnHome,
				sortOrder: item.sortOrder,
				createdAt: new Date(),
				updatedAt: new Date()
			}).onConflictDoNothing();
		}

		// 3. Seed Music
		console.log('  - Seeding music...');
		for (let i = 0; i < mockMusic.length; i++) {
			const item = mockMusic[i];
			const link = (item as any).spotifyUrl || `https://open.spotify.com/search/${encodeURIComponent(item.title + ' ' + item.artist)}`;
			await db.insert(schema.music).values({
				id: item.id,
				title: item.title,
				artist: item.artist,
				album: item.album,
				coverUrl: item.coverUrl,
				spotifyUrl: link,
				playedAt: item.playedAt,
				sortOrder: i
			}).onConflictDoUpdate({
				target: schema.music.id,
				set: {
					spotifyUrl: link,
					coverUrl: item.coverUrl,
					title: item.title,
					artist: item.artist,
					album: item.album
				}
			});
		}

		// 4. Seed Gallery Photos
		console.log('  - Seeding gallery photos...');
		for (let i = 0; i < mockGalleryPhotos.length; i++) {
			const item = mockGalleryPhotos[i];
			await db.insert(schema.galleryPhoto).values({
				id: item.id,
				slug: item.slug,
				title: item.title,
				imageUrl: item.imageUrl,
				shortDesc: item.shortDesc,
				cameraDesc: item.cameraDesc,
				width: item.width,
				height: item.height,
				sortOrder: i,
				createdAt: new Date()
			}).onConflictDoNothing();
		}

		// 5. Seed Academics (Semesters, Courses, Materials)
		console.log('  - Seeding academics...');
		for (const semester of mockAcademics) {
			await db.insert(schema.academicSemester).values({
				id: semester.id,
				slug: semester.slug,
				title: semester.title,
				sortOrder: semester.sortOrder
			}).onConflictDoNothing();

			for (let cIdx = 0; cIdx < semester.courses.length; cIdx++) {
				const course = semester.courses[cIdx];
				await db.insert(schema.academicCourse).values({
					id: course.id,
					semesterId: semester.id,
					slug: course.slug,
					title: course.title,
					dosenName: course.dosenName,
					hasPraktikum: course.hasPraktikum,
					asprakName: course.asprakName,
					sortOrder: cIdx
				}).onConflictDoNothing();

				for (let mIdx = 0; mIdx < course.materials.length; mIdx++) {
					const material = course.materials[mIdx];
					await db.insert(schema.academicMaterial).values({
						id: material.id,
						courseId: course.id,
						slug: material.slug,
						fullSlug: material.fullSlug,
						title: material.title,
						type: material.type,
						content: material.contentHtml,
						contentHtml: material.contentHtml,
						attachments: material.attachments,
						sortOrder: mIdx,
						createdAt: material.createdAt,
						updatedAt: new Date()
					}).onConflictDoNothing();
				}
			}
		}

		console.log('✅ Database seeding completed successfully!');
		process.exit(0);
	} catch (error) {
		console.error('❌ Seeding failed:', error);
		process.exit(1);
	}
}

seed();
