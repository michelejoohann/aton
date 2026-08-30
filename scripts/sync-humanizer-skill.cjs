const fs = require('node:fs');
const path = require('node:path');

const [mode] = process.argv.slice(2);

if (process.argv.length !== 3 || !['--write', '--check'].includes(mode)) {
  console.error('Uso: node scripts/sync-humanizer-skill.cjs <--write|--check>');
  process.exit(1);
}

const root = path.resolve(__dirname, '..');
const sourceDirectory = path.join(root, '.agents/skills/humanizer');
const targetDirectory = path.join(root, '.claude/skills/humanizer');
const marker = '<!-- GENERATED FROM .agents/skills/humanizer/SKILL.md; DO NOT EDIT -->';

function collectTree(directory, relative = '', tree = { directories: new Set(), files: [] }) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const next = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      tree.directories.add(next);
      collectTree(path.join(directory, entry.name), next, tree);
    } else if (entry.isFile()) {
      tree.files.push(next);
    } else {
      throw new Error(`Recurso não suportado: ${next}`);
    }
  }
  return tree;
}

function generatedSkill(source) {
  const frontmatter = source.match(/^---(\r\n|\n)[\s\S]*?\1---(?=\1|$)/);
  if (!frontmatter) {
    throw new Error('A skill canônica deve começar no byte 0 com frontmatter YAML fechado.');
  }
  const frontmatterEnd = frontmatter[0].length;
  const lineEnding = frontmatter[1];
  return source.slice(0, frontmatterEnd) + lineEnding.repeat(2) + marker + source.slice(frontmatterEnd);
}

const sourceTree = collectTree(sourceDirectory);
const expectedFiles = new Map(sourceTree.files.map((relative) => {
  const source = fs.readFileSync(path.join(sourceDirectory, relative));
  return [relative, relative === 'SKILL.md' ? Buffer.from(generatedSkill(source.toString('utf8')), 'utf8') : source];
}));

if (mode === '--write') {
  fs.rmSync(targetDirectory, { recursive: true, force: true });
  fs.mkdirSync(targetDirectory, { recursive: true });

  for (const relative of sourceTree.directories) fs.mkdirSync(path.join(targetDirectory, relative), { recursive: true });

  for (const [relative, contents] of expectedFiles) {
    const target = path.join(targetDirectory, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
  }
  process.exit(0);
}

const synchronized = (() => {
  let targetTree;
  try {
    targetTree = collectTree(targetDirectory);
  } catch {
    return false;
  }

  if (
    targetTree.files.length !== expectedFiles.size ||
    targetTree.directories.size !== sourceTree.directories.size ||
    targetTree.files.some((relative) => !expectedFiles.has(relative)) ||
    [...targetTree.directories].some((relative) => !sourceTree.directories.has(relative))
  ) {
    return false;
  }

  return [...expectedFiles].every(([relative, contents]) => {
  try {
    return fs.readFileSync(path.join(targetDirectory, relative)).equals(contents);
  } catch {
    return false;
  }
  });
})();

if (!synchronized) {
  console.error('A cópia Claude está ausente ou desatualizada. Execute: node scripts/sync-humanizer-skill.cjs --write');
  process.exit(1);
}
