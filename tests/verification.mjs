import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const required = [
  'container.html',
  'container.js',
  'src/worker.js',
  'src/resources/inference.worker.js',
  'tests/verification.mjs',
];

const failures = [];
for (const path of required) {
  if (!existsSync(resolve(root, path))) failures.push('missing: ' + path);
}
assert.strictEqual(failures.length, 0, failures.join('\n'));

const examplesDir = resolve(root, 'examples/browser-capabilities');
const expected = [
  'bandwidth_proxy.html',
  'cpu_compute.html',
  'gpu_compute.html',
  'memory_caching.html',
  'temporary_storage.html',
  'micro_sensors.html',
];
const actual = readdirSync(examplesDir);
const missing = expected.filter((file) => !actual.includes(file));
assert.strictEqual(missing.length, 0, missing.length ? 'missing example files: ' + missing.join(', ') : 'ok');

const inferenceWorker = readFileSync(resolve(root, 'src/resources/inference.worker.js'), 'utf8');
assert.ok(inferenceWorker.includes('text-generation'), 'inference worker should implement polling job logic');

const containerJs = readFileSync(resolve(root, 'container.js'), 'utf8');
assert.ok(containerJs.includes('idleInference'), 'container.js should define idleInference service');
