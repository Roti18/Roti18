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
    id: "64395b7e-144a-4606-9752-5d10d4ee00eb",
    slug: "semester-1",
    title: "Semester 1",
    sortOrder: 1,
    courses: [
      {
        id: "f9e23350-4f9b-4753-b588-ad709a0895a1",
        slug: "bahasa-indonesia",
        title: "Bahasa Indonesia",
        dosenName: "Naelur Rohmah, S. Pd., M. Pd.",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "fd614acf-bec7-4d9a-bbb6-1050c7ac7a94",
        slug: "bahasa-inggris",
        title: "Bahasa Inggris",
        dosenName: "Lutfi Awwalia, S.Pd., M.Pd.",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "59dcd67c-2380-4c34-a0f5-8ab8c5d4dd43",
        slug: "matematika-diskret",
        title: "Matematika Diskret",
        dosenName: "Devie Rosa Anamisa, S.Kom., M.Kom.",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "566827ed-7a4a-493a-83de-14750bfdd346",
        slug: "matematika-teknik",
        title: "Matematika Teknik",
        dosenName: "Dr. Bain Khusnul Khotimah, S.T., M.Kom.",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "6e3c1d68-bee9-4f87-ad11-1e3b4b599f2f",
        slug: "pancasila",
        title: "Pancasila",
        dosenName: "Taufik Hidayah, S.I.Kom., M.I.Kom.",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "ca2d9aa1-0739-40f8-bf48-4171cba2e025",
        slug: "pendidikan-agama-islam",
        title: "Pendidikan Agama Islam",
        dosenName: "Fathur Rahman, M. Pd",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "a2a12dad-f22b-497f-84bd-302e7bce2f4d",
        slug: "algoritma-dasar-pemrograman",
        title: "Algoritma Dasar Pemrograman",
        dosenName: "Dr. Indah Agustien Siradjuddin, S.Kom, M.Kom.",
        hasPraktikum: true,
        asprakName: "Muhammad Azhari",
        materials: [] as any[]
      },
      {
        id: "b53f8536-eaaa-4f00-89fa-5794b3d0246b",
        slug: "pengantar-teknologi-informasi",
        title: "Pengantar Teknologi Informasi",
        dosenName: "Ari Kusumaningsih, ST., MT",
        hasPraktikum: true,
        asprakName: "Mochammad Febrianu Hakim Alamsyah",
        materials: [] as any[]
      }
    ]
  },
  {
    id: "9ef6e33e-95e7-41e2-92f0-1f3abed27eaf",
    slug: "semester-2",
    title: "Semester 2",
    sortOrder: 2,
    courses: [
      {
        id: "25751d3a-3f1c-46d3-a6ca-4d4b919f8639",
        slug: "organisasi-komputer",
        title: "Organisasi Komputer",
        dosenName: "Yoga Dwitya Pramudita, S.Kom., M.Cs.",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "01385a9e-c9aa-4da6-9701-eca01d47a992",
        slug: "metode-statistika",
        title: "Metode Statistika",
        dosenName: "Sigit Susanto Putro, S.Kom., M.Kom.",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "c7310f8f-ecef-4292-a8cf-dfee99d9fd36",
        slug: "komputasi-aljabar-linier",
        title: "Komputasi Aljabar Linier",
        dosenName: "Ari Kusumaningsih, ST., MT",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "71931033-668d-4955-b042-d651e2d8ceba",
        slug: "kewarganegaraan",
        title: "Kewarganegaraan",
        dosenName: "Taufik Hidayah, S.I.Kom., M.I.Kom.",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "63a1befd-27fc-4156-9c2b-a8c9b6b5855b",
        slug: "dasar-pemrograman-web",
        title: "Dasar Pemrograman Web",
        dosenName: "Devie Rosa Anamisa, S.Kom., M.Kom.",
        hasPraktikum: true,
        asprakName: "Zanuar Rizka Aditiya",
        materials: [] as any[]
      },
      {
        id: "8e552e79-e273-4af1-8f6d-de2207503ecd",
        slug: "algoritma-dasar-pemrograman-2",
        title: "Algoritma Dasar Pemrograman",
        dosenName: "Husni, S.Kom., MT",
        hasPraktikum: true,
        asprakName: "Imam Syafii",
        materials: [] as any[]
      }
    ]
  },
  {
    id: "0d6c4fcb-485a-4a2f-b70e-3e37b43292c3",
    slug: "semester-3",
    title: "Semester 3",
    sortOrder: 3,
    courses: [
      {
        id: "a81c08fe-05a6-4a48-a54a-8b5183ac2708",
        slug: "teori-komputasi",
        title: "Teori Komputasi",
        dosenName: "Ika Oktavia Suzanti, S.Kom., M.Cs.",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "b76dcee1-d8bb-4cac-b98c-93dbb28c7b85",
        slug: "sistem-informasi",
        title: "Sistem Informasi",
        dosenName: "Eka Mala Sari Rochman, S.Kom., M.Kom.",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "8361ee88-d7d6-4789-a5c1-e3ca31d7769e",
        slug: "rekayasa-multimedia",
        title: "Rekayasa Multimedia",
        dosenName: "Pak Faris",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "4ab86f38-8741-481c-885a-4170c765dcd0",
        slug: "etika-profesional",
        title: "Etika Profesional",
        dosenName: "Fika Hastarita Rachman, S.T., M.Eng.",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "52f5b8a0-fdbf-4605-9a8f-97b68b63b952",
        slug: "pengembangan-aplikasi-web",
        title: "Pengembangan Aplikasi Web",
        dosenName: "Moch. Kautsar Sophan, S.Kom., M.MT.",
        hasPraktikum: true,
        asprakName: "Muhammad Fathan Alizain",
        materials: [] as any[]
      },
      {
        id: "d2c9c173-60e7-4e7d-8510-ae1dafd5b5d0",
        slug: "jaringan-komputer-1",
        title: "Jaringan Komputer 1",
        dosenName: "Ika Oktavia Suzanti, S.Kom., M.Cs.",
        hasPraktikum: true,
        asprakName: "Muhammad Haikal Firmansyah",
        materials: [] as any[]
      }
    ]
  },
  {
    id: "ef452998-d426-45f8-ae53-43a33cb5f7ca",
    slug: "semester-4",
    title: "Semester 4",
    sortOrder: 4,
    courses: [
      {
        id: "4e9a763d-29a0-40e8-80b4-83e4eb30b7d5",
        slug: "internet-of-things",
        title: "Internet Of Things",
        dosenName: "Dwi Kuswanto, S.Pd., M.T.",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "e1f2b6b7-07eb-45e1-86f5-9030b4a46080",
        slug: "jaringan-komputer-2",
        title: "Jaringan Komputer 2",
        dosenName: "Ika Oktavia Suzanti, S.Kom., M.Cs.",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "d1dca33c-fec7-4745-90f6-8f5e099738eb",
        slug: "kecerdasan-komputasi",
        title: "Kecerdasan Komputasi",
        dosenName: "Arik Kurniawati, S.Kom., MT",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "3a4856d0-8428-42c6-9856-9ccbc754582e",
        slug: "penambangan-data",
        title: "Penambangan Data",
        dosenName: "Mula’ab, S.Si., M.Kom.",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "5a65aab9-9c7a-4267-8bf3-c1d091f719c7",
        slug: "psbf",
        title: "PSBF",
        dosenName: "Hermawan, S.T., M.Kom.",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "899d0528-68a4-492f-b7de-6249b7e9e5ef",
        slug: "temu-kembali-informasi",
        title: "Temu Kembali Informasi",
        dosenName: "Firdaus Solihin, S.Kom., M.Kom.",
        hasPraktikum: false,
        asprakName: null,
        materials: [] as any[]
      },
      {
        id: "f49bf5c4-901a-487c-9ec1-07512aeb1e9d",
        slug: "struktur-data",
        title: "Struktur Data",
        dosenName: "Arik Kurniawati, S.Kom., MT",
        hasPraktikum: true,
        asprakName: "Putra Fajar Suhardi",
        materials: [] as any[]
      }
    ]
  }
];

async function seedAcademics() {
	console.log('🌱 Starting academic template seed...');
	await db.delete(schema.academicMaterial);
	await db.delete(schema.academicCourse);
	await db.delete(schema.academicSemester);
	console.log('🧹 Cleared old academics data...');

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
