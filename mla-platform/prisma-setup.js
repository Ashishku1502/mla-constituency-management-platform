const fs = require('fs');
const path = require('path');

// Load environment variables manually from .env files in priority order
function getDatabaseUrl() {
  const envFiles = ['.env.local', '.env.development.local', '.env'];
  for (const file of envFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const match = content.match(/^\s*DATABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?/m);
      if (match) {
        return match[1].trim();
      }
    }
  }
  return process.env.DATABASE_URL || 'file:./dev.db';
}

const dbUrl = getDatabaseUrl();
const isSqlite = dbUrl.startsWith('file:') || dbUrl.startsWith('sqlite:');
const targetProvider = isSqlite ? 'sqlite' : 'postgresql';

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
if (fs.existsSync(schemaPath)) {
  let schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Replace the provider in the datasource block
  // Searches for: provider = "ANYTHING" within datasource db { ... }
  const updatedSchema = schema.replace(
    /(datasource\s+db\s*\{\s*[\s\S]*?provider\s*=\s*")[^"]+("\s*[\s\S]*?\})/g,
    (match, p1, p2) => {
      // Avoid replacing if it's already matching
      return p1 + targetProvider + p2;
    }
  );
  
  if (schema !== updatedSchema) {
    fs.writeFileSync(schemaPath, updatedSchema, 'utf8');
    console.log(`[Prisma Setup] Updated schema provider to "${targetProvider}" based on DATABASE_URL.`);
  } else {
    console.log(`[Prisma Setup] Schema provider is already "${targetProvider}".`);
  }
} else {
  console.error('[Prisma Setup] schema.prisma not found!');
  process.exit(1);
}
