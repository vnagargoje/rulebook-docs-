# YUGO BACKEND ENGINEERING RULE BOOK
### Official Engineering Standard — Version 1.0
### Status: MANDATORY. Every developer and AI agent must read and comply before writing any code.

> This document is the single source of truth for all backend development on the Yugo platform.
> It is not a suggestion. It is the engineering law.

---

## TABLE OF CONTENTS

1. [Architecture First](#1-architecture-first)
2. [NestJS Standards](#2-nestjs-standards)
3. [CQRS Standards](#3-cqrs-standards)
4. [Entity Standards](#4-entity-standards)
5. [DTO Standards](#5-dto-standards)
6. [Service Standards](#6-service-standards)
7. [Reusability Rules](#7-reusability-rules)
8. [Import Rules](#8-import-rules)
9. [API Standards](#9-api-standards)
10. [Database & Migration Standards](#10-database--migration-standards)
11. [Code Review Standards](#11-code-review-standards)
12. [AI Development Workflow](#12-ai-development-workflow)
13. [Enterprise Folder Structure](#13-enterprise-folder-structure)
14. [Performance Rules](#14-performance-rules)
15. [The 50 Golden Rules](#15-the-50-golden-rules)

---

## 1. ARCHITECTURE FIRST

### 1.1 Project Overview

This is a **Turborepo monorepo**. It contains multiple applications that share common packages. The architecture enforces strict boundaries between layers. Violating these boundaries is a blocking defect.

```
yugo-app/                         ← Monorepo root
├── apps/                         ← Deployable applications
│   ├── api/                      ← NestJS REST API (PRIMARY BACKEND)
│   ├── app/                      ← Mobile app (React Native)
│   ├── backoffice/               ← Admin web dashboard
│   ├── cli/                      ← Internal CLI tooling
│   └── henchmen/                 ← Background worker service
├── packages/                     ← Shared libraries (not deployable on their own)
│   ├── nestjs/
│   │   ├── casl/                 ← Authorization: AccessService, CaslModule
│   │   ├── cqrs/                 ← ALL Commands, Queries, and Handlers
│   │   ├── database/             ← ALL Entity definitions
│   │   ├── fcm/                  ← Firebase Cloud Messaging integration
│   │   ├── framework/            ← Base NestJS utilities
│   │   └── inngest/              ← Background job integration module
│   └── shared/
│       ├── permissions/          ← Role/action permission policy definitions
│       ├── shared/               ← Enums, interfaces (Gender, Roles, KycStatus)
│       ├── utils/                ← Pure utility functions
│       └── tsconfig/             ← Shared TypeScript configuration
├── migrations/                   ← TypeORM database migration files
└── docs/                         ← Documentation
```

### 1.2 Dependency Direction (INVIOLABLE)

Dependencies flow **strictly downward**. No layer may import from a layer above it.

```
HTTP Client
    ↓
Controller (apps/api/src/modules/*/controllers/)
    ↓
CommandBus / QueryBus / DataSource / Service
    ↓
CommandHandler / QueryHandler / Service (packages/nestjs/cqrs/)
    ↓
Entity / DataSource (packages/nestjs/database/)
    ↓
Database (MySQL)
```

**FORBIDDEN dependency directions:**
- ❌ Entity importing from Controller
- ❌ Handler importing from Controller
- ❌ Service importing from Controller
- ❌ `packages/` importing from `apps/`
- ❌ `shared/` importing from `nestjs/`
- ❌ Two feature modules directly importing each other's internals

### 1.3 Layer Responsibilities

| Layer | Location | Responsibility | Forbidden |
|---|---|---|---|
| **Controller** | `apps/api/src/modules/*/controllers/` | Route handling, auth checks, dispatching commands/queries | Business logic, DB access, complex conditionals |
| **Command Handler** | `packages/nestjs/cqrs/src/commands/handlers/` | Write operations, transactional business logic | HTTP concerns, response formatting |
| **Query Handler** | `packages/nestjs/cqrs/src/queries/handlers/` | Read operations, data fetching | Mutations, writes to database |
| **Service** | `apps/api/src/modules/*/services/` | Stateful, module-scoped orchestration (e.g., OTP, Token) | Direct DB access without DataSource |
| **Entity** | `packages/nestjs/database/src/entities/` | Database table definition | Business logic, validation, HTTP concerns |
| **DTO** | `apps/api/src/modules/*/dtos/` | Input validation schema, output shape | Business logic, DB access |
| **Guard** | `apps/api/src/guards/` | Request allow/deny decision | Business logic, data transformation |
| **Interceptor** | `apps/api/src/interceptors/` | Request/response transformation | Business logic, DB access |
| **Config** | `apps/api/src/config/` | Environment variable loading and typing | Business logic |
| **Migrations** | `migrations/` | Schema evolution SQL | Application logic |

---

### 1.4 Folder-by-Folder Reference

#### `apps/api/src/main.ts`
**Purpose**: Application bootstrap. One file only.
**Belongs here**: NestJS factory creation, global middleware, CORS, versioning, Swagger setup, server listen.
**Never**: Business logic, module imports directly, database calls.

```typescript
// ✅ CORRECT
async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();
    app.enableVersioning({ type: VersioningType.URI });
    await app.listen(PORT, HOST);
}
bootstrap();

// ❌ WRONG — never put logic here
async function bootstrap() {
    const user = await UserRepository.findOne(...); // FORBIDDEN
}
```

---

#### `apps/api/src/app.module.ts`
**Purpose**: Root NestJS module. Wires the entire dependency graph.
**Belongs here**: Global module imports (TypeORM, Redis, JWT, ConfigModule, CaslModule, InngestModule), global guards and interceptors registered with `APP_GUARD` / `APP_INTERCEPTOR`, all feature module imports.
**Never**: Business logic, direct database calls, controller declarations.

```typescript
// ✅ CORRECT — global guard/interceptor registration
providers: [
    { provide: APP_GUARD, useClass: AppAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: TypeboxSerializerInterceptor },
]
```

---

#### `apps/api/src/config/`
**Purpose**: Load and type environment variables using NestJS `registerAs`.
**Belongs here**: One file per external service config (`database.config.ts`, `jwt.config.ts`, `redis.config.ts`, `inngest.config.ts`, etc.).
**Never**: Business logic, imports from modules, hardcoded secrets.

```typescript
// ✅ CORRECT
export const databaseConfig = registerAs('database.config', (): TypeOrmModuleOptions => ({
    type: 'mysql',
    url: process.env['DATABASE_MASTER_URL'],
    entities: Object.values(entities),
    synchronize: false, // NEVER true in production
}));

// ❌ WRONG
export const databaseConfig = registerAs('database.config', () => ({
    password: 'hardcoded-password', // FORBIDDEN
}));
```

---

#### `apps/api/src/modules/`
**Purpose**: Feature domains. Each subdirectory is one bounded context.
**Belongs here**: Module file, controllers, DTOs, module-scoped services.
**Never**: Entities, CQRS handlers, global utilities.

**Rule**: Every feature module must map 1:1 to a business domain. Name it after the resource, not the action.

```
✅ modules/users/
✅ modules/bookings/
✅ modules/vehicles/

❌ modules/create-user/   ← action, not domain
❌ modules/helpers/       ← no domain ownership
```

---

#### `apps/api/src/modules/<domain>/controllers/v1/`
**Purpose**: HTTP route handlers for version 1 of the API.
**Belongs here**: `@Controller()`, HTTP method decorators, auth checks using `accessService`, dispatching via `commandBus` or `queryBus`, pagination.
**Never**: TypeORM queries for writes, business logic, `if/else` chains beyond access checks.

**File naming**: `<domain>.controller.ts`
**Class naming**: `V<version><Domain>Controller`
**Examples**: `V1UsersController`, `V1BookingsController`

---

#### `apps/api/src/modules/<domain>/dtos/`
**Purpose**: Input and output schemas for this module's API.
**Standard files**:
- `payloads.ts` — Request body schemas (TypeBox `Type.Object`)
- `responses.ts` — Response shape schemas (TypeBox `Type.Object`)

**Never**: Business logic, imports from handlers or entities.

---

#### `apps/api/src/modules/<domain>/services/`
**Purpose**: Module-scoped stateful services that do NOT fit the CQRS pattern.
Used for: OTP sending, token generation, external API calls, complex stateful logic local to one module.
**Never**: Services that could be shared across modules (move to `packages/`).

---

#### `apps/api/src/guards/`
**Purpose**: NestJS `CanActivate` implementations.
**Belongs here**: `AppAuthGuard` (JWT validation), any future route-level guard.
**Never**: Business logic beyond allow/deny, database mutations.

**File naming**: `<purpose>.guard.ts` → Class: `<Purpose>Guard`

---

#### `apps/api/src/interceptors/`
**Purpose**: NestJS `NestInterceptor` implementations.
**Belongs here**: Response serialization, logging interceptors.
**File naming**: `<purpose>.interceptor.ts`

---

#### `apps/api/src/decorators/`
**Purpose**: Custom parameter decorators and metadata decorators.
**Belongs here**: `@Public()`, `@Serialize()`, `@ApiResource()`, `@AuthUser()`.
**Never**: Business logic, service calls.

---

#### `apps/api/src/strategies/`
**Purpose**: Passport.js authentication strategies.
**Belongs here**: `jwt.strategy.ts` (JWT validation, Redis blacklist check, user loading).
**Never**: Authorization logic (CASL's responsibility).

---

#### `packages/nestjs/cqrs/src/commands/impl/`
**Purpose**: Command class definitions. Pure data containers.
**Belongs here**: One file per command, one class per file, constructor only.
**Never**: Business logic, database calls, NestJS decorators.

**File naming**: `<action>-<resource>.command.ts`
**Class naming**: `<Action><Resource>Command`

```
create-user.command.ts        → CreateUserCommand
update-user.command.ts        → UpdateUserCommand
delete-booking.command.ts     → DeleteBookingCommand
```

---

#### `packages/nestjs/cqrs/src/commands/handlers/`
**Purpose**: All business write logic. One handler per command.
**Belongs here**: `@CommandHandler()` class, `execute()` with full business logic, TypeORM transactions.
**Never**: HTTP-specific code (`Request`, `Response`), Swagger decorators.

**File naming**: `<action>-<resource>.handler.ts` → Class: `<Action><Resource>Handler`

---

#### `packages/nestjs/cqrs/src/queries/`
**Purpose**: Read-only data fetching operations. Mirrors commands structure.
**Never**: Write operations (`save`, `delete`, `update`), transactions for mutations.

---

#### `packages/nestjs/database/src/entities/`
**Purpose**: TypeORM entity definitions. Single source of truth for the database schema.
**Belongs here**: `@Entity()` classes extending `IdTimestamppedEntity`.
**Never**: Business logic, validation, HTTP concerns, NestJS service/controller imports.
**Rule**: All apps and packages import entities from `@yugo/nestjs-database/entities`. Never define entities elsewhere.

---

#### `packages/shared/permissions/src/`
**Purpose**: CASL role-action-subject permission definitions used across the entire platform.
**Belongs here**: `permissions.ts` (the policy map), `subjects.ts` (subject classes), `actions.enum.ts`.
**Never**: NestJS-specific code, database access.

---

#### `migrations/`
**Purpose**: Versioned database schema changes. Generated by TypeORM CLI.
**Belongs here**: Migration files with timestamp-prefixed names, each with `up()` and `down()`.
**Never**: Application logic, imports from NestJS modules, hardcoded application data.

---

## 2. NESTJS STANDARDS

### 2.1 Module Standards

Every feature module must follow this structure:

```typescript
// ✅ CORRECT module definition
@Module({
    controllers: [V1UsersController],
    providers: [
        CreateUserHandler,
        UpdateUserHandler,
        UpdateUserAddressesHandler,
        RegisterDeviceTokenHandler,
    ],
})
export class UsersModule {}
```

**Module Rules:**
- One module per business domain
- Module class name: `<Domain>Module` (e.g., `UsersModule`, `BookingsModule`)
- Module file name: `<domain>.module.ts`
- Module must declare only its own controllers and providers
- Every handler used in this module must be in `providers`
- Never import `TypeOrmModule.forFeature()` for per-entity repositories — use `DataSource` injection
- Never add global providers in feature modules — global providers belong in `app.module.ts`

**Service/OTP swappable pattern:**
```typescript
// ✅ CORRECT — factory provider for swappable implementations
{
    provide: OTP_SERVICE,
    useFactory: (config: ConfigService, msg91: Msg91OtpService, mock: MockOtpService) => {
        return config.get('MOCK_OTP_SERVICE') === 'true' ? mock : msg91;
    },
    inject: [ConfigService, Msg91OtpService, MockOtpService],
}
```

---

### 2.2 Controller Standards

```typescript
// ✅ CORRECT controller structure
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'users', version: '1' })   // Always specify version
export class V1UsersController {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        @Inject(AccessService) private readonly accessService: AccessService,
        private readonly commandBus: CommandBus,
    ) {}

    @ApiResource(UserResponse)
    @Get(':id')
    async getOneUser(@Param('id') id: string, @Req() req: Request) {
        const canManage = this.accessService.hasAbility(req.user, Actions.read, new UserSubject());
        if (id !== 'me' && !canManage) throw new ForbiddenException('not allowed');

        const userId = id === 'me' ? req.user.id : id;
        const user = await this.datasource.manager.findOne(UserEntity, {
            where: { id: userId },
            relations: { roles: true, addresses: { city: { state: true } } },
        });

        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    @ApiBody({ schema: CreateUserPayload })
    @ApiResource(UserResponse)
    @Post()
    async createOneUser(@Body() body: Static<typeof CreateUserPayload>, @Req() req: Request) {
        if (!this.accessService.hasAbility(req.user, Actions.create, new UserSubject())) {
            throw new ForbiddenException('not allowed');
        }
        return this.commandBus.execute(new CreateUserCommand(body));
    }
}
```

**Controller Rules:**
- Maximum 15 lines per route method
- Authorization check is the ONLY `if/else` logic allowed
- No TypeORM queries in write routes — dispatch a Command
- Simple reads (`findOne`, `paginate`) may be in the controller directly
- Always use `@ApiTags`, `@ApiBearerAuth`, `@ApiResource` or `@ApiBody`
- Always apply `@UseGuards(AppAuthGuard)` at the class level
- Version must always be specified: `version: '1'`
- Class name prefix must match version: `V1`, `V2`
- File path: `controllers/v<N>/<domain>.controller.ts`

---

### 2.3 Guard Standards

```typescript
// ✅ CORRECT guard implementation
@Injectable()
export class AppAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        try {
            const result = super.canActivate(context);
            const resolved = result instanceof Observable
                ? await firstValueFrom(result)
                : await result;
            return isPublic ? true : resolved;
        } catch (error) {
            if (isPublic) return true;
            throw error;
        }
    }
}
```

**Guard Rules:**
- Guards only answer: "Can this request proceed? Yes or No"
- No data transformation, no business logic
- Use `@Public()` decorator to bypass auth on specific routes
- Always extend `AuthGuard` for authentication; use `AccessService` for authorization

---

### 2.4 Interceptor Standards

```typescript
// ✅ CORRECT interceptor
@Injectable()
export class TypeboxSerializerInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const schema = this.reflector.getAllAndOverride<TSchema | undefined>(
            SERIALIZE_SCHEMA_KEY,
            [context.getHandler(), context.getClass()],
        );
        return next.handle().pipe(
            map((data) => {
                if (!schema) return data;
                return Value.Clean(schema, data as object);
            }),
        );
    }
}
```

**Interceptor Rules:**
- Interceptors transform data — they do not make decisions
- Never throw business exceptions from interceptors
- The global `TypeboxSerializerInterceptor` strips any field not in the response schema — this is the security serialization boundary

---

### 2.5 Naming Conventions Reference

| Artifact | File Name | Class Name | Example |
|---|---|---|---|
| Module | `<domain>.module.ts` | `<Domain>Module` | `users.module.ts` → `UsersModule` |
| Controller | `<domain>.controller.ts` | `V<N><Domain>Controller` | `V1UsersController` |
| Service | `<purpose>.service.ts` | `<Purpose>Service` | `TokenService` |
| Guard | `<purpose>.guard.ts` | `<Purpose>Guard` | `AppAuthGuard` |
| Interceptor | `<purpose>.interceptor.ts` | `<Purpose>Interceptor` | `TypeboxSerializerInterceptor` |
| Decorator | `<purpose>.decorator.ts` | function `<Purpose>()` | `Public()` |
| Strategy | `<strategy>.strategy.ts` | `<Strategy>Strategy` | `JwtStrategy` |
| Command | `<action>-<resource>.command.ts` | `<Action><Resource>Command` | `CreateUserCommand` |
| Handler | `<action>-<resource>.handler.ts` | `<Action><Resource>Handler` | `CreateUserHandler` |
| Query | `<action>-<resource>.query.ts` | `<Action><Resource>Query` | `GetUserQuery` |
| Entity | `<resource>.entity.ts` | `<Resource>Entity` | `UserEntity` |
| Config | `<service>.config.ts` | (exported function) | `database.config.ts` |
| Migration | `<timestamp>-<Description>.ts` | class with timestamp suffix | `AddActiveToUsers1779944...` |

---

## 3. CQRS STANDARDS

### 3.1 Why CQRS

CQRS separates **write intent** (Commands) from **read intent** (Queries). In this project:

1. **Reusability across apps**: The same `CreateUserCommand` works from API, CLI, and Henchmen. If business logic lived in a controller service, it would be trapped in `apps/api/`.
2. **Testability**: Handlers are plain classes with no HTTP dependency. Unit-testable without a server.
3. **Clarity**: A handler's `execute()` has one job. Its purpose is unmistakable.
4. **Scalability**: Reads and writes can be optimized independently.

### 3.2 Decision Tree

```
Is the operation changing data?
├── YES → Create a Command + CommandHandler
│         Place in: packages/nestjs/cqrs/src/commands/
│         Examples: CreateUser, UpdateUser, DeleteBooking, AssignVehicle
│
└── NO (reading data)
    ├── Simple findOne/findMany used only in one controller?
    │   └── YES → Use DataSource directly in the controller (acceptable)
    │
    └── Complex, reusable, or shared across apps?
        └── YES → Create a Query + QueryHandler
                  Place in: packages/nestjs/cqrs/src/queries/
```

### 3.3 Command Standard

**Command = a pure data container. No logic. No methods beyond the constructor.**

```typescript
// ✅ CORRECT — packages/nestjs/cqrs/src/commands/impl/users/create-user.command.ts
export class CreateUserCommand {
    constructor(public readonly payload: CreateUserPayload) {}
}

// ✅ CORRECT — multi-argument command
export class UpdateUserCommand {
    constructor(
        public readonly userId: string,
        public readonly payload: UpdateUserPayload,
        public readonly canUpdateRole: boolean,
    ) {}
}

// ❌ WRONG — logic in command
export class CreateUserCommand {
    constructor(data: CreateUserPayload) {
        this.payload = { ...data, email: data.email?.toLowerCase() }; // FORBIDDEN
    }
}
```

### 3.4 Command Handler Standard

```typescript
// ✅ CORRECT — packages/nestjs/cqrs/src/commands/handlers/users/create-user.handler.ts
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        @InjectInngestService() private readonly inngest: HenchmenInngestClient,
    ) {}

    async execute(command: CreateUserCommand) {
        const { payload } = command;
        const manager = this.datasource.manager;

        return manager.transaction(async (manager) => {
            // Step 1: Validate dependencies
            const role = await manager.findOne(RoleEntity, { where: { name: payload.role } });
            if (!role) throw new BadRequestException(`Role ${payload.role} does not exist`);

            // Step 2: Check uniqueness constraints
            if (payload.mobilenumber) {
                const existing = await manager.findOne(UserEntity, {
                    where: { mobilenumber: payload.mobilenumber },
                });
                if (existing) throw new ConflictException('Mobile number already exists');
            }

            // Step 3: Create and save entity
            const user = manager.create(UserEntity, {
                mobilenumber: payload.mobilenumber,
                email: payload.email,
                roles: [role],
            });
            await manager.save(user);

            // Step 4: Fire side effects via Inngest
            await this.inngest.send({
                name: 'user/user.created',
                data: { userId: user.id },
            });

            // Step 5: Return complete entity with relations
            return manager.findOne(UserEntity, {
                where: { id: user.id },
                relations: { roles: true, addresses: true, kycs: true },
            });
        });
    }
}
```

**Handler Rules:**
- Always use `manager.transaction()` when performing more than one write
- Always throw specific NestJS exceptions: `BadRequestException`, `NotFoundException`, `ConflictException`, `ForbiddenException`
- Always return the final state of the primary entity with necessary relations loaded
- Never access `req` or any HTTP object
- Never format or serialize responses

### 3.5 Query Handler Standard

```typescript
// ✅ CORRECT — packages/nestjs/cqrs/src/queries/handlers/stations/get-station.handler.ts
@QueryHandler(GetStationQuery)
export class GetStationHandler implements IQueryHandler<GetStationQuery> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(query: GetStationQuery) {
        const station = await this.datasource.manager.findOne(StationEntity, {
            where: { id: query.stationId },
            relations: { address: true, batteries: true, vehicles: true },
        });
        if (!station) throw new NotFoundException('Station not found');
        return station;
    }
}
```

**Query Handler Rules:**
- Never write to the database
- Never use transactions
- Load only relations needed for the response
- Always throw `NotFoundException` if entity does not exist

### 3.6 CQRS File Structure

```
packages/nestjs/cqrs/src/
├── commands/
│   ├── impl/
│   │   ├── index.ts                    ← re-exports all command impls
│   │   ├── users/
│   │   │   ├── index.ts
│   │   │   ├── create-user.command.ts
│   │   │   ├── update-user.command.ts
│   │   │   └── update-user-addresses.command.ts
│   │   ├── bookings/
│   │   └── ... (one folder per domain)
│   └── handlers/
│       ├── index.ts                    ← re-exports all handlers
│       ├── users/
│       │   ├── index.ts
│       │   ├── create-user.handler.ts
│       │   └── update-user.handler.ts
│       └── ... (mirrors impl/ structure)
├── queries/
│   ├── impl/
│   └── handlers/
└── index.ts                            ← public API: exports everything
```

---

## 4. ENTITY STANDARDS

### 4.1 The Base Entity

**All entities MUST extend `IdTimestamppedEntity`. No exceptions.**

```typescript
// packages/nestjs/database/src/entities/id-timestampped.entity.ts
export class IdTimestamppedEntity {
    @PrimaryColumn({ type: 'varchar', length: 26 })
    id: string;                    // ULID — sortable, unique, collision-proof

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;               // Soft delete — records are NEVER hard-deleted by default

    @BeforeInsert()
    setId() {
        if (!this.id) this.id = ulid(); // Auto-assign ULID before INSERT
    }
}
```

**Rules:**
- Never use `@PrimaryGeneratedColumn('uuid')` or `@PrimaryGeneratedColumn('increment')`
- Never manually add `id`, `createdAt`, `updatedAt`, `deletedAt` to any entity — they come from the base
- Always use soft delete (`DeleteDateColumn`) — never hard delete business data

### 4.2 Entity Structure Template

```typescript
// ✅ CORRECT entity
@Entity({ name: 'bookings' })           // Table name: plural, snake_case, always explicit
@Index(['userPlanId', 'status'])        // Composite indexes where needed
export class BookingEntity extends IdTimestamppedEntity {

    // ── SCALAR COLUMNS ────────────────────────────────────────────────────
    @Column('enum', { enum: BookingStatus, default: BookingStatus.INACTIVE })
    status: BookingStatus

    @Column('varchar', { length: 4 })
    pickupOtp: string

    // ── FOREIGN KEY COLUMNS (always declare alongside relations) ──────────
    @Column('varchar', { nullable: true })
    stationId: string | null

    @Column('varchar', { nullable: true })
    vehicleId: string | null

    // ── RELATIONS ─────────────────────────────────────────────────────────
    @ManyToOne(() => StationEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    station: StationEntity

    @ManyToOne(() => VehicleEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    vehicle: VehicleEntity

    // ── VIRTUAL FIELDS (not persisted, no @Column decorator) ──────────────
    computedField?: string
}
```

### 4.3 Relationship Rules

#### OneToMany / ManyToOne
```typescript
// UserEntity (the "one" side):
@OneToMany(() => AddressEntity, (address) => address.user, { cascade: true })
addresses: AddressEntity[]

// AddressEntity (the "many" side — owns the FK):
@ManyToOne(() => UserEntity, (user) => user.addresses, { onDelete: 'CASCADE' })
@JoinColumn()
user: UserEntity

@Column({ nullable: true })
userId: string    // Always declare the FK column explicitly
```

#### OneToOne
```typescript
// Booking owns the FK for UserPlan:
@OneToOne(() => UserPlanEntity, { onDelete: 'CASCADE' })
@JoinColumn()                    // @JoinColumn goes on the OWNING side
userPlan: UserPlanEntity

@Column('varchar', { unique: true })
userPlanId: string               // Always declare FK column
```

#### ManyToMany
```typescript
// UserEntity (owning side):
@ManyToMany(() => RoleEntity, (r) => r.name, { cascade: true })
@JoinTable()                     // @JoinTable only on ONE side (the owner)
roles: RoleEntity[]
// TypeORM auto-creates join table: users_roles_roles
```

### 4.4 Entity Rules Summary

| Rule | Detail |
|---|---|
| **Single source of truth** | Every entity lives in `packages/nestjs/database/src/entities/`. Never elsewhere. |
| **Never duplicate** | Search before creating. If `UserEntity` exists, use it. |
| **Explicit FK columns** | Every `@ManyToOne` or `@OneToOne` owner must have a `@Column` for the FK. |
| **`onDelete` is mandatory** | Always specify: `'CASCADE'`, `'SET NULL'`, or `'RESTRICT'`. |
| **Enums from `@yugo/shared`** | All `enum` columns use enums from `packages/shared/shared/`. No inline enums. |
| **Table names explicit** | `@Entity({ name: 'battery_swap_histories' })` — always plural, snake_case. |
| **No logic in entities** | Entities are data bags. No methods. Exception: `@BeforeInsert` for ULID only. |
| **Export from index** | Every entity exported from `packages/nestjs/database/src/entities/index.ts`. |

### 4.5 Column Type Reference

| TypeScript Type | TypeORM Column Type | Example |
|---|---|---|
| `string` | `'varchar'` | `@Column('varchar', { nullable: true })` |
| `number` (int) | `'int'` | `@Column('int', { default: 0 })` |
| `number` (decimal) | `'decimal'` | `@Column('decimal', { precision: 10, scale: 2 })` |
| `boolean` | `'boolean'` | `@Column('boolean', { default: true })` |
| `Date` | `'datetime'` | `@Column('datetime', { nullable: true })` |
| `Date` (date only) | `'date'` | `@Column('date', { nullable: true })` |
| `object/JSON` | `'json'` | `@Column('json', { nullable: true })` |
| `enum` | `'enum'` | `@Column('enum', { enum: MyEnum, default: MyEnum.VALUE })` |
| long text | `'text'` | `@Column('text', { nullable: true })` |

---

## 5. DTO STANDARDS

### 5.1 DTO Library

This project uses **TypeBox** (`@sinclair/typebox`) for all DTO schemas.
TypeBox provides **runtime validation AND static TypeScript types** from a single schema definition.

**DO NOT use class-validator, class-transformer, Zod, or io-ts.**
TypeBox + `@ApiBody({ schema })` + `TypeboxSerializerInterceptor` is the established pattern.

### 5.2 Payload DTOs (Request Input)

```typescript
// ✅ CORRECT — apps/api/src/modules/users/dtos/payloads.ts
import { Type } from '@sinclair/typebox'
import { Gender, Roles } from '@yugo/shared'

// Reusable sub-object (define once, import everywhere needed)
export const AddressPayload = Type.Object({
    lineOne: Type.String(),
    lineTwo: Type.Optional(Type.String()),
    pincode: Type.String(),
    cityId: Type.Optional(Type.String()),
})

export const CreateUserPayload = Type.Object({
    email: Type.Optional(Type.String({ format: 'email' })),  // format validates email
    mobilenumber: Type.String(),
    firstName: Type.Optional(Type.String()),
    gender: Type.Optional(Type.Enum(Gender)),                 // use shared enums
    role: Type.Optional(Type.Enum(Roles)),
    dateOfBirth: Type.Optional(Type.String({ format: 'date' })),
    address: Type.Optional(AddressPayload),
    active: Type.Optional(Type.Boolean()),
})

// Type.Partial → all-optional version (for PATCH/update endpoints)
export const UpdateUserPayload = Type.Partial(CreateUserPayload)
```

**Usage in controller (type-safe via TypeBox):**
```typescript
@Post()
async createOneUser(@Body() body: Static<typeof CreateUserPayload>) {
    return this.commandBus.execute(new CreateUserCommand(body));
}
```

### 5.3 Response DTOs (Output Schema)

```typescript
// ✅ CORRECT — apps/api/src/modules/users/dtos/responses.ts
import { Type } from '@sinclair/typebox'

const RoleResponse = Type.Object({ name: Type.String() })

export const UserResponse = Type.Object({
    id: Type.String(),
    email: Type.Optional(Type.String()),
    mobilenumber: Type.Optional(Type.String()),
    firstName: Type.Optional(Type.String()),
    roles: Type.Optional(Type.Array(RoleResponse)),
    active: Type.Boolean(),
    kycStatus: Type.Optional(Type.Enum(KycStatus)),
    createdAt: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String()),
    // ❌ NEVER include: password, deletedAt, internal tokens
})
```

The **`TypeboxSerializerInterceptor` enforces the response schema**. Any field not in `UserResponse` is automatically stripped. This is the security serialization boundary — sensitive fields like `password` are never accidentally leaked.

### 5.4 Controller + DTO Wiring

```typescript
// ✅ CORRECT wiring pattern
@ApiBody({ schema: CreateUserPayload })     // Documents request schema in Swagger
@ApiResource(UserResponse)                  // Documents response schema + applies @Serialize()
@Post()
async createOneUser(@Body() body: Static<typeof CreateUserPayload>) { ... }

// @ApiResource is a compound decorator that:
// 1. Applies @Serialize(schema) — stores schema for the interceptor
// 2. Applies @ApiOkResponse({ schema }) — Swagger documentation
// 3. Applies @ApiPaginationQuery(config) — if pagination config provided
```

### 5.5 DTO Rules

| Rule | Detail |
|---|---|
| **File placement** | `apps/api/src/modules/<domain>/dtos/payloads.ts` and `responses.ts` |
| **Schema library** | TypeBox only. |
| **Enums** | Always from `@yugo/shared`. Never `Type.Union([Type.Literal(...)])` for business enums. |
| **Never leak sensitive fields** | `password`, `deletedAt`, internal IDs must not appear in response schemas. |
| **Reuse sub-schemas** | `AddressPayload` defined once, imported wherever needed. Never copy-paste. |
| **Partial updates** | Use `Type.Partial(CreateXxxPayload)`. Never rewrite all fields manually. |

---

## 6. SERVICE STANDARDS

### 6.1 When to Use a Service vs. a Handler

| Situation | Solution |
|---|---|
| Write to database, business write logic | CQRS Command Handler |
| Read from database | CQRS Query Handler or DataSource in controller |
| Call an external API (OTP, payment, FCM) | NestJS Service in module's `services/` |
| Token generation / verification | `TokenService` in auth module |
| Shared computation across modules | Utility function in `packages/shared/utils/` |
| Module-scoped stateful orchestration | Service in module's `services/` |

### 6.2 Service Structure

```typescript
// ✅ CORRECT service
// apps/api/src/modules/auth/services/token.service.ts
@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}

    signAccessToken(userId: string, extra?: object): string {
        return this.jwtService.sign({ sub: userId, id: userId, ...extra });
    }

    verifyToken(token: string): JwtPayload {
        return this.jwtService.verify(token);
    }
}
```

**Service Rules:**
- Services must be `@Injectable()`
- Services belong in `apps/api/src/modules/<domain>/services/`
- Services that are shared globally belong in `packages/nestjs/<name>/`
- Services must have a single, clear responsibility
- Never put complex write business logic in services — that belongs in handlers

---

## 7. REUSABILITY RULES

### 7.1 Mandatory Pre-Code Checklist

**Before writing ANY new code, every developer and AI MUST complete this checklist.**

```
✅ PRE-CODE REUSABILITY CHECKLIST

□ 1. ENTITIES:    Checked packages/nestjs/database/src/entities/ for existing entities?
□ 2. COMMANDS:    Checked packages/nestjs/cqrs/src/commands/impl/ for existing commands?
□ 3. HANDLERS:    Checked packages/nestjs/cqrs/src/commands/handlers/ for existing handlers?
□ 4. QUERIES:     Checked packages/nestjs/cqrs/src/queries/ for existing queries/handlers?
□ 5. DTOs:        Checked the module's dtos/ for existing payload or response schemas?
□ 6. SERVICES:    Checked the module's services/ for existing services?
□ 7. UTILITIES:   Checked packages/shared/utils/ for existing utility functions?
□ 8. ENUMS:       Checked packages/shared/shared/ for existing enums?
□ 9. PERMISSIONS: Checked packages/shared/permissions/src/ for existing subjects/actions?
□ 10. PACKAGES:   Checked all packages/ before creating a new NestJS module?
```

### 7.2 Anti-Duplication Rules

```typescript
// ❌ FORBIDDEN — duplicating an existing entity
// apps/api/src/modules/users/user.model.ts
export class UserModel { ... }         // UserEntity already exists in packages/nestjs/database

// ✅ CORRECT
import { UserEntity } from '@yugo/nestjs-database/entities'

// ❌ FORBIDDEN — duplicating an existing enum
// apps/api/src/modules/bookings/booking-status.enum.ts
export enum BookingStatus { ACTIVE = 'active' }  // Already in @yugo/shared

// ✅ CORRECT
import { BookingStatus } from '@yugo/shared'

// ❌ FORBIDDEN — duplicate helper function
// apps/api/src/modules/kyc/utils/compute-kyc.ts
function computeKycStatus(kycs) { ... }  // Already in packages/nestjs/cqrs/src/utils/

// ✅ CORRECT
import { computeKycStatus } from '@yugo/cqrs'
```

### 7.3 Extending vs. Duplicating

When existing code almost fits but needs slight modification:
1. **Extend** the existing class/interface — do not duplicate
2. **Add an optional field** to the existing command payload — do not create a parallel command
3. **Add a method** to an existing service — do not create a new service
4. **Add an optional parameter** to an existing utility — do not create a parallel utility

---

## 8. IMPORT RULES

### 8.1 Package Alias Map

All cross-package imports use workspace aliases, never relative paths across package boundaries.

| Import | Alias | Provides |
|---|---|---|
| Database entities | `@yugo/nestjs-database/entities` | All `*Entity` classes |
| CQRS | `@yugo/cqrs` | All commands, queries, handlers, `computeKycStatus` |
| CASL authorization | `@yugo/nestjs-casl` | `AccessService`, `CaslModule` |
| Shared enums/types | `@yugo/shared` | `Gender`, `Roles`, `KycStatus`, etc. |
| Inngest | `@yugo/nestjs-inngest` | `NestjsInngestModule`, `@InjectInngestService()` |
| FCM | `@yugo/nestjs-fcm` | `NestjsFcmModule` |
| Permissions | `@yugo/permissions` | `permissions`, `Actions`, `UserSubject`, etc. |

### 8.2 Allowed Imports by Layer

```typescript
// ✅ ALLOWED in Controller:
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { AccessService } from '@yugo/nestjs-casl'
import { UserEntity } from '@yugo/nestjs-database/entities'
import { CreateUserCommand } from '@yugo/cqrs'
import { Actions, UserSubject } from '@yugo/permissions'
import { UserResponse, CreateUserPayload } from '../../dtos/...'

// ❌ FORBIDDEN in Controller:
import { CreateUserHandler } from '@yugo/cqrs'     // Import the command, not the handler
import fs from 'fs'                                // No filesystem access in controllers
```

```typescript
// ✅ ALLOWED in Command Handler:
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { UserEntity, RoleEntity } from '@yugo/nestjs-database/entities'
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'
import { InjectInngestService } from '@yugo/nestjs-inngest'

// ❌ FORBIDDEN in Command Handler:
import { Request, Response } from 'express'          // No HTTP objects in handlers
import { AppAuthGuard } from '../../guards/...'      // No guards in handlers
```

```typescript
// ✅ ALLOWED in Entity:
import { Column, Entity, OneToMany } from 'typeorm'
import { SomeEnum } from '@yugo/shared'
import { OtherEntity } from './other.entity.js'

// ❌ FORBIDDEN in Entity:
import { Injectable } from '@nestjs/common'           // No NestJS DI in entities
import { UserService } from '../..'                   // No service imports
```

### 8.3 Path Alias for Internal Imports

In `apps/api/`, use the `@/` alias for absolute imports within `src/`:

```typescript
// ✅ CORRECT
import { IS_PUBLIC_KEY } from '@/decorators/public.decorator'
import { AppAuthGuard } from '@/guards/app.guard'

// ❌ AVOID — deep relative paths
import { IS_PUBLIC_KEY } from '../../../../../decorators/public.decorator'
```

### 8.4 Circular Dependency Prevention

**Never create circular imports:**
```
❌ ModuleA imports ModuleB → ModuleB imports ModuleA
❌ EntityA imports EntityB → EntityB imports EntityA
❌ Handler imports Controller → Controller imports Handler
```

**Resolution**: Move shared logic to `packages/`, or use DI tokens.

---

## 9. API STANDARDS

### 9.1 REST Conventions

| Method | URL Pattern | Action | Response |
|---|---|---|---|
| `GET` | `/v1/users` | List (paginated) | Paginated list |
| `GET` | `/v1/users/:id` | Get one | Single object |
| `POST` | `/v1/users` | Create | Created object (201) |
| `PATCH` | `/v1/users/:id` | Partial update | Updated object |
| `PUT` | `/v1/users/:id/addresses` | Full replace sub-resource | Updated object |
| `DELETE` | `/v1/users/:id` | Soft delete | 204 No Content |

**Special case**: `GET /v1/users/me` — returns the authenticated user. Controller resolves `'me'` → `req.user.id`.

### 9.2 Versioning

- All controllers must specify `version: '1'` (or higher)
- Controller class prefix must match version: `V1`, `V2`
- New breaking changes → create `v2/` directory with new controller
- **Never** change an existing version's behavior in a breaking way
- Old version remains until deprecated and explicitly removed

```typescript
// ✅ CORRECT
@Controller({ path: 'users', version: '1' })
export class V1UsersController {}

// ❌ WRONG
@Controller('users')   // No version — forbidden
export class UsersController {}
```

### 9.3 Pagination Standard

Use `nestjs-paginate` for ALL list endpoints. Never implement manual pagination.

```typescript
// ✅ CORRECT — declare config as a module-level constant
const PAGINATE_CONFIG: PaginateConfig<UserEntity> = {
    sortableColumns: ['id', 'firstName', 'lastName', 'createdAt'],
    searchableColumns: ['firstName', 'lastName', 'email', 'mobilenumber'],
    defaultLimit: 50,
    multiWordSearch: true,
    filterableColumns: {
        email: [FilterOperator.EQ, FilterOperator.ILIKE],
        active: [FilterOperator.EQ],
        'roles.name': [FilterOperator.EQ, FilterOperator.IN],
    },
    relations: ['roles', 'addresses'],
    defaultSortBy: [['createdAt', 'DESC']],
};

@ApiResource(UserResponse, PAGINATE_CONFIG)
@Get()
async getManyUsers(@Paginate() query: PaginateQuery, @Req() req: Request) {
    const qb = this.datasource.manager.createQueryBuilder(UserEntity, 'user');
    return paginate(query, qb, PAGINATE_CONFIG);
}
```

### 9.4 Standard Response Shapes

**Single object:**
```json
{
    "id": "01JXXXXXXXXXXXXXXXXXXXXXXX",
    "email": "user@example.com",
    "active": true,
    "createdAt": "2026-07-04T06:30:00.000Z"
}
```

**Paginated list:**
```json
{
    "data": [...],
    "meta": {
        "itemsPerPage": 50,
        "totalItems": 200,
        "currentPage": 1,
        "totalPages": 4
    },
    "links": {
        "first": "/v1/users?limit=50",
        "next": "/v1/users?limit=50&page=2",
        "last": "/v1/users?limit=50&page=4"
    }
}
```

**Error:**
```json
{
    "statusCode": 409,
    "message": "Customer with this mobile number already exists.",
    "error": "Conflict"
}
```

### 9.5 HTTP Status Codes

| Scenario | Code | NestJS Exception |
|---|---|---|
| Created | 201 | (POST default) |
| OK | 200 | (GET default) |
| No content | 204 | (DELETE) |
| Not found | 404 | `NotFoundException` |
| Bad input | 400 | `BadRequestException` |
| Unauthenticated | 401 | `UnauthorizedException` |
| Forbidden | 403 | `ForbiddenException` |
| Duplicate | 409 | `ConflictException` |

### 9.6 Swagger & API Documentation Standards (MANDATORY)

Every endpoint must be fully documented using Swagger/OpenAPI. An endpoint without documentation is considered incomplete.

**1. Global Swagger Setup**
Swagger is configured in `apps/api/src/utils/setup_swagger.ts` and initialized in `main.ts`.
It uses `extractInlineSchemas()` to parse TypeBox schemas properly and generates deterministic `operationId`s (e.g., `usersGetOneUser`).

**2. Mandatory Decorators per Controller**
- **`@ApiTags('<domain>')`**: Applied at the class level. Must match the domain (e.g., `'users'`, `'bookings'`).
- **`@ApiBearerAuth()`**: Applied at the class level for protected routes.

**3. Mandatory Decorators per Endpoint**
- **Reads (GET)**: `@ApiResource(ResponseSchema)` or `@ApiResource(ResponseSchema, PAGINATE_CONFIG)`.
- **Writes (POST/PATCH/PUT)**: `@ApiBody({ schema: PayloadSchema })` + `@ApiResource(ResponseSchema)`.
- **No Response (DELETE)**: `@ApiNoContentResponse()`.
- **Custom Operations**: `@ApiOperation({ summary: 'Short desc', description: 'Long desc' })`.

**Example:**
```typescript
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'users', version: '1' })
export class V1UsersController {

    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({ schema: CreateUserPayload })
    @ApiResource(UserResponse)
    @Post()
    async createOneUser(@Body() body: Static<typeof CreateUserPayload>) { ... }
}
```

**4. TypeBox Schema Extraction**
Because we use TypeBox, you do not need to create Swagger `@ApiProperty()` decorators inside DTOs.
Instead, use `@ApiBody({ schema: TypeBoxSchema })`. The custom `extractInlineSchemas` utility in `setup_swagger.ts` automatically converts the TypeBox schema into an OpenAPI specification.

---

## 10. DATABASE & MIGRATION STANDARDS

### 10.1 Migration Rules (CRITICAL)

| Rule | Detail |
|---|---|
| **`synchronize: false` always** | `TypeOrmModule` must have `synchronize: false` in ALL environments. Auto-sync can DROP COLUMNS silently. |
| **Every schema change = a migration** | Adding/removing a column, changing a type, adding an index — all require a migration file. |
| **Always review generated migrations** | `migration:generate` produces SQL — always audit before committing. |
| **Never edit an applied migration** | Once committed and applied, a migration is immutable. Create a new one to correct it. |
| **`up` and `down` both required** | Every migration must have a working `down()` for safe rollback. |
| **One concern per migration** | One migration = one schema change. Do not bundle unrelated changes. |

### 10.2 Migration File Structure

```typescript
// ✅ CORRECT migration
// migrations/1779944369313-AddActiveToUsers.ts
import type { MigrationInterface, QueryRunner } from 'typeorm'

export class AddActiveToUsers1779944369313 implements MigrationInterface {
    name = 'AddActiveToUsers1779944369313'  // Must match class name

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` ADD \`active\` tinyint NOT NULL DEFAULT 1`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` DROP COLUMN \`active\``
        )
    }
}
```

### 10.3 Migration Workflow

```
STEP 1: Modify the entity file
        (e.g., add @Column('varchar') notes: string to UserEntity)

STEP 2: Generate migration
        npx typeorm migration:generate migrations/AddNotesToUsers --dataSource <path>

STEP 3: Review generated SQL
        • Does the SQL match your intent?
        • Is down() correct and safe?
        • Are there unexpected DROP statements?

STEP 4: Commit both files:
        • Entity change
        • Migration file

STEP 5: Apply to database
        npx typeorm migration:run --dataSource <path>

STEP 6: Rollback if needed
        npx typeorm migration:revert --dataSource <path>
```

### 10.4 Database Naming Standards

| Object | Convention | Example |
|---|---|---|
| Table name | Plural, `snake_case`, explicit | `battery_swap_histories` |
| Column name | `camelCase` (TypeORM default) | `firstName`, `createdAt` |
| FK column | `<relation>Id` camelCase | `stationId`, `userPlanId` |
| Enum values | `snake_case` strings | `'in_transit'`, `'battery_swap'` |
| Join table | Auto-named by TypeORM | `users_roles_roles` |

---

## 11. CODE REVIEW STANDARDS

### 11.1 Mandatory Review Checklist

Every pull request must pass ALL items. Failure on any item is grounds for rejection.

#### ARCHITECTURE
```
□ File is in the correct folder per this rulebook
□ Naming follows conventions (file, class, method)
□ No code placed in the wrong layer
□ Dependencies flow in the correct direction
□ No circular imports introduced
□ Feature belongs to the correct module
```

#### ENTITY & DATABASE
```
□ Entity extends IdTimestamppedEntity
□ Entity lives in packages/nestjs/database/src/entities/
□ Entity is exported from entities/index.ts
□ No entity is duplicated or recreated elsewhere
□ onDelete specified on ALL relations
□ FK column declared alongside every relation
□ Migration file accompanies every entity schema change
□ synchronize: false unchanged
□ Migration has working up() and down()
□ Migration SQL manually reviewed
```

#### CQRS
```
□ All write operations use Command + CommandHandler
□ Command is a pure data container (no logic)
□ Handler uses manager.transaction() for multi-step writes
□ Handler never accesses HTTP Request/Response objects
□ Handler returns complete entity with needed relations
□ Handler is registered in its module's providers array
□ Query handlers do not write to the database
```

#### CONTROLLER
```
□ Controller method is ≤ 15 lines
□ Authorization check (accessService.hasAbility) present for protected routes
□ No business logic in controller methods
□ No raw TypeORM writes in controller methods
□ @ApiTags, @ApiBearerAuth, @ApiResource/@ApiBody present
□ @UseGuards(AppAuthGuard) applied at class level
□ Version specified in @Controller decorator
```

#### DTO
```
□ Payloads use TypeBox Type.Object
□ Enums come from @yugo/shared
□ Response schema excludes password, deletedAt, internal fields
□ @ApiResource applied to every endpoint
□ @ApiBody applied to every POST/PATCH/PUT endpoint
```

#### REUSABILITY
```
□ Pre-code checklist (Section 7.1) completed
□ No duplicate entity created
□ No duplicate enum created
□ No duplicate utility function created
□ No duplicate command/query created
```

#### PERFORMANCE
```
□ No N+1 query patterns
□ Relations eagerly loaded in a single query where needed
□ No duplicate database calls for the same data
□ Transactions used only for atomic multi-writes
□ QueryBuilder used for paginated list endpoints
```

#### SECURITY
```
□ Response schema filters out sensitive fields
□ No hardcoded secrets in code
□ Authorization checks present on all non-public endpoints
□ @Public() applied only where truly needed
□ JWT blacklist check intact in JwtStrategy
```

---

## 12. AI DEVELOPMENT WORKFLOW

Before generating any code, an AI agent MUST execute each step in this workflow. Skipping steps produces incorrect, non-compliant code.

### STEP 1 — Analyze Project Structure
```
READ apps/api/src/modules/                     → List all existing modules
READ packages/nestjs/cqrs/src/commands/impl/   → List all existing commands
READ packages/nestjs/cqrs/src/queries/impl/    → List all existing queries
READ packages/nestjs/database/src/entities/    → List all existing entities
```

### STEP 2 — Analyze the Target Module
```
If module exists:
    READ <module>/<domain>.module.ts            → What is already declared?
    READ <module>/controllers/v1/*.ts           → What routes exist?
    READ <module>/dtos/payloads.ts              → What input schemas exist?
    READ <module>/dtos/responses.ts             → What output schemas exist?
    READ <module>/services/                     → What services exist?
```

### STEP 3 — Analyze Existing Entities
```
For each entity relevant to the task:
    READ packages/nestjs/database/src/entities/<entity>.entity.ts
    IDENTIFY all columns, relations, decorators, onDelete behavior
    NOTE existing foreign keys
```

### STEP 4 — Analyze Existing Commands and Queries
```
CHECK packages/nestjs/cqrs/src/commands/impl/<domain>/
CHECK packages/nestjs/cqrs/src/commands/handlers/<domain>/
CHECK packages/nestjs/cqrs/src/queries/impl/<domain>/
CHECK packages/nestjs/cqrs/src/queries/handlers/<domain>/

QUESTION: Does a command/query already exist for this operation?
    YES → Reuse or extend it.
    NO  → Proceed to create new.
```

### STEP 5 — Analyze Shared Enums and Types
```
READ packages/shared/shared/src/               → What enums exist?
READ packages/shared/permissions/src/          → What subjects and actions exist?
IDENTIFY required enums for new entities or DTOs
```

### STEP 6 — Check for Reusable Utilities
```
READ packages/shared/utils/src/                → What utility functions exist?
READ packages/nestjs/cqrs/src/utils/           → What shared CQRS utils exist?

QUESTION: Is any needed computation already implemented?
    YES → Import it. Do not re-implement.
    NO  → Create in appropriate utils folder.
```

### STEP 7 — Check Permissions
```
READ packages/shared/permissions/src/permissions.ts
READ packages/shared/permissions/src/subjects.ts

QUESTION: Does the new feature need a new subject or action?
    YES → Add to permissions.ts and subjects.ts before writing controller code
    NO  → Use existing Actions and Subjects
```

### STEP 8 — Generate Architecture Plan

Produce a textual plan before writing any code:

```
NEW FEATURE: <description>

Files to CREATE:
  - packages/nestjs/cqrs/src/commands/impl/<domain>/<action>-<resource>.command.ts
  - packages/nestjs/cqrs/src/commands/handlers/<domain>/<action>-<resource>.handler.ts
  - [migration if entity schema changes]

Files to MODIFY:
  - apps/api/src/modules/<domain>/controllers/v1/<domain>.controller.ts
  - apps/api/src/modules/<domain>/dtos/payloads.ts
  - apps/api/src/modules/<domain>/dtos/responses.ts
  - apps/api/src/modules/<domain>/<domain>.module.ts (register handler in providers)
  - packages/nestjs/cqrs/src/commands/handlers/index.ts (export new handler)
  - packages/nestjs/cqrs/src/commands/impl/index.ts (export new command)

Entities REUSED (not created):
  - UserEntity, RoleEntity

Enums REUSED:
  - Gender from @yugo/shared
```

### STEP 9 — Generate Code (Dependency Order)
```
1. Entity changes (if any)
2. Migration file (if entity changed)
3. Enum additions (if any)
4. Command definition
5. Command handler
6. DTO payload schema
7. DTO response schema
8. Controller route method
9. Module providers update
10. Index.ts exports update
```

### STEP 10 — Self-Review Against This Rulebook
```
□ Naming is correct
□ File placement is correct
□ No forbidden imports
□ Layer responsibilities respected
□ Reusability checklist completed
□ CQRS pattern correctly implemented
□ Entity extends base class
□ DTOs use TypeBox
□ Controller is thin (≤ 15 lines per method)
□ Swagger decorators present
□ Handler registered in module providers
□ Exports updated in index files
```

### STEP 11 — Validate Against Golden Rules

Check all 50 Golden Rules (Section 15) against the generated code.

### STEP 12 — Produce Final Validated Code

Output with:
- File paths clearly labeled
- Summary of files created vs. modified
- Any required migration SQL noted
- Any new permissions/subjects noted

---

## 13. ENTERPRISE FOLDER STRUCTURE

This is the canonical, complete folder structure for an enterprise NestJS + CQRS monorepo. Every file in any project following this architecture must be placeable within this structure.

```
my-project-root/
├── apps/
│   └── api/
│       ├── .env.example                           ← Document ALL required env variables
│       ├── nest-cli.json
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── main.ts                            ← Bootstrap only
│           ├── app.module.ts                      ← Root module, global wiring
│           │
│           ├── config/                            ← One file per external service
│           │   ├── database.config.ts
│           │   ├── jwt.config.ts
│           │   ├── redis.config.ts
│           │   ├── inngest.config.ts              ← Background jobs config
│           │   ├── third-party-api.config.ts      ← E.g., Stripe, Twilio, SendGrid
│           │   └── index.ts                       ← Re-export all configs
│           │
│           ├── guards/
│           │   └── app.guard.ts                   ← AppAuthGuard (JWT)
│           │
│           ├── interceptors/
│           │   └── typebox-serializer.interceptor.ts
│           │
│           ├── decorators/
│           │   ├── public.decorator.ts            ← @Public()
│           │   ├── serialize.decorator.ts         ← @Serialize()
│           │   ├── api-resource.decorator.ts      ← @ApiResource()
│           │   └── auth-user.decorator.ts         ← @AuthUser()
│           │
│           ├── strategies/
│           │   └── jwt.strategy.ts
│           │
│           ├── dtos/
│           │   └── responses.ts                   ← Global wrappers (e.g. PaginatedListResponse)
│           │
│           ├── types/
│           │   └── express.d.ts                   ← Extends Request with req.user
│           │
│           ├── utils/
│           │   ├── setup_swagger.ts
│           │   └── extract-openapi-schemas.ts
│           │
│           └── modules/                           ← Feature modules (one per domain)
│               ├── auth/
│               │   ├── auth.module.ts
│               │   ├── controllers/v1/auth.controller.ts
│               │   ├── services/
│               │   │   ├── token.service.ts
│               │   │   ├── otp.service.ts
│               │   │   └── otp-service.interface.ts
│               │   └── dtos/
│               │       ├── payloads.ts
│               │       └── responses.ts
│               │
│               ├── users/
│               │   ├── users.module.ts
│               │   ├── controllers/v1/users.controller.ts
│               │   └── dtos/
│               │       ├── payloads.ts
│               │       └── responses.ts
│               │
│               ├── feature-a/                     ← E.g., orders, bookings, products
│               ├── feature-b/
│               └── feature-c/
│
├── packages/                                      ← Shared libraries (not deployable on their own)
│   ├── nestjs/
│   │   ├── cqrs/
│   │   │   ├── package.json                       ← name: "@my-org/cqrs"
│   │   │   └── src/
│   │   │       ├── index.ts                       ← Public API surface
│   │   │       ├── commands/
│   │   │       │   ├── index.ts
│   │   │       │   ├── impl/
│   │   │       │   │   ├── index.ts
│   │   │       │   │   ├── users/
│   │   │       │   │   │   ├── index.ts
│   │   │       │   │   │   ├── create-user.command.ts
│   │   │       │   │   │   └── update-user.command.ts
│   │   │       │   │   ├── feature-a/
│   │   │       │   │   └── feature-b/
│   │   │       │   └── handlers/
│   │   │       │       ├── index.ts
│   │   │       │       ├── users/
│   │   │       │       │   ├── index.ts
│   │   │       │       │   ├── create-user.handler.ts
│   │   │       │       │   └── update-user.handler.ts
│   │   │       │       └── ... (mirrors impl/ structure)
│   │   │       ├── queries/
│   │   │       │   ├── impl/
│   │   │       │   └── handlers/
│   │   │       │       ├── feature-a/
│   │   │       │       └── feature-b/
│   │   │       ├── types/
│   │   │       └── utils/
│   │   │           └── kyc-status.ts              ← computeKycStatus()
│   │   │
│   │   ├── database/
│   │   │   ├── package.json                       ← name: "@my-org/nestjs-database"
│   │   │   └── src/
│   │   │       ├── index.ts
│   │   │       └── entities/
│   │   │           ├── index.ts                   ← EXPORTS ALL ENTITIES
│   │   │           ├── id-timestampped.entity.ts  ← BASE ENTITY (all extend this)
│   │   │           ├── user.entity.ts
│   │   │           ├── role.entity.ts
│   │   │           ├── feature-a.entity.ts
│   │   │           └── feature-b.entity.ts
│   │   │
│   │   ├── casl/
│   │   │   ├── package.json                       ← name: "@my-org/nestjs-casl"
│   │   │   └── src/
│   │   │       ├── index.ts
│   │   │       ├── casl.module.ts
│   │   │       ├── access.service.ts
│   │   │       ├── access.guard.ts
│   │   │       └── actions.enum.ts
│   │   │
│   │   ├── inngest/                               ← Background jobs package
│   │   │   ├── package.json                       ← name: "@my-org/nestjs-inngest"
│   │   │   └── src/
│   │   │       ├── index.ts
│   │   │       ├── nestjs-inngest.module.ts
│   │   │       ├── configurable.module.ts
│   │   │       ├── decorators.ts
│   │   │       ├── constants.ts
│   │   │       └── types.ts
│   │   │
│   │   └── notification/                          ← E.g. FCM, Email, SMS abstractions
│   │       ├── package.json
│   │       └── src/
│   │
│   └── shared/
│       ├── shared/
│       │   ├── package.json                       ← name: "@my-org/shared"
│       │   └── src/
│       │       ├── index.ts
│       │       └── enums/
│       │           ├── roles.enum.ts
│       │           └── global-status.enum.ts
│       │
│       ├── permissions/
│       │   ├── package.json                       ← name: "@my-org/permissions"
│       │   └── src/
│       │       ├── index.ts
│       │       ├── permissions.ts                 ← The policy map
│       │       ├── subjects.ts                    ← Subject class definitions
│       │       └── actions.enum.ts
│       │
│       └── utils/
│           ├── package.json                       ← name: "@my-org/utils"
│           └── src/
│
└── migrations/
    ├── 1778502053570-Baseline.ts                  ← Baseline (all tables)
    ├── 1778741674516-AddRoleToUsers.ts
    └── ...                                        ← Chronological, one per schema change
```

---

## 14. PERFORMANCE RULES

### 14.1 N+1 Query Prevention

An N+1 query fires one query for a list then N separate queries per item. This is a critical performance defect.

```typescript
// ❌ FORBIDDEN — N+1 pattern
const users = await manager.find(UserEntity);
for (const user of users) {
    // This fires N separate queries for N users!
    user.roles = await manager.find(RoleEntity, { where: { userId: user.id } });
}

// ✅ CORRECT — eager load all relations in a single query
const users = await manager.find(UserEntity, {
    relations: { roles: true, addresses: { city: true } },
});

// ✅ CORRECT — QueryBuilder for complex joins
const qb = manager
    .createQueryBuilder(UserEntity, 'user')
    .leftJoinAndSelect('user.roles', 'role')
    .leftJoinAndSelect('user.addresses', 'address')
    .where('user.active = :active', { active: true });
```

### 14.2 Duplicate Database Call Prevention

```typescript
// ❌ FORBIDDEN — fetching the same entity twice
const user = await manager.findOne(UserEntity, { where: { id } });
// ... logic ...
const sameUser = await manager.findOne(UserEntity, { where: { id } }); // DUPLICATE

// ✅ CORRECT — load all needed data upfront in one query
const user = await manager.findOne(UserEntity, {
    where: { id },
    relations: { roles: true, addresses: true, kycs: true },
});
```

### 14.3 Transaction Discipline

```typescript
// ❌ WRONG — transaction around read-only operation (unnecessary overhead)
return manager.transaction(async (txManager) => {
    return txManager.findOne(UserEntity, { where: { id } });
});

// ✅ CORRECT — transactions only for multi-step writes that must be atomic
return manager.transaction(async (txManager) => {
    await txManager.save(user);
    await txManager.save(address);
    return txManager.findOne(UserEntity, { where: { id: user.id }, relations: { ... } });
});
```

### 14.4 Thin Controller Enforcement

```typescript
// ❌ FORBIDDEN — fat controller (business logic in controller)
async createOneUser(@Body() body, @Req() req) {
    const role = await this.datasource.manager.findOne(RoleEntity, { where: { name: body.role } });
    if (!role) throw new BadRequestException('...');
    const existing = await this.datasource.manager.findOne(UserEntity, { where: { mobilenumber: body.mobilenumber } });
    if (existing) throw new ConflictException('...');
    const user = this.datasource.manager.create(UserEntity, body);
    await this.datasource.manager.save(user);
    return user;
    // ← VIOLATION: 8+ lines of business logic
}

// ✅ CORRECT — thin controller (3 lines)
async createOneUser(@Body() body: Static<typeof CreateUserPayload>, @Req() req: Request) {
    if (!this.accessService.hasAbility(req.user, Actions.create, new UserSubject())) {
        throw new ForbiddenException('not allowed');
    }
    return this.commandBus.execute(new CreateUserCommand(body));
}
```

### 14.5 Relation Loading Rules

| Scenario | Rule |
|---|---|
| Single entity with relations | `findOne` with `relations` option |
| List with relations | `find` with `relations` option OR QueryBuilder |
| Complex filtering + relations | Always use QueryBuilder |
| Counting related entities | QueryBuilder `COUNT` — never load full relation to count |
| Pagination | Always `nestjs-paginate` with QueryBuilder — never manual slicing |

### 14.6 Inngest Side Effects

Long-running operations (email, push notifications, KYC verification, payment processing) must be dispatched to Inngest — never awaited inline in an HTTP request handler:

```typescript
// ❌ WRONG — inline side effect blocks response
await sendPushNotification(user.deviceToken, message); // Can take 500ms+

// ✅ CORRECT — fire-and-forget via Inngest
await this.inngest.send({
    name: 'notification/send.push',
    data: { userId: user.id, message },
});
// Returns immediately; Inngest handles it asynchronously with retries
```

---

## 15. THE 50 GOLDEN RULES

These are non-negotiable engineering laws. Any violation is a blocking code review finding.

### Architecture Laws

**Rule 1**: Every file has exactly one responsibility. A file that does two things must be split into two files.

**Rule 2**: Dependencies flow downward only. Controller → Handler → Entity → Database. No layer imports from a layer above it.

**Rule 3**: Business logic belongs in Command Handlers and Query Handlers. It never belongs in Controllers, Guards, or Interceptors.

**Rule 4**: Feature boundaries are sacred. One module owns one domain. Modules do not reach into each other's internal files.

**Rule 5**: `packages/` contains shared code. `apps/` contains app-specific code. When code needs to be used by more than one app, it moves to `packages/`.

**Rule 6**: Every new feature fits naturally into the existing folder structure. If it does not, discuss the architecture before writing any code.

### Entity Laws

**Rule 7**: All entities live in `packages/nestjs/database/src/entities/`. No entity is ever defined anywhere else.

**Rule 8**: All entities extend `IdTimestamppedEntity`. No exceptions. No custom primary keys. No auto-increment integers.

**Rule 9**: All entity primary keys are ULIDs assigned by the `@BeforeInsert` hook. Never manually assign integer IDs.

**Rule 10**: Never duplicate an entity. Search all existing entities before creating. If `UserEntity` exists, use `UserEntity`.

**Rule 11**: Every relation must declare `onDelete` behavior: `'CASCADE'`, `'SET NULL'`, or `'RESTRICT'`. Omitting `onDelete` is a defect.

**Rule 12**: Every `@ManyToOne` or owning `@OneToOne` must have a corresponding `@Column` for the FK (e.g., `stationId: string`).

**Rule 13**: Entities contain zero business logic, zero validation, zero methods — except `@BeforeInsert` for ULID generation only.

**Rule 14**: All enums used in entity columns come from `packages/shared/shared/`. Never define inline enums in entities.

**Rule 15**: Soft delete is the default. Never call `manager.delete()` or `manager.remove()` for business data unless explicitly required by a spec.

### CQRS Laws

**Rule 16**: Every write operation that touches the database goes through a Command and a CommandHandler.

**Rule 17**: Command classes are pure data containers. A command class has only a constructor and readonly properties. Zero logic.

**Rule 18**: Every `CommandHandler.execute()` that performs more than one database write wraps them in `manager.transaction()`.

**Rule 19**: Command Handlers never access `Request`, `Response`, or any HTTP object.

**Rule 20**: Query Handlers never write to the database.

**Rule 21**: A handler is registered in the `providers` array of the module that uses it. A handler missing from `providers` will be silently ignored by the CommandBus.

**Rule 22**: Every new Command class is exported from its domain `index.ts` and from the package root `index.ts`.

### Controller Laws

**Rule 23**: Controllers are thin. The maximum permitted length of a single route handler method is 15 lines.

**Rule 24**: Every write route handler dispatches a Command. Direct `manager.save()` in a write controller method is forbidden.

**Rule 25**: Every protected route method begins with an `accessService.hasAbility()` check.

**Rule 26**: Every controller class applies `@UseGuards(AppAuthGuard)` at the class level, not per-method.

**Rule 27**: Every controller specifies a `version` in the `@Controller()` decorator.

**Rule 28**: Every controller endpoint has Swagger documentation: `@ApiTags`, `@ApiBearerAuth`, `@ApiResource` or `@ApiBody`.

**Rule 29**: `@Public()` is applied only to routes that genuinely require no authentication. Applying it to a protected route is a security defect.

### DTO Laws

**Rule 30**: All DTOs use TypeBox (`@sinclair/typebox`). Do not introduce `class-validator`, Zod, or any other schema library.

**Rule 31**: Response schemas never include `password`, `deletedAt`, internal tokens, or any field clients must not see.

**Rule 32**: `Type.Partial()` is the standard pattern for update (PATCH) schemas. Never rewrite all fields manually.

**Rule 33**: Enum types in DTOs always come from `@yugo/shared`. Never use `Type.Union([Type.Literal(...)])` for business-domain enums.

**Rule 34**: The `TypeboxSerializerInterceptor` is global. Fields not in the response schema are stripped automatically. Trust the schema — design it by inclusion, not exclusion.

### Database & Migration Laws

**Rule 35**: `synchronize: false` is absolute. It is never changed to `true` in any environment.

**Rule 36**: Every schema change requires a migration file. No entity change reaches production without a corresponding migration.

**Rule 37**: Migration files are never edited after being applied to any environment. Create a new migration to correct a mistake.

**Rule 38**: Every migration has a working `down()` method. A migration without a rollback path is a deployment risk.

**Rule 39**: Generated migrations are always reviewed manually before committing. Never blindly commit auto-generated SQL.

**Rule 40**: Table names are plural, `snake_case`, explicitly declared in `@Entity({ name: '...' })`.

### Reusability Laws

**Rule 41**: The pre-code reusability checklist (Section 7.1) is completed before writing any new code.

**Rule 42**: If a command already exists for an operation, extend its payload rather than creating a parallel command.

**Rule 43**: If a utility function exists in `packages/shared/utils/`, import it. Creating a duplicate in `apps/` is a violation.

**Rule 44**: If an enum exists in `@yugo/shared`, import it. Creating a local copy anywhere is a violation.

**Rule 45**: `computeKycStatus()` from `@yugo/cqrs` is the canonical KYC status calculator. All code needing KYC status uses this function.

### Security Laws

**Rule 46**: No hardcoded credentials, API keys, secrets, or passwords in source code. All secrets come from environment variables.

**Rule 47**: JWT token blacklisting (Redis check in `JwtStrategy`) must remain intact. It must not be removed or bypassed.

**Rule 48**: The `active` flag on `UserEntity` is checked in `JwtStrategy`. An inactive user receives `401` on every request.

**Rule 49**: The CASL permission system is the authorization layer. Do not bypass it with manual role string comparisons outside of `AccessService`.

**Rule 50**: Every field in a response DTO is intentional and explicitly declared. The response schema is a whitelist. Design it by adding fields the client should see — not by removing fields you want to hide.

---

## APPENDIX A — Quick Decision Reference

```
QUESTION: Where does this code go?

Is it an HTTP endpoint handler?
  → apps/api/src/modules/<domain>/controllers/v1/<domain>.controller.ts

Is it a write operation (create, update, delete)?
  → Command: packages/nestjs/cqrs/src/commands/impl/<domain>/
  → Handler: packages/nestjs/cqrs/src/commands/handlers/<domain>/

Is it a read operation used across multiple apps?
  → Query:   packages/nestjs/cqrs/src/queries/impl/<domain>/
  → Handler: packages/nestjs/cqrs/src/queries/handlers/<domain>/

Is it a simple read used only in one controller?
  → Use DataSource directly in the controller method

Is it a database table definition?
  → packages/nestjs/database/src/entities/<name>.entity.ts

Is it request body validation?
  → apps/api/src/modules/<domain>/dtos/payloads.ts

Is it a response shape definition?
  → apps/api/src/modules/<domain>/dtos/responses.ts

Is it an external API integration (OTP, payment, FCM)?
  → Service: apps/api/src/modules/<domain>/services/<name>.service.ts
  → OR: packages/nestjs/<name>/ if shared across apps

Is it an authentication check?
  → apps/api/src/guards/app.guard.ts

Is it a response transformation?
  → apps/api/src/interceptors/

Is it a shared TypeScript enum or type?
  → packages/shared/shared/src/

Is it a role-action-subject permission policy?
  → packages/shared/permissions/src/permissions.ts

Is it a database schema change?
  → migrations/<timestamp>-<Description>.ts

Is it server configuration?
  → apps/api/src/config/<service>.config.ts

Is it a background/async job?
  → Use inngest.send() from the command handler, decorated method in any provider
```

---

## APPENDIX B — Glossary

| Term | Definition |
|---|---|
| **Command** | CQRS intent object for a write operation. Carries data, no logic. |
| **CommandHandler** | NestJS provider that executes a Command's business logic. |
| **Query** | CQRS intent object for a read operation. |
| **QueryHandler** | NestJS provider that executes a Query's data fetching. |
| **CASL** | Authorization library. Defines what roles can do to subjects. |
| **AccessService** | CASL service answering `hasAbility(user, action, subject)`. |
| **Entity** | TypeORM class mapped to a database table. |
| **Migration** | Versioned file describing a schema change with `up()` and `down()`. |
| **DTO** | Data Transfer Object. Defines the shape of API input/output. |
| **TypeBox** | Schema library providing runtime validation + static TypeScript types. |
| **ULID** | Universally Unique Lexicographically Sortable Identifier. Primary key format. |
| **Inngest** | Background job/workflow platform. Runs async tasks with retries. |
| **Monorepo** | Single repository containing multiple apps and shared packages. |
| **DI** | Dependency Injection. NestJS pattern where classes receive dependencies via constructors. |
| **Soft Delete** | Marking a record as deleted via `deletedAt` without physically removing it. |
| **Guard** | NestJS class that decides if a request is allowed to proceed. |
| **Interceptor** | NestJS class that transforms requests/responses. |
| **Strategy** | Passport.js authentication strategy (JWT validation). |
| **`@Public()`** | Decorator marking a route as not requiring authentication. |
| **`APP_GUARD`** | NestJS DI token to register a guard globally for every route. |
| **`APP_INTERCEPTOR`** | NestJS DI token to register an interceptor globally for every route. |
| **`@InngestFunction`** | Decorator marking a method as an Inngest background job handler. |
| **`computeKycStatus()`** | Canonical utility to compute KYC status from a user's kyc records. |

---

*This document is maintained by the backend engineering team.*
*Derived from the Yugo production codebase.*
*Version: 1.0 — Last updated: 2026-07-04*
