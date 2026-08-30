import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');
const assetsDir = path.join(rootDir, 'assets');

console.log('--- POSTBUILD SYNC START ---');

// 1. Limpar e recriar pasta docs/
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}
fs.cpSync(distDir, docsDir, { recursive: true });
console.log('✓ Copiado dist -> docs/');

// 2. Copiar index.html compilado para a raiz e 404.html
const distIndex = path.join(distDir, 'index.html');
if (fs.existsSync(distIndex)) {
  fs.copyFileSync(distIndex, path.join(rootDir, 'index.html'));
  fs.copyFileSync(distIndex, path.join(rootDir, '404.html'));
  fs.copyFileSync(distIndex, path.join(docsDir, '404.html'));
  console.log('✓ Atualizado index.html da raiz, 404.html e docs/404.html');
}

// 3. Sincronizar pasta assets/ na raiz
if (fs.existsSync(assetsDir)) {
  fs.rmSync(assetsDir, { recursive: true, force: true });
}
const distAssets = path.join(distDir, 'assets');
if (fs.existsSync(distAssets)) {
  fs.cpSync(distAssets, assetsDir, { recursive: true });
  console.log('✓ Copiado dist/assets -> assets/');
}

console.log('--- POSTBUILD SYNC COMPLETED SUCCESSFULLY ---');
