// API worker — Public API contribution checklist.
// A real implementation forwards EarnIdle proxy traffic back to an upstream endpoint.
// The flow here mirrors how a billing service would sit between the router and origin.

self.onmessage = async (event) => {
  const { type, data } = event.data;
  if (type === 'start') {
    self.postMessage({ type: 'status', status: 'loading', resource: 'api' });
    self.postMessage({
      type: 'status',
      status: 'ready',
      resource: 'api',
      note: 'API worker stub — requires upstream origin configured before enabling.',
    });
  }
  if (type === 'stop') {
    // nothing to teardown here
  }
};
