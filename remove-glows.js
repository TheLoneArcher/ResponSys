const fs = require('fs');
const glob = require('glob');
const path = require('path');

// Search all TSX files in src
const files = glob.sync('src/**/*.tsx');

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Remove neon box shadows
  if (content.match(/shadow-\[0_0_20px_rgba\([^)]+\)\]/g)) {
    content = content.replace(/shadow-\[0_0_20px_rgba\([^)]+\)\]/g, 'shadow-md');
    changed = true;
  }
  if (content.match(/hover:shadow-\[0_0_25px_rgba\([^)]+\)\]/g)) {
    content = content.replace(/hover:shadow-\[0_0_25px_rgba\([^)]+\)\]/g, 'hover:shadow-lg');
    changed = true;
  }

  // Remove blur-3xl decorative elements
  if (content.match(/<div className="absolute[^"]*blur-3xl[^"]*" \/>/g)) {
    content = content.replace(/<div className="absolute[^"]*blur-3xl[^"]*" \/>\n?\s*/g, '');
    changed = true;
  }
  if (content.match(/<div className="absolute[^"]*blur-2xl[^"]*" \/>/g)) {
    content = content.replace(/<div className="absolute[^"]*blur-2xl[^"]*" \/>\n?\s*/g, '');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Cleaned file:', file);
  }
});
