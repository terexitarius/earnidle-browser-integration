# earnidle-browser-integration

Production-ready browser container for EarnIdle inference and rentable browser capabilities.

## Browser services

- `idleInference` — EarnIdle inference worker

## Browser capability examples

- Bandwidth / routing — `examples/browser-capabilities/bandwidth_proxy.html`
- CPU / WebAssembly compute — `examples/browser-capabilities/cpu_compute.html`
- GPU / WebGPU + WebGL — `examples/browser-capabilities/gpu_compute.html`
- Memory / caching — `examples/browser-capabilities/memory_caching.html`
- Temporary storage — `examples/browser-capabilities/temporary_storage.html`
- Micro-sensors / RTC — `examples/browser-capabilities/micro_sensors.html`

## Run

```bash
cd /home/user/earnidle-browser-integration
python3 -m http.server 8080
# open http://localhost:8080/container
```

No build or compilation required.