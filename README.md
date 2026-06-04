# earnidle-browser-integration

Run-in-browser adapters for six EarnIdle-style earn projects:
- EarnIdle inference (modeled from `play.earnidle.com`)
- get-grass (Solana)
- MASQ (ETH, Polygon, Base)
- Oasis (BNB)
- Rivalz (ETH, SOL, ARB, BASE)
- NuNet (ETH, BNB)
- NodePay (SOL)

Each adapter can be exercised inside the browser container in demo mode, with a documented bridge path for real production backends where browser-only execution is not viable.

## Run the container

```bash
cd /home/user/earnidle-browser-integration
bash run.sh
# open http://localhost:3000/container
```

`npx serve` redirects `container.html` to `/container`. Use the `/container` URL.

