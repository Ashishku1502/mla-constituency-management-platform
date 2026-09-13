const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function buildHostinger() {
  console.log('1. Running Next.js build...');
  execSync('npm run build', { stdio: 'inherit' });

  const root = __dirname;
  const standalone = path.join(root, '.next', 'standalone');
  const target = path.join(root, 'hostinger-build');

  console.log('2. Preparing Hostinger build folder...');
  if (fs.existsSync(target)) {
    fs.removeSync(target);
  }

  // Next.js output: standalone contains everything except static assets
  fs.copySync(standalone, target);

  // Copy static assets
  console.log('3. Copying static assets...');
  fs.copySync(path.join(root, 'public'), path.join(target, 'public'));
  fs.copySync(path.join(root, '.next', 'static'), path.join(target, '.next', 'static'));

  // Copy prisma schema so it can be generated on the server if needed
  if (fs.existsSync(path.join(root, 'prisma'))) {
    fs.copySync(path.join(root, 'prisma'), path.join(target, 'prisma'));
  }
  
  // Copy package.json to the root of hostinger build
  fs.copySync(path.join(root, 'package.json'), path.join(target, 'package.json'));

  // Update server.js to run on process.env.PORT
  const serverJsPath = path.join(target, 'server.js');
  if (fs.existsSync(serverJsPath)) {
    let serverJs = fs.readFileSync(serverJsPath, 'utf8');
    // Ensure it binds to 0.0.0.0 and PORT
    // Hostinger sets process.env.PORT automatically.
    fs.writeFileSync(serverJsPath, serverJs);
  }

  console.log('');
  console.log('✅ Hostinger Deployment Package Ready!');
  console.log('----------------------------------------------------');
  console.log('To deploy to Hostinger:');
  console.log('1. Zip the contents INSIDE the "hostinger-build" folder.');
  console.log('2. Upload that zip file to your Hostinger File Manager (public_html or your domain folder).');
  console.log('3. Extract the ZIP.');
  console.log('4. Go to your Hostinger "Node.js" settings, set the startup file to "server.js".');
  console.log('5. Install dependencies and start the app from the Hostinger panel.');
}

buildHostinger().catch(console.error);
