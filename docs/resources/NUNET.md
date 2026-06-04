# NuNet

Source of truth:
- https://gitlab.com/nunet
- https://github.com/nunet/appliance

## Earned assets
- ETH, BNB

## Run instructions
1. Clone and bootstrap:
   - git clone <nunet appliance repository path>
   - ./deploy/scripts/devctl.sh dev up
2. Backend:
   - default http://127.0.0.1:8080
3. Frontend:
   - default http://127.0.0.1:5173
4. Web systemd mode:
   - deploy/scripts/nunet-web-mode.sh supports dev-on, dev-off, rebuild, status
5. Runtime/config paths:
   - ensembles: /home/ubuntu/ensembles
   - contracts: /home/ubuntu/contracts
   - appliance data: /home/ubuntu/nunet/appliance
   - DMS caps: /home/ubuntu/.nunet and /home/nunet/.nunet
   - DMS config: /home/nunet/config/dms_config.json
6. Tests:
   - backend: ./deploy/scripts/run-pytest.sh
   - frontend: Cypress E2E via frontend/README.md

## Verified hard requirements
- Python 3.10+
- Node.js 22.x with Corepack-managed pnpm (`pnpm@10.33.4`)
- Host filesystem paths for ensembles, contracts, DMS configuration, and logs

## BrowserContainerMode
- Direct: not viable in browser container
- Reason: requires multi-language runtime, backend services, and filesystem-writable host paths.
- Bridge candidate: browser container can call NuNet API endpoints and orchestrate external jobs from a browser runtime.
