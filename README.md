# slug-pages

[![CI](https://github.com/grabreu/slug-pages/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/grabreu/slug-pages/actions/workflows/ci.yml)
[![CD](https://github.com/grabreu/slug-pages/actions/workflows/cd.yml/badge.svg?branch=main)](https://github.com/grabreu/slug-pages/actions/workflows/cd.yml)
[![License](https://img.shields.io/github/license/grabreu/slug-pages?style=flat-square)](LICENSE)

Anonymous, no-login scratchpad — visit any URL and start typing. Notes save automatically as you type; Markdown is supported if you want it.

Built entirely on Cloudflare's edge with Workers and D1.

**[Try it live →](https://slug-pages.grabreu.dev)**

## Features

- **URL as a page** — visit any path and start writing immediately. No login or creation step.
- **Autosave** — changes are persisted automatically after a pause in typing.
- **Shared by design** — anyone with the URL can read and edit the page. Authentication and ownership are intentionally omitted; see [ADR 0001](docs/adr/0001-no-authentication.md).
- **Conflict handling** — if the page changed remotely, choose between reloading the latest version or overwriting it with your local changes.
- **Soft delete** — clearing a page removes its content while keeping the slug available for editing.
- **Markdown, if you want it** — a side-by-side preview renders the page's content as Markdown; plain text works too.

See [CONTEXT.md](CONTEXT.md) for the domain vocabulary.

## Inspiration

Inspired by [DontPad](https://dontpad.com)'s URL-as-a-page concept, with a different take on the editing experience and underlying architecture.

## Development

Requires [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm db:migrate:local
pnpm dev
```

`pnpm db:migrate:local` applies the Drizzle migrations to the local D1 database (a SQLite file emulated by Wrangler, not the production database).

Other scripts: `pnpm check` (lint/format), `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm db:generate` (new migration from schema changes), `pnpm db:migrate:remote` (apply migrations to production D1).

## Deployment

Auto-deployed to Cloudflare Workers on every merge to `main` via GitHub Actions.

## License

Licensed under the [MIT License](LICENSE).
