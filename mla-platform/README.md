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

## Deploy on Hostinger

We have two options to deploy the Next.js app on Hostinger:
1. **Hostinger VPS (Recommended)**: Fully automated deployment using SSH and GitHub Actions.
2. **Hostinger Shared Hosting**: Manual upload of a standalone ZIP archive.

### Option 1: Deployment on Hostinger VPS

#### A. Initial VPS Setup
Before deploying, prepare the Hostinger VPS:
1. Log in to your Hostinger VPS via SSH as `root` (or your SSH user).
2. Run the one-time VPS setup script:
   ```bash
   bash vps-setup.sh
   ```
   This will install Node.js 20, PM2, Nginx, configure Nginx for Next.js, and prepare directories.
3. Configure the production environment variables on the VPS at `/var/www/mla-platform/.env.production`:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@localhost:5432/mla_db?schema=public"
   NEXTAUTH_URL="https://yourdomain.com"
   AUTH_SECRET="your-secure-nextauth-secret"
   DISABLE_MOCKS="true"
   ```

#### B. Automated Deployment (GitHub Actions)
Our GitHub Actions workflow in `.github/workflows/deploy.yml` automatically builds and deploys the app to the Hostinger VPS whenever code is pushed to the `main` branch.

To set this up, add these Secrets to your GitHub repository:
- `VPS_HOST`: The IP address of your Hostinger VPS.
- `VPS_USER`: `root` (or your SSH username).
- `VPS_PASSWORD`: Your VPS SSH password.
- `DATABASE_URL`: The production database URL.
- `AUTH_SECRET`: Your NextAuth secret.
- `NEXTAUTH_URL`: Your site URL (e.g., `https://yourdomain.com`).

#### C. Local Command Deployment
You can also trigger a manual deployment directly from your local machine to the VPS by running:
```bash
node deploy_vps.js
```
This runs the local build, packages it into a `deploy.zip`, uploads it via SSH, extracts it on the VPS, runs migrations, and restarts the PM2 process.

---

### Option 2: Manual Deployment on Hostinger Shared Hosting
If you are deploying to Hostinger Shared Hosting:
1. Build the project locally and package it:
   ```bash
   npm run build:shared
   ```
   This compiles the project and generates a `deploy.zip` containing the standalone Next.js server, static assets, and Prisma schema.
2. Upload `deploy.zip` to your Hostinger File Manager under the directory specified for your Node.js application.
3. Extract `deploy.zip`.
4. In the Hostinger Web Panel (Node.js App Setup):
   - Set the entry file to `server.js`.
   - Run `npm install` on the panel (or run `npm install @prisma/client prisma --no-save` manually in terminal).
   - Generate the prisma client using `npx prisma generate`.
   - Start/Restart the application from the panel.

---

### Database Setup & Migration
Our hosting setup is configured to run PostgreSQL in production on Hostinger.

1. **Local Development Setup**:
   - SQLite is used by default for local development (no setup required).
   - If using local PostgreSQL, configure Docker:
     ```bash
     docker-compose up -d
     ```
   - Run setup:
     ```bash
     npm run db:setup
     ```
2. **Production Setup on Hostinger (PostgreSQL)**:
   - Ensure a PostgreSQL database is created on the Hostinger VPS/panel.
   - Run initial migrations/DB sync:
     ```bash
     npx prisma db push
     npx prisma db seed
     ```
   *(Note: The deployment scripts automatically execute `prisma db push` using `.env.production` during the deployment phase).*

