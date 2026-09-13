const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('i:/Project/MLA Constituency Management Platform/mla-platform/src/app/partner');

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const initial = content;
  
  // Replace \\` with `
  content = content.replace(/\\`/g, '`');
  // Replace \\$ with $
  content = content.replace(/\\\$/g, '$');
  // Replace \\{ with {
  content = content.replace(/\\{/g, '{');
  // Replace \\} with }
  content = content.replace(/\\}/g, '}');
  
  if (initial !== content) {
    fs.writeFileSync(f, content);
    console.log('Fixed', f);
  }
});
