# Yugo Core Architecture Documentation

> **Version:** 1.0  
> **Last Updated:** April 2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [Monorepo Structure](#2-monorepo-structure)
3. [System Architecture](#3-system-architecture)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [Data Flow](#6-data-flow)
7. [Shared Libraries & Packages](#7-shared-libraries--packages)
8. [Environment & Configuration](#8-environment--configuration)
9. [Scalability & Design Decisions](#9-scalability--design-decisions)
10. [Developer Workflow](#10-developer-workflow)

---

## 1. Overview

### What is Yugo?

Yugo is a **vehicle rental and battery swap management platform** designed for electric mobility services. The platform supports:

- **End Users (Customers):** Rent vehicles, purchase plans, book rides, manage KYC
- **Station Managers:** Swap station and hub managers handling vehicle assignments, battery swaps
- **System Administrators:** Full platform management via backoffice

### Purpose of the Monorepo

The Yugo monorepo consolidates all platform components into a single repository, enabling:

- **Shared code** across frontend and backend
- **Unified tooling** (linting, formatting, building)
- **Consistent versioning** and dependency management
- **Atomic changes** across multiple services

### Key Design Principles

| Principle                  | Implementation                                            |
| -------------------------- | --------------------------------------------------------- |
| **Separation of Concerns** | CQRS pattern for read/write operations                    |
| **Type Safety**            | TypeScript end-to-end, TypeBox schemas for API validation |
| **Role-Based Access**      | CASL-based permission system                              |
| **Modularity**             | Domain-driven module structure                            |
| **Consistency**            | Strict kebab-case file naming, shared configurations      |

---

## 2. Monorepo Structure

### Turborepo Setup

Yugo uses **Turborepo** for monorepo orchestration with Yarn 4 workspaces.

```
yugo-app/
├── apps/                    # Deployable applications
│   ├── api/                 # NestJS REST API
│   ├── app/                 # React Native mobile app (Expo)
│   ├── backoffice/          # React Router admin dashboard
│   ├── cli/                 # NestJS CLI tools
│   └── henchmen/            # Background worker service
├── packages/
│   ├── nestjs/              # Backend-specific packages
│   │   ├── casl/            # Permission management
│   │   ├── cqrs/            # Commands & Queries
│   │   ├── database/        # TypeORM entities
│   │   └── framework/       # Common NestJS utilities
│   └── shared/              # Cross-platform packages
│       ├── eslint/          # Shared ESLint config
│       ├── permissions/     # CASL permission definitions
│       ├── shared/          # Enums, types, constants
│       ├── tsconfig/        # Shared TypeScript configs
│       └── utils/           # Common utility functions
├── migrations/              # Database migrations
├── docs/                    # Documentation
├── turbo.json               # Turborepo configuration
└── package.json             # Root workspace config
```

### Package Responsibilities

| Package                 | Scope   | Purpose                                 |
| ----------------------- | ------- | --------------------------------------- |
| `@yugo/api`             | Backend | Main REST API service                   |
| `@yugo/app`             | Mobile  | Customer-facing React Native app        |
| `@yugo/backoffice`      | Web     | Admin dashboard (React Router)          |
| `@yugo/cli`             | Backend | Database migrations, seeding, utilities |
| `@yugo/henchmen`        | Backend | Background job processing               |
| `@yugo/cqrs`            | Backend | Command/Query handlers                  |
| `@yugo/nestjs-database` | Backend | TypeORM entity definitions              |
| `@yugo/nestjs-casl`     | Backend | NestJS CASL integration                 |
| `@yugo/permissions`     | Shared  | Role-based permission definitions       |
| `@yugo/shared`          | Shared  | Enums, types, constants                 |

---

## 3. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                     │
├─────────────────────────────┬───────────────────────────────────────────┤
│     Mobile App (Expo)       │         Backoffice (React Router)         │
│  • Customer Portal          │      • Admin Dashboard                    │
│  • Hub/Swap Manager Views   │      • User Management                    │
│  • KYC, Bookings, Plans     │      • Station/Vehicle Management         │
└─────────────┬───────────────┴───────────────────┬───────────────────────┘
              │                                   │
              │            HTTPS/REST             │
              ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY                                    │
│                        (NestJS + Express)                                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │   Auth     │  │   Users    │  │  Bookings  │  │  Stations  │        │
│  │  Module    │  │  Module    │  │   Module   │  │   Module   │        │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘        │
│        │               │               │               │                │
│        └───────────────┴───────┬───────┴───────────────┘                │
│                                │                                         │
│                    ┌───────────▼───────────┐                            │
│                    │   CQRS Command Bus    │                            │
│                    │   (Commands/Queries)  │                            │
│                    └───────────┬───────────┘                            │
└────────────────────────────────┼────────────────────────────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
      ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
      │    MySQL      │  │    Redis      │  │      S3       │
      │  (TypeORM)    │  │   (Cache/     │  │   (Files,     │
      │               │  │   Sessions)   │  │   QR Codes)   │
      └───────────────┘  └───────────────┘  └───────────────┘
```

### Communication Patterns

| Pattern                  | Usage                               |
| ------------------------ | ----------------------------------- |
| **REST API**             | Primary client-server communication |
| **JWT Authentication**   | Stateless auth with Redis blacklist |
| **CQRS**                 | Segregated read/write operations    |
| **TypeORM Transactions** | Atomic database operations          |
| **Redis**                | Session blacklisting, caching       |

---

## 4. Frontend Architecture

### 4.1 Mobile App (`apps/app`)

#### Tech Stack

| Technology         | Purpose                                |
| ------------------ | -------------------------------------- |
| **React Native**   | Cross-platform mobile framework        |
| **Expo**           | Development tooling and native modules |
| **Expo Router**    | File-based navigation                  |
| **NativeWind**     | Tailwind CSS for React Native          |
| **TanStack Query** | Server state management                |
| **Zustand**        | Client state management                |
| **xior**           | HTTP client (axios alternative)        |
| **i18next**        | Internationalization                   |

#### Folder Structure

```
apps/app/src/
├── app/                    # Expo Router screens
│   ├── (app)/              # Authenticated routes
│   ├── customer/           # Customer-specific screens
│   ├── hub-manager/        # Hub manager screens
│   ├── swap-manager/       # Swap manager screens
│   ├── login.tsx           # Login screen
│   └── onboarding.tsx      # Onboarding flow
├── auth/                   # Authentication flows
├── components/             # Reusable UI components
├── data/                   # Static data/mocks
├── feed/                   # Feed-related components
├── lib/
│   ├── api/                # API client configuration
│   ├── auth/               # Auth utilities
│   ├── hooks/              # Custom React hooks
│   ├── i18n/               # Internationalization setup
│   └── storage.tsx         # Secure storage utilities
├── onboarding/             # Onboarding components
├── services/
│   └── api/                # Auto-generated API client
└── translations/           # i18n translation files
```

#### API Integration

The mobile app uses **auto-generated API clients** from OpenAPI/Swagger specifications:

```typescript
// services/api.ts
import { Api } from './api/codegen/Api'

export const client = new Api({
    baseURL: Env.EXPO_PUBLIC_API_URL,
})

// Automatic JWT injection via interceptor
client.instance.interceptors.request.use(async (config) => {
    const tokens = getToken()
    if (tokens?.access) {
        config.headers['Authorization'] = `Bearer ${tokens.access}`
    }
    return config
})
```

#### State Management Strategy

| State Type   | Solution                  | Example                    |
| ------------ | ------------------------- | -------------------------- |
| Server State | TanStack Query            | User data, bookings, plans |
| Auth State   | Zustand + SecureStorage   | JWT tokens, user session   |
| UI State     | React useState/useReducer | Form inputs, modals        |

### 4.2 Backoffice (`apps/backoffice`)

#### Purpose

The backoffice is an **admin dashboard** for system administrators to manage:

- Users and roles
- Stations (swap stations, charging hubs)
- Vehicles and batteries
- Plans and top-ups
- Bookings and assignments

#### Tech Stack

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| **React Router 7** | Full-stack React framework |
| **Radix UI**       | Accessible UI primitives   |
| **TanStack Query** | Server state management    |
| **TanStack Table** | Data tables                |
| **Tailwind CSS**   | Styling                    |
| **Recharts**       | Data visualization         |

#### Key Modules

```
apps/backoffice/app/routes/
├── dashboard.tsx           # Main dashboard
├── users/                  # User management
├── stations/               # Station CRUD
├── vehicles/               # Vehicle management
├── batteries/              # Battery tracking
├── plans/                  # Subscription plans
├── top-up-plans/           # Top-up management
├── assignments/            # Vehicle assignments
├── maintenance/            # Maintenance tracking
├── inactive-vehicles/      # Inactive vehicle list
└── surrender/              # Vehicle surrender
```

---

## 5. Backend Architecture

### 5.1 API (`apps/api`)

#### Tech Stack

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| **NestJS**         | Backend framework          |
| **TypeORM**        | Database ORM               |
| **MySQL**          | Primary database           |
| **Redis**          | Caching, session blacklist |
| **Passport + JWT** | Authentication             |
| **CASL**           | Authorization              |
| **TypeBox**        | Schema validation          |
| **Pino**           | Structured logging         |
| **Swagger/Scalar** | API documentation          |

#### Module Structure

```
apps/api/src/
├── config/                 # Environment configurations
│   ├── database.config.ts
│   ├── jwt.config.ts
│   ├── redis.config.ts
│   ├── s3.config.ts
│   └── logger.config.ts
├── decorators/             # Custom decorators
├── dtos/                   # Global DTOs
├── guards/
│   └── app.guard.ts        # JWT auth guard
├── interceptors/
│   └── typebox-serializer.interceptor.ts
├── modules/
│   ├── auth/               # Authentication
│   ├── users/              # User management
│   ├── kyc/                # KYC verification
│   ├── bookings/           # Booking management
│   ├── stations/           # Station management
│   ├── plans/              # Subscription plans
│   ├── top-ups/            # Top-up management
│   ├── user-plans/         # User plan subscriptions
│   └── country-state-cities/  # Location data
├── strategies/
│   └── jwt.strategy.ts     # Passport JWT strategy
└── utils/                  # Helper utilities
```

#### Request Lifecycle

```
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Express Middleware │  (Helmet, CORS, JSON parsing)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    AppAuthGuard     │  JWT validation via Passport
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   AccessService     │  CASL permission check
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Controller       │  Route handler
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   CommandBus/       │  CQRS dispatch
│   QueryBus          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Command/Query      │  Business logic
│     Handler         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    EntityManager    │  TypeORM operations
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Response         │
└─────────────────────┘
```

#### Domain Modules

| Module         | Responsibilities                             |
| -------------- | -------------------------------------------- |
| **Auth**       | OTP login, JWT issuance, token refresh       |
| **Users**      | User CRUD, role management, address handling |
| **KYC**        | Document verification integration            |
| **Bookings**   | Vehicle booking lifecycle                    |
| **Stations**   | Swap station and hub management              |
| **Plans**      | Subscription plan definitions                |
| **User Plans** | User plan purchases, QR code generation      |
| **Top-ups**    | Wallet top-up management                     |

### 5.2 CLI (`apps/cli`)

#### Purpose

Command-line interface for administrative tasks:

- Database migrations
- Data seeding
- Utility scripts

#### Available Commands

| Command                                  | Description                     |
| ---------------------------------------- | ------------------------------- |
| `yarn cli db migrations:generate <name>` | Generate TypeORM migration      |
| `yarn cli db migrations:run`             | Execute pending migrations      |
| `yarn cli db seed`                       | Seed database with initial data |
| `yarn cli db drop`                       | Drop all database tables        |
| `yarn cli db init`                       | Initialize fresh database       |

#### Seeders

```
apps/cli/src/commands/db/seeders/
├── admin.seeder.ts              # System admin user
├── country-state-cities.seeder.ts  # Geographic data
├── dummy-data.seeder.ts         # Test data
├── roles.seeder.ts              # Role definitions
└── index.ts
```

### 5.3 Henchmen (`apps/henchmen`)

#### Purpose

Background worker service for:

- Asynchronous job processing
- Scheduled tasks
- Long-running operations

#### Current Implementation

The henchmen service is a minimally configured NestJS application with database connectivity, ready for background job implementations.

```typescript
// apps/henchmen/src/app.module.ts
@Module({
    imports: [
        ConfigModule.forRoot({ ... }),
        TypeOrmModule.forRootAsync({ ... }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
```

> **Note:** This service is scaffolded for future task processing (e.g., BullMQ, cron jobs).

---

## 6. Data Flow

### End-to-End Example: User Purchases a Plan

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 1. MOBILE APP                                                            │
│    User selects plan → POST /v1/user-plans                               │
└───────────────────────────────────┬──────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 2. API - USER PLANS CONTROLLER                                           │
│    @UseGuards(AppAuthGuard)                                              │
│    AccessService.hasAbility(user, Actions.create, UserPlanSubject)       │
│    → Dispatches: CreateUserPlanCommand(userId, planId)                   │
└───────────────────────────────────┬──────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 3. CQRS - CREATE USER PLAN HANDLER                                       │
│    manager.transaction(async (txn) => {                                  │
│        1. Validate plan exists                                           │
│        2. Create UserPlanEntity with status PENDING                      │
│        3. Generate QR code with plan metadata                            │
│        4. Upload QR to S3                                                │
│        5. Create FileEntity for QR reference                             │
│        6. Return created UserPlan                                        │
│    })                                                                    │
└───────────────────────────────────┬──────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 4. RESPONSE                                                              │
│    UserPlanResponse { id, status, qrCodeUrl, plan, ... }                 │
└──────────────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Mobile/Web     │     │      API        │     │     Redis       │
│    Client       │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │ POST /v1/auth/otp     │                       │
         │───────────────────────>                       │
         │                       │                       │
         │                       │ Generate/Send OTP     │
         │                       │──────────────────────>│
         │                       │                       │
         │ POST /v1/auth/verify  │                       │
         │───────────────────────>                       │
         │                       │                       │
         │                       │ Validate OTP          │
         │                       │──────────────────────>│
         │                       │                       │
         │ { access, refresh }   │                       │
         │<───────────────────────                       │
         │                       │                       │
         │ GET /v1/users/me      │                       │
         │ Authorization: Bearer │                       │
         │───────────────────────>                       │
         │                       │ Check blacklist       │
         │                       │──────────────────────>│
         │                       │                       │
         │ UserResponse          │                       │
         │<───────────────────────                       │
```

---

## 7. Shared Libraries & Packages

### 7.1 `@yugo/nestjs-database`

TypeORM entity definitions shared across all backend services.

**Key Entities:**

| Entity                                         | Description                              |
| ---------------------------------------------- | ---------------------------------------- |
| `UserEntity`                                   | User accounts with roles, addresses      |
| `RoleEntity`                                   | Role definitions (customer, admin, etc.) |
| `StationEntity`                                | Swap stations and charging hubs (STI)    |
| `VehicleEntity`                                | Vehicle inventory                        |
| `BatteryEntity`                                | Battery tracking                         |
| `BookingEntity`                                | Vehicle booking records                  |
| `PlanEntity`                                   | Subscription plan definitions            |
| `UserPlanEntity`                               | User plan subscriptions                  |
| `AddressEntity`                                | User/station addresses                   |
| `CityEntity` / `StateEntity` / `CountryEntity` | Geographic data                          |

**Base Entity Pattern:**

```typescript
// IdTimestamppedEntity provides: id (ULID), createdAt, updatedAt, deletedAt
export class UserEntity extends IdTimestamppedEntity {
    @Column('varchar')
    email: string
    // ...
}
```

### 7.2 `@yugo/cqrs`

CQRS command and query definitions with handlers.

**Structure:**

```
packages/nestjs/cqrs/src/
├── commands/
│   ├── impl/           # Command classes
│   │   ├── users/
│   │   ├── bookings/
│   │   └── stations/
│   └── handlers/       # Command handlers
│       ├── users/
│       ├── bookings/
│       └── stations/
└── queries/
    ├── impl/           # Query classes
    └── handlers/       # Query handlers
```

### 7.3 `@yugo/nestjs-casl`

NestJS integration for CASL permission management.

**Components:**

- `CaslModule` - NestJS module registration
- `AccessService` - Permission checking service
- `AccessGuard` - Route-level authorization guard

### 7.4 `@yugo/permissions`

Role-based permission definitions using CASL.

**Roles:**

| Role           | Permissions                                        |
| -------------- | -------------------------------------------------- |
| `customer`     | Read plans, create bookings, manage own user plans |
| `swap_manager` | Read and update bookings                           |
| `hub_manager`  | (Configurable)                                     |
| `system_admin` | Full access to all resources                       |

```typescript
// permissions.ts
export const permissions = {
    customer({ can }) {
        can(Actions.read, Subjects.Plan)
        can(Actions.create, Subjects.Booking)
    },
    system_admin({ can, extend }) {
        extend(Roles.CUSTOMER)
        can(Actions.manage, Subjects.User)
        can(Actions.manage, Subjects.Station)
    },
}
```

### 7.5 `@yugo/shared`

Cross-platform shared types and enums.

**Contents:**

```
packages/shared/shared/src/
├── enums/
│   ├── roles.ts         # ApplicationRoles, SystemRoles
│   ├── booking.ts       # BookingStatus
│   ├── plan.ts          # PlanStatus
│   ├── station.ts       # StationType
│   └── user.ts          # Gender, etc.
├── types/               # Shared type definitions
└── constants/           # Application constants
```

---

## 8. Environment & Configuration

### Environment Strategy

| Environment   | Purpose           | API URL                 |
| ------------- | ----------------- | ----------------------- |
| `development` | Local development | `http://localhost:4500` |
| `preview`     | Staging/QA        | Configured via env      |
| `production`  | Production        | Configured via env      |

### Configuration Management

The API uses NestJS `ConfigModule` with typed configuration factories:

```typescript
// apps/api/src/config/
├── database.config.ts   # TypeORM configuration
├── jwt.config.ts        # JWT secret and options
├── redis.config.ts      # Redis connection
├── s3.config.ts         # AWS S3 credentials
├── logger.config.ts     # Pino logger config
└── deepvue.config.ts    # KYC integration config
```

**Example Configuration Factory:**

```typescript
// database.config.ts
export const databaseConfig = registerAs('database', () => ({
    config: {
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        entities: [
            /* entity imports */
        ],
        synchronize: false,
    },
}))
```

### Required Environment Variables

| Variable                                                  | Service            | Description             |
| --------------------------------------------------------- | ------------------ | ----------------------- |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_DATABASE` | API, CLI, Henchmen | MySQL connection        |
| `JWT_SECRET`                                              | API                | JWT signing secret      |
| `REDIS_URL`                                               | API                | Redis connection string |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET` | API                | S3 credentials          |
| `EXPO_PUBLIC_API_URL`                                     | App                | API base URL            |
| `VITE_API_URL`                                            | Backoffice         | API base URL            |

---

## 9. Scalability & Design Decisions

### Why CQRS?

| Benefit                    | Explanation                                           |
| -------------------------- | ----------------------------------------------------- |
| **Separation of concerns** | Read and write paths are independently optimized      |
| **Testability**            | Handlers are isolated units with clear inputs/outputs |
| **Scalability**            | Read/write workloads can be scaled independently      |
| **Audit trail**            | Commands represent explicit business actions          |

### Why CASL for Authorization?

| Benefit                 | Explanation                                           |
| ----------------------- | ----------------------------------------------------- |
| **Declarative**         | Permissions defined in a centralized, readable format |
| **Flexible**            | Supports attribute-based access control (ABAC)        |
| **Extensible**          | Roles can inherit from other roles                    |
| **Frontend compatible** | Same permission logic usable in UI                    |

### Why TypeBox over class-validator?

| Benefit                    | Explanation                        |
| -------------------------- | ---------------------------------- |
| **JSON Schema compatible** | Direct OpenAPI/Swagger integration |
| **Runtime + compile-time** | Types derived from schemas         |
| **Smaller bundle**         | No decorator overhead              |

### Database Design Decisions

| Decision                           | Rationale                                              |
| ---------------------------------- | ------------------------------------------------------ |
| **ULID for primary keys**          | Sortable, URL-safe, no central coordination            |
| **Soft deletes**                   | Audit trail, data recovery                             |
| **Single Table Inheritance (STI)** | Station types share common fields                      |
| **Explicit FK columns**            | `userId` column before `@ManyToOne` for easier queries |

### Trade-offs

| Decision                  | Trade-off                                  |
| ------------------------- | ------------------------------------------ |
| **Monorepo**              | Build complexity vs. code sharing benefits |
| **CQRS everywhere**       | Boilerplate overhead vs. consistency       |
| **Generated API clients** | Build step required vs. type safety        |

---

## 10. Developer Workflow

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd yugo-app

# Install dependencies
yarn install

# Setup environment files
cp apps/api/.env.example apps/api/.env
cp apps/app/.env.example apps/app/.env
cp apps/backoffice/.env.example apps/backoffice/.env

# Initialize database
yarn cli db init
yarn cli db migrations:run
yarn cli db seed
```

### Running the Project

```bash
# Start all services (Turborepo)
yarn dev

# Start individual services
yarn workspace @yugo/api dev
yarn workspace @yugo/app start
yarn workspace @yugo/backoffice dev
```

### Build System

Turborepo handles build orchestration with dependency-aware caching:

```json
// turbo.json
{
    "tasks": {
        "build": {
            "dependsOn": ["^build"],
            "outputs": ["dist/**", "build/**"]
        },
        "dev": {
            "cache": false,
            "persistent": true
        }
    }
}
```

### Adding New Features

#### New API Module

1. Create module folder: `apps/api/src/modules/<module-name>/`
2. Add controller: `controllers/v1/<module-name>.controller.ts`
3. Add DTOs: `dtos/payloads.ts`, `dtos/responses.ts`
4. Create CQRS commands/queries in `packages/nestjs/cqrs/`
5. Register module in `app.module.ts`

#### New Entity

1. Create entity: `packages/nestjs/database/src/entities/<entity-name>.entity.ts`
2. Export from `packages/nestjs/database/src/entities/index.ts`
3. Generate migration: `yarn cli db migrations:generate <MigrationName>`
4. Run migration: `yarn cli db migrations:run`

#### New Mobile Screen

1. Create screen file in `apps/app/src/app/`
2. Follow Expo Router file-based routing conventions
3. Create supporting components in `apps/app/src/components/`

### Code Style Enforcement

| Tool           | Purpose                      |
| -------------- | ---------------------------- |
| **ESLint**     | Code linting (shared config) |
| **Prettier**   | Code formatting              |
| **TypeScript** | Type checking                |
| **Husky**      | Git hooks (app only)         |

### API Documentation

The API auto-generates Swagger/OpenAPI documentation available at:

- **Swagger UI:** `http://localhost:4500/openapi`
- **Scalar:** `http://localhost:4500/reference`

### Code Generation

Both frontend apps use auto-generated API clients:

```bash
# Mobile app
cd apps/app && yarn codegen

# Backoffice
cd apps/backoffice && yarn codegen
```

---

## Appendix

### Key File Naming Conventions

All files must use **kebab-case**:

```
✅ create-user.command.ts
✅ user-plans.controller.ts
✅ booking-status.enum.ts

❌ CreateUserCommand.ts
❌ UserPlansController.ts
❌ BookingStatus.enum.ts
```

### Module File Structure Template

```
modules/<domain>/
├── controllers/
│   └── v1/
│       └── <domain>.controller.ts
├── dtos/
│   ├── payloads.ts
│   └── responses.ts
└── <domain>.module.ts
```

### CQRS File Structure Template

```
packages/nestjs/cqrs/src/commands/
├── impl/<domain>/
│   └── <action>-<entity>.command.ts
└── handlers/<domain>/
    └── <action>-<entity>.handler.ts
```

---

_This document should be updated as the architecture evolves. For implementation details, refer to the source code and inline documentation._
