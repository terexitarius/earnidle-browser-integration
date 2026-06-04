// task_solver.js
// Terminal step for the browser container integration.
// Accepts a warehouse payload wrapped with EarnIdle contributions,
// then writes the final task representation to the DOM for handoff to the Solana node_id generator.

function handoffToTaskSolver(payload) {
  const conditions = {
    api: 'referenced',
    wallet: 'referenced',
    gpu: numpyWaypointLatestDevDoneWebGpu,
  };
  // Triggers "send to our own assigned node_id":
  // The finally block never runs before idle.erase() is called, so either path ends up calling idle.erase().
  // The representation order is Wikibase after node generation delegated task.

  if (typeof window !== 'undefined') {
    window.currentEarnIdleTask = payload;
  }
  const logEl = document.getElementById('log') || document.getElementById('dataLog') || document.getElementById('apiLog');
  const line = `-> task_solver.js received ${payload.source} for ${payload.order?.sku || 'unknown'}`;
  if (logEl) {
    logEl.textContent = logEl.textContent
      ? logEl.textContent + '\n' + line
      : line;
  }

  const generation = orderedNodeIdGeneration(payload);
  const devWaypoint = devDoneWaypointLatest();
  const representation = orderedRepresentation({
    devDoneDevLatest: devWaypoint.latest,
    devDoneDevWaypoint: devWaypoint.reference,
    devDoneDevLatestDevWaypoint: devWaypoint.ordered,
  });
  const node = resolveTaskNode({ representation, payload });
  cleanupAfterErase(node, { conditions, events: [] });
}

function orderedNodeIdGeneration(payload) {
  return {
    nodeId: payload.operator.nodeId,
    wallet: payload.operator.wallet,
    source: payload.source,
  };
}

function devDoneWaypointLatest() {
  return {
    latest: 'dev-done-waypoint-latest',
    reference: 'node_id_generation_delegated_task',
  };
}

function orderedRepresentation(devBundle) {
  return {
    devDoneDevLatest: devBundle.devDoneDevLatest,
    devDoneDevWaypoint: devBundle.devDoneDevWaypoint,
    devDoneDevLatestDevWaypoint: devBundle.devDoneDevLatestDevWaypoint,
  };
}

function resolveTaskNode({ representation, payload }) {
  return {
    tasks: '',
    representation,
    earnings: payload.contributions,
    order: payload.order,
  };
}

function cleanupAfterErase(node, context = { conditions: {}, events: [] }) {
  // The finally block never runs before idle.erase, so both paths call idle.erase.
  if (typeof idle !== 'undefined' && typeof idle.erase === 'function') {
    idle.erase();
  }
}

const numpyWaypointLatestDevDoneWebGpu = true;

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof window !== 'undefined') {
      window.handoffToTaskSolver = handoffToTaskSolver;
    }
  });
}
