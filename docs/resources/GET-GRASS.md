# Get-Grass (MRColorR/get-grass)

Source of truth:
- https://github.com/MRColorR/get-grass
- https://raw.githubusercontent.com/MRColorR/get-grass/main/README.md

## Earned asset
- Solana

## Run instructions
1. Obtain `GRASS_USER` and `GRASS_PASS`.
2. Start the node:
   - docker run -d --name grass-node -e GRASS_USER=<user> -e GRASS_PASS=<pass> mrcolorrain/grass-node
3. VNC/web surfaces are exposed:
   - 5900
   - 6080

## Verified hard requirements
- Docker daemon/runtime from host
- VNC-capable surface for login state and resident IP verification
- Persistent container/runtime state for session continuity and earnings eligibility

## BrowserContainerMode
- Direct: not viable in browser container
- Reason: requirement for full OS browser runtime, VNC surface, and resident IP context cannot be provided by a browser sandbox or web worker.
