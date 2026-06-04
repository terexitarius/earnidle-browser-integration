// Agent worker — Side-effect-free small task execution.
// Designed for conceptual parity with inference.worker.js.
// Actual routing integration depends on future EarnIdle agent endpoints.

self.onmessage = async (event) => {
  const { type, data } = event.data;
  if (type === 'start') {
    self.postMessage({ type: 'status', status: 'loading', resource: 'agent' });
    // Placeholder: the actual implementation would depend on the task contract exposed by IDLE.
    // Typically: receive task description -> transform into agent action -> return structured output.
    // Non-goals: persistent local storage, side effects, multi-step chains, or memory beyond a session.
    self.postMessage({
      type: 'status',
      status: 'ready',
      resource: 'agent',
      note: 'Agent worker stub — awaiting EarnIdle agent task contract',
    });
  }
  if (type === 'stop') {
    // Parent should terminate worker.
  }
};
