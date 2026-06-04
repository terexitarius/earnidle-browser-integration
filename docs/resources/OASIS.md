# Oasis (oasisprotocol)

Source of truth:
- https://github.com/oasisprotocol/oasis-core
- https://raw.githubusercontent.com/oasisprotocol/oasis-core/master/README.md
- docs/development-setup/building.md

## Earned asset
- BNB

## Run instructions
1. Set unsafe dev env where applicable:
   - export OASIS_UNSAFE_SKIP_AVR_VERIFY=1
   - export OASIS_UNSAFE_ALLOW_DEBUG_ENCLAVES=1
   - export OASIS_UNSAFE_SKIP_KM_POLICY=1
   - export OASIS_BADGER_NO_JEMALLOC=1
2. Build:
   - make
3. Optional local test network:
   - use docs/development-setup/oasis-net-runner.md steps
4. Optional SGX production path uses:
   - docker run --detach --restart always --device /dev/isgx --volume /var/run/aesmd:/var/run/aesmd --name aesmd ghcr.io/oasisprotocol/aesmd:master

## Verified hard requirements
- Go and Rust toolchains
- make-based build
- Optional Intel SGX hardware + AESM daemon for production enclaves
- Host filesystem access for runtime data and enclave state

## BrowserContainerMode
- Direct: not viable in browser container
- Reason: requires compiled native binaries, hardware enclave support, and persistent host runtime state.
- Bridge candidate: browser container can call host-provided APIs or status endpoints, but not consensus/node execution itself.
