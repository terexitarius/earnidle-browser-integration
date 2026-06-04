# Browser feasibility overview

Sources of truth:
- EarnIdle PLAY: inferred from `idle-node.js` and `idle-node.worker.js` observed at play.earnidle.com
- External projects: docs/resources/*.md

## Feasibility matrix

| Project | Browser-native | Bridge-backed | Verified blocker |
|---|---|---|---|
| get-grass | no | no | Docker + VNC/resident IP/runtime surface |
| MASQ | no | yes | Native Rust daemon + keystore/network stack |
| Oasis | no | yes | Native node build + optional SGX enclave + host persistence |
| Rivalz | no | yes | Go backend + MongoDB/PostgreSQL/Redis/Kafka |
| NuNet | no | yes | Python + Node.js backend + host config paths |
| NodePay | partial | no | Browser-local token capture; automation requires browser control context, not available in web-only container |

## Browser mapping guidance

- Use this codebase for inference and API proxy flows in a browser context.
- Treat get-grass, MASQ, Oasis, Rivalz, and NuNet as external-node callouts:
  - browser container provides an orchestration dashboard or access layer
  - earning execution stays on native host services or dedicated containers
- NodePay indicates browser-aware telemetry/automation flows that can be mirrored in a browser-flow checker, but earning proxy behavior is not definable from published public docs and remains host/orchestration-bound.
