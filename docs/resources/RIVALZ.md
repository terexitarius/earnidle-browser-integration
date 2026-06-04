# Rivalz (Rivalz-ai/framework-be)

Source of truth:
- https://github.com/Rivalz-ai/framework-be
- https://raw.githubusercontent.com/Rivalz-ai/framework-be/main/README.md

## Earned assets
- ETH, SOLANA, ARBITRUM, BASE

## Run instructions
1. Clone:
   - git clone https://github.com/Rivalz-ai/framework-be.git
   - cd framework-be
2. Install:
   - go mod download
3. Create .env with required service credentials, including:
   - KEY_STORE_HOST=https://vault.rivalz.ai
   - KEY_STORE_PORT=8200
   - KEY_STORE_USER, KEY_STORE_PASSWORD, KEY_STORE_DIR
4. Run development:
   - go run main.go
5. Hot reload:
   - air
6. Docker:
   - docker build -t rivalz-framework-be .
   - docker run -p 30000:30000 rivalz-framework-be
7. Production Docker:
   - docker run -d -p 30000:30000 -e MONGODB_URI=mongodb://... -e POSTGRES_URI=postgres://... -e REDIS_URI=redis://... rivalz-framework-be:latest

## Verified hard requirements
- Go 1.23+
- MongoDB, PostgreSQL, Redis
- Apache Kafka
- Host network access for ports and message brokers

## BrowserContainerMode
- Direct: not viable in browser container
- Reason: requires multi-service backend runtime and broker connectivity.
- Bridge candidate: browser container can act as a task-orchestration client invoking Rivalz APIs hosted externally.
