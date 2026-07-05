# 🚀 Backend Development Guide — Yugo NestJS Project

> A complete, beginner-friendly guide using the **real production codebase** as your learning material.  
> You are a frontend developer transitioning to backend — every concept is explained from the ground up.

---

## Table of Contents

1. [Project Architecture & Folder Structure](#1-project-architecture--folder-structure)
2. [Backend Development Fundamentals](#2-backend-development-fundamentals)
3. [NestJS Framework](#3-nestjs-framework)
4. [Application Entry Point & Execution Flow](#4-application-entry-point--execution-flow)
5. [API Layer](#5-api-layer)
6. [Database Layer](#6-database-layer)
7. [TypeORM](#7-typeorm)
8. [Entities](#8-entities)
9. [Migrations](#9-migrations)
10. [CQRS Architecture](#10-cqrs-architecture)
11. [CASL Authorization](#11-casl-authorization)
12. [Packages Folder](#12-packages-folder)
13. [Inngest — Background Jobs](#13-inngest--background-jobs)
14. [Complete Request Flow](#14-complete-request-flow)
15. [Real Project Learning Path](#15-real-project-learning-path)

---

## 1. Project Architecture & Folder Structure

### 🏢 Real-World Analogy

Think of a large company building. The entire project (`yugo-app`) is the **building**. Inside it:

- **Ground floor** = The root folder (shared config, infra, scripts)
- **Each floor** = An `app` (api, frontend mobile app, backoffice, CLI tool)
- **Shared departments** = The `packages` folder (CASL, CQRS, database — used by multiple floors)

### Root Level Structure

```
yugo-app/                        ← The monorepo root (the entire company building)
├── apps/                        ← All runnable applications
│   ├── api/                     ← ✅ The NestJS backend API (our main focus)
│   ├── app/                     ← Mobile app (React Native / Expo)
│   ├── backoffice/              ← Admin dashboard (web frontend)
│   ├── cli/                     ← Command-line tools for internal use
│   └── henchmen/                ← Worker/job runner service
├── packages/                    ← Shared code used across multiple apps
│   ├── nestjs/                  ← NestJS-specific shared modules
│   │   ├── casl/                ← Authorization logic
│   │   ├── cqrs/                ← All Commands, Queries, Handlers
│   │   ├── database/            ← All Entities (database table definitions)
│   │   ├── fcm/                 ← Firebase Cloud Messaging (push notifications)
│   │   ├── framework/           ← Base NestJS utilities
│   │   └── inngest/             ← Background job integration
│   └── shared/                  ← Pure TypeScript shared across everything
│       ├── permissions/         ← Role-based permission definitions
│       ├── shared/              ← Enums, types (Gender, Roles, KycStatus…)
│       ├── utils/               ← Utility functions
│       └── tsconfig/            ← Shared TypeScript config
├── migrations/                  ← Database migration files (SQL change history)
├── docs/                        ← Documentation
├── infra/                       ← Infrastructure config (Kubernetes, Docker, etc.)
├── scripts/                     ← Deployment/setup scripts
├── turbo.json                   ← Turborepo build config (builds all apps efficiently)
├── docker-compose.yml           ← Local development environment (DB, Redis, etc.)
└── package.json                 ← Root-level dependencies and workspace config
```

### The API App Structure (Your Main Focus)

```
apps/api/src/
├── main.ts                      ← 🚀 Entry point. Where the server starts.
├── app.module.ts                ← 🧩 Root module. Wires everything together.
├── config/                      ← ⚙️  Environment variable loaders
│   ├── database.config.ts
│   ├── jwt.config.ts
│   ├── inngest.config.ts
│   └── ...
├── modules/                     ← 📦 Feature modules (one per business domain)
│   ├── auth/                    ← Login, logout, OTP
│   ├── users/                   ← User CRUD
│   ├── bookings/                ← Vehicle booking
│   ├── vehicles/                ← Vehicle management
│   ├── batteries/               ← Battery management
│   ├── stations/                ← Station management
│   └── ...
├── guards/                      ← 🔒 Access control (JWT auth check)
├── interceptors/                ← 🔄 Response transformers
├── decorators/                  ← 🏷️  Custom annotations like @Public()
├── strategies/                  ← 🎫 Authentication strategies (JWT parsing)
├── dtos/                        ← 📋 Global shared DTOs
├── types/                       ← TypeScript type definitions
└── utils/                       ← Helper functions
```

### Each Module's Structure (e.g., `users/`)

```
modules/users/
├── users.module.ts              ← Declares controllers and handlers for this feature
├── controllers/
│   └── v1/
│       └── users.controller.ts  ← HTTP route handlers (GET /v1/users, POST /v1/users)
└── dtos/
    ├── payloads.ts              ← Input validation schemas (what the client sends)
    └── responses.ts             ← Output schemas (what the server sends back)
```

### Communication Between Folders

```
HTTP Request
    ↓
Controller (modules/users/controllers/v1/users.controller.ts)
    ↓
CommandBus / DataSource (from packages/nestjs/cqrs or TypeORM)
    ↓
CommandHandler (packages/nestjs/cqrs/src/commands/handlers/users/)
    ↓
Entity (packages/nestjs/database/src/entities/user.entity.ts)
    ↓
MySQL Database
```

### Team Conventions — Where Does a File Go?

| File Type | Location | Rule |
|---|---|---|
| New API endpoint | `apps/api/src/modules/<domain>/controllers/v1/` | One controller per version per domain |
| Input/Output schemas | `apps/api/src/modules/<domain>/dtos/` | `payloads.ts` for input, `responses.ts` for output |
| Business logic (write) | `packages/nestjs/cqrs/src/commands/` | Reusable across apps |
| Business logic (read) | `packages/nestjs/cqrs/src/queries/` | Reusable across apps |
| Database table definition | `packages/nestjs/database/src/entities/` | Single source of truth |
| Database change | `migrations/` | Never touch entities directly in prod without a migration |
| Shared types/enums | `packages/shared/shared/src/` | Used by both frontend and backend |
| Permissions / roles | `packages/shared/permissions/src/` | Centralized policy |
| Background jobs | Any module using `@InngestFunction` decorator | Discovered automatically |

---

## 2. Backend Development Fundamentals

### What is a Backend?

**Frontend analogy**: You know that when you click a button in a React app, something happens in the UI.

**Backend** is what happens *on the server* when that button fires an HTTP request.

```
👤 User taps "Book Vehicle" on phone
    ↓
📱 Mobile App (React Native) sends HTTP POST to https://api.yugo.com/v1/bookings
    ↓
🖥️  NestJS API receives the request
    ↓
🔒 Check: Is the user logged in? (JWT Guard)
    ↓
✅ Create booking in database
    ↓
📤 Return the new booking as JSON
    ↓
📱 Mobile App shows "Booking Confirmed!"
```

### The Lifecycle of a Backend Request

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTP REQUEST LIFECYCLE                    │
├─────────────────────────────────────────────────────────────┤
│  1. Client sends: POST /v1/users { name: "Ravi" }           │
│                          ↓                                   │
│  2. NestJS Router matches path → users controller           │
│                          ↓                                   │
│  3. Middleware runs (logging, CORS, etc.)                    │
│                          ↓                                   │
│  4. Guards run: AppAuthGuard → Is JWT valid?                 │
│                          ↓                                   │
│  5. Interceptors run (before): logging, transform input      │
│                          ↓                                   │
│  6. Pipes run: Validate + transform request body             │
│                          ↓                                   │
│  7. Controller method executes: createOneUser()              │
│                          ↓                                   │
│  8. CommandBus dispatches CreateUserCommand                  │
│                          ↓                                   │
│  9. CreateUserHandler executes, talks to DB via TypeORM      │
│                          ↓                                   │
│  10. Database saves the user                                 │
│                          ↓                                   │
│  11. Handler returns the user object                         │
│                          ↓                                   │
│  12. Interceptors run (after): TypeboxSerializerInterceptor  │
│      strips fields not in UserResponse schema               │
│                          ↓                                   │
│  13. HTTP 201 JSON response sent to client                   │
└─────────────────────────────────────────────────────────────┘
```

### Core Backend Concepts You Must Know First

| Concept | What it Is | Analogy |
|---|---|---|
| **HTTP** | The protocol for web communication | Language that clients and servers speak |
| **REST API** | Convention for organizing endpoints | Menu card of what the server can do |
| **JSON** | Data format for requests/responses | The plates food is served on |
| **Database** | Persistent data storage | The restaurant's pantry |
| **ORM** | Maps TypeScript classes to DB tables | Recipe book that talks to the pantry |
| **Authentication** | Proving who you are | Showing your ID at the door |
| **Authorization** | What you're allowed to do | Your access badge: employee vs. VIP |
| **Environment Variables** | Configuration stored outside code | The settings dial on a machine |
| **Migrations** | Versioned database schema changes | Git commits for your database |
| **Background Jobs** | Work done asynchronously | Kitchen staff working behind the scenes |

---

## 3. NestJS Framework

### What is NestJS?

NestJS is a **Node.js backend framework** built with TypeScript. It is inspired by Angular's architecture.

**Why do companies use it?**
- Enforces a consistent, scalable structure (no "wild west" code)
- Built-in support for dependency injection (no manual wiring of classes)
- Excellent TypeScript support
- First-class modules for CQRS, GraphQL, WebSockets, microservices
- Large ecosystem and community

**What problem does it solve?**  
Without a framework, a Node.js backend can become a mess of callbacks and `require()` calls.  
NestJS gives you a **well-defined skeleton** — like a skeleton gives shape to a body.

### NestJS Core Building Blocks

#### 🧩 Module
A **logical unit** that groups related code. Think of it as a department in a company.

```typescript
// apps/api/src/modules/users/users.module.ts
@Module({
    controllers: [V1UsersController],          // Who handles HTTP requests
    providers: [CreateUserHandler, UpdateUserHandler, ...],  // Services/Handlers
})
export class UsersModule {}
```

#### 🎮 Controller
Handles **HTTP requests**. Maps a URL + HTTP method to a TypeScript function.

```
GET /v1/users        → getManyUsers()
GET /v1/users/:id    → getOneUser()
POST /v1/users       → createOneUser()
PATCH /v1/users/:id  → patchOneUser()
```

#### 🛠️ Service / Handler
Contains **business logic**. In this project, business logic lives in CQRS Handlers (in the `packages/nestjs/cqrs` package) rather than traditional Services.

#### 🔌 Provider
Any class managed by NestJS's **Dependency Injection** container. This includes services, handlers, guards, strategies, etc.

#### 🔒 Guard
Decides whether a request is **allowed to proceed**. In this project: `AppAuthGuard` checks JWT tokens.

#### 🔄 Interceptor
Runs code **before and after** a route handler. In this project: `TypeboxSerializerInterceptor` strips sensitive fields from responses.

#### 📐 Pipe
**Validates and transforms** request data. Example: converts `"123"` string to `123` number, or rejects invalid email formats.

#### 🧱 Middleware
Runs on **every request**, before routing. Used for logging, CORS, body parsing, etc.

### Dependency Injection — The Heart of NestJS

**Analogy**: Imagine a restaurant kitchen. A cook needs a knife. Instead of the cook buying their own knife, the *kitchen manager* provides it. This is dependency injection.

```typescript
// The controller doesn't create its own CommandBus.
// NestJS injects it automatically.
export class V1UsersController {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,   // ← injected
        @Inject(AccessService) private readonly accessService: AccessService, // ← injected
        private readonly commandBus: CommandBus,                       // ← injected
    ) {}
}
```

NestJS reads the constructor parameters, looks them up in its **DI Container**, and provides them automatically. You never write `new CommandBus()` yourself.

---

## 4. Application Entry Point & Execution Flow

### Where Does It All Start?

**File**: [main.ts](file:///c:/Projects/yugo-pr/yugo-app/apps/api/src/main.ts)

```typescript
async function bootstrap() {
    // 1. Create the NestJS application using AppModule as root
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
    });

    // 2. Set up the structured logger (pino)
    const logger = app.get<Logger>(Logger);
    app.useLogger(logger);

    // 3. Read config (PORT, etc.) from environment variables
    const configService = app.get<ConfigService>(ConfigService);

    // 4. Enable CORS (allows frontend on a different domain to call this API)
    app.enableCors();
    app.enableShutdownHooks();

    // 5. Set security headers using helmet
    app.use(helmet({ ... }));

    // 6. Enable URI versioning: /v1/users, /v2/users
    app.enableVersioning({ type: VersioningType.URI });

    // 7. Set up Swagger API documentation
    await setupSwagger(app);

    // 8. Start listening on port 4500
    await app.listen(PORT, HOST);
}
bootstrap();
```

### Module Loading Sequence

When NestJS starts, it loads modules in a tree:

```
AppModule (root)
    ↓ imports
    ├── ConfigModule        (env variables)
    ├── TypeOrmModule       (database connection)
    ├── RedisModule         (Redis cache)
    ├── JwtModule           (JWT token handling)
    ├── CaslModule          (permissions)
    ├── NestjsInngestModule (background jobs)
    ├── UsersModule         → V1UsersController, CreateUserHandler...
    ├── AuthModule          → AuthController, LoginHandler...
    ├── BookingsModule      → V1BookingsController, CreateBookingHandler...
    └── ... (all other feature modules)
```

Each module:
1. Instantiates its providers (handlers, services)
2. Registers its controllers (attaches routes)
3. Exports any providers other modules need

### What Happens When the Server Starts

```
1. NestFactory.create(AppModule)
2. Scan all @Module decorators
3. Build the dependency injection container
4. Connect to MySQL database (TypeORM)
5. Connect to Redis
6. Set up Inngest background job routes
7. Register all HTTP routes from controllers
8. Apply global guards (AppAuthGuard) and interceptors (TypeboxSerializerInterceptor)
9. Start listening on 0.0.0.0:4500
```

---

## 5. API Layer

### What is the API Folder?

`apps/api/src/modules/` contains **17 feature modules**. Each module represents a business domain:

| Module | What it handles |
|---|---|
| `auth` | Login, logout, OTP verification, token refresh |
| `users` | User CRUD, profile, device tokens |
| `vehicles` | Vehicle management (add, update, assign) |
| `batteries` | Battery inventory management |
| `bookings` | Customer vehicle bookings |
| `stations` | Swap/hub station management |
| `kyc` | Know Your Customer (identity verification) |
| `plans` | Subscription plan management |
| `transactions` | Payment records |
| `notifications` | Push notification tracking |

### How Routes Are Organized

In this project, routes are **versioned** using URI versioning:

```
/v1/users          ← Version 1 of the users API
/v2/users          ← Future version 2 (if API changes break clients)
```

The version comes from the controller declaration:

```typescript
// users.controller.ts
@Controller({ path: 'users', version: '1' })   // ← version: '1' → /v1/
export class V1UsersController { ... }
```

### Controller → Command/Query Connection

```
// Controller dispatches a command (write operation)
async createOneUser(@Body() body, @Req() req) {
    return this.commandBus.execute(new CreateUserCommand(body));
    //              ↑                       ↑
    //   NestJS CQRS CommandBus    The command object (a plain class carrying data)
}
```

The `CommandBus` finds the matching `@CommandHandler` for `CreateUserCommand` and calls `execute()`.

---

## 6. Database Layer

### How the Database is Connected

**File**: [database.config.ts](file:///c:/Projects/yugo-pr/yugo-app/apps/api/src/config/database.config.ts)

```typescript
export const databaseConfig = registerAs('database.config', (): TypeOrmModuleOptions => {
    return {
        type: 'mysql',                          // ← Database type (MySQL)
        database: env['DATABASE_NAME'] ?? 'yugo',
        charset: 'utf8mb4_unicode_ci',          // ← Supports emojis, Hindi text
        connectorPackage: 'mysql2',             // ← MySQL driver package
        entities: Object.values(entities),      // ← All entity classes (UserEntity, etc.)
        synchronize: false,                     // ← NEVER auto-change DB in prod! Use migrations.
        url: process.env['DATABASE_MASTER_URL'],// ← mysql://root:pass@localhost:3306
    };
});
```

This config is loaded in `app.module.ts`:

```typescript
TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
        configService.getOrThrow('database.config'),   // ← Uses the config above
})
```

### Environment Variables (`.env.example`)

```bash
DATABASE_MASTER_URL=mysql://root:123456@localhost:3306
DATABASE_NAME=yugo
```

Environment variables keep **secrets out of source code**. Never commit a `.env` file. The `.env.example` file shows what variables are needed.

### How NestJS Communicates with the Database

There are two ways used in this project:

**1. Via `DataSource` (direct TypeORM queries)**:
```typescript
// In the controller or handler
const user = await this.datasource.manager.findOne(UserEntity, {
    where: { id: userId },
    relations: { roles: true },
});
```

**2. Via `EntityManager` in transactions**:
```typescript
return manager.transaction(async (manager) => {
    const user = manager.create(UserEntity, { ... });
    await manager.save(user);
    // If anything throws, the entire transaction is rolled back
});
```

---

## 7. TypeORM

### What is TypeORM?

TypeORM is an **Object-Relational Mapper (ORM)**. It lets you work with your database using TypeScript classes instead of raw SQL.

**Without ORM** (raw SQL):
```sql
INSERT INTO users (id, email, firstName) VALUES ('01J...', 'ravi@email.com', 'Ravi');
SELECT * FROM users WHERE id = '01J...';
```

**With TypeORM**:
```typescript
const user = manager.create(UserEntity, { email: 'ravi@email.com', firstName: 'Ravi' });
await manager.save(user);
const found = await manager.findOne(UserEntity, { where: { id: user.id } });
```

### Why TypeORM?

- Write database operations in TypeScript, not SQL strings
- Relations (joins) become simple: `relations: { roles: true }`
- Migrations auto-generate SQL from entity changes
- Type safety — you know what properties exist on `UserEntity`

### Key TypeORM APIs Used in This Project

```typescript
// Create an entity object (not saved yet)
const user = manager.create(UserEntity, { firstName: 'Ravi' });

// Save to database (INSERT or UPDATE)
await manager.save(user);

// Find one record
const user = await manager.findOne(UserEntity, { where: { id: 'abc' } });

// Find multiple records
const users = await manager.find(UserEntity, { where: { active: true } });

// Run raw queries inside a transaction
await manager.transaction(async (txManager) => {
    await txManager.save(userEntity);
    await txManager.save(addressEntity);
    // Both saved, or both rolled back if error
});

// Build custom queries (for complex filtering/joins)
const qb = this.datasource.manager.createQueryBuilder(UserEntity, 'user');
const result = await paginate(query, qb, PAGINATE_CONFIG);
```

### Repositories

TypeORM supports `Repository<Entity>` pattern, but this project uses **`DataSource.manager`** directly, which is a more flexible approach that gives access to the full entity manager without needing to inject per-entity repositories.

---

## 8. Entities

### What is an Entity?

An Entity is a **TypeScript class that maps to a database table**. Each property maps to a column. Each instance maps to a row.

```
UserEntity class   →   users table in MySQL
   .id property    →   id column
   .email property →   email column
   .roles array    →   users_roles_roles join table
```

### The Base Entity

**File**: [id-timestampped.entity.ts](file:///c:/Projects/yugo-pr/yugo-app/packages/nestjs/database/src/entities/id-timestampped.entity.ts)

```typescript
export class IdTimestamppedEntity {
    @PrimaryColumn({ type: 'varchar', length: 26 })
    id: string;
    //  ↑ Uses ULID (Universally Unique Lexicographically Sortable ID)
    //    instead of auto-increment numbers — better for distributed systems

    @CreateDateColumn()    // Automatically set when a record is created
    createdAt: Date;

    @UpdateDateColumn()    // Automatically updated on every save
    updatedAt: Date;

    @DeleteDateColumn()    // Set when soft-deleted (record stays in DB!)
    deletedAt: Date;

    @BeforeInsert()        // Lifecycle hook: runs before INSERT
    setId() {
        if (!this.id) {
            this.id = ulid();    // Generate a ULID if no ID set
        }
    }
}
```

> **Soft Delete**: `deletedAt` means records are never physically deleted. If `deletedAt` is set, the record is "deleted" logically. TypeORM automatically filters these out in queries. This is essential for audit trails.

### The User Entity

**File**: [user.entity.ts](file:///c:/Projects/yugo-pr/yugo-app/packages/nestjs/database/src/entities/user.entity.ts)

```typescript
@Entity({ name: 'users' })       // ← Maps to "users" table in MySQL
@Index(['email', 'mobilenumber']) // ← Creates DB index on these columns (faster queries)
export class UserEntity extends IdTimestamppedEntity {  // ← Inherits id, createdAt, updatedAt, deletedAt

    // SIMPLE COLUMNS
    @Column('varchar', { nullable: true, unique: true })
    email: string;                  // → email VARCHAR NULL UNIQUE

    @Column('varchar', { nullable: true, unique: true })
    mobilenumber: string;           // → mobilenumber VARCHAR NULL UNIQUE

    @Column('boolean', { default: true })
    active: boolean;                // → active BOOLEAN DEFAULT true

    @Column('enum', { enum: Gender, nullable: true })
    gender: Gender;                 // → gender ENUM('male','female','other')

    @Column('json', { nullable: true })
    properties: any;                // → properties JSON (flexible key-value storage)

    // RELATIONS
    @ManyToMany(() => RoleEntity, (r) => r.name, { cascade: true })
    @JoinTable()                    // ← Creates the join table: users_roles_roles
    roles: RoleEntity[];            // A user can have many roles; a role can belong to many users

    @OneToMany(() => AddressEntity, (a) => a.user, { cascade: true })
    addresses: AddressEntity[];     // A user has many addresses

    @ManyToOne(() => StationEntity, (s) => s.managers, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    station: StationEntity;         // A user belongs to one station (optional)

    @Column({ nullable: true })
    stationId: string;              // Foreign key column
}
```

### Common TypeORM Decorators Explained

| Decorator | Meaning | Example |
|---|---|---|
| `@Entity({ name })` | Marks class as DB table | `@Entity({ name: 'users' })` |
| `@Column(type, opts)` | Maps property to column | `@Column('varchar', { nullable: true })` |
| `@PrimaryColumn()` | Primary key column | `@PrimaryColumn({ type: 'varchar', length: 26 })` |
| `@CreateDateColumn()` | Auto-set on INSERT | createdAt |
| `@UpdateDateColumn()` | Auto-set on UPDATE | updatedAt |
| `@DeleteDateColumn()` | Soft-delete timestamp | deletedAt |
| `@Index()` | Creates DB index | `@Index(['email'])` |
| `@OneToMany()` | One-to-many relation | One user → many addresses |
| `@ManyToOne()` | Many-to-one relation | Many users → one station |
| `@ManyToMany()` | Many-to-many relation | Users ↔ Roles |
| `@JoinTable()` | Creates pivot/join table | `users_roles_roles` |
| `@JoinColumn()` | Stores the FK column | `stationId` |
| `@BeforeInsert()` | Hook before INSERT | Set `id = ulid()` |

---

## 9. Migrations

### What Are Migrations?

A migration is a **versioned file describing how to change the database schema**. Each file has an `up()` (apply change) and `down()` (undo change) method.

**Analogy**: Git commits for your database. Every schema change is tracked, versioned, and reversible.

### Why Are They Critical in Teams?

Without migrations:
- Developer A adds a column on their laptop
- Developer B doesn't know about it
- Production database is different from development
- App crashes or behaves unexpectedly in production

With migrations:
- Every schema change is a committed file
- Everyone runs `migration:run` and gets the exact same database
- Production deployments are safe and predictable

### Real Example — Adding a Column

**File**: [1779944369313-add_active_status_to_users.ts](file:///c:/Projects/yugo-pr/yugo-app/migrations/1779944369313-add_active_status_to_users.ts)

```typescript
export class addActiveStatusToUsers1779944369313 implements MigrationInterface {
    name = 'addActiveStatusToUsers1779944369313'  // Name for tracking

    // What to do when applying this migration
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` ADD \`active\` tinyint NOT NULL DEFAULT 1`
        );
        // This adds the 'active' column to the users table
    }

    // What to do when rolling back this migration
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` DROP COLUMN \`active\``
        );
        // This removes the 'active' column (reverting the change)
    }
}
```

The timestamp `1779944369313` in the filename ensures migrations run in chronological order.

### Migration Workflow in Production Teams

```
Step 1: Developer changes an Entity
        (e.g., adds `active` column to UserEntity)
          ↓
Step 2: Generate migration automatically
        npx typeorm migration:generate migrations/AddActiveToUser
        (TypeORM compares your entities to DB and generates the SQL)
          ↓
Step 3: Review the generated file (ALWAYS review!)
          ↓
Step 4: Commit the migration file to git
          ↓
Step 5: CI/CD pipeline runs migrations in production
        npx typeorm migration:run
          ↓
Step 6: Column now exists in production database

ROLLBACK (if something goes wrong):
        npx typeorm migration:revert
        (Runs the down() method of the latest migration)
```

### ⚠️ What Happens Without Migrations

| Scenario | Result |
|---|---|
| `synchronize: true` in production | TypeORM auto-alters DB tables. Can DROP COLUMNS accidentally. **Never do this in production.** |
| Deploy without running migrations | App crashes: column doesn't exist, SELECT fails |
| Team doesn't track migrations | Developer databases diverge. Works on Dev, fails on Prod. |

---

## 10. CQRS Architecture

### What is CQRS?

**CQRS = Command Query Responsibility Segregation**

The core idea: **separate reading from writing**.

- **Command** = an intention to **change** data (Create, Update, Delete)
- **Query** = an intention to **read** data (Get, List, Search)

### Why Use CQRS?

1. **Separation of Concerns**: Write logic and read logic are in different files
2. **Reusability**: The same `CreateUserCommand` works from the API, CLI, or background jobs
3. **Scalability**: Reads and writes can be optimized independently
4. **Testability**: Handlers are plain classes — easy to unit test

### Analogy

In a bank:
- **Withdrawal** (write money) → goes through the teller + compliance + vault
- **Check Balance** (read) → just look at the ledger

These are fundamentally different operations with different rules. CQRS models this separation.

### Command Flow — "Create User"

**Step 1**: Controller creates a Command object

```typescript
// users.controller.ts
async createOneUser(@Body() body, @Req() req) {
    return this.commandBus.execute(new CreateUserCommand(body));
    //                              ↑
    //                   A plain class that carries the payload
}
```

**Step 2**: The Command class (just a data container)

```typescript
// packages/nestjs/cqrs/src/commands/impl/users/create-users.command.ts
export class CreateUserCommand {
    constructor(public readonly payload: CreateUserPayload) {}
    // That's it. No logic. Just carries the data.
}
```

**Step 3**: The Command Handler (all the business logic)

```typescript
// packages/nestjs/cqrs/src/commands/handlers/users/create-users.handler.ts
@CommandHandler(CreateUserCommand)    // ← "I handle CreateUserCommand"
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: CreateUserCommand) {
        const body = command.payload;
        const manager = this.datasource.manager;

        return manager.transaction(async (manager) => {
            // 1. Validate: Does the role exist?
            const role = await manager.findOne(RoleEntity, { where: { name: body.role } });
            if (!role) throw new BadRequestException(`Role ${body.role} does not exist`);

            // 2. Check for duplicates
            const existingMobile = await manager.findOne(UserEntity, {
                where: { mobilenumber: body.mobilenumber }
            });
            if (existingMobile) throw new ConflictException('Mobile number already exists');

            // 3. Create the user
            const user = manager.create(UserEntity, {
                email: body.email,
                mobilenumber: body.mobilenumber,
                firstName: body.firstName,
                roles: [role],
            });
            await manager.save(user);

            // 4. Return the saved user with relations
            return manager.findOne(UserEntity, {
                where: { id: user.id },
                relations: { roles: true, addresses: true },
            });
        });
    }
}
```

**Step 4**: Register the Handler in the Module

```typescript
// users.module.ts
@Module({
    controllers: [V1UsersController],
    providers: [CreateUserHandler, UpdateUserHandler, ...],  // ← Handlers are providers
})
export class UsersModule {}
```

### Query Flow — "Get User"

Queries are similar to Commands but are used for **reading data**.

This project uses direct `DataSource` queries in the controller for reads (a pragmatic approach) and QueryHandlers for more complex reads:

```typescript
// Controller reads directly using DataSource
async getOneUser(@Param('id') id, @Req() req) {
    const user = await this.datasource.manager.findOne(UserEntity, {
        where: { id: userId },
        relations: { roles: true, addresses: true, kycs: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
}
```

### CQRS Directory Structure

```
packages/nestjs/cqrs/src/
├── commands/
│   ├── impl/                    ← Command definitions (data containers)
│   │   ├── users/
│   │   │   ├── create-users.command.ts
│   │   │   ├── update-users.command.ts
│   │   │   └── ...
│   │   ├── bookings/
│   │   └── ...
│   └── handlers/                ← Command handlers (business logic)
│       ├── users/
│       │   ├── create-users.handler.ts
│       │   ├── update-users.handler.ts
│       │   └── ...
│       └── ...
└── queries/
    ├── impl/                    ← Query definitions
    └── handlers/                ← Query handlers
        ├── stations/
        ├── plans/
        └── ...
```

---

## 11. CASL Authorization

### What is CASL?

**CASL** (pronounced "castle") is an authorization library that lets you define **what each user role can do**.

**Authentication** = *Who are you?* (JWT token)  
**Authorization** = *What are you allowed to do?* (CASL)

### The Permission System

**File**: [permissions.ts](file:///c:/Projects/yugo-pr/yugo-app/packages/shared/permissions/src/permissions.ts)

```typescript
export const permissions = {

    // A CUSTOMER can:
    customer({ can }) {
        can(Actions.read, Subjects.Plan)       // Read plans (view subscription options)
        can(Actions.create, Subjects.UserPlan) // Buy a plan
        can(Actions.read, Subjects.UserPlan)   // View their own plan
        can(Actions.create, Subjects.Booking)  // Book a vehicle
        can(Actions.read, Subjects.Booking)    // View their bookings
        can(Actions.create, Subjects.Kyc)      // Submit KYC documents
    },

    // A SWAP MANAGER (station employee) can:
    swap_manager({ can }) {
        can(Actions.read, Subjects.Booking)         // View bookings
        can(Actions.update, Subjects.Booking)       // Update booking status
        can(Actions.create, Subjects.BatterySwap)   // Perform battery swaps
    },

    // A SYSTEM ADMIN can do everything:
    system_admin({ can, extend }) {
        extend(Roles.HUB_MANAGER)    // Inherits all hub_manager permissions
        extend(Roles.SWAP_MANAGER)   // Inherits all swap_manager permissions
        extend(Roles.CUSTOMER)       // Inherits all customer permissions
        can(Actions.manage, Subjects.User)      // manage = CRUD + everything
        can(Actions.manage, Subjects.Vehicle)
        // ... manage everything
    },
}
```

### How Authorization is Checked in a Controller

```typescript
// users.controller.ts
async createOneUser(@Body() body, @Req() req) {
    // Check if the logged-in user has 'create' permission on UserSubject
    if (!this.accessService.hasAbility(req.user, Actions.create, new UserSubject())) {
        throw new ForbiddenException('not allowed');  // 403 Forbidden
    }
    return this.commandBus.execute(new CreateUserCommand(body));
}
```

### The Access Service

**File**: [access.service.ts](file:///c:/Projects/yugo-pr/yugo-app/packages/nestjs/casl/src/access.service.ts)

The `AccessService.hasAbility()` method:
1. Gets the user's roles from `req.user.roles` (e.g., `['customer', 'hub_manager']`)
2. Builds the user's ability set from the permissions config
3. Checks if that ability set includes `action` on `subject`
4. Superuser (`system_admin`) always returns `true` — they bypass all checks

### Real-World Analogy

Think of a hospital:
- **Patients** (customer): Can view their own records, book appointments
- **Nurses** (swap_manager): Can update patient records
- **Doctors** (hub_manager): Can prescribe, view all records
- **Administrator** (system_admin): Can do everything, including manage staff

The permissions file is like the hospital's policy manual.

---

## 12. Packages Folder

### Purpose of `packages/`

This is a **monorepo** (one repository, multiple projects). The `packages/` folder contains shared code that is:
- Used by more than one app (API, CLI, Henchmen worker)
- Independently versioned
- Reusable without copy-pasting

### Why Separate from the Main App?

```
❌ Without packages/ (copy-paste approach):
   apps/api/src/entities/user.entity.ts
   apps/cli/src/entities/user.entity.ts     ← Same code, two files
   apps/henchmen/src/entities/user.entity.ts ← Three files to maintain!
   
   When you change the User entity, you update 3 files.
   Risk: They drift out of sync.

✅ With packages/ (shared library approach):
   packages/nestjs/database/src/entities/user.entity.ts  ← ONE source of truth
   
   All apps import from @yugo/nestjs-database/entities
   Change in one place, all apps get the update.
```

### Package Index

| Package | Import Alias | Purpose |
|---|---|---|
| `packages/nestjs/database` | `@yugo/nestjs-database` | All Entity definitions |
| `packages/nestjs/cqrs` | `@yugo/cqrs` | All Commands, Queries, Handlers |
| `packages/nestjs/casl` | `@yugo/nestjs-casl` | CASL AccessService, guards |
| `packages/nestjs/inngest` | `@yugo/nestjs-inngest` | Inngest NestJS module |
| `packages/nestjs/fcm` | `@yugo/nestjs-fcm` | Firebase Cloud Messaging module |
| `packages/shared/permissions` | `@yugo/permissions` | Role + permission definitions |
| `packages/shared/shared` | `@yugo/shared` | Shared enums (Gender, Roles, KycStatus) |

### Code That Belongs in Packages vs. App

| Belongs in `packages/` | Belongs in `apps/api/` |
|---|---|
| Entity definitions | HTTP controllers |
| CQRS Command/Query/Handlers | Config loaders |
| Authorization policy | Guards (app-specific wiring) |
| Push notification module | Interceptors |
| Shared enums and types | DTOs (specific to API's input/output) |

---

## 13. Inngest — Background Jobs

### What is Inngest?

Inngest is a **background job and workflow orchestration platform**. It lets you run tasks:
- **Asynchronously**: after the HTTP response has been sent
- **Reliably**: with automatic retries on failure
- **On a schedule**: like a cron job
- **In sequence**: step 1 → step 2 → step 3

### Why Use Background Jobs?

Some operations are too slow or unreliable to run synchronously during an HTTP request:

```
❌ Bad: "Send push notification" inside an HTTP request
   User: POST /v1/bookings
   Server: Save booking (50ms) + Send push notification (200ms) + Wait for FCM (300ms)
   Total: 550ms response time — slow!

✅ Good: "Send push notification" as a background job
   User: POST /v1/bookings
   Server: Save booking (50ms) → immediately return 201
   Background: Inngest picks up "notification" task and sends it asynchronously
   Total user wait: 50ms — fast!
```

### How Inngest Works with NestJS

**The Module** ([nestjs-inngest.module.ts](file:///c:/Projects/yugo-pr/yugo-app/packages/nestjs/inngest/src/nestjs-inngest.module.ts)):

1. Creates an Inngest client using your `INNGEST_APP_ID`
2. Discovers all `@InngestFunction`-decorated methods in your NestJS providers
3. Registers a route at `/api/inngest` (or configured path)
4. Inngest Cloud calls this route to trigger functions

### How Inngest Routes Are Set Up

```typescript
// inngest.config.ts
return {
    clientOptions: {
        id: env['INNGEST_APP_ID']!,          // Your app identifier: 'yugo'
        baseUrl: env['INNGEST_BASE_URL'],     // 'http://localhost:8288' for local dev
    },
    serveOptions: {
        servePath: '/api/inngest',           // The route Inngest calls
    },
};
```

### Real-World Use Cases in This Project

| Use Case | How Inngest Helps |
|---|---|
| KYC document verification | Submit KYC → Background job calls Deepvue API → Updates status |
| Payment webhook processing | Payment received → Background job activates user plan |
| Push notifications | Booking confirmed → Background job sends FCM push |
| Booking expiry | Job runs periodically → Marks expired bookings |

### Development Flow

```
Local Development:
1. Run: npx inngest-cli@latest dev
2. Inngest Dev Server runs at http://localhost:8288
3. Trigger a job manually via the Inngest dashboard
4. Inngest calls your API at /api/inngest
5. Your function runs with full logging

Production:
1. Functions are deployed with your API
2. Inngest Cloud (cloud.inngest.com) manages scheduling and retries
3. On failure, Inngest retries automatically (with exponential backoff)
```

---

## 14. Complete Request Flow

### Scenario: Frontend calls POST /v1/users to create a new user

Let's trace every single step.

```
📱 FRONTEND
  |
  | HTTP POST /v1/users
  | Headers: { Authorization: "Bearer eyJhbGciOi..." }
  | Body: { "mobilenumber": "9876543210", "role": "customer" }
  |
  ↓
🌐 NETWORK → NestJS HTTP Server (Express under the hood)
  |
  ↓
🔧 MIDDLEWARE (runs first, on every request)
  | - body-parser: Parses JSON body
  | - helmet: Adds security headers
  | - cors: Allows cross-origin requests
  | - queryMiddleware: Custom query string parser
  |
  ↓
🧭 ROUTER
  | NestJS matches:
  |   Method: POST
  |   Path: /v1/users
  |   Version: 1
  |   → V1UsersController.createOneUser()
  |
  ↓
🔒 GUARD: AppAuthGuard (app.guard.ts)
  | 1. Checks if route is @Public() — if yes, skip auth
  | 2. Extracts JWT from "Authorization: Bearer ..." header
  | 3. Validates JWT signature using JWT_SECRET
  | 4. Calls JwtStrategy.validate() →
  |    a. Checks Redis: is this token blacklisted? (e.g., logged out)
  |    b. Loads user from DB: findOne(UserEntity, { id: jwtPayload.id })
  |    c. Checks user.active — if inactive, throw UnauthorizedException
  |    d. Sets req.user = { ...user, roles: ['customer'] }
  | 5. If any check fails → 401 Unauthorized
  |
  ↓
🎮 CONTROLLER METHOD: createOneUser()
  | // users.controller.ts
  | async createOneUser(@Body() body, @Req() req) {
  |
  | // AUTHORIZATION CHECK
  | if (!this.accessService.hasAbility(req.user, Actions.create, new UserSubject()))
  |   → throw ForbiddenException → 403 Forbidden
  |
  | // DISPATCH COMMAND
  | return this.commandBus.execute(new CreateUserCommand(body))
  | }
  |
  ↓
📨 COMMAND BUS
  | - Receives: CreateUserCommand({ mobilenumber: '9876543210', role: 'customer' })
  | - Finds registered handler: @CommandHandler(CreateUserCommand) → CreateUserHandler
  | - Calls: CreateUserHandler.execute(command)
  |
  ↓
⚙️  COMMAND HANDLER: CreateUserHandler.execute()
  | // create-users.handler.ts
  | 1. manager.transaction(async (manager) => {
  |
  |    2. Find role: manager.findOne(RoleEntity, { where: { name: 'customer' } })
  |       → Role 'customer' found ✓
  |
  |    3. Check duplicate mobile:
  |       manager.findOne(UserEntity, { where: { mobilenumber: '9876543210' } })
  |       → No duplicate ✓
  |
  |    4. Create user entity in memory:
  |       const user = manager.create(UserEntity, {
  |           mobilenumber: '9876543210',
  |           roles: [roleEntity],
  |       })
  |       → user.id auto-set to ULID in @BeforeInsert hook
  |
  |    5. Save to database: manager.save(user)
  |       → INSERT INTO users (...) VALUES (...)
  |
  |    6. Fetch complete user with relations:
  |       manager.findOne(UserEntity, { where: { id: user.id },
  |           relations: { roles: true, addresses: true, kycs: true }
  |       })
  |
  |    7. Compute KYC status: computeKycStatus(savedUser.kycs)
  |
  |    8. Return savedUser
  | })
  |
  ↓
🔄 INTERCEPTOR: TypeboxSerializerInterceptor
  | - Receives the UserEntity object from the handler
  | - Looks up the @Serialize(UserResponse) schema on the route
  | - Strips any fields NOT in UserResponse schema (e.g., password hash!)
  | - Returns only the safe fields: { id, email, mobilenumber, roles, ... }
  |
  ↓
📤 HTTP RESPONSE
  | Status: 201 Created
  | Body: {
  |   "id": "01JXXXXXXXXXXXXXXXXXXXXXXX",
  |   "mobilenumber": "9876543210",
  |   "email": null,
  |   "roles": [{ "name": "customer" }],
  |   "active": true,
  |   "createdAt": "2026-07-04T06:30:00.000Z"
  | }
  |
  ↓
📱 FRONTEND receives response
  | Show success message: "User created!"
```

---

## 15. Real Project Learning Path

### 🗺️ Structured Roadmap

Follow this order — each stage builds on the last.

---

### Stage 1: Understand the Environment (Days 1-2)

**Goal**: Get the project running and understand what each config does.

1. Read [`.env.example`](file:///c:/Projects/yugo-pr/yugo-app/apps/api/.env.example) — understand what each variable does
2. Look at [`docker-compose.yml`](file:///c:/Projects/yugo-pr/yugo-app/docker-compose.yml) — understand how MySQL, Redis are set up
3. Run the project locally
4. Open `http://localhost:4500/reference` — explore the Swagger API docs
5. Make a real API request using curl or Postman

**Key files to read**:
- `.env.example`
- `docker-compose.yml`
- `apps/api/src/main.ts`

---

### Stage 2: Understand the Entry Point (Days 3-4)

**Goal**: Know exactly what happens when the server starts.

1. Read [`main.ts`](file:///c:/Projects/yugo-pr/yugo-app/apps/api/src/main.ts) line by line
2. Read [`app.module.ts`](file:///c:/Projects/yugo-pr/yugo-app/apps/api/src/app.module.ts) — count all the modules
3. Read any one config file: [`database.config.ts`](file:///c:/Projects/yugo-pr/yugo-app/apps/api/src/config/database.config.ts)
4. Understand `registerAs` — how NestJS reads environment variables

**Key concepts**: NestJS module system, dependency injection, `ConfigModule`

---

### Stage 3: Trace One Feature End-to-End (Days 5-7)

**Goal**: Understand the full request cycle using the **Users** feature.

Follow this path in order:

```
1. users.module.ts            → What does this module register?
2. users.controller.ts        → What routes does it expose? How is auth checked?
3. dtos/payloads.ts           → What does the request body look like?
4. dtos/responses.ts          → What does the response look like?
5. CreateUserCommand          → What data does it carry?
6. CreateUserHandler          → How is the user actually saved?
7. user.entity.ts             → How is the entity structured?
8. migrations/                → How was the users table created?
```

**Files to read in order**:
1. [users.module.ts](file:///c:/Projects/yugo-pr/yugo-app/apps/api/src/modules/users/users.module.ts)
2. [users.controller.ts](file:///c:/Projects/yugo-pr/yugo-app/apps/api/src/modules/users/controllers/v1/users.controller.ts)
3. [payloads.ts](file:///c:/Projects/yugo-pr/yugo-app/apps/api/src/modules/users/dtos/payloads.ts)
4. [create-users.command.ts](file:///c:/Projects/yugo-pr/yugo-app/packages/nestjs/cqrs/src/commands/impl/users/create-users.command.ts)
5. [create-users.handler.ts](file:///c:/Projects/yugo-pr/yugo-app/packages/nestjs/cqrs/src/commands/handlers/users/create-users.handler.ts)
6. [user.entity.ts](file:///c:/Projects/yugo-pr/yugo-app/packages/nestjs/database/src/entities/user.entity.ts)

---

### Stage 4: Understand Auth (Days 8-10)

**Goal**: Know how the JWT guard and CASL work together.

1. Read [`app.guard.ts`](file:///c:/Projects/yugo-pr/yugo-app/apps/api/src/guards/app.guard.ts) — the global JWT check
2. Read [`jwt.strategy.ts`](file:///c:/Projects/yugo-pr/yugo-app/apps/api/src/strategies/jwt.strategy.ts) — how JWT is validated
3. Read [`public.decorator.ts`](file:///c:/Projects/yugo-pr/yugo-app/apps/api/src/decorators/public.decorator.ts) — how to skip auth
4. Read [`permissions.ts`](file:///c:/Projects/yugo-pr/yugo-app/packages/shared/permissions/src/permissions.ts) — the role permission map
5. Read [`access.service.ts`](file:///c:/Projects/yugo-pr/yugo-app/packages/nestjs/casl/src/access.service.ts) — how `hasAbility()` works

---

### Stage 5: Understand the Database (Days 11-13)

**Goal**: Understand TypeORM entities and migrations.

1. Read all entity files in [`packages/nestjs/database/src/entities/`](file:///c:/Projects/yugo-pr/yugo-app/packages/nestjs/database/src/entities/) — understand each table
2. Read [`id-timestampped.entity.ts`](file:///c:/Projects/yugo-pr/yugo-app/packages/nestjs/database/src/entities/id-timestampped.entity.ts) — understand the base entity
3. Open MySQL (via DB client) and explore the actual tables
4. Read [`1779944369313-add_active_status_to_users.ts`](file:///c:/Projects/yugo-pr/yugo-app/migrations/1779944369313-add_active_status_to_users.ts) — simplest migration
5. Read the big migration [`1778502053570-Complete_May_11_2026.ts`](file:///c:/Projects/yugo-pr/yugo-app/migrations/1778502053570-Complete_May_11_2026.ts) — see how the entire DB was initially created

---

### Stage 6: Explore More Modules (Days 14-21)

**Goal**: Apply what you know to other domains.

Repeat Stage 3's tracing approach for these modules (increasing complexity):
1. **`plans/`** — Simple CRUD, good for practice
2. **`bookings/`** — More complex with multiple relations
3. **`kyc/`** — Has Inngest background jobs
4. **`transactions/`** — Payment integration with Razorpay

---

### Stage 7: Add a Feature Yourself (Week 4)

**Goal**: Build something new using the established patterns.

**Exercise**: Add a `notes` column to the `UserEntity`:
1. Add `notes` column to [user.entity.ts](file:///c:/Projects/yugo-pr/yugo-app/packages/nestjs/database/src/entities/user.entity.ts)
2. Add it to [payloads.ts](file:///c:/Projects/yugo-pr/yugo-app/apps/api/src/modules/users/dtos/payloads.ts) and [responses.ts](file:///c:/Projects/yugo-pr/yugo-app/apps/api/src/modules/users/dtos/responses.ts)
3. Update [update-users.handler.ts](file:///c:/Projects/yugo-pr/yugo-app/packages/nestjs/cqrs/src/commands/handlers/users/update-users.handler.ts) to save the notes
4. Generate a migration: `npx typeorm migration:generate migrations/AddNotesToUsers`
5. Run the migration

---

### 📊 Beginner Exploration Priority Chart

```
Priority 1 (Read First — Core Understanding)
────────────────────────────────────────────
✅ main.ts
✅ app.module.ts
✅ users.module.ts
✅ users.controller.ts (v1)
✅ user.entity.ts
✅ create-users.command.ts
✅ create-users.handler.ts
✅ app.guard.ts

Priority 2 (Read Second — Deepen Understanding)
────────────────────────────────────────────────
✅ jwt.strategy.ts
✅ database.config.ts
✅ permissions.ts
✅ access.service.ts
✅ payloads.ts + responses.ts
✅ id-timestampped.entity.ts

Priority 3 (Read Third — Advanced Concepts)
────────────────────────────────────────────
✅ Any migration file
✅ nestjs-inngest.module.ts
✅ inngest.config.ts
✅ typebox-serializer.interceptor.ts
✅ public.decorator.ts
```

---

### 🔑 Golden Rules for Navigating This Codebase

1. **HTTP route → controller**: Find any URL in the codebase by searching for the path string
2. **Controller uses → command**: Look at `commandBus.execute(new XxxCommand(...))` calls
3. **Command is handled by**: Search for `@CommandHandler(XxxCommand)`
4. **Entity maps to**: Search for `@Entity({ name: 'table_name' })`
5. **Permission check**: Look for `accessService.hasAbility(req.user, Actions.xxx, new XxxSubject())`
6. **Config value**: Look in `apps/api/src/config/` and trace to `.env.example`

---

### 💡 Key Mental Models

| Frontend Concept | Backend Equivalent |
|---|---|
| React Component | NestJS Module |
| Props | DTO (Data Transfer Object) |
| State | Database |
| useEffect | Background Job (Inngest) |
| Context/Redux | Dependency Injection Container |
| API call (fetch) | Controller endpoint |
| Type/Interface | Entity + DTO |
| Route guard (react-router) | NestJS Guard |
| Middleware (Express) | NestJS Middleware/Interceptor |

---

*Generated from the actual Yugo production codebase. All examples are from real files.*
