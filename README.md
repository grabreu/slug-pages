# slug-pages

[![CI](https://github.com/grabreu/slug-pages/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/grabreu/slug-pages/actions/workflows/ci.yml)
[![CD](https://github.com/grabreu/slug-pages/actions/workflows/cd.yml/badge.svg?branch=main)](https://github.com/grabreu/slug-pages/actions/workflows/cd.yml)
[![License](https://img.shields.io/github/license/grabreu/slug-pages?style=flat-square)](LICENSE)

Anonymous, no-login scratchpad — navigate to any URL and start typing. Content saves automatically as you pause, and Markdown renders live while you write. Runs entirely on Cloudflare's edge (Workers + D1), no origin server.

_(Same zero-friction idea as [DontPad](https://dontpad.com), rebuilt with live Markdown rendering and an edge-only backend.)_

**[Try it live →](https://slug-pages.grabreu.workers.dev)**

## How it works

- Visit any URL under the deployed domain — the page is created empty and immediately editable. No login, no create step, no buttons.
- Type Markdown; it renders live as formatted text as you go.
- Content autosaves after a pause in typing.
- Anyone with the link can read and write — there's no authentication or ownership. That's a deliberate choice, not a gap; see [docs/adr/0001-no-authentication.md](docs/adr/0001-no-authentication.md).
- If the page changed on the server since you loaded it, saving offers a choice: discard your local changes and reload, or overwrite with your version.
- "Deleting" a page clears its content; the slug stays reserved and editable.

See [CONTEXT.md](CONTEXT.md) for the domain vocabulary.

## Development

Requires [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Other scripts: `pnpm check` (lint/format), `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Deployment

Auto-deployed to Cloudflare Workers on every merge to `main` via GitHub Actions.

## License

Licensed under the [MIT License](LICENSE).
