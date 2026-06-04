import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');

const required = [
  'README.md',
  'package.json',
  'src/core/idle.js',
  'src/resources/inference.worker.js',
  'docs/resources/OVERVIEW.md',
  'docs/INTEGRATION.md',
  'docs/WORKER.md',
  'docs/ARCHITECTURE.md',
  'examples/app/index.html',
  'examples/app/app.js',
];

const failures = [];
for (const relative of required) {
  if (!existsSync(resolve(root, relative))) {
    failures.push('missing: ' + relative);
  }
}
assert.strictEqual(failures.length, 0, failures.join('\n'));

const idleSource = readFileSync(resolve(root, 'src/core/idle.js'), 'utf8');
assert.ok(idleSource.includes('export default'), 'expected idle semantic entrypoint export');
assert.ok(idleSource.includes('idle.emit'), 'expected idle event emission API');

const inferenceSource = readFileSync(resolve(root, 'src/resources/inference.worker.js'), 'utf8');
assert.ok(inferenceSource.includes("import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3')"), 'expected CDN transformers import');
assert.ok(inferenceSource.includes('onnx-community/Llama-3.2-1B-Instruct'), 'expected browser-capable model');
assert.ok(inferenceSource.includes('nodeId'), 'expected nodeId handle in inference worker');

const overview = readFileSync(resolve(root, 'docs/resources/OVERVIEW.md'), 'utf8');
for (const heading of ['PC', 'Wallet', 'Agent', 'Data', 'API', 'GPU']) {
  assert.ok(overview.includes(heading), 'expected overview to cover ' + heading);
}

const app = readFileSync(resolve(root, 'examples/app/app.js'), 'utf8');
assert.ok(app.includes("new Worker(new URL('../src/worker.js', import.meta.url), { type: 'module' })"), 'expected example DOM worker path');
