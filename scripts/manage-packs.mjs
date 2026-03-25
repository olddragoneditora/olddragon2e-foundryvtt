#!/usr/bin/env node
/* eslint-env node */
import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// Auto-detect project type: system.json or module.json
let manifest;
let projectType;
if (existsSync(resolve(rootDir, 'src/system.json'))) {
  manifest = JSON.parse(readFileSync(resolve(rootDir, 'src/system.json'), 'utf-8'));
  projectType = 'System';
} else if (existsSync(resolve(rootDir, 'src/module.json'))) {
  manifest = JSON.parse(readFileSync(resolve(rootDir, 'src/module.json'), 'utf-8'));
  projectType = 'Module';
} else {
  console.error('No system.json or module.json found in src/');
  process.exit(1);
}

const projectId = manifest.id;
const packs = manifest.packs.map((p) => p.name);

const ACTIONS = ['extract', 'extract:dist', 'pack'];
const action = process.argv[2];
if (!ACTIONS.includes(action)) {
  console.error(`Usage: node scripts/manage-packs.mjs <${ACTIONS.join('|')}>`);
  process.exit(1);
}

console.log(`${projectType}: ${projectId} (${packs.length} packs)\n`);

const isExtract = action === 'extract' || action === 'extract:dist';
const sourceDir = action === 'extract:dist' ? 'dist/packs' : 'src/packs';

for (const pack of packs) {
  if (isExtract) {
    console.log(`Extracting ${pack} from ${sourceDir}...`);
    execSync(
      `npx fvtt package unpack --type ${projectType} --id ${projectId} "${pack}" --in "${sourceDir}" --out "src/packs/${pack}/_source"`,
      {
        cwd: rootDir,
        stdio: 'inherit',
      },
    );
  } else {
    console.log(`Packing ${pack} to src/packs...`);
    execSync(
      `npx fvtt package pack --type ${projectType} --id ${projectId} "${pack}" --in "src/packs/${pack}/_source" --out "src/packs"`,
      {
        cwd: rootDir,
        stdio: 'inherit',
      },
    );
  }
}

// After extracting, format JSON files so they match prettier and stay clean on commit
if (isExtract) {
  console.log('\nFormatting extracted files with prettier...');
  execSync('npx prettier --write "src/packs/**/_source/*.json"', {
    cwd: rootDir,
    stdio: 'inherit',
  });
}
