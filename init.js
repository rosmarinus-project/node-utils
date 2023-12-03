const { execSync } = require('child_process');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');

const projectRoot = __dirname;

const projectName = process.argv[2];

if (!projectName) {
  throw new Error('Missing project name');
}

execSync('pnpm i', { cwd: projectRoot, stdio: 'inherit' });

const KEY = 'template-name';

const FILES = ['.github/workflows/publish.yml', 'package.json', 'README.md'];

function main() {
  for (const file of FILES) {
    const content = readFileSync(file, 'utf-8');
    const newContent = content.replace(KEY, projectName);

    writeFileSync(file, newContent);
  }

  unlinkSync(__filename);
}

main();
