# AGENTS.md — lms-backend

NestJS 11 + TypeScript + TypeORM + PostgreSQL. Single package (not a monorepo).

## Commands

| Action | Command |
|--------|---------|
| Install | `npm install` |
| Build | `npm run build` (compiles to `dist/`) |
| Dev server | `npm run start:dev` (watch mode, port from `PORT` env or 3000) |
| Lint | `npm run lint` (ESLint flat config + Prettier, auto-fixes) |
| Format | `npm run format` (Prettier, singleQuote + trailingComma) |
| Unit tests | `npm run test` (Jest, `*.spec.ts` in `src/`) |
| E2E tests | `npm run test:e2e` (Jest, config at `test/jest-e2e.json`) |
| Coverage | `npm run test:cov` |
| Generate module | `nest g resource <name>` (NestJS CLI) |

No standalone typecheck script — `npm run build` and test compilation check types.

## Architecture

- **Entrypoint:** `src/main.ts` → bootstrap `AppModule`
- **Root module:** `src/app.module.ts` — imports feature modules (currently `AuthModule`)
- **Database:** TypeORM + PostgreSQL via `@nestjs/typeorm`. Requires `.env` file (gitignored).
- **Config:** `@nestjs/config` reads `.env` vars at bootstrap.
- **TSConfig:** `module: "nodenext"`, `target: "ES2023"`, decorators enabled. `noImplicitAny: false`, `skipLibCheck: true`.

## Style & Conventions

- **ESLint:** Flat config at `eslint.config.mjs`, `typescript-eslint` with type-checked rules. `prettier/prettier: "error"` with `endOfLine: "auto"`.
- **Prettier:** `singleQuote: true`, `trailingComma: "all"`.
- **Imports:** NestJS decorator-based controllers/services/modules. Standard NestJS DI pattern.

## Current State Gotchas

- `src/auth/` module is **deleted from working tree** but `AppModule` still imports `AuthModule`. `npm run build` and `npm run test:e2e` will fail until the import is removed or the module is restored.
- No database migrations exist yet. TypeORM sync/create must be configured before running.
- No CI/CD configured — no workflows or Docker files.

## Testing

- Jest 30 + ts-jest 29. `rootDir: "src"`, test match `**/*.spec.ts`. Coverage dir `../coverage`.
- E2E: supertest, config at `test/jest-e2e.json`, imports full `AppModule`.
- No test DB setup, testcontainers, or in-memory DB wired yet.
