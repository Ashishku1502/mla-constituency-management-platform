This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Geist, a new font family.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Database Migration (PostgreSQL)

Since SQLite cannot run on serverless platforms like Vercel, this project has been updated to use **PostgreSQL** via Prisma.

1. **Local Development Setup**:
   - Make sure you have Docker running.
   - Start the local PostgreSQL database using docker-compose:
     ```bash
     docker-compose up -d
     ```
   - In `.env`, configure your database URL:
     ```env
     DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mla_db?schema=public"
     ```
   - Initialize and seed the local database:
     ```bash
     npm run db:setup
     ```

2. **Production Setup on Vercel**:
   - Link your project to Vercel (or deploy via Github integration).
   - Provision a PostgreSQL database (e.g., Vercel Postgres, Neon database, or Supabase).
   - Add the required environment variables in your Vercel project settings:
     - `DATABASE_URL`: Your PostgreSQL connection string.
     - `AUTH_SECRET`: A secure key for NextAuth (can be generated using `openssl rand -base64 32`).
   - Run initial schema migration manually from your local machine pointing to production, or run:
     ```bash
     DATABASE_URL="your-production-url" npx prisma db push
     DATABASE_URL="your-production-url" npx prisma db seed
     ```

