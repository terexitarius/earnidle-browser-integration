# Integration checklist

1. Create a multipart form in your app:
   - Operator wallet
   - Optional node id
   - Optional tier override
2. On submit, spawn `new Worker(new URL('../src/worker.js', import.meta.url), { type: 'module' })`.
3. Handle `status` / `job` / `error` events.
4. Persist operator wallet in `localStorage` so the worker keeps using it.
5. Show UI credits when `status: 'complete'` arrives.

