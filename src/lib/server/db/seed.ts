import { db } from './index';
import { profile, projects, hero } from './schema';

async function seed() {
	await db
		.insert(profile)
		.values({
			id: 1,
			title: 'PROFILE',
			leftText: `Driven by passion for creating impactful experiences, specializing in good strategy, branding, and UX/UI focus. Aesthetically-oriented, transforming complex ideas into elegant functional designs.`,
			rightText: `A holistic re-imagination ad wellness platform combines command human-centered solution and aestheticsion, she transforms Her work examines the interplay of detail into a pursuit of pursuit.
			`
		})
		.onConflictDoNothing();

	await db.insert(hero).values([
		{
			id: 1,
			name: 'M.ZAMRONI FAHREZA',
			role: 'CYBER SECURITY & WEB DEVELOPER',
			tagline: 'Crafting secure solutions through thoughtful engineering'
		}
	]);

	await db
		.insert(projects)
		.values([
			{
				id: 1,
				title: 'AURORA',
				subtitle: 'BRAND IDENTITY & APP DESIGN',
				description:
					'A holistic re-imagination a wellness platform, emotive navigation and calming visuals.',
				image: '/images/aurora.jpg',
				url: '/projects/aurora'
			},
			{
				id: 2,
				title: 'SOLSTICE',
				subtitle: 'INTERACTIVE ART INSTALLATION',
				description: 'Immersive digital experience blending light and motion.',
				image: '/images/solstice.jpg',
				url: '/projects/solstice'
			},
			{
				id: 3,
				title: 'ECHO',
				subtitle: 'LUXURY PACKAGING SUITE',
				description: 'Sophisticated brand materials for high-end products.',
				image: '/images/echo.jpg',
				url: '/projects/echo'
			}
		])
		.onConflictDoNothing();

	console.log('✅ Seed completed');
}

seed()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error('❌ Seed failed', err);
		process.exit(1);
	});
