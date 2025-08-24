// Content validation script for The Messenger's Path
// Checks for missing scenes, duplicate IDs, invalid requirements/effects, and narrative rules

import fs from 'node:fs';
import path from 'node:path';

const contentDir = path.resolve('src/content');
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'));

const allSceneIds = new Set();
const allChoiceIds = new Set();
let errors = [];

function validateRequirement(req) {
  const validTypes = ['stat','coins','flagMin','clueSum','item'];
  if (!validTypes.includes(req.type)) return `Invalid requirement type: ${req.type}`;
  return null;
}

function validateEffect(eff) {
  const validTypes = ['statGain','coins','addFlag','ally','scrolls','item','knowledge','goto'];
  if (!validTypes.includes(eff.type)) return `Invalid effect type: ${eff.type}`;
  return null;
}

for (const file of files) {
  const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8');
  let chapter;
  try { chapter = JSON.parse(raw); } catch (e) { errors.push(`${file}: JSON parse error`); continue; }
  const seenSceneIds = new Set();
  for (const scene of chapter.scenes) {
    if (allSceneIds.has(scene.id)) errors.push(`${file}: Duplicate scene id ${scene.id}`);
    allSceneIds.add(scene.id);
    if (seenSceneIds.has(scene.id)) errors.push(`${file}: Scene id ${scene.id} duplicated in chapter`);
    seenSceneIds.add(scene.id);
    if (!scene.choices) errors.push(`${file}: Scene ${scene.id} missing choices array`);
    for (const choice of (scene.choices||[])) {
      if (allChoiceIds.has(choice.id)) errors.push(`${file}: Duplicate choice id ${choice.id}`);
      allChoiceIds.add(choice.id);
      if (choice.requirements) {
        for (const req of choice.requirements) {
          const reqErr = validateRequirement(req);
          if (reqErr) errors.push(`${file}: Scene ${scene.id} choice ${choice.id}: ${reqErr}`);
        }
      }
      if (choice.effects) {
        for (const eff of choice.effects) {
          const effErr = validateEffect(eff);
          if (effErr) errors.push(`${file}: Scene ${scene.id} choice ${choice.id}: ${effErr}`);
        }
      }
      if (choice.onFail) {
        for (const eff of choice.onFail) {
          const effErr = validateEffect(eff);
          if (effErr) errors.push(`${file}: Scene ${scene.id} choice ${choice.id} (onFail): ${effErr}`);
        }
      }
      // Narrative rule: no meta labels
      if (/meta|decode|flag|knowledge/i.test(choice.label)) {
        errors.push(`${file}: Scene ${scene.id} choice ${choice.id} label contains meta term`);
      }
    }
  }
}

if (errors.length) {
  console.error('Content validation errors:');
  for (const err of errors) console.error(' -', err);
  process.exit(1);
} else {
  console.log('All content files passed validation.');
}
