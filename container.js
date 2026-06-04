// container.js
// Browser-side service lifecycle control and log stream.
//
// Each "service" can be:
//  browser-native — implemented in-page or in a worker
//  external       — requires a backend at a URI, controlled here
const POLL_MS = 30000;
const state = {
  services: {
    idleInference: { id: 'idleInference', label: 'EarnIdle Inference', kind: 'browser-native', status: 'stopped', config: { nodeId: 'node-1', wallet: 'wallet-1' } },
    getGrass:      { id: 'getGrass',       label: 'get-grass (Solana)',  kind: 'external',       status: 'stopped', config: { host: 'http://127.0.0.1:8081', user: '', pass: '' } },
    masq:          { id: 'masq',           label: 'MASQ (ETH/Polygon/Base)', kind: 'external', status: 'stopped', config: { host: 'http://127.0.0.1:8082', configFile: '/etc/masq/config.toml' } },
    oasis:         { id: 'oasis',          label: 'Oasis (BNB)',        kind: 'external',       status: 'stopped', config: { host: 'http://127.0.0.1:8083', unsafe: '1' } },
    rivalz:        { id: 'rivalz',         label: 'Rivalz (ETH/SOL/ARB/BASE)', kind: 'external', status: 'stopped', config: { host: 'http://127.0.0.1:30000', keystore: 'https://vault.rivalz.ai:8200' } },
    nunet:         { id: 'nunet',          label: 'NuNet (ETH/BNB)',   kind: 'external',       status: 'stopped', config: { backend: 'http://127.0.0.1:8080', frontend: 'http://127.0.0.1:5173' } },
    nodepay:       { id: 'nodepay',        label: 'NodePay (SOL)',     kind: 'browser-native', status: 'stopped', config: { token: '' } },
  },
  workers: {},
};

function setStatus(id, status) {
  const el = document.getElementById('status-' + id);
  if (el) el.textContent = status;
  if (state.services[id]) state.services[id].status = status;
}

function appendLog(id, message, kind = 'info') {
  const el = document.getElementById('log-' + id);
  if (!el) return;
  const prefix = new Date().toISOString().slice(11, 19);
  el.innerHTML += `<div class="${kind}">[${prefix}] ${message}</div>`;
  el.scrollTop = el.scrollHeight;
}

function disableControls(id, disabled) {
  document.querySelectorAll(`[data-service-id="${id}"] button`).forEach((b) => { b.disabled = disabled; });
}

function renderService(svc) {
  const isBrowser = svc.kind === 'browser-native';
  const startStopLabel = svc.status === 'running' ? 'Stop' : 'Start';
  const startStopClass = svc.status === 'running' ? 'danger' : '';

  return `<div class="service" data-service-id="${svc.id}">
    <header>
      <div>
        <strong>${svc.label}</strong>
        <div class="status ${svc.status}" id="status-${svc.id}">${svc.status}</div>
      </div>
      <div style="display:flex; gap:8px; align-items:center;">
        <button id="start-stop-${svc.id}" class="${startStopClass}" type="button">${startStopLabel}</button>
        <button id="reconfigure-${svc.id}" type="button">Reconfigure</button>
        <span style="font-size:12px; color:#45a29e;">(${svc.kind})</span>
      </div>
    </header>
    <fieldset id="cfg-${svc.id}">
      <legend>Configuration</legend>
      ${Object.entries(svc.config).map(([k, v]) => `<label>${k} <input id="cfg-${svc.id}-${k}" value="${escapeHtml(String(v))}" /></label>`).join('\n')}
    </fieldset>
    <div class="log" id="log-${svc.id}">Waiting for lifecycle events.</div>
  </div>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

function renderAll() {
  const container = document.getElementById('services');
  container.innerHTML = Object.values(state.services).map(renderService).join('');
  container.querySelectorAll('button[id^="start-stop-"]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const id = btn.id.replace('start-stop-', '');
      if (state.services[id].status === 'running') stopService(id);
      else startService(id);
    });
  });
  container.querySelectorAll('button[id^="reconfigure-"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.id.replace('reconfigure-', '');
      applyConfig(id);
    });
  });
}

function applyConfig(id) {
  const svc = state.services[id];
  if (!svc) return;
  const updated = {};
  Object.keys(svc.config).forEach((k) => {
    const el = document.getElementById(`cfg-${id}-${k}`);
    if (!el) return;
    updated[k] = el.value.trim();
  });
  svc.config = { ...svc.config, ...updated };
  appendLog(id, `Config updated: ${JSON.stringify(svc.config)}`, 'info');
}

async function startService(id) {
  const svc = state.services[id];
  if (!svc) return;
  setStatus(id, 'starting');
  appendLog(id, `Start command issued for ${svc.label}`, 'info');
  disableControls(id, true);

  try {
    if (svc.kind === 'browser-native') {
      await startBrowserNative(id, svc);
    } else {
      await startExternal(id, svc);
    }
    setStatus(id, 'running');
    appendLog(id, `Service started`, 'out');
    if (typeof window.startEarnIdleServiceBlock === 'function') {
      window.startEarnIdleServiceBlock(id, svc.config);
    }
  } catch (error) {
    setStatus(id, 'error');
    appendLog(id, `Start failed: ${error.message}`, 'err');
  } finally {
    disableControls(id, svc.status === 'running');
  }
}

async function startBrowserNative(id, svc) {
  if (id === 'idleInference') {
    const { nodeId, wallet } = svc.config;
    appendLog(id, `Starting inference worker for nodeId=${nodeId} wallet=${wallet}`, 'info');
    const workerPath = new URL('./src/worker.js', import.meta.url).toString();
    const worker = new Worker(workerPath, { type: 'module' });
    state.workers[id] = worker;

    worker.onmessage = (event) => {
      const { type, status, jobId, payout, event: eventName } = event.data || {};
      if (type === 'status') setStatus(id, status);
      if (type === 'job') appendLog(id, `Job ${jobId}: ${event?.status || type}`, 'out');
      if (type === 'earnings') appendLog(id, `Payout ${payout}`, 'out');
      if (type === 'error') appendLog(id, event?.message || 'error', 'err');
    };
    worker.postMessage({ type: 'start', data: { nodeId, wallet } });
    return;
  }
  if (id === 'nodepay') {
    const token = svc.config.token || localStorage.getItem('np_webapp_token');
    if (!token) throw new Error('NodePay token is missing. Fill token in config or capture it from the dashboard.');
    appendLog(id, `NodePay session starting from token`, 'info');
    if (!state.workers[id]) state.workers[id] = { terminate: () => {} };
    await pollNodePayStatus(id);
    return;
  }
}

async function startExternal(id, svc) {
  const { host } = svc.config;
  if (!host) throw new Error(`${svc.label} host/backend is not configured.`);

  // Try to reach backend provisioning/status endpoint.
  const urls = [
    `${host}/status`,
    `${host}/api/status`,
    `${host}/health`,
    `${host}/`,
  ];

  let lastError = new Error('No reachable endpoint');
  for (let i = 0; i < urls.length; i++) {
    try {
      appendLog(id, `Probing ${urls[i]}`, 'info');
      const res = await fetch(urls[i], { mode: 'cors', cache: 'no-store' });
      appendLog(id, `Probe ${urls[i]} -> ${res.status}`, 'out');
      if (res.ok) {
        appendLog(id, `Backend service is reachable at ${urls[i]}`, 'out');
        scheduleStatusPoll(id, svc);
        return;
      }
      lastError = new Error(`Unexpected status ${res.status}`);
    } catch (error) {
      lastError = error;
      appendLog(id, `Probe failed: ${error.message}`, 'err');
    }
  }
  throw lastError;
}

async function pollNodePayStatus(id) {
  appendLog(id, 'NodePay remains in browser-local token mode until a real backend/endpoint is reachable.', 'info');
}

async function scheduleStatusPoll(id, svc) {
  const { host } = svc.config;
  const poll = async () => {
    try {
      const res = await fetch(host, { mode: 'cors', cache: 'no-store' });
      appendLog(id, `Status poll ${res.status}`, 'out');
    } catch (error) {
      appendLog(id, `Status poll error: ${error.message}`, 'err');
      if (state.services[id].status === 'running') setTimeout(poll, POLL_MS);
    }
  };
  setTimeout(poll, POLL_MS);
}

async function stopService(id) {
  const svc = state.services[id];
  setStatus(id, 'stopped');
  appendLog(id, `Stop command issued`, 'info');
  if (state.workers[id] && typeof state.workers[id].terminate === 'function') {
    state.workers[id].terminate();
    state.workers[id] = null;
  }
  disableControls(id, false);
}

window.addEventListener('DOMContentLoaded', () => {
  renderAll();
  if (typeof attachWarehouse === 'function') attachWarehouse();
});
