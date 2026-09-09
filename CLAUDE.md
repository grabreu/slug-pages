# slug-pages

## Repository

Read `README.md` before making changes — it documents the project pitch and the domain's business rules. Read `CONTEXT.md` for the domain vocabulary. Significant, hard-to-reverse decisions are recorded in `docs/adr/` — check it before revisiting one, and add an entry when making a new one (see the `domain-modeling` skill for the format).

## Stack

- TanStack Start (SSR, React 19) on Cloudflare Workers — server functions are the entire backend, no separate API.
- Vite 8, `@cloudflare/vite-plugin`, `wrangler`.
- Biome for lint/format (no ESLint, no Prettier).
- pnpm.
- Data layer: Cloudflare D1 + Drizzle ORM. Schema, client, and the first feature slice (`src/features/pages/`) are wired up.
- Vertical Slice / feature-folder organization for server-side logic: `src/features/<name>/{schemas,server,functions}.ts`.
- Live-preview Markdown editing mechanism — TODO, not decided (CodeMirror 6 + decoration plugin is the current lean, not finalized).

## Skill Loading

Before editing files for a substantial task:

- Run `pnpm dlx @tanstack/intent@latest list` from the repo root to see available local skills.
- If a listed skill matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.

Enabled skill scope is `@tanstack/*` only (see `intent.skills` in `package.json`).

## General Rules

- Keep changes scoped to the requested change.
- Prefer existing patterns over introducing new abstractions.
- Do not add dependencies unless they are necessary.
- Run validation (see below) after changes.
- Do not change CI/CD configuration unless explicitly required.
- Do not claim a validation command passed unless it was actually run.
- Do not fill gaps with assumptions when the user hasn't given the information — ask, or mark it as pending.
- Do not document technical decisions that haven't been made yet — mark them TODO explicitly instead of inventing.
- Code, comments, commit messages, and documentation are always written in English.

## Source

Generated files — do not hand-edit:

- `src/routeTree.gen.ts` — regenerate with `pnpm generate-routes`.
- `worker-configuration.d.ts` — regenerate with `wrangler types`.

Layout: routes in `src/routes/` (TanStack Router file-based routing), data layer in `src/db/` (Drizzle schema + D1 client) with migrations in `drizzle/`, server-side feature logic in `src/features/<name>/`.

## Validation

Run `pnpm check`, `pnpm typecheck`, `pnpm build`, and `pnpm test` before considering a change done — CI (`.github/workflows/ci.yml`) runs the same on push/PR to `main`; CD (`.github/workflows/cd.yml`) deploys on push to `main`. Exported functions with real logic should have a matching `*.test.ts`.

## Git

- Do not create or switch branches unless explicitly requested by the user.
- Do not create commits unless explicitly requested by the user.
- Do not push changes unless explicitly requested by the user.
- Keep commits focused on the requested change.
- Commit message format: `type: summary` ([Conventional Commits](https://www.conventionalcommits.org/)), e.g. `feat: add slug route`.

## Documentation

### Audience

Write for the maintainer returning to this code later. Keep documentation concise and skimmable. Do not write onboarding tutorials unless explicitly requested.

### Content Rules

- State facts concisely. Avoid unnecessary explanations or trailing rationale.
- Do not document information that is already obvious from the repository structure or configuration.
- Do not invent features, API shapes, or future direction.
- Document a capability only after it is implemented and verified.
- Use proper Markdown headings (`##`, `###`), not bold text as headings.
