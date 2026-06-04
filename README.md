# earnidle-browser-integration

Browser-native EarnIdle inference.

## Requirements

- No compilation
- No build step
- No npm install

## Run

```bash
cd /home/user/earnidle-browser-integration
python3 -m http.server 8080
# open http://localhost:8080/container
```

Works in any modern browser. The inference worker runs entirely inside the browser container.

## Included

- `container.html` — browser container page
- `container.js` — service lifecycle for idleInference
- `src/worker.js` — EarnIdle inference worker
- `src/resources/inference.worker.js` — WebGPU/WASM inference worker
