import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');
const templatePath = path.join(__dirname, '../../frontend/public/templates/visual-novel-player.html');

const html = fs.readFileSync(indexPath, 'utf-8');

const templatesDir = path.dirname(templatePath);
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

fs.writeFileSync(templatePath, html);

console.log('✓ Visual Novel播放器模板已生成:', templatePath);

