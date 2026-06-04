# NodePay

Source of truth:
- https://github.com/ashtrobe/nodepaywoex

## Earned asset
- SOLANA

## Run instructions
1. Install Termux packages:
   - pkg install git nano python
2. Clone repository and install depedencies:
   - git clone https://github.com/ashtrobe/nodepaywoex-py.git
   - cd nodepaywoex-py
   - pip install -r requirements.txt
3. Obtain NodePay bearer token:
   - open Nodepay dashboard in Kiwi browser
   - open DevTools Console
   - run: localStorage.getItem('np_webapp_token')
   - paste returned token into user.txt
4. Run proxy/bot script:
   - python main.py

## Verified hard requirements
- Python runtime requirements from requirements.txt, including:
  - aiohttp
  - requests
- Bearer token sourced from browser localStorage

## BrowserContainerMode
- Browser-native bridge mode supported by workflow design, not by code in this repository.
- Can be modeled as a browser-side automation client:
  - execute automation flow from the container
  - capture token from localStorage with explicit user consent
  - send outbound traffic through the NodePay session with chosen downstream proxying behavior
