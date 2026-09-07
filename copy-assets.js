const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'assets');
const pubDir = path.join(__dirname, 'public', 'assets');

if (!fs.existsSync(pubDir)) {
  fs.mkdirSync(pubDir, { recursive: true });
}

const files = ['Mahesh_gite_logo.png', 'Mahesh_img.png', 'favicon.svg'];

files.forEach(file => {
  const srcFile = path.join(srcDir, file);
  const destFile = path.join(pubDir, file);
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied ${file} to public/assets/`);
  }
});

// Also copy favicon.svg to public root
if (fs.existsSync(path.join(srcDir, 'favicon.svg'))) {
  fs.copyFileSync(path.join(srcDir, 'favicon.svg'), path.join(__dirname, 'public', 'favicon.svg'));
}

// If make-rounded-favicon.js exists, invoke it
try {
  const makeFavicon = path.join(__dirname, 'make-rounded-favicon.js');
  if (fs.existsSync(makeFavicon)) {
    require(makeFavicon);
  }
} catch (e) {
  // Ignore
}
