import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deployDir = path.join(__dirname, 'deploy_package');
const zipFile = path.join(__dirname, 'deploy.zip');

console.log('🚀 Preparing deployment package for Hostinger Shared Hosting...');

// 1. Clean up old package
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true });
}
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}
fs.mkdirSync(deployDir);

// 2. Copy standalone files
console.log('📁 Copying standalone build files...');
const standaloneDir = path.join(__dirname, '.next', 'standalone');
if (!fs.existsSync(standaloneDir)) {
  console.error('❌ Error: .next/standalone folder not found. Did you run `npm run build`?');
  process.exit(1);
}
fs.cpSync(standaloneDir, deployDir, { recursive: true });

// 3. Copy static files
console.log('📁 Copying static assets...');
const staticSourceDir = path.join(__dirname, '.next', 'static');
const staticDestDir = path.join(deployDir, '.next', 'static');
if (!fs.existsSync(staticDestDir)) {
  fs.mkdirSync(staticDestDir, { recursive: true });
}
fs.cpSync(staticSourceDir, staticDestDir, { recursive: true });

// 4. Copy public folder
console.log('📁 Copying public folder...');
const publicSourceDir = path.join(__dirname, 'public');
const publicDestDir = path.join(deployDir, 'public');
if (fs.existsSync(publicSourceDir)) {
  fs.cpSync(publicSourceDir, publicDestDir, { recursive: true });
}

// Copy prisma schema and seed script
console.log('📁 Copying prisma files...');
const prismaDestDir = path.join(deployDir, 'prisma');
fs.mkdirSync(prismaDestDir, { recursive: true });
fs.cpSync(path.join(__dirname, 'prisma', 'schema.prisma'), path.join(prismaDestDir, 'schema.prisma'));
if (fs.existsSync(path.join(__dirname, 'prisma', 'seed.ts'))) {
  fs.cpSync(path.join(__dirname, 'prisma', 'seed.ts'), path.join(prismaDestDir, 'seed.ts'));
}
if (fs.existsSync(path.join(__dirname, 'prisma-setup.js'))) {
  fs.cpSync(path.join(__dirname, 'prisma-setup.js'), path.join(deployDir, 'prisma-setup.js'));
}

// 5. Create zip file using Windows tar (available in Windows 10/11)
console.log('📦 Zipping files (this may take a moment)...');
try {
  // Use tar to create a zip file (-a auto-detects zip from extension)
  execSync(`tar -a -c -f ../deploy.zip .`, { cwd: deployDir, stdio: 'inherit' });
  console.log('✅ deploy.zip created successfully!');
} catch (error) {
  console.error('❌ Failed to create zip file using tar.', error.message);
  console.log('⚠️ Please manually zip the contents of the "deploy_package" folder.');
}

// 6. Cleanup (Optional, keep it so user can see what's inside if they want)
// fs.rmSync(deployDir, { recursive: true, force: true });
console.log('');
console.log('🎉 All done! You can now upload "deploy.zip" to Hostinger File Manager.');
console.log('⚠️ IMPORTANT: After extracting deploy.zip on Hostinger, you must run:');
console.log('   cd /var/www/mla-platform (or your deploy directory)');
console.log('   npm install @prisma/client prisma --no-save');
console.log('   npx prisma generate');
console.log('   pm2 restart mla-platform');

