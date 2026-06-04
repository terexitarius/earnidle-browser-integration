# MASQ (MASQ-Project/Node)

Source of truth:
- https://github.com/MASQ-Project/Node
- https://raw.githubusercontent.com/MASQ-Project/Node/master/README.md

## Earned assets
- ETH, POLYGON, BASE

## Run instructions
1. Initialize daemon:
   - sudo nohup ./MASQNode --initialization &
2. Configure delegated earning wallet inside `config.toml` or via the `masq` CLI setup flow.
3. Start the node:
   - masq start
4. Optional external contact exposure:
   - pass --ip to MASQNode if public egress contact is desired

## Verified hard requirements
- Native Rust binary: MASQNode
- Linux/macOS/Windows 64-bit host runtime
- No Node.js or browser runtime involved
- Persistent data dir containing config.toml and wallet/keystore

## BrowserContainerMode
- Direct: not viable in browser container
- Reason: native system daemon, network-stack participant, and keystore requirements are outside a browser environment.
- Bridge candidate: browser container can call host-side MASQ APIs, but earnings and node participation remain host-bound.
