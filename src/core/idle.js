// idle.js — EarnIdle browser SDK
// Drop this into your app, call idle.start(), and opt-in users earn while browsing.
//
// Entrypoints:
//  idle.start(config)            — start enabled resources
//  idle.stop()                   — stop all
//  idle.status()                 — current state
//  idle.contributions()          — current-user contribution metadata

export const IDLE_KEY = Symbol.for('earnidle');

function existingRoot() {
  return typeof globalThis !== 'undefined' && globalThis[IDLE_KEY];
}

if (!existingRoot()) {
  const state = {
    resources: [],
    running: false,
    optInStatus: new Map(), // contributionId -> { wallet, nodeId, tier, acceptedAt, status }
  };

  const api = {
    async start({ resources = ['inference'], wallet, nodeId, tier = 'high' } = {}) {
      if (state.running) return;
      state.running = true;
      state.resources = resources;
      for (const resource of resources) {
        const worker = new Worker(
          new URL(`./resources/${resource}.worker.js`, import.meta.url),
          { type: 'module' }
        );
        const contributionId = `${resource}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
        state.optInStatus.set(contributionId, {
          wallet,
          nodeId,
          tier,
          acceptedAt: new Date().toISOString(),
          status: 'starting',
          resource,
        });
        worker.onmessage = (event) => {
          const current = state.optInStatus.get(contributionId);
          if (!current) return;
          const next = { ...current, lastEvent: event.data, status: event.data.status || current.status };
          if (event.data.payout) next.lastPayout = event.data.payout;
          state.optInStatus.set(contributionId, next);
          idle.emit('contribution', { contributionId, ...next });
        };
        worker.onerror = (error) => {
          const current = state.optInStatus.get(contributionId);
          if (!current) return;
          state.optInStatus.set(contributionId, { ...current, status: 'error', error: error.message });
          idle.emit('contribution', { contributionId, ...state.optInStatus.get(contributionId) });
        };
        worker.postMessage({ type: 'start', data: { wallet, nodeId, tier } });
        idle.emit('started', { contributionId, resource });
      }
    },

    stop() {
      state.running = false;
    },

    status() {
      return {
        running: state.running,
        resources: state.resources,
        contributions: Object.fromEntries(state.optInStatus),
      };
    },

    contributions() {
      return Object.fromEntries(state.optInStatus);
    },
  };

  const listeners = new Set();
  const idle = {
    ...api,
    on(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    emit(name, payload) { for (const fn of listeners) fn(name, payload); },
  };

  globalThis[IDLE_KEY] = idle;
  Object.defineProperty(globalThis, 'idle', { value: idle, configurable: true, writable: true, enumerable: true });
}

export default globalThis[IDLE_KEY];
