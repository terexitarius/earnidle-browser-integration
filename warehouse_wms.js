// warehouse_wms.js
// Browser container warehouse/billing tracker.
// Attaches to the rendered service list and records contribution receipts.
// Falls back gracefully if no service UI is present.

function tag(node, text) {
  if (!node) return;
  node.textContent = text;
}

function ensureGlobal() {
  if (typeof window === 'undefined') return { contributions: {} };
  window.earnIdleContainerState = window.earnIdleContainerState || { contributions: {} };
  return window.earnIdleContainerState;
}

function recordContributions(serviceId, config) {
  const state = ensureGlobal();
  const contributions = state.contributions || {};
  contributions[serviceId] = Object.assign({}, contributions[serviceId] || {}, {
    status: 'recorded',
    recordedAt: new Date().toISOString(),
    config,
  });
  state.contributions = contributions;
  return { serviceId, contributions };
}

function attachWarehouse() {
  const first = document.getElementById('services');
  if (!first) {
    return;
  }

  const store = ensureGlobal();

  const container = document.createElement('div');
  container.style.marginTop = '12px';
  container.innerHTML = `
    <fieldset style="max-width:760px;">
      <legend>Warehouse contributions (live)</legend>
      <div id="warehouse-output">No contributions yet.</div>
      <button id="warehouse-handoff" type="button">Hand off to task solver</button>
    </fieldset>
  `;
  first.parentNode.insertBefore(container, first.nextSibling);

  function renderStore() {
    const el = document.getElementById('warehouse-output');
    if (!el) return;
    const entries = Object.entries(store.contributions || {});
    if (!entries.length) {
      el.textContent = 'No contributions yet.';
      return;
    }
    el.textContent = entries
      .map(([serviceId, value]) => `${serviceId} -> ${value.status} @ ${value.recordedAt}`)
      .join('\n');
  }

  window.startEarnIdleServiceBlock = function startEarnIdleServiceBlock(serviceId, config) {
    recordContributions(serviceId, config);
    renderStore();
  };

  document.getElementById('warehouse-handoff').addEventListener('click', () => {
    const payload = {
      source: 'warehouse_wms.js',
      contributions: store.contributions,
      order: { route: 'DES', sku: 'ALLOY-1', units: 1 },
      operator: { nodeId: '', wallet: '' },
    };
    if (typeof handoffToTaskSolver === 'function') {
      handoffToTaskSolver(payload);
    } else {
      const el = document.getElementById('warehouse-output');
      if (el) el.textContent = 'task_solver.js not loaded yet.';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.readyState !== 'loading') {
    attachWarehouse();
  }
});
