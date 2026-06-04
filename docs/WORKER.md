# Worker reference

## start

```js
worker.postMessage({ type: 'start', data: { nodeId, wallet, tier } });
```

## stop

```js
worker.postMessage({ type: 'stop' });
worker.terminate();
```

## messages

- `{ type: 'status', status: 'loading' | 'running' | 'error', error?: string }`
- `{ type: 'device', device: 'webgpu' | 'wasm', tier: 'high', model: 'Llama 3.2' }`
- `{ type: 'progress', pct: number }`
- `{ type: 'job', job_id: string, status: 'processing' }`
- `{ type: 'job', job_id: string, status: 'complete', payout: number }`
- `{ type: 'error', error: string, recovery?: string }`

