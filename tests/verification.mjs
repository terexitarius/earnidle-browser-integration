import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const required = [
  'container.html',
  'container.js',
  'src/resources/vm.worker.js',
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

if (!existsSync(resolve(root, 'examples/webvm/index.html'))) {
  throw new Error('missing: examples/webvm/index.html');
}

const vmWorker = readFileSync(resolve(root, 'src/resources/vm.worker.js'), 'utf8');
assert.ok(vmWorker.includes('submitResult'), 'vm worker should implement EarnIdle submit hook');

const containerJs = readFileSync(resolve(root, 'container.js'), 'utf8');
assert.ok(containerJs.includes('earnIdleVM'), 'container.js should define earnIdleVM service');
