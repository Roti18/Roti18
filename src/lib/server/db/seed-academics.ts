import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

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

const rawUrl = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!rawUrl) {
	console.error('DATABASE_URL is missing in .env');
	process.exit(1);
}

// Convert libsql:// to https:// for HTTP REST protocol
const url = rawUrl.replace(/^libsql:\/\//, 'https://');

const client = createClient({ url, authToken });
const db = drizzle(client, { schema });

const templateAcademics = [
  {
    id: "s-template-1",
    slug: "semester-1-template",
    title: "Semester 1 (Template)",
    sortOrder: 0,
    courses: [
      {
        id: "c-template-1",
        slug: "dasar-pemrograman-template",
        title: "Dasar Pemrograman (Template)",
        dosenName: "Dr. Ahmad Fauzi, S.Kom., M.Kom.",
        hasPraktikum: true,
        asprakName: "Rizky Pratama",
        materials: [
          // ── TEMPLATE MATERI ──
          {
            id: "m-template-1",
            slug: "pertemuan-1-pengantar",
            fullSlug: "semester-1-template/dasar-pemrograman-template/pertemuan-1-pengantar",
            title: "Pertemuan 1: Pengantar Pemrograman",
            type: "materi" as const,
            contentHtml: 
              "<h3>Tujuan Pembelajaran</h3><ul><li>Memahami konsep dasar algoritma</li><li>Mengenal bahasa pemrograman C++</li></ul><p>Silakan pelajari slide yang dilampirkan sebelum kelas dimulai.</p>",
            attachments: [
              { name: "Slide_Pertemuan_1.pdf", url: "#" },
              { name: "Silabus_Dasar_Pemrograman.pdf", url: "#" }
            ],
            createdAt: new Date("2024-09-01"),
          },
          // ── TEMPLATE PRAKTIKUM ──
          {
            id: "m-template-2",
            slug: "modul-1-io-dasar",
            fullSlug: "semester-1-template/dasar-pemrograman-template/modul-1-io-dasar",
            title: "Modul Praktikum 1: Input & Output",
            type: "praktikum" as const,
            contentHtml:
              "<h3>Instruksi Praktikum</h3><p>Pada modul ini kita akan belajar tentang:</p><ol><li>Fungsi <code>printf</code> dan <code>scanf</code></li><li>Tipe data dasar (int, float, char)</li></ol><blockquote>Jangan lupa bawa laptop masing-masing yang sudah terinstall MinGW!</blockquote>",
            attachments: [
              { name: "Modul_1_IO.pdf", url: "#" },
              { name: "Format_Laporan.docx", url: "#" }
            ],
            createdAt: new Date("2024-09-08"),
          },
          // ── TEMPLATE TUGAS ──
          {
            id: "m-template-3",
            slug: "tugas-1-kalkulator",
            fullSlug: "semester-1-template/dasar-pemrograman-template/tugas-1-kalkulator",
            title: "Tugas 1: Program Kalkulator Sederhana",
            type: "tugas" as const,
            contentHtml:
              "<p>Buatlah program kalkulator sederhana yang bisa melakukan operasi penjumlahan, pengurangan, perkalian, dan pembagian.</p><p><strong>Ketentuan:</strong></p><ul><li>Dikumpulkan maksimal minggu depan.</li><li>Upload source code <code>.cpp</code> ke Google Classroom.</li></ul>",
            attachments: [],
            createdAt: new Date("2024-09-10"),
          },
        ],
      },
      // ── TEMPLATE MATA KULIAH TANPA PRAKTIKUM ──
      {
        id: "c-template-2",
        slug: "kalkulus-1-template",
        title: "Kalkulus 1 (Template)",
        dosenName: "Prof. Siti Nurhaliza, M.Si.",
        hasPraktikum: false,
        asprakName: null,
        materials: [
          {
            id: "m-template-4",
            slug: "pertemuan-1-sistem-bilangan-real",
            fullSlug: "semester-1-template/kalkulus-1-template/pertemuan-1-sistem-bilangan-real",
            title: "Pertemuan 1: Sistem Bilangan Real",
            type: "materi" as const,
            contentHtml: "<p>Konsep dasar himpunan, pertidaksamaan, dan nilai mutlak.</p>",
            attachments: [{ name: "Modul_Kalkulus_Bab_1.pdf", url: "#" }],
            createdAt: new Date("2024-09-02"),
          },
        ],
      },
      // ── TEMPLATE MATA KULIAH LAINNYA ──
      {
        id: "c-template-3",
        slug: "pengantar-teknologi-informasi-template",
        title: "Pengantar Teknologi Informasi (Template)",
        dosenName: "Ir. Budi Santoso, M.T.",
        hasPraktikum: false,
        asprakName: null,
        materials: [
          {
            id: "m-template-5",
            slug: "sejarah-komputer",
            fullSlug: "semester-1-template/pengantar-teknologi-informasi-template/sejarah-komputer",
            title: "Sejarah dan Perkembangan Komputer",
            type: "materi" as const,
            contentHtml: "<p>Mempelajari generasi-generasi komputer dari tabung hampa hingga era kecerdasan buatan.</p>",
            attachments: [{ name: "Materi_Sejarah_Komputer.pptx", url: "#" }],
            createdAt: new Date("2024-09-03"),
          }
        ]
      }
    ]
  }
];

async function seedAcademics() {
	console.log('🌱 Starting academic template seed...');

	try {
		for (const semester of templateAcademics) {
			console.log(`- Seeding ${semester.title}...`);
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
					}).onConflictDoUpdate({
                        target: schema.academicMaterial.fullSlug,
                        set: {
                            title: material.title,
                            type: material.type,
                            contentHtml: material.contentHtml,
                            content: material.contentHtml
                        }
                    });
				}
			}
		}

		console.log('✅ Academic templates seeding completed successfully!');
		process.exit(0);
	} catch (error) {
		console.error('❌ Seeding failed:', error);
		process.exit(1);
	}
}

seedAcademics();
