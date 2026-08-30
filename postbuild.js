import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');
const assetsDir = path.join(rootDir, 'assets');

console.log('--- POSTBUILD SYNC START ---');

// 1. Limpar e recriar pasta docs/ a partir de dist/
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}
fs.cpSync(distDir, docsDir, { recursive: true });
console.log('✓ Copiado dist -> docs/');

// 2. Criar 404.html em dist e docs para evitar rotas 404 no GitHub Pages
const distIndex = path.join(distDir, 'index.html');
if (fs.existsSync(distIndex)) {
  fs.copyFileSync(distIndex, path.join(rootDir, '404.html'));
  fs.copyFileSync(distIndex, path.join(docsDir, '404.html'));
  console.log('✓ Criado 404.html na raiz e em docs/404.html');
}

// 3. Garantir .nojekyll na raiz, em docs/ e em dist/
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '# Disable Jekyll');
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '# Disable Jekyll');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '# Disable Jekyll');
}
console.log('✓ Garantido .nojekyll na raiz, docs/ e dist/');

// 4. Sincronizar pasta assets/ na raiz
if (fs.existsSync(assetsDir)) {
  fs.rmSync(assetsDir, { recursive: true, force: true });
}
const distAssets = path.join(distDir, 'assets');
if (fs.existsSync(distAssets)) {
  fs.cpSync(distAssets, assetsDir, { recursive: true });
  console.log('✓ Copiado dist/assets -> assets/');
}

console.log('--- POSTBUILD SYNC COMPLETED SUCCESSFULLY ---');
