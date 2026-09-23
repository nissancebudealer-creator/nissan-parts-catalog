# Project Directives — Nissan Genuine Parts Catalog

## Continuous Deployment & Sync Protocol
- **Strict Localhost & Production Parity**: Whenever changes or features are implemented, tested, and verified on `localhost:3000`, they MUST automatically be committed and pushed to the Git repository (`origin main`).
- **Production Web UI Target**: `https://nissan-parts-finder-app.vercel.app` (connected to Vercel via GitHub `main` branch).
- **Zero Drift Policy**: Never leave verified changes only in the local environment. Always push to remote so the public web UI immediately reflects the exact state of localhost.
- **Verification Before Push**: Always ensure unit tests, route handlers, and `next build` pass cleanly before pushing to `origin main`.

