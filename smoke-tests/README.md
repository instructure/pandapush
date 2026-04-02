# Pandapush Smoke Tests

End-to-end smoke test suite that run against a live Pandapush instance.

## Setup

```bash
cp .env.example .env
# Fill in values if not using the local docker compose defaults
npm install
```

## Running

### Local Docker Compose

```bash
# From the repo root
docker compose -f docker-compose.yml -f docker-compose.smoke-test.yml up -d

# From smoke-tests/
npm test
```

### Against a Live Environment

```bash
SMOKE_TEST_BASE_URL=https://pandapush.beta.example.com \
SMOKE_TEST_APP_ID=smoke-test \
SMOKE_TEST_KEY_ID=xxx \
SMOKE_TEST_KEY_SECRET=yyy \
SMOKE_TEST_ENVIRONMENT=beta \
npm test
```

## Configuration

| Variable                    | Description                                         | Default                 |
|-----------------------------|-----------------------------------------------------|-------------------------|
| `SMOKE_TEST_BASE_URL`       | Base URL of the Pandapush instance                  | `http://localhost:3000` |
| `SMOKE_TEST_APP_ID`         | Pre-provisioned smoke-test application ID           | `devapp`                |
| `SMOKE_TEST_KEY_ID`         | API key ID                                          | `devkey`                |
| `SMOKE_TEST_KEY_SECRET`     | API key secret                                      | `devsecret`             |
| `SMOKE_TEST_ENVIRONMENT`    | Target environment: `local`, `edge`, `beta`, `prod` | `local`                 |
| `SMOKE_TEST_ADMIN_USERNAME` | Admin basic auth username (docker only)             | `admin`                 |
| `SMOKE_TEST_ADMIN_PASSWORD` | Admin basic auth password (docker only)             | `password`              |

## Test Plan Matrix

Tests are tiered by risk. Higher tiers run in fewer environments.

| Test                                               | local | edge | beta | prod |
|----------------------------------------------------|-------|------|------|------|
| Health check (200, valid JSON)                     | ✅     | ☑️   | ☑️   | ☑️   |
| Publish with Basic Auth → 200                      | ✅     | ☑️   | ☑️   | ☑️   |
| Publish without auth → rejected                    | ✅     | ☑️   | ☑️   | ☑️   |
| Publish with JWT → 200                             | ✅     | ☑️   | ☑️   | ☑️   |
| Pub/sub round-trip (subscribe + publish + receive) | ✅     | ☑️   | ☑️   | ☑️   |
| Private channel subscribe with valid JWT           | ✅     | ☑️   | ☑️   | ❌    |
| Private channel subscribe without auth → rejected  | ✅     | ☑️   | ☑️   | ❌    |
| Expired token → rejected                           | ✅     | ☑️   | ☑️   | ❌    |
| Token for wrong channel → rejected                 | ✅     | ☑️   | ☑️   | ❌    |
| Presence channel round-trip                        | ✅     | ☑️   | ❌    | ❌    |
| Admin API: create application                      | ☑️    | ❌    | ❌    | ❌    |
| Admin API: create key                              | ☑️    | ❌    | ❌    | ❌    |
| Admin API: generate token                          | ☑️    | ❌    | ❌    | ❌    |
| Admin API: delete application                      | ☑️    | ❌    | ❌    | ❌    |

**Legend**:
* ✅: supported
* ☑️: planned
* ❌: not supported

Admin API tests are local-only because live environments use Okta OIDC, which requires a browser-based OAuth flow.
