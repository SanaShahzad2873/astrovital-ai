// Run with:  node --test src/engine/__tests__/browserSafe.test.js
// Guards the files the React app imports: no Node-only modules, no unguarded `process`.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const NODE_ONLY = ['runOsd575.js', 'runFusion.js'];
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js') && !NODE_ONLY.includes(f));

test('app-facing engine files are browser-safe', () => {
  assert.ok(files.length >= 8);
  for (const f of files) {
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    assert.ok(!/from\s+['"]node:/.test(src), `${f} imports a Node module`);
    for (const line of src.split('\n')) {
      if (/\bprocess\./.test(line) && !line.trim().startsWith('//')) {
        assert.ok(/typeof process/.test(line), `${f} uses process without a guard: ${line.trim()}`);
      }
    }
  }
});