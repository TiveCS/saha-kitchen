## Teknologi yang digunakan

- <a href="https://nextjs.org/docs">Next.js 14 (App Router)</a>
- <a href="https://tailwindcss.com/">TailwindCSS</a>
- <a href="https://nextui.org">NextUI</a>
- <a href="https://www.prisma.io">Prisma ORM</a>
- <a href="https://www.postgresql.org">PostgreSQL</a>
- <a href="https://nodejs.org">Node.js</a> / <a href="https://bun.sh">Bun</a>
- <a href="https://www.docker.com/">Docker</a>

## Instalasi Aplikasi

Pastikan sebelumnya sudah terinstall Node.js atau Bun. Bisa di download melalui:

- <a href="https://nodejs.org/en/download">Node.js</a>
- <a href="https://bun.sh/docs/installation">Bun</a>

### Langkah install dependency

1. Buka terminal dan arahkan pada lokasi project

2. Install dependency menggunakan perintah: `npm install` atau `bun install`

### Langkah deploy database

Bisa menginstall terlebih dahulu database PostgreSQL atau menggunakan Docker.

#### Menggunakan Docker

1. Install <a href="https://docs.docker.com/get-docker/">Docker</a>

2. Buka terminal dan arahkan ke folder project

3. Gunakan perintah: `docker compose up -d` untuk menjalankan container database

4. Deploy database dengan perintah: `npx prisma db push` atau `bunx prisma db push`

### Menjalankan aplikasi

1. Untuk pertama kali menjalankan, gunakan perintah `npx prisma generate` atau `bunx prisma generate`

2. Setelah prisma sudah di generate, jalankan aplikasi dengan `npm run start` atau `bun run start`
