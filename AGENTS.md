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

## Architecture: Hexagonal (Ports & Adapters)

```
src/
├── domain/               # Core business logic (no framework deps)
│   ├── entities/         # Pure domain entities (no decorators)
│   ├── ports/
│   │   ├── inbound/      # Use case interfaces
│   │   └── outbound/     # Repository/gateway interfaces
│   └── services/         # Use case implementations
├── infrastructure/       # Driven adapters (external concerns)
│   ├── auth/             # Passport strategies, guards, JWT
│   ├── database/         # TypeORM entities & repositories
│   └── interceptors/     # Audit logging interceptor
├── application/          # Driving adapters (HTTP interface)
│   ├── controllers/      # NestJS REST controllers
│   ├── dto/              # Request/response DTOs
│   └── modules/          # NestJS module wiring (composition root)
└── common/               # Shared enums, constants
```

### Layer Rules
- **Domain** — pure TypeScript. Imports NOTHING from Infra or NestJS (`@nestjs/*`).
- **Infrastructure** — implements domain ports. Uses TypeORM decorators, Passport, bcrypt.
- **Application** — NestJS controllers that wire domain use cases → HTTP routes. Composition root for DI.
- **Common** — cross-layer enums/constants only (no domain logic).

## Key Architectural Decisions

- **Auth flow:** `LoginUseCase` (domain) validates credentials via `PasswordHasherPort` + `UserRepositoryPort`, returns user + tokens via `TokenGeneratorPort`. Controller calls use case directly.
- **Profile tables** (`students`, `teachers`, `treasury_staff`, `administrative_staff`): 1:1 with `users` via PK=FK (`id_user`). TypeORM uses `@OneToOne(() => UserEntity, { primary: true })`.
- `administrative_staff.assigned_department` is `'HR' | 'Academic' | 'Welfare'`.
- `synchronize: false` in TypeORM config — DB schema is managed externally (tables assumed to exist).
- Audit logs captured via `AuditLogInterceptor` for all POST/PUT/PATCH/DELETE requests.

## Database

- PostgreSQL via `@nestjs/typeorm`. Config from `.env` via `ConfigModule`.
- 19 TypeORM entities in `src/infrastructure/database/entities/`.
- Start DB: `docker-compose up -d` (PostgreSQL 16 + PgAdmin on port 5050).

## Authentication

| Strategy | Guard | Endpoint |
|----------|-------|----------|
| Local (email+password) | `LocalAuthGuard` | `POST /api/auth/login` |
| JWT (Bearer token) | `JwtAuthGuard` | `POST /api/auth/register`, `GET /api/auth/profile` |
| Google OAuth2 | `GoogleOAuthGuard` | `GET /api/auth/google`, `GET /api/auth/google/callback` |

Register calls `RegisterUserUseCase` (domain), hashes password via `BcryptPasswordHasher`, returns JWT.

## Style & Conventions

- **ESLint:** Flat config at `eslint.config.mjs`, `typescript-eslint` with type-checked rules. `prettier/prettier: "error"` with `endOfLine: "auto"`.
- **Prettier:** `singleQuote: true`, `trailingComma: "all"`.
- **Imports:** NestJS decorator-based controllers/services/modules. Standard NestJS DI pattern.
- Domain services are plain classes instantiated via NestJS's DI (they become providers).

## Current State Gotchas

- `.env` required — copy `.env.example` and configure DB + JWT + Google OAuth credentials.
- No database migrations exist. TypeORM `synchronize: false` — tables must exist beforehand.
- No CI/CD configured — no workflows or Docker files.
- `bcrypt` requires build tools (node-gyp). On Windows, run as admin or use `npm install --build-from-source`.

## Testing

- Jest 30 + ts-jest 29. `rootDir: "src"`, test match `**/*.spec.ts`. Coverage dir `../coverage`.
- E2E: supertest, config at `test/jest-e2e.json`, imports full `AppModule`.
- No test DB setup, testcontainers, or in-memory DB wired yet. Tests need real Postgres or mock the repository port.
