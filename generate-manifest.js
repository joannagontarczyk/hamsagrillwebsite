import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const announcementsDir = path.join(__dirname, 'public', 'announcements');
const manifestPath = path.join(__dirname, 'public', 'announcements-manifest.json');

const getImages = (lang) => {
  const dir = path.join(announcementsDir, lang);
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return [];
  }
  return fs.readdirSync(dir).filter(file => 
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
  );
};

try {
  const manifest = {
    eng: getImages('eng'),
    pol: getImages('pol')
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✅ Announcements manifest generated successfully!');
} catch (error) {
  console.error('❌ Failed to generate announcements manifest:', error);
  process.exit(1);
}

