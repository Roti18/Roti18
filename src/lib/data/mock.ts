/**
 * Mock data for development - replace with Drizzle queries when DB is ready.
 */

export const siteConfig = {
	name: 'M. Roni',
	fullName: 'M. Roni',
	title: 'Software Engineer',
	description:
		"I'm a software engineer based in Indonesia, currently studying Informatics at Trunojoyo University. I build things for the web and explore creative coding.",
	longDescription: `I'm a software engineer and student based in Madura, Indonesia. I study Informatics Engineering at Universitas Trunojoyo Madura.

I'm passionate about building beautiful, performant web applications. My current stack revolves around SvelteKit, TypeScript, and modern web technologies. I enjoy the intersection of design and engineering - making things that not only work well but feel good to use.

Outside of code, I'm into photography, music, and exploring the local food scene. I believe in learning by building and sharing what I learn along the way.`,
	avatarUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
	socialLinks: [
		{ platform: 'GitHub', url: 'https://github.com/brian', icon: 'github' },
		{ platform: 'X', url: 'https://x.com/brian', icon: 'x' },
		{ platform: 'YouTube', url: 'https://youtube.com/@brian', icon: 'youtube' }
	],
	techStack: [
		'SvelteKit',
		'TypeScript',
		'Tailwind CSS',
		'Drizzle ORM',
		'Turso',
		'Vercel',
		'Figma',
		'GSAP',
		'Node.js',
		'Bun',
		'PostgreSQL',
		'Git'
	]
};

export const mockWritings = [
	{
		id: '1',
		slug: 'building-a-portfolio-with-sveltekit',
		title: 'Building a portfolio with SvelteKit',
		excerpt: 'How I rebuilt my portfolio from scratch using SvelteKit and Turso.',
		content: '',
		contentHtml: `<p>I've been wanting to rebuild my portfolio for a while now. The old one was built with Next.js and was getting a bit long in the tooth.</p>
<hr />
<h2>1. Why SvelteKit?</h2>
<p>SvelteKit has been my framework of choice for the past year. It's fast, it's simple, and it compiles away the framework overhead. The developer experience is unmatched - hot module replacement is instant, and the file-based routing just makes sense.</p>
<p>What really sold me was Svelte 5's runes. The new reactivity system is elegant and predictable. No more guessing about when things update.</p>
<hr />
<h2>2. The design philosophy</h2>
<p>I wanted something minimal. Typography-driven. No flashy gradients or 3D effects - just clean text on a dark background. I took heavy inspiration from <a href="https://brianlovin.com">Brian Lovin's site</a>, which I think is one of the best personal sites on the web.</p>
<p>The key principles:</p>
<ul>
<li>Content is king - let the writing speak for itself</li>
<li>Whitespace is not wasted space</li>
<li>Animations should be subtle and purposeful</li>
<li>Every element earns its place</li>
</ul>
<hr />
<h2>3. Technical decisions</h2>
<p>For the database, I went with <strong>Turso</strong> (libSQL). It's edge-replicated, has a generous free tier, and pairs perfectly with Drizzle ORM. The schema is straightforward - writings, projects, gallery photos, and academic materials.</p>
<blockquote>The best database is the one you don't have to think about.</blockquote>
<p>Authentication is handled by Better Auth with Google OAuth only. No passwords, no magic links. One click and you're in.</p>`,
		year: 2026,
		likes: 42,
		published: true,
		createdAt: new Date('2026-07-15')
	},
	{
		id: '2',
		slug: 'svelte-5-runes-in-practice',
		title: 'Svelte 5 runes in practice',
		excerpt: 'Real-world patterns and lessons from using runes in production.',
		content: '',
		contentHtml: '<p>Svelte 5 runes changed everything about how I think about reactivity...</p>',
		year: 2026,
		likes: 28,
		published: true,
		createdAt: new Date('2026-06-20')
	},
	{
		id: '3',
		slug: 'why-i-switched-to-turso',
		title: 'Why I switched to Turso',
		excerpt: 'Edge databases and why they matter for personal projects.',
		content: '',
		contentHtml: '<p>Turso has been a revelation for my personal projects...</p>',
		year: 2026,
		likes: 15,
		published: true,
		createdAt: new Date('2026-05-10')
	},
	{
		id: '4',
		slug: 'gsap-animations-in-sveltekit',
		title: 'GSAP animations in SvelteKit',
		excerpt: 'Making GSAP play nice with SSR and Svelte lifecycle.',
		content: '',
		contentHtml: '<p>GSAP is incredibly powerful, but it needs some care in SSR environments...</p>',
		year: 2026,
		likes: 33,
		published: true,
		createdAt: new Date('2026-04-01')
	},
	{
		id: '5',
		slug: 'the-case-for-drizzle-orm',
		title: 'The case for Drizzle ORM',
		excerpt: 'Why Drizzle became my go-to ORM for TypeScript projects.',
		content: '',
		contentHtml: '<p>I used to be a Prisma person. Then I tried Drizzle...</p>',
		year: 2025,
		likes: 51,
		published: true,
		createdAt: new Date('2025-11-15')
	},
	{
		id: '6',
		slug: 'photography-and-code',
		title: 'Photography and code',
		excerpt: 'Finding creative parallels between two different crafts.',
		content: '',
		contentHtml: '<p>Both photography and programming are about seeing patterns...</p>',
		year: 2025,
		likes: 19,
		published: true,
		createdAt: new Date('2025-09-08')
	},
	{
		id: '7',
		slug: 'learning-in-public',
		title: 'Learning in public',
		excerpt: 'Why sharing your journey matters more than showing results.',
		content: '',
		contentHtml: '<p>The best way to learn is to teach...</p>',
		year: 2025,
		likes: 67,
		published: true,
		createdAt: new Date('2025-06-22')
	},
	{
		id: '8',
		slug: 'my-development-setup-2024',
		title: 'My development setup 2024',
		excerpt: 'Tools, extensions, and workflows that keep me productive.',
		content: '',
		contentHtml: '<p>Every year I like to document my setup...</p>',
		year: 2024,
		likes: 44,
		published: true,
		createdAt: new Date('2024-12-01')
	}
];

export const mockProjects = [
	{
		id: '1',
		slug: 'porto-v2',
		title: 'Porto v2',
		shortDesc: 'This portfolio site - SvelteKit, Turso, GSAP',
		content: 'A complete rebuild of my personal portfolio...',
		contentHtml:
			'<p>A complete rebuild of my personal portfolio using SvelteKit 5, Turso database, and GSAP animations. Minimalist design inspired by brianlovin.com.</p>',
		thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
		repoUrl: 'https://github.com/brian/porto-v2',
		repoIsPublic: true,
		demoUrl: 'https://brian.dev',
		demoIsLive: true,
		featuredOnHome: true,
		sortOrder: 0
	},
	{
		id: '2',
		slug: 'briOS',
		title: 'briOS',
		shortDesc: 'Personal knowledge base and operating system',
		content: 'An interactive knowledge base...',
		contentHtml: '<p>An interactive knowledge base built as a desktop-like OS interface in the browser.</p>',
		thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
		repoUrl: 'https://github.com/brian/brios',
		repoIsPublic: true,
		demoUrl: 'https://brios.brian.dev',
		demoIsLive: true,
		featuredOnHome: true,
		sortOrder: 1
	},
	{
		id: '3',
		slug: 'snap-cli',
		title: 'Snap CLI',
		shortDesc: 'A minimal screenshot tool for the terminal',
		content: 'CLI tool for capturing...',
		contentHtml: '<p>A fast, minimal CLI tool for capturing and annotating screenshots from the terminal.</p>',
		thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
		repoUrl: 'https://github.com/brian/snap-cli',
		repoIsPublic: true,
		demoUrl: null,
		demoIsLive: false,
		featuredOnHome: false,
		sortOrder: 2
	},
	{
		id: '4',
		slug: 'akademik-utm',
		title: 'Akademik UTM',
		shortDesc: 'Academic resource archive for Trunojoyo students',
		content: 'A shared academic resource...',
		contentHtml: '<p>A shared academic resource archive for students at Universitas Trunojoyo Madura.</p>',
		thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
		repoUrl: 'https://github.com/brian/akademik-utm',
		repoIsPublic: false,
		demoUrl: null,
		demoIsLive: false,
		featuredOnHome: true,
		sortOrder: 3
	},
	{
		id: '5',
		slug: 'color-palette',
		title: 'Color Palette',
		shortDesc: 'Generate beautiful color palettes from images',
		content: '',
		contentHtml: '<p>Extract dominant colors from any image and generate harmonious color palettes.</p>',
		thumbnailUrl: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=80',
		repoUrl: 'https://github.com/brian/color-palette',
		repoIsPublic: true,
		demoUrl: 'https://palette.brian.dev',
		demoIsLive: true,
		featuredOnHome: false,
		sortOrder: 4
	}
];

export const mockMusic = [
	{
		id: '1',
		title: 'Echoes Of You',
		artist: 'Aftruu',
		album: 'Echoes Of You',
		coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
		spotifyUrl: 'https://open.spotify.com/search/Aftruu%20Echoes%20Of%20You',
		playedAt: new Date('2026-07-19')
	},
	{
		id: '2',
		title: 'Mind',
		artist: 'Farves',
		album: 'Mind',
		coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
		spotifyUrl: 'https://open.spotify.com/search/Farves%20Mind',
		playedAt: new Date('2026-07-19')
	},
	{
		id: '3',
		title: 'Waking Still Beneath',
		artist: 'Blugazer',
		album: 'Waking Still Beneath / Mirrored Dusk',
		coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
		spotifyUrl: 'https://open.spotify.com/search/Blugazer%20Waking%20Still%20Beneath',
		playedAt: new Date('2026-07-19')
	},
	{
		id: '4',
		title: 'Brighter Than Yesterday',
		artist: 'Brendel',
		album: 'Brighter Than Yesterday',
		coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
		spotifyUrl: 'https://open.spotify.com/search/Brendel%20Brighter%20Than%20Yesterday',
		playedAt: new Date('2026-07-19')
	},
	{
		id: '5',
		title: 'New Day',
		artist: 'Alangji',
		album: 'New Day',
		coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
		spotifyUrl: 'https://open.spotify.com/search/Alangji%20New%20Day',
		playedAt: new Date('2026-07-19')
	},
	{
		id: '6',
		title: 'Faded',
		artist: 'Stendahl',
		album: 'Faded',
		coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&q=80',
		spotifyUrl: 'https://open.spotify.com/search/Stendahl%20Faded',
		playedAt: new Date('2026-07-18')
	},
	{
		id: '7',
		title: 'Our Own Island',
		artist: 'Sound Quelle',
		album: 'Higher Note',
		coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80',
		spotifyUrl: 'https://open.spotify.com/search/Sound%20Quelle%20Our%20Own%20Island',
		playedAt: new Date('2026-07-18')
	},
	{
		id: '8',
		title: 'Through The Dark',
		artist: 'Isam Hadjih',
		album: 'Through The Dark',
		coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80',
		spotifyUrl: 'https://open.spotify.com/search/Isam%20Hadjih%20Through%20The%20Dark',
		playedAt: new Date('2026-07-17')
	},
	{
		id: '9',
		title: 'Hold On',
		artist: 'Rezident',
		album: 'Feeling Fades',
		coverUrl: null,
		playedAt: new Date('2026-07-12')
	},
	{
		id: '10',
		title: 'Never Change',
		artist: 'Otherwish',
		album: 'Never Change',
		coverUrl: null,
		playedAt: new Date('2026-07-09')
	},
	{
		id: '11',
		title: 'Toucan',
		artist: 'Robby East',
		album: 'Marula / Toucan',
		coverUrl: null,
		playedAt: new Date('2026-07-09')
	},
	{
		id: '12',
		title: 'Story to Remember',
		artist: 'Melosense',
		album: 'Story to Remember',
		coverUrl: null,
		playedAt: new Date('2026-07-09')
	}
];

export const mockGalleryPhotos = [
	{
		id: '1',
		slug: 'sunset-madura',
		title: 'Sunset over Madura Strait',
		imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
		shortDesc: 'Golden hour at the Suramadu bridge viewpoint',
		cameraDesc: 'Fujifilm X-T3, 23mm f/2, ISO 200',
		width: 800,
		height: 533
	},
	{
		id: '2',
		slug: 'morning-coffee',
		title: 'Morning ritual',
		imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
		shortDesc: 'The quiet moment before the day begins',
		cameraDesc: 'Fujifilm X-T3, 35mm f/1.4, ISO 400',
		width: 800,
		height: 533
	},
	{
		id: '3',
		slug: 'campus-library',
		title: 'UTM Library',
		imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80',
		shortDesc: 'Late afternoon study session',
		cameraDesc: 'Fujifilm X-T3, 16mm f/2.8, ISO 800',
		width: 800,
		height: 533
	},
	{
		id: '4',
		slug: 'street-light',
		title: 'Street light',
		imageUrl: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=800&q=80',
		shortDesc: 'Urban geometry at night',
		cameraDesc: 'Fujifilm X-T3, 23mm f/2, ISO 1600',
		width: 800,
		height: 1067
	},
	{
		id: '5',
		slug: 'rain-drops',
		title: 'After the rain',
		imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e39aacf?w=800&q=80',
		shortDesc: 'Macro details on a leaf',
		cameraDesc: 'Fujifilm X-T3, 60mm f/2.4 Macro, ISO 320',
		width: 800,
		height: 1067
	},
	{
		id: '6',
		slug: 'dock-morning',
		title: 'Empty dock',
		imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
		shortDesc: 'Calm waters at dawn',
		cameraDesc: 'Fujifilm X-T3, 16mm f/2.8, ISO 200',
		width: 800,
		height: 533
	}
];

export const mockAcademics = [
	{
		id: 's1',
		slug: 'semester-1',
		title: 'Semester 1',
		sortOrder: 0,
		courses: [
			{
				id: 'c1',
				slug: 'dasar-pemrograman',
				title: 'Dasar Pemrograman',
				dosenName: 'Dr. Ahmad Fauzi',
				hasPraktikum: true,
				asprakName: 'Rizky Pratama',
				materials: [
					{
						id: 'm1',
						slug: 'intro-programming',
						fullSlug: 'semester-1/dasar-pemrograman/intro-programming',
						title: 'Introduction to Programming',
						type: 'materi' as const,
						contentHtml: '<p>Welcome to the world of programming...</p>',
						attachments: [{ name: 'Slide Week 1.pdf', url: '#' }],
						createdAt: new Date('2024-09-01')
					},
					{
						id: 'm2',
						slug: 'variables-and-types',
						fullSlug: 'semester-1/dasar-pemrograman/variables-and-types',
						title: 'Variables and Data Types',
						type: 'materi' as const,
						contentHtml: '<p>Understanding variables and data types in programming...</p>',
						attachments: null,
						createdAt: new Date('2024-09-08')
					},
					{
						id: 'm3',
						slug: 'tugas-1-hello-world',
						fullSlug: 'semester-1/dasar-pemrograman/tugas-1-hello-world',
						title: 'Tugas 1: Hello World',
						type: 'tugas' as const,
						contentHtml: '<p>Create a simple Hello World program in three different languages...</p>',
						attachments: [{ name: 'Template.zip', url: '#' }],
						createdAt: new Date('2024-09-10')
					},
					{
						id: 'm4',
						slug: 'praktikum-1-setup',
						fullSlug: 'semester-1/dasar-pemrograman/praktikum-1-setup',
						title: 'Praktikum 1: Environment Setup',
						type: 'praktikum' as const,
						contentHtml: '<p>Setting up your development environment for the course...</p>',
						attachments: null,
						createdAt: new Date('2024-09-12')
					}
				]
			},
			{
				id: 'c2',
				slug: 'kalkulus-1',
				title: 'Kalkulus 1',
				dosenName: 'Prof. Siti Nurhaliza',
				hasPraktikum: false,
				asprakName: null,
				materials: [
					{
						id: 'm5',
						slug: 'limit-dan-kontinuitas',
						fullSlug: 'semester-1/kalkulus-1/limit-dan-kontinuitas',
						title: 'Limit dan Kontinuitas',
						type: 'materi' as const,
						contentHtml: '<p>Konsep dasar limit dan kontinuitas fungsi...</p>',
						attachments: [{ name: 'Modul Kalkulus Bab 1.pdf', url: '#' }],
						createdAt: new Date('2024-09-02')
					}
				]
			}
		]
	},
	{
		id: 's2',
		slug: 'semester-2',
		title: 'Semester 2',
		sortOrder: 1,
		courses: [
			{
				id: 'c3',
				slug: 'struktur-data',
				title: 'Struktur Data',
				dosenName: 'Dr. Budi Santoso',
				hasPraktikum: true,
				asprakName: 'Dewi Lestari',
				materials: [
					{
						id: 'm6',
						slug: 'array-and-linked-list',
						fullSlug: 'semester-2/struktur-data/array-and-linked-list',
						title: 'Array and Linked List',
						type: 'materi' as const,
						contentHtml: '<p>Understanding arrays and linked lists...</p>',
						attachments: null,
						createdAt: new Date('2025-02-01')
					}
				]
			},
			{
				id: 'c4',
				slug: 'dasar-pemrograman-web',
				title: 'Dasar Pemrograman Web',
				dosenName: 'Ir. Candra Wijaya',
				hasPraktikum: true,
				asprakName: 'Fajar Nugroho',
				materials: [
					{
						id: 'm7',
						slug: 'intro-html',
						fullSlug: 'semester-2/dasar-pemrograman-web/intro-html',
						title: 'Introduction to HTML',
						type: 'materi' as const,
						contentHtml: '<p>HTML is the foundation of every web page...</p>',
						attachments: [{ name: 'Slide HTML Basics.pdf', url: '#' }],
						createdAt: new Date('2025-02-03')
					}
				]
			}
		]
	}
];

export function formatDate(date: Date): string {
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
}

export function formatDateShort(date: Date): string {
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric'
	});
}

export function groupWritingsByYear(
	writings: typeof mockWritings
): { year: number; items: typeof mockWritings }[] {
	const grouped = new Map<number, typeof mockWritings>();
	for (const w of writings) {
		if (!grouped.has(w.year)) grouped.set(w.year, []);
		grouped.get(w.year)!.push(w);
	}
	return Array.from(grouped.entries())
		.sort(([a], [b]) => b - a)
		.map(([year, items]) => ({ year, items }));
}
