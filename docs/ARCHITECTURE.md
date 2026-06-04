# Architecture

## Dispatcher pattern

1. The browser app loads a small embedding snippet.
2. The snippet creates a `Worker` from `src/worker.js`.
3. The worker runs WebGPU/WASM inference via Transformers.js, polls `api.earnidle.com`, submits results, emits `complete` messages with payouts.
4. The dispatcher can route per-user earnings back to the owning account or to a shared treasury as configured.

```text
┌─────────────────────────────────────────────────────────┐
│ Browser container / user tab                             │
│                                                         │
│  ┌──────────────────────────────────────────────┐       │
│  │ app snippet                                  │       │
│  │ new Worker('/src/worker.js')                  │       │
│  └──────────────────────────────────────────────┘       │
│               │ onmessage(payout)                        │
│  ┌────────────────┴────────────────────────────┐         │
│  │ Dispatcher                                  │         │
│  │  - update UI                                │         │
│  │  - issue credit receipt                     │         │
│  │  - remit to operator wallet                 │         │
│  └─────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────┘
                    │ HTTPS
                    ▼
         EarnIdle inference backend
```

## Worker lifecycle

- **Started** once per tab or once globally, depending on app policy.
- **Idle** when no jobs are queued.
- **Processing** when a job is in flight.
- **Completed** when a result is submitted.
- **Errored** when fetching or submission fails.

## Attribution models

See `docs/ATTRIBUTION.html` for Credential/Bearer + payout examples.

