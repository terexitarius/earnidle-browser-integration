import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const required = [
  'container.html',
  'container.js',
  'warehouse_wms.js',
  'task_solver.js',
  'src/worker.js',
  'tests/verification.mjs',
];

const failures = [];
for (const path of required) {
  if (!existsSync(resolve(root, path))) {
    failures.push('missing: ' + path);
  }
}
assert.strictEqual(failures.length, 0, failures.join('\n'));

const worker = readFileSync(resolve(root, 'src/worker.js'), 'utf8');
assert.ok(worker.includes('Wallet'), 'worker implements Wallet resource');
assert.ok(worker.includes('Agent'), 'worker implements Agent resource');
assert.ok(worker.includes('Data'), 'worker implements Data resource');
assert.ok(worker.includes('API'), 'worker implements API resource');
assert.ok(worker.includes('GPU'), 'worker implements GPU resource');

const expectedServices = ['idleInference','getGrass','masq','oasis','rivalz','nunet','nodepay'];

const wms = readFileSync(resolve(root, 'warehouse_wms.js'), 'utf8');
assert.ok(wms.includes('startEarnIdleServiceBlock') || wms.includes('handoffToTaskSolver'), 'warehouse_wms.js should integrate with container and task_solver.js');

const containerJs = readFileSync(resolve(root, 'container.js'), 'utf8');
expectedServices.forEach((id) => {
  assert.ok(containerJs.includes(id), `expected container.js to define ${id} service`);
});

const solver = readFileSync(resolve(root, 'task_solver.js'), 'utf8');
assert.ok(solver.includes('handoffToTaskSolver'), 'task_solver.js should export handoff');
