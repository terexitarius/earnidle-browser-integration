const $log = document.getElementById('log');
const $node = document.getElementById('nodeId');
const $wallet = document.getElementById('wallet');

function log(msg) {
  $log.textContent += msg + '\n';
}

document.getElementById('start').addEventListener('click', async () => {
  const nodeId = $node.value.trim();
  const wallet = $wallet.value.trim();
  if (!nodeId || !wallet) {
    log('Provide nodeId + wallet first.');
    return;
  }

  const worker = new Worker(new URL('../src/worker.js', import.meta.url), { type: 'module' });
  worker.onmessage = (e) => {
    const { type, status, job_id, payout, error, pct, recovery } = e.data;
    if (type === 'status') log('status: ' + status + (error ? ' — ' + error : ''));
    if (type === 'progress') log('load progress: ' + pct + '%');
    if (type === 'device') log('device ready');
    if (type === 'job' && status === 'processing') log('job ' + job_id + ' processing...');
    if (type === 'job' && status === 'complete') log('job ' + job_id + ' complete — payout: ' + (payout || 0));
    if (type === 'error') {
      log('error: ' + error);
      if (recovery) log('recovery hint: ' + recovery);
    }
  };

  worker.postMessage({ type: 'start', data: { nodeId, wallet, tier: 'high' } });
  log('worker started');
});

document.getElementById('stop').addEventListener('click', () => {
  location.reload();
});
