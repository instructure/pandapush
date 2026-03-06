# Pandapush

Web pub/sub service built on [Faye](http://faye.jcoglan.com/). See `README.md` for full API and usage documentation.

## Repo Structure

```
.
├── server/          # Node.js backend
│   ├── index.js     # App entry point (Passenger loads this via app.js symlink)
│   ├── admin_auth.js # Okta OIDC / basic auth setup
│   ├── knexfile.js  # DB config (SQLite dev, Postgres prod)
│   └── lib/
│       └── extensions/
│           └── auth.js  # Faye extension for channel auth (JWT/key validation)
├── client/          # Browser client library (compiled by webpack)
├── ui/              # Admin UI (React, compiled by webpack)
├── Dockerfile       # Production image (npm ci, webpack build, prune devDeps)
├── docker-compose.yml       # Local dev
├── docker-compose.jenkins.yml  # CI overrides
└── Jenkinsfile      # CI pipeline (build → lint → test → trigger deployment)
```

## Local Development

```bash
docker compose run --rm -u root web chown docker:docker node_modules
docker compose run --rm web npm install
docker compose up
```

Runs on http://pandapush.docker/admin (requires dinghy-http-proxy — see README).

Use the existing `devapp` for manual testing:
http://pandapush.docker/admin/application/devapp/console

## Testing

```bash
# Unit tests with coverage (inside docker)
docker compose run --rm web npm run test:coverage

# Unit tests only
docker compose run --rm web npm run test:unit

# Integration tests
docker compose run --rm web npm run test:integration
```

Tests use Jest. Integration tests live in `server/__integration__/`.

## Architecture Notes

- **Runtime**: Nginx + Phusion Passenger (Node.js mode). Passenger loads `app.js`, which is a symlink to `server/index.js`.
- **Pub/sub**: Faye handles message routing. Pandapush wraps it with multi-tenancy and auth via Faye extensions (`server/lib/extensions/`).
- **Auth**: Two modes controlled by `AUTH_METHOD` env var:
  - `okta` — Okta OIDC via `@okta/oidc-middleware`. Requires `OKTA_ISSUER`, `OKTA_CLIENT_ID`, `OKTA_CLIENT_SECRET`, `OKTA_REDIRECT_URI`. `appBaseUrl` is derived from `OKTA_REDIRECT_URI` (e.g. `new URL(env.OKTA_REDIRECT_URI).origin`).
  - `basic` — HTTP basic auth via `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
- **Channel auth**: Publishing always requires a key/secret or JWT. Subscribing to `/private/` and `/presence/` channels requires a JWT scoped to that channel.
- **Database**: Knex migrations. SQLite in standalone/dev, Postgres in production (`DATABASE=postgres`).
- **Redis**: Used for Faye pub/sub across nodes (`REDIS_HOSTS`).

## CI/CD

The Jenkinsfile runs on every push (multibranch pipeline):
1. **Build** — `docker compose build`
2. **Lint** — `npm run eslint`
3. **Tests** — `npm run test:coverage`, publishes coverage report
4. **Trigger Deployment** — only on `main`; fires the `../pandapush-instructure` downstream job

Merging to `main` automatically triggers a downstream deployment.

## Dockerfile Notes

- `package-lock.json` is explicitly copied and `npm ci` is used — builds are reproducible and will fail fast if the lock file is out of sync with `package.json`.
- Dev dependencies are pruned after webpack builds.
