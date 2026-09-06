# 🚀 Project Technology Stack & Architecture Overview

This document provides a comprehensive breakdown of all the technologies, frameworks, and architectures utilized across the entire Yugo monorepo.

---

## 🏗️ Core Architecture & Tooling (Monorepo)

*   **Turborepo (`turbo`)**: Used to manage the monorepo, build pipelines, and intelligent caching.
*   **Yarn Workspaces**: For managing multiple applications (`apps/*`) and shared internal libraries (`packages/*`) in a single repository.
*   **TypeScript**: Strictly used across all backend and frontend codebases for type safety.
*   **ESLint & Prettier**: Configured in a shared package to enforce consistent code formatting and linting rules across all workspaces.

---

## ⚙️ Backend Services (`apps/api` & `apps/henchmen`)

The backend is split between two separate NestJS applications:
- **`apps/api`** — The primary REST API that handles all HTTP requests from frontend apps.
- **`apps/henchmen`** — A dedicated background job worker that handles all heavy, async operations (push notifications, battery sync, plan activation, email sending) via Inngest.

*   **Henchmen (`apps/henchmen`)**: A standalone NestJS worker process. It runs separately from the main API, consumes Inngest events, and executes long-running tasks (Auth, Battery, UserPlan, Notification functions) without ever blocking an HTTP response.
*   **NestJS (v11)**: The core scalable backend framework used for both the main API and the background worker.
*   **TypeORM**: The primary Object-Relational Mapper (ORM) used for database interactions.
*   **MySQL**: The main relational database (connected via the `mysql2` driver).
*   **Redis**: Used for caching and high-speed data access (`@liaoliaots/nestjs-redis`).
*   **CQRS (Command Query Responsibility Segregation)**: A custom-built implementation (`@yugo/cqrs`) used to strictly separate database reads (Queries) from database writes/mutations (Commands).
*   **Inngest**: A powerful event-driven background job and workflow engine. Used heavily for side-effects (like sending emails, OTPs, push notifications) without blocking the main HTTP threads.
*   **TypeBox**: Used instead of `class-validator` for ultra-fast JSON schema validation and serialization in DTOs.
*   **CASL**: Used for fine-grained, role-based authorization (Permissions & Policies).
*   **Passport.js**: Used for JWT-based Authentication.
*   **Swagger / OpenAPI**: Auto-generated API documentation using a custom `extract-openapi-schemas.ts` utility to bridge TypeBox with Swagger.
*   **Pino**: Extremely fast Node.js logger used in `henchmen` and API.
*   **Handlebars**: Used for compiling HTML templates (likely for transactional emails).

---

## 📱 Frontend Mobile App (`apps/app`)

The consumer-facing mobile application.

*   **React Native (v0.81)**: The core mobile framework.
*   **Expo (v54)**: Used for building, managing native modules, and rapid development (EAS, Expo Go).
*   **Expo Router**: File-based routing for the mobile app navigation.
*   **Zustand**: Used for global client-side state management.
*   **TanStack React Query (v5)**: Used exclusively for all API data fetching, caching, and server state.
*   **Tailwind CSS (via Uniwind / Nativewind)**: Used for styling mobile components with utility classes.
*   **React Hook Form + Zod**: Used for strictly typed, uncontrolled form validation.
*   **xior**: A lightweight Axios alternative used as the HTTP client to talk to the NestJS API.
*   **FlashList (`@shopify/flash-list`)**: High-performance lists replacing standard React Native FlatLists.
*   **React Native Maps & Camera**: For location-based and media capture features.
*   **Maestro**: Used for end-to-end (E2E) UI testing on mobile.

---

## 💻 Frontend Backoffice Admin (`apps/backoffice`)

The internal web dashboard used by administrators.

*   **React (v19)**: The latest React version for the web dashboard.
*   **React Router v7**: The primary framework for the web dashboard, providing file-based routing, nested layouts, and loaders.
*   **Tailwind CSS (v4)**: The brand-new version of Tailwind for web styling.
*   **Radix UI**: Headless, accessible primitive components (Dialogs, Dropdowns, Tabs, Popovers) used to build the internal design system.
*   **TanStack Query (v5)**: For server state management and data fetching.
*   **TanStack Table**: For complex, feature-rich data grids and tables.
*   **React Hook Form + Zod**: For complex web form handling.
*   **xior**: The HTTP client used to connect to the backend.

---

## 📦 Custom Internal Packages (`packages/*`)

The monorepo has heavily modularized features into shareable, internal packages that are imported by the apps:

*   `@yugo/cqrs`: Custom Command/Query implementation used by the backend.
*   `@yugo/nestjs-database`: Shared TypeORM entities, base entities, and database configurations.
*   `@yugo/nestjs-casl`: Shared permission logic, actions, and guards.
*   `@yugo/nestjs-inngest`: Shared background job definitions and decorators.
*   `@yugo/nestjs-fcm`: Firebase Cloud Messaging module abstraction for push notifications.
*   `@yugo/shared`: Enums, types, and constants shared between the frontend and backend.
*   `@yugo/utils`: Helper functions and utilities.
*   `@yugo/permissions`: Shared policy maps and subject class definitions for CASL.

---

---

# 📖 DETAILED EXPLANATION — WHAT IS EACH TECHNOLOGY?

> This section explains every technology listed above in simple words, with a technical example and a real-life analogy. It is written for someone who is learning backend and frontend development from scratch.

---

## 🏗️ SECTION 1: Core Architecture & Tooling

---

### 1.1 Turborepo (`turbo`)

> 📦 **Latest Stable Version:** `v2.10.0` — Released June 24, 2026 *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: High-performance build system for monorepos.
* 🎯 **Why do we use it?**: Runs builds, tests, and lints across all apps and packages in parallel with smart caching.
* 💡 **Key Advantage (Why this & why NOT the old way?)**: **Why Turborepo over manual script running?** Old way required `cd`ing into 10 folders manually to build. Turborepo runs everything in 1 command and skips rebuilding code that hasn't changed, saving 90% build time!

**Simple explanation:**
Turborepo is like a **smart manager for a big company** that has many departments (frontend, backend, packages). Instead of going to each department one by one and asking them to build their thing, the manager does it all in the right order, skips work that hasn't changed, and caches results so nothing is done twice.

**Quick Answer / Elevator Pitch:**
> *"Turborepo is a high-performance monorepo build system with smart caching that runs tasks in parallel and skips work that hasn't changed."*

**Real-life analogy:**
Imagine a restaurant kitchen. Turborepo is the head chef who knows: "The bread must be baked before the sandwich is assembled." It runs tasks in the right order and never re-bakes bread that was already baked.

**Technical example:**
```bash
# Without Turborepo: you'd go into each folder manually
cd apps/api && npm run build
cd apps/backoffice && npm run build

# With Turborepo: one command, smart order, cached
turbo run build
```
If `apps/api` code didn't change, Turborepo skips rebuilding it and uses the cached output from last time.

---

### 1.2 Yarn Workspaces

> 📦 **Latest Stable Version:** `v4.18.0` (Yarn Berry) — Released July 29, 2026 *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: A package management feature for monorepos.
* 🎯 **Why do we use it?**: Shares dependencies (`node_modules`) and links local packages (`packages/*`) directly to apps (`apps/*`).
* 💡 **Key Advantage (Why this & why NOT the old way?)**: **Why Yarn Workspaces over separate repos or npm link?** Old way required publishing private npm packages or copying code between repos. Yarn Workspaces lets apps import local packages instantly as normal imports with zero code duplication.

**Simple explanation:**
Yarn Workspaces lets you treat your entire project as one big family where all members (apps and packages) can share resources (like `node_modules`) without each one needing their own copy.

**Quick Answer / Elevator Pitch:**
> *"Yarn Workspaces manages multiple apps (`apps/*`) and shared internal libraries (`packages/*`) in a single monorepo with unified dependency resolution."*

**Real-life analogy:**
Think of a shared apartment. Instead of each person buying their own TV, fridge, and wifi, they share one set for the whole apartment. This saves space (disk space) and money (install time).

**Technical example:**
```json
// Root package.json
{
  "workspaces": ["apps/*", "packages/nestjs/*", "packages/shared/*"]
}
```
Now `apps/api` can import `@yugo/cqrs` directly as if it's an npm package, even though it lives locally in `packages/nestjs/cqrs`.

---

### 1.3 TypeScript

> 📦 **Latest Stable Version:** `v7.0.2` — Released July 8, 2026 *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Strongly typed programming language built on top of JavaScript.
* 🎯 **Why do we use it?**: Enforces strict type safety across all backend and frontend codebases.
* 💡 **Key Advantage (Why this & why NOT plain JS?)**: **Why TypeScript over plain JavaScript?** Plain JS crashes in production at runtime (e.g. `undefined is not a function`). TypeScript catches typos and type bugs at compile-time while typing code, with full IDE autocomplete.

**Simple explanation:**
TypeScript is JavaScript with **labels on everything**. JavaScript lets you put anything anywhere; TypeScript forces you to say "this variable holds a number" or "this function returns a string." This prevents entire categories of bugs.

**Quick Answer / Elevator Pitch (Option B — Developer Experience):**
> *"TypeScript adds strict type definitions to JavaScript, giving us better autocomplete, self-documenting code, and safe refactoring."*

**Key Terms & Concepts:**
* **Type Safety**: Ensures variables only hold the data types they are defined to hold.
* **Compile-Time Error Checking**: Catches typos, missing properties, and bugs *while coding*, before code ever runs in production.
* **Self-Documenting Code**: Clear interfaces make it immediately obvious what data structure a function expects.
* **Safe Refactoring**: Changing or renaming code in one file automatically alerts you if it breaks another file.

**Real-life analogy:**
Imagine a warehouse where every box has a label saying exactly what's inside. TypeScript is the labeling system. Without it (plain JavaScript), you might open a box expecting TVs and find shoes instead.

**Technical example:**
```typescript
// ❌ JavaScript — no safety
function getUser(id) {
  return id.toUpperCase(); // Runtime crash if id is a number!
}

// ✅ TypeScript — caught at compile time
function getUser(id: string): string {
  return id.toUpperCase(); // Safe
}
```

---

### 1.4 ESLint & Prettier

> 📦 **Latest Stable Versions:** ESLint `v10.10.0` — Released Sep 4, 2026 &nbsp;|&nbsp; Prettier `v3.9.6` *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Automated code linter (ESLint) and code auto-formatter (Prettier).
* 🎯 **Why do we use it?**: Enforces identical code quality standards, formatting, and security rules across all team members.
* 💡 **Key Advantage (Why this & why NOT manual code reviews?)**: **Why ESLint & Prettier over manual code formatting?** Saves hours in code reviews arguing about tabs/spaces or missing semi-colons; catches dead code and anti-patterns automatically on file save.

**Simple explanation:**
ESLint is the **spelling and grammar checker** for your code — it finds bugs and bad patterns. Prettier is the **auto-formatter** — it makes every developer's code look exactly the same, regardless of their personal style.

**Quick Answer / Elevator Pitch:**
> *"ESLint catches code bugs and bad architectural patterns at dev-time, while Prettier enforces consistent code formatting across the entire team."*

**Real-life analogy:**
ESLint = A teacher who marks your essay for logical errors.
Prettier = A printer that prints everything in the same font and layout.

**Technical example:**
```typescript
// ❌ Before Prettier
const x=1; if(x===1){console.log('yes')}

// ✅ After Prettier auto-formats
const x = 1;
if (x === 1) {
    console.log('yes');
}
```

---

## ⚙️ SECTION 2: Backend Services

---

### 2.0 Henchmen (`apps/henchmen`) — The Background Worker

> 📦 **Runtime:** NestJS `v12.0.0` + Inngest `v4.19.0` *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Dedicated background worker NestJS process.
* 🎯 **Why do we use it?**: Executes long-running background jobs (push notifications, battery sync, cron jobs) via Inngest.
* 💡 **Key Advantage (Why this & why NOT the old way?)**: **Why a separate worker instead of doing background work inside `apps/api`?** If background jobs crash or get overwhelmed with heavy tasks, the main REST API stays 100% fast and responsive for users without crashing.

**Simple explanation:**
Henchmen is a **completely separate NestJS application** that runs alongside your main API (`apps/api`). Its sole job is to execute background tasks that were triggered by Inngest events. It never handles any direct HTTP requests from users — it only processes jobs from the Inngest queue.

**Quick Answer / Elevator Pitch:**
> *"Henchmen is a dedicated background worker process that handles long-running, asynchronous jobs (push notifications, email delivery, cron tasks) via Inngest without blocking user HTTP API responses."*

Think of it like a two-team restaurant:
- **`apps/api`** is the **front-of-house** — waiters taking orders (HTTP requests) and responding to customers immediately.
- **`apps/henchmen`** is the **kitchen** — it receives the orders (Inngest events) and does the actual heavy cooking (push notifications, battery sync, plan activation) behind the scenes.

**Real-life analogy:**
When you place an order on Swiggy, the app immediately says "Order Placed! ✅". But behind the scenes, a completely separate system is working — sending you an SMS confirmation, notifying the restaurant, and tracking the delivery agent. Henchmen is that separate background system.

**What Henchmen specifically does in this project:**

| Function File | What it handles |
|---|---|
| `auth.functions.ts` | Background tasks triggered after auth events (e.g., new user registered) |
| `battery.functions.ts` | Battery swap tracking, state sync, transport events |
| `user-plan.functions.ts` | Activating queued plans when they are scheduled to start |
| `notification-service.functions.ts` | Delivering push notifications via FCM to mobile devices |

**Technical example — How it works end to end:**
```typescript
// STEP 1: In apps/api — HTTP request comes in, we respond immediately
async createBooking(@Body() body: CreateBookingDTO) {
    const booking = await this.commandBus.execute(new CreateBookingCommand(body));

    // Fire event to Inngest and return IMMEDIATELY. No waiting.
    await this.inngest.send({
        name: 'booking/created',
        data: { bookingId: booking.id, userId: booking.userId }
    });

    return booking; // ← Response sent in ~50ms
}

// STEP 2: In apps/henchmen — Inngest delivers the event here asynchronously
@InngestFunction({ event: 'booking/created' })
async handleBookingCreated({ event }: InngestEventContext) {
    // Now we do the heavy work (may take 2-5 seconds, but user doesn't wait)
    await this.notificationService.sendPush(event.data.userId, 'Booking confirmed! 🎉');
    await this.analyticsService.track('booking.created', event.data);
}
```

**Why is Henchmen a separate app and not just a background service inside `apps/api`?**

1. **Scalability**: You can scale the API and the worker independently. If notifications are slow, add more Henchmen instances, not more API instances.
   * 💡 *In simple words*: If 500 customers order pizzas at once, you don't hire 10 extra Waiters at the front door — you just hire more Chefs in the kitchen! The front door is never blocked.
2. **Fault Isolation**: If Henchmen crashes, the main API keeps running. Users can still create bookings even if notifications temporarily fail.
   * 💡 *In simple words*: If the oven in the kitchen catches fire, the Waiter at the door can still sell cold drinks and take future orders. The whole app doesn't crash for users!
3. **Clean Separation**: The API's job is to be fast and respond to HTTP. Henchmen's job is to be reliable and process events. Mixing them violates Single Responsibility Principle.
   * 💡 *In simple words*: The Waiter's only job is to be ultra-fast (~50ms response). The Chef's only job is to complete heavy background work (SMS, Push Notifications, Emails, Syncing) reliably.

> 🍕 **Simple Real-Time Restaurant Analogy:**
> * 🤵 **`apps/api` = The Waiter at the front desk**: Takes your order, hands you a receipt, and says *"Order confirmed!"* in 5 seconds.
> * 👨‍🍳 **`apps/henchmen` = The Chef inside the kitchen**: Bakes the pizza, packs it, and sends the delivery boy behind the scenes in 15 minutes.
> * *If the Waiter ALSO had to bake the pizza before taking the next order, customers would wait 15 minutes in line just to place an order!*

---

### 2.1 NestJS

> 📦 **Latest Stable Version:** `v12.0.0` — Released August 27, 2026 *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Enterprise Node.js backend framework built on TypeScript.
* 🎯 **Why do we use it?**: Structures our REST API (`apps/api`) and background worker (`apps/henchmen`) into clean, modular layers.
* 💡 **Key Advantage (Why this & why NOT raw Express?)**: **Why NestJS over raw Express?** Express leads to messy "spaghetti code" mixing routes, auth, and database calls in one file. NestJS enforces clean modular architecture with Dependency Injection, Controllers, Services, and Guards.

**Simple explanation:**
NestJS is an enterprise **framework** built on top of Node.js (and Express) that gives you a structured, standardized way to build scalable backend applications. 

**Why NestJS instead of raw Express?**
In **raw Express**, there are no enforced architectural rules. Developers often put database queries, routing logic, input validation, and authentication inside one huge, messy `app.js` file ("spaghetti code"). **NestJS** solves this by enforcing a modular structure divided into 5 distinct building blocks:

1. **📦 Modules**: Group related features together into isolated packages (e.g. `UserModule`, `AuthModule`, `BookingModule`). Like a department in an office.
2. **🎮 Controllers**: Listen for incoming HTTP requests (`GET /users`, `POST /bookings`) and return responses. Like a reception desk handling calls.
3. **⚙️ Services (Providers)**: Contain the actual business logic, calculations, and database interactions. Like the specialists doing the real work.
4. **🛡️ Guards**: Security checkpoints that check if a user is authenticated (`AuthGuard`) or authorized (`RolesGuard`) before letting them access a route. Like a bouncer at a club door.
5. **⚡ Interceptors**: Intercept and transform requests/responses before or after execution (e.g., measuring execution time, logging, or wrapping output JSON). Like a quality inspector or gift-wrapper.

**Quick Answer / Elevator Pitch:**
> *"NestJS is an enterprise Node.js framework providing clean, modular architecture with Dependency Injection, Controllers, Services, Guards, Interceptors, and Modules."*

**Real-life analogy:**
* **Raw Express** = Working in an open garage where tools, documents, and engines are all thrown on the same table.
* **NestJS** = Working in a modern office building where every department has its own room (**Module**), receptionist (**Controller**), worker (**Service**), and bouncer at the door (**Guard**).

**Technical Example — Raw Express vs NestJS:**

```typescript
// ❌ Raw Express — Routing, Auth, and DB logic mixed in one messy function
app.get('/users/:id', async (req, res) => {
  if (!req.headers.token) return res.status(401).send('Unauthorized'); // Auth
  const user = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]); // DB
  res.json(user); // Response
});

// ✅ NestJS — Clean separation of concerns
// 🛡️ Guard handles Auth | 🎮 Controller handles HTTP | ⚙️ Service handles Business Logic
@Controller('users')
@UseGuards(AuthGuard) // 🛡️ Guard checks authentication automatically
export class UsersController {
  constructor(private userService: UserService) {} // ⚙️ Service injected automatically

  @Get(':id')
  getUser(@Param('id') id: string) { // 🎮 Controller handles route
    return this.userService.findById(id); // Clean delegate to Service
  }
}
```

---

### 2.2 TypeORM

> 📦 **Latest Stable Version:** `v1.0.0` — Released May 19, 2026 *(Verified: Sep 6, 2026)*

> 🔤 **Full Form:** **Type**Script **O**bject-**R**elational **M**apper
> `Type` = TypeScript &nbsp;|&nbsp; `ORM` = Object-Relational Mapper (maps code objects → database tables)

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Object-Relational Mapper (ORM) for TypeScript and MySQL.
* 🎯 **Why do we use it?**: Interacts with the database using TypeScript classes (Entities) instead of raw SQL strings.
* 💡 **Key Advantage (Why this & why NOT raw SQL?)**: **Why TypeORM over raw SQL?** Raw SQL strings (`SELECT * FROM users WHERE...`) have zero autocomplete and break silently if a column changes. TypeORM provides 100% type-safe queries and auto-generates SQL safely.

**Simple explanation:**
TypeORM is an **Object-Relational Mapper (ORM)**. It acts as an automatic translator between your **TypeScript code and your MySQL database**. 

Instead of writing raw, error-prone SQL strings (like `SELECT * FROM users WHERE id = '123'`), TypeORM lets you define a TypeScript class (called an **Entity**) to represent a database table, and provides simple methods (`save()`, `find()`, `delete()`) to interact with it.

**Why do we use TypeORM? (In Simple Words)**
1. **No SQL Typos**: If you mistype a field name in TypeScript, your code won't compile (catches errors immediately).
2. **Auto SQL Generation**: You write `userRepo.save(newUser)`, and TypeORM automatically generates `INSERT INTO users ...` behind the scenes.
3. **TypeScript Types**: Database query results return fully typed TypeScript objects with autocomplete.

**Quick Answer / Elevator Pitch:**
> *"TypeORM is an Object-Relational Mapper (ORM) that maps TypeScript class models into SQL queries for database interactions."*

**Real-life Analogy — The Japanese Restaurant Tablet:**
* Imagine you are at a restaurant in Tokyo. The chef in the kitchen only speaks **Japanese (MySQL Database)**. You only speak **English (TypeScript)**.
* **TypeORM** is the digital menu tablet on your table. You tap *"Order 1 Cheeseburger"* in English. The tablet translates it into Japanese, sends it to the chef, and brings back your food. You never have to learn Japanese (SQL)!

**Core Building Blocks of TypeORM:**
- **Entity (`@Entity()`)**: A TypeScript class that represents a table in MySQL.
- **Repository (`userRepo`)**: A built-in helper object that gives you easy methods (`find()`, `save()`, `update()`, `delete()`).

**Technical Example — Raw SQL vs TypeORM:**

```typescript
// ❌ Raw SQL — Error prone string, no autocomplete, risk of SQL Injection
const result = await db.query(
  "INSERT INTO users (name, email) VALUES ('Vaibhav', 'vaibhav@gmail.com')"
);

// ✅ TypeORM — 100% Type-safe TypeScript
// 1. Create new user object
const newUser = userRepo.create({ name: 'Vaibhav', email: 'vaibhav@gmail.com' });

// 2. Save to database (TypeORM generates SQL automatically)
await userRepo.save(newUser);

// 3. Find user by email
const user = await userRepo.findOneBy({ email: 'vaibhav@gmail.com' });
```

---

### 2.3 MySQL

> 📦 **Latest Stable Version:** `v9.3.0` (Server) *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Relational Database Management System (RDBMS).
* 🎯 **Why do we use it?**: Stores permanent application data (users, bookings, vehicles, battery status) in structured linked tables.
* 💡 **Key Advantage (Why this & why NOT NoSQL/MongoDB?)**: **Why MySQL over MongoDB?** Our domain (bookings, vehicles, plans) requires strict table relationships, ACID transactions, and structured schemas that relational databases guarantee.

**Simple explanation:**
MySQL is a **relational database** — think of it as a collection of Excel spreadsheets. Each "table" is a spreadsheet (e.g., `users`, `bookings`, `vehicles`). Rows are records, columns are fields. Tables can be linked together (e.g., a booking is linked to a user and a vehicle).

**Quick Answer / Elevator Pitch:**
> *"MySQL is our primary relational database for storing structured application data across linked tables."*

**Real-life analogy:**
MySQL is like a **well-organized filing cabinet**. Every drawer (table) holds records (rows). When you need to find a booking, you open the Bookings drawer and find the row by ID.

---

### 2.4 Redis

> 📦 **Latest Stable Version:** `v8.0.2` (Server) *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Ultra-fast, in-memory key-value data store.
* 🎯 **Why do we use it?**: High-speed caching, temporary OTP code storage, and quick session token checks.
* 💡 **Key Advantage (Why this & why NOT MySQL for temp data?)**: **Why Redis over MySQL queries?** Reading/writing to RAM memory takes ~1 millisecond (1,000x faster than disk SQL), and Redis supports automatic expiration timers (TTL) for temporary OTPs.

**3-Line Simple Explanation:**
1. ⚡ **Ultra-Fast RAM Storage**: Redis stores data directly in computer memory (RAM) instead of hard drive disks, making reads/writes 1,000x faster than traditional databases.
2. 🔑 **Key-Value Dictionary**: It stores data as simple pairs (e.g. `phone_number` ➔ `OTP_code`) rather than complex tables and rows.
3. ⌛ **Auto-Expiring Data (TTL)**: It allows setting an automatic expiration time (Time To Live), so data like OTPs or session tokens delete themselves after a set period.

**Quick Answer / Elevator Pitch:**
> *"Redis is an ultra-fast in-memory key-value data store used for high-speed caching and temporary token storage."*

**Real-life Analogy — Sticky Note vs File Cabinet:**
* **MySQL Database** = A file archive down in the basement. It holds permanent records, but takes time to walk down and search through folders.
* **Redis** = A sticky note on your laptop screen. You look at it instantly in 1 second, but you throw it away after 5 minutes.

**Common Use-Cases in Our App:**
- **OTP Codes**: Temporary 6-digit verification codes (expires in 5 mins).
- **Auth Tokens**: User JWT session tokens for quick validation without hitting MySQL.
- **API Caching**: Saving heavy backend calculation results for fast repeat access.

**Technical Example — Saving & Reading an OTP:**

```typescript
// 1. Store OTP with automatic 5-minute expiry (300 seconds)
await redis.set('otp:9876543210', '123456', 'EX', 300);

// 2. Retrieve the OTP instantly when user submits form
const savedOtp = await redis.get('otp:9876543210'); // Returns '123456'

// 3. After 300 seconds, Redis automatically deletes it (returns null)
```

---

### 2.5 CQRS (Command Query Responsibility Segregation)

> 📦 **In this project:** Custom `@yugo/cqrs` internal package *(Architecture Pattern — no external npm version)*

> 🔤 **Full Form:** **C**ommand **Q**uery **R**esponsibility **S**egregation
> `Command` = Write/change data (Create, Update, Delete) &nbsp;|&nbsp; `Query` = Read/fetch data &nbsp;|&nbsp; `Responsibility Segregation` = Strictly keep Read code and Write code in **separate files**

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Pattern separating Write operations (Commands) from Read operations (Queries).
* 🎯 **Why do we use it?**: Keeps business logic decoupled into small, dedicated handler files.
* 💡 **Key Advantage (Why this & why NOT standard services?)**: **Why CQRS over monolithic service files?** Instead of one huge 2,000-line service file doing everything, every single action has its own small handler file (`CreateBookingHandler`). Reads can be heavily cached without touching write logic.

**Simple explanation:**
CQRS is a design pattern that enforces one strict rule: **"Never mix code that reads data with code that changes data."**

It splits all backend operations into two separate categories:
- ✍️ **Command (WRITE)**: An action that modifies database data (e.g. *Create User*, *Book Vehicle*, *Update Payment Status*). Commands change state and return success/failure.
- 🔍 **Query (READ)**: An action that fetches data without making any changes (e.g. *Get User Profile*, *List Available Vehicles*, *Fetch Booking History*). Queries never modify state.

**Why do we use CQRS in our app? (In Simple Words)**
1. **Easy to Maintain**: Instead of one giant 2,000-line `BookingService.ts` file doing everything, every single action has its own small, dedicated handler file (`CreateBookingCommandHandler.ts`, `GetBookingQueryHandler.ts`).
2. **Independent Scaling**: Users read data 90% of the time and write 10% of the time. CQRS lets us optimize and cache read queries heavily without risking database write consistency.
3. **Faster Debugging**: If booking creation fails, you know *exactly* which single command file to look at.

**Quick Answer / Elevator Pitch:**
> *"CQRS strictly separates read operations (Queries) from write/mutation operations (Commands) for better performance and scalability."*

**Real-life Analogy — Bank & Hospital:**
* **Bank Analogy**:
  * ✍️ **Bank Manager (Command)**: Approves a loan or opens an account (changes your account state).
  * 🔍 **ATM Screen (Query)**: Displays your balance (reads data, never changes your balance).
* **Hospital Analogy**:
  * ✍️ **Doctor (Command)**: Performs surgery or prescribes medicine (changes patient health state).
  * 🔍 **Nurse / Records Clerk (Query)**: Pulls up medical charts and checks temperature (reads patient history).

**Technical Example — Command vs Query in NestJS:**

```typescript
// ✍️ 1. COMMAND (Write Operation) — Changes data in database
export class CreateBookingCommand {
  constructor(public readonly vehicleId: string, public readonly userId: string) {}
}
// CommandHandler handles the write logic
@CommandHandler(CreateBookingCommand)
export class CreateBookingHandler implements ICommandHandler<CreateBookingCommand> {
  async execute(command: CreateBookingCommand) {
    // Saves new booking to MySQL database
    return await this.bookingRepo.save({ ... });
  }
}

// 🔍 2. QUERY (Read Operation) — Only fetches data from database/cache
export class GetUserBookingsQuery {
  constructor(public readonly userId: string) {}
}
// QueryHandler handles the read logic
@QueryHandler(GetUserBookingsQuery)
export class GetUserBookingsHandler implements IQueryHandler<GetUserBookingsQuery> {
  async execute(query: GetUserBookingsQuery) {
    // Reads bookings from MySQL or Redis cache (no database changes made)
    return await this.bookingRepo.find({ where: { userId: query.userId } });
  }
}
```

---

### 2.6 Inngest

> 📦 **Latest Stable Version:** `v4.19.0` — Released September 2, 2026 *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Event-driven background job and workflow engine.
* 🎯 **Why do we use it?**: Runs async background tasks (emails, notifications, retries) without delaying HTTP API responses.
* 💡 **Key Advantage (Why this & why NOT blocking API calls?)**: **Why Inngest over blocking synchronous calls?** Synchronous API calls make users wait 3 seconds for emails to send. Inngest responds to the user in 50ms and runs background tasks with automatic retries if an external API fails.

**Simple explanation:**
Inngest is a **background job engine**. When a user signs up, you don't want to make them wait while the server sends a welcome email (which can take 2 seconds). Instead, you tell Inngest *"send this email in the background"* and immediately respond to the user. Inngest handles the rest asynchronously.

**Why do we use Inngest in our app? (In Simple Words)**
1. ⚡ **Instant API Responses (~50ms)**: When a user registers or books a vehicle, they don't wait 3 seconds for emails, SMS, or FCM push notifications to send. The server responds instantly, and Inngest handles the work in the background.
2. 🔁 **Automatic Error Retries**: If an external service (like email or push notification API) goes down temporarily, Inngest automatically retries the job 3 to 5 times with exponential backoff until it succeeds.
3. ⌛ **Delayed & Scheduled Workflows**: You can easily define multi-step workflows with delays (e.g. *"Send an email now, wait 24 hours, then check if user activated their subscription plan"*).

**Quick Answer / Elevator Pitch:**
> *"Inngest is an event-driven background job engine that manages queues, automatic retries, and multi-step async workflows."*

**Real-life Analogy — Waiter & Kitchen:**
> When you order food at a restaurant, the **waiter (API)** takes your order and immediately goes to the next table (responds fast). The **kitchen (Inngest)** prepares your food in the background without blocking the waiter.

**Real-World Example — Swiggy Order:**
* **Scenario**: When you click *"Place Order"* on Swiggy:
  * 📱 **API Response**: Swiggy shows *"Order Confirmed! ✅"* in **0.1 seconds**.
  * ⚙️ **Inngest in the Background**: Inngest triggers 4 background tasks behind the scenes:
    1. Sends order details to restaurant kitchen.
    2. Assigns delivery driver.
    3. Sends SMS confirmation to your phone.
    4. Schedules a reminder if driver is delayed by 30 mins.
  * *You never had to wait 2 minutes for all 4 tasks to complete before seeing your confirmation screen!*

**Technical Example — Blocking vs Inngest Non-Blocking:**

```typescript
// ❌ Old Blocking Way — User waits 3 seconds for emails & push notifications! (Slow 🐢)
async registerUser(@Body() dto: RegisterDTO) {
  const user = await userRepo.save(dto);
  await emailService.sendWelcomeEmail(user.email); // Takes 1.5s
  await fcmService.sendPushNotification(user.id);  // Takes 1.5s
  return user; // User waits 3.0+ seconds total!
}

// ✅ Inngest Event-Driven Way — User gets instant response in 50ms! (Fast ⚡)
// STEP 1: In API — Fire event to Inngest and return immediately
async registerUser(@Body() dto: RegisterDTO) {
  const user = await userRepo.save(dto);
  
  // Fire-and-forget event dispatch to Inngest
  await this.inngest.send({ name: 'user/registered', data: { userId: user.id } });
  
  return user; // Response sent to user in ~50ms!
}

// STEP 2: In Henchmen Worker — Inngest executes function asynchronously in background
@InngestFunction({ event: 'user/registered' })
async handleUserRegistered({ event }: InngestEventContext) {
  await this.emailService.sendWelcomeEmail(event.data.userId);
  await this.fcmService.sendPushNotification(event.data.userId);
}
```

---

### 2.7 TypeBox

> 📦 **Latest Stable Version:** `typebox@1.3.16` (modern) &nbsp;|&nbsp; `@sinclair/typebox@0.34.52` (LTS) — Aug 2026 *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: High-performance JSON schema library for TypeScript type inference & validation.
* 🎯 **Why do we use it?**: Validates incoming HTTP API request payloads (DTOs) and infers TypeScript types automatically.
* 💡 **Key Advantage (Why this & why NOT class-validator?)**: **Why TypeBox over class-validator?** `class-validator` requires writing both a class decorator AND a TypeScript type (double work). TypeBox lets you write schema ONCE and infers types automatically while being up to 100x faster.

**Simple explanation:**
TypeBox solves the **"Double Work"** problem in backend development.

When a user submits data to your API (e.g. `{ name: 'Vaibhav', phone: '9876543210' }`), traditional backend code forces you to write **TWO separate things**:
1. A **TypeScript type** (so your IDE gives autocomplete while coding).
2. A **Validation class** with `@IsString()`, `@MinLength()` decorators (so the server checks incoming data at runtime).

Writing both means duplicating code. **TypeBox lets you write the schema ONCE, and automatically gives you BOTH the runtime validator AND the TypeScript type for free!**

**Why do we use TypeBox in our app? (In Simple Words)**
1. 🚫 **Zero Code Duplication**: Define schema once (`Type.Object(...)`) ➔ Extract TypeScript type automatically (`Static<typeof Schema>`).
2. ⚡ **100x Faster Performance**: Compiles to pure JSON Schema functions, which is up to 100x faster than traditional `class-validator` reflection decorators.
3. 📄 **Automatic Swagger Docs**: Automatically generates OpenAPI documentation for frontend teams without writing extra code.

**Quick Answer / Elevator Pitch:**
> *"TypeBox provides high-performance JSON schema validation for DTOs while automatically inferring TypeScript types."*

**Real-life Analogy — The 3D Cookie Cutter Mould:**
* **Without TypeBox (Double Work)**: You manually cut out a star shape from dough (validation), and then separately draw a star on paper (TypeScript type). If you change the star size, you have to rewrite both!
* **With TypeBox**: You use a **3D Cookie Cutter Mould**. The moment it cuts the dough (validates incoming API JSON), it instantly prints the paper recipe label (TypeScript type) at the exact same second!

**Technical Example — Step-by-Step:**

```typescript
import { Type, Static } from '@sinclair/typebox';

// STEP 1: Define schema ONCE (The 3D Mould)
export const CreateUserSchema = Type.Object({
  name: Type.String({ minLength: 2 }),             // Must be string, min 2 characters
  phone: Type.String({ pattern: '^[0-9]{10}$' }),  // Must be exactly 10 digits
});

// STEP 2: Extract TypeScript Type FOR FREE (No duplicate code written!)
export type CreateUserDTO = Static<typeof CreateUserSchema>;
// CreateUserDTO is automatically: { name: string; phone: string; }

// STEP 3: Use in NestJS Controller — Gets 100% Autocomplete AND Runtime Validation!
@Controller('users')
export class UsersController {
  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    // 'body.name' and 'body.phone' are already validated and 100% type-safe!
    return await this.userService.create(body);
  }
}
```

---

### 2.8 CASL (Authorization)

> 📦 **Latest Stable Version:** `@casl/ability@7.0.1` — Released July 2026 *(Verified: Sep 6, 2026)*

> 🔤 **Full Form:** **C**ode **A**ccess **S**ecurity **L**ayer *(also: Code-level Authorization & Security Layer)*
> Controls user permissions — answers: *"Is this user **allowed** to perform **this action** on **this resource**?"* e.g. `can('read', 'Booking')`

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Attribute-based authorization library for defining user access rules.
* 🎯 **Why do we use it?**: Enforces fine-grained policy permissions (e.g. *"Admins can delete any booking, but users can only read their own"*).
* 💡 **Key Advantage (Why this & why NOT nested if-else?)**: **Why CASL over nested `if/else` checks?** Nested `if/else` permission checks scatter security rules across controllers. CASL centralizes all security policies in `@yugo/permissions` using declarative `can()` and `cannot()` syntax.

**Simple explanation:**
CASL is an **authorization library** that defines who can do what. 

- **Authentication** asks: *"Who are you?"* (e.g. Logging in with email & password).
- **Authorization (CASL)** asks: *"Are you allowed to do this action?"* (e.g. Can this user delete this booking?).

CASL lets you define fine-grained rules like *"An Admin can delete any booking, but a regular User can only view or cancel their own booking."*

**Why do we use CASL? (In Simple Words)**
1. 🎯 **Attribute-Based Control (ABAC)**: Permissions aren't just based on your role (Admin/User), but also on resource details (e.g. You can only edit a booking IF `booking.userId === user.id`).
2. 📜 **No Messy `if/else` Code**: Without CASL, controllers get filled with messy `if (role === 'admin' || user.id === booking.userId)` checks. CASL provides clean `can()` and `cannot()` helper methods.
3. 🔄 **Central Security Rulebook**: All application security permissions live in a single shared package (`@yugo/permissions`), making security audits super easy.

**Quick Answer / Elevator Pitch:**
> *"CASL is an attribute-based authorization library that defines fine-grained user permissions and policy rules."*

**Real-life Analogy — Office Security Badge System:**
* **Authentication** = Showing your ID card at the front entrance gate so the guard knows who you are.
* **CASL Authorization** = Your security badge scanner. An intern's badge opens the lobby door. A manager's badge opens their department floor. Only the CEO's badge opens the server room door!

**Technical Example — Defining & Checking Rules:**

```typescript
import { AbilityBuilder, createMongoAbility } from '@casl/ability';

// 1. DEFINE RULES based on User Role
const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

if (user.role === 'admin') {
  can('manage', 'all'); // Admin can do EVERYTHING (Create, Read, Update, Delete)
} else {
  // Regular User can ONLY READ bookings where they are the owner
  can('read', 'Booking', { userId: user.id });
  
  // Regular User can NEVER delete any booking
  cannot('delete', 'Booking');
}

const ability = build();

// 2. CHECK PERMISSION anywhere in code
const isAllowed = ability.can('read', currentBooking);
// Returns true ONLY IF currentBooking.userId matches user.id!
```

---

### 2.9 Passport.js (JWT Authentication)

> 📦 **Latest Stable Version:** `v0.7.0` — Released November 2023 *(Verified: Sep 6, 2026 — stable, maintenance mode)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Authentication middleware for Node.js / NestJS.
* 🎯 **Why do we use it?**: Extracts and validates signed JWT tokens on incoming API HTTP requests.
* 💡 **Key Advantage (Why this & why NOT custom JWT code?)**: **Why Passport over writing custom token parsing code?** Passport is battle-tested, handles token decoding, expiration checks, and error responses automatically through reusable NestJS `@UseGuards()`.

**Simple explanation:**
Passport.js handles the *"Who are you?"* question (Authentication). 

When you log in, the server gives you a **JWT token** (like a digital ID card). Every subsequent request your app makes carries this token. Passport verifies it is valid, checks for tampering or expiration, and tells NestJS who you are.

**How JWT Authentication Works (In 3 Simple Steps):**
1. 🔑 **Step 1 — Login**: User enters email & password at `/auth/login`. The server verifies password and returns a signed **JWT Token**.
2. 📲 **Step 2 — Request**: For all future API requests, your app sends the token in the header (`Authorization: Bearer <token>`).
3. 🛡️ **Step 3 — Passport Validation**: Passport.js automatically intercepts the request, decodes the token `{ userId: '123', email: 'user@gmail.com' }`, and attaches `req.user` for your controller to use.

**Quick Answer / Elevator Pitch:**
> *"Passport.js handles user authentication by verifying signed JSON Web Tokens (JWT) on incoming requests."*

**Real-life Analogy — Hotel Key Card:**
* **Logging In** = Showing your ID at the hotel reception desk. The receptionist hands you a **digital key card (JWT Token)**.
* **Making an API Request** = Tapping your key card on your room door to open it.
* **Passport.js** = The electronic door lock scanner. It reads your key card, verifies if it's expired or fake, and unlocks the door for you!

**Technical Example — Protecting Routes with Passport:**

```typescript
// 1. Passport Strategy verifies JWT Signature & Expiry in background
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  async validate(payload: { sub: string; email: string }) {
    // Decoded payload attached automatically to req.user
    return { userId: payload.sub, email: payload.email }; 
  }
}

// 2. Protect any NestJS route using @UseGuards
@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(AppAuthGuard) // 🛡️ Passport runs here: validates JWT & blocks invalid requests with 401
  getProfile(@Req() req: Request) {
    return req.user; // { userId: '123', email: 'vaibhav@gmail.com' }
  }
}
```

---

### 2.10 Swagger / OpenAPI

> 📦 **Latest Stable Version:** `@nestjs/swagger@11.x` *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Interactive visual API documentation generator.
* 🎯 **Why do we use it?**: Auto-generates a interactive webpage showing all API endpoints, parameters, and DTO schemas.
* 💡 **Key Advantage (Why this & why NOT manual docs?)**: **Why Swagger over manual documentation?** Manual docs quickly get out of date. Swagger auto-generates 100% accurate, live interactive docs directly from our TypeBox schemas in code.

**Simple explanation:**
Swagger automatically generates a **visual documentation website** for your API. It shows every available endpoint, what parameters they accept, and what they return. Developers and frontend teams use it to understand how to use the backend without reading source code.

**Why Developers Love Swagger (In Simple Words):**
1. 📖 **Zero Friction for Frontend Devs**: React/Mobile developers never have to ask *"What URL do I call?"* or *"What JSON field names do I send?"*. Everything is clearly documented in one URL.
2. 🧪 **Live In-Browser Testing (No Postman Needed)**: You can click the **"Try it out"** button directly on the webpage to execute live API requests and see real responses right inside your browser.
3. ⚡ **100% Auto-Generated**: In our repo, we bridge TypeBox DTO schemas directly into Swagger via `@scalar/nestjs-api-reference`. No manual documentation writing required!

**Quick Answer / Elevator Pitch:**
> *"Swagger automatically generates interactive OpenAPI documentation for testing and integrating backend REST APIs."*

**Real-life Analogy — Restaurant Menu:**
> Swagger is like the **menu of a restaurant**. As a customer (frontend developer), you don't need to go into the kitchen (backend code) to know what's available. The menu (Swagger UI) tells you exactly what you can order and how.

**Technical Example — Annotating NestJS Controllers for Swagger:**

```typescript
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Bookings') // Groups endpoints under 'Bookings' section in Swagger UI
@Controller('bookings')
export class BookingsController {
  
  @Post()
  @ApiOperation({ summary: 'Create a new vehicle booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully', type: BookingDTO })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createBooking(@Body() body: CreateBookingDTO) {
    return await this.bookingService.create(body);
  }
}
```

---

### 2.11 Pino (Logging)

> 📦 **Latest Stable Version:** `v10.3.1` — Released February 9, 2026 *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Ultra-fast, low-overhead structured JSON logger for Node.js.
* 🎯 **Why do we use it?**: Records structured JSON logs for production monitoring (CloudWatch/Datadog) and clean terminal logs in dev.
* 💡 **Key Advantage (Why this & why NOT console.log?)**: **Why Pino over `console.log`?** `console.log` is slow, blocks Node threads, and produces plain text that cannot be searched. Pino outputs structured JSON with zero performance lag, filterable by `userId` or `statusCode`.

**Simple explanation:**
Pino is an extremely fast logger. Instead of `console.log`, production applications use structured loggers like Pino that write logs in JSON format, which can be easily searched, filtered, and monitored in services like Datadog or CloudWatch.

**Why do we use Pino in production? (In Simple Words)**
1. ⚡ **Ultra Fast (Low Overhead)**: Pino is built to be the fastest Node.js logger. It uses asynchronous logging streams so log writing never slows down API response times.
2. 📊 **Structured JSON Format**: Instead of unstructured plain text, Pino writes logs as clean JSON objects. Monitoring tools can instantly index and filter logs by `userId`, `bookingId`, or `statusCode`.
3. 🎨 **Pretty Printing in Local Dev**: In development mode, `pino-pretty` converts JSON logs into clean, color-coded terminal lines for easy reading.

**Quick Answer / Elevator Pitch:**
> *"Pino is a low-overhead, high-speed structured JSON logger for Node.js production applications."*

**Real-life Analogy — Scrap Paper vs Excel Spreadsheet:**
* **`console.log`** = Writing random notes on loose scrap paper. When a bug occurs in production, searching through 10,000 pieces of scrap paper is impossible!
* **Pino Logger** = Writing entries into a clean **Excel Spreadsheet**. When a bug occurs, you can filter by column *"User ID = 123"* in 1 second!

**Technical Example — `console.log` vs Pino:**

```typescript
// ❌ console.log — Unstructured plain text, slow, impossible to filter in CloudWatch
console.log('User created: ' + userId);

// ✅ Pino Logger — Structured JSON object, ultra-fast, instantly filterable
logger.info({ userId, action: 'user.created' }, 'User created successfully');
// Outputs JSON: {"level":30,"time":1690000000,"userId":"123","action":"user.created","msg":"User created successfully"}
```

---

### 2.12 Handlebars (Email Templates)

> 📦 **Latest Stable Version:** `v4.7.8` *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Lightweight HTML template engine.
* 🎯 **Why do we use it?**: Compiles HTML email templates with dynamic runtime values (e.g. `{{userName}}`, `{{bookingId}}`).
* 💡 **Key Advantage (Why this & why NOT inline string concatenation?)**: **Why Handlebars over inline string literals (`<h1>${name}</h1>`)?** Keeps complex HTML email design files completely separate from TypeScript business logic code.

**Simple explanation:**
Handlebars is a **template engine** — it lets you write HTML files with placeholders like `{{userName}}` that get replaced with real values at runtime. Used here to generate HTML emails before sending them.

**Technical example:**
```html
<!-- welcome.hbs template file -->
<h1>Hello, {{name}}!</h1>
<p>Your booking #{{bookingId}} is confirmed.</p>
```
```typescript
// Compile the template with real data
const html = handlebars.compile(template)({ name: 'Vaibhav', bookingId: 'BK-001' });
// Result: <h1>Hello, Vaibhav!</h1><p>Your booking #BK-001 is confirmed.</p>
```

---

## 📱 SECTION 3: Frontend Mobile App

---

### 3.1 React Native

> 📦 **Latest Stable Version:** `v0.87.1` — Released August 26, 2026 *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Cross-platform mobile framework using React & TypeScript.
* 🎯 **Why do we use it?**: Builds our consumer mobile app (`apps/app`) for both iOS and Android from one single codebase.
* 💡 **Key Advantage (Why this & why NOT Native Swift/Kotlin?)**: **Why React Native over separate Swift & Kotlin apps?** Writing separate native apps doubles development time and cost. React Native gives 95%+ shared code across iOS & Android with true native UI performance.

**Simple explanation:**
React Native lets you write **one codebase in JavaScript/TypeScript** and deploy it as a real native app on both iOS and Android. Unlike a website in a browser, React Native apps use actual native UI components (real buttons, real text inputs) from iOS and Android.

**Quick Answer / Elevator Pitch:**
> *"React Native is a cross-platform mobile framework allowing us to build native iOS and Android apps using React and TypeScript."*

**Real-life analogy:**
Without React Native, building a mobile app is like having to write the same book in two different languages separately. React Native lets you write it once and have it automatically translated into both languages.

---

### 3.2 Expo

> 📦 **Latest Stable Version:** `SDK 57` — Released June 30, 2026 *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Development ecosystem and native module toolkit built on top of React Native.
* 🎯 **Why do we use it?**: Accesses phone hardware (camera, GPS, biometrics), builds native binaries (EAS), and sends Over-The-Air (OTA) updates.
* 💡 **Key Advantage (Why this & why NOT Bare React Native?)**: **Why Expo over Bare React Native?** Bare React Native requires manually configuring complex Xcode and Android Studio files. Expo handles native modules, builds, and OTA updates out-of-the-box.

**Simple explanation:**
Expo is a **toolkit and platform built on top of React Native** that makes development dramatically easier. It provides a standard way to access native device features (camera, GPS, biometrics), build your app (EAS Build), and push updates over-the-air (OTA).

**Quick Answer / Elevator Pitch:**
> *"Expo is a development ecosystem and native module framework built on React Native for rapid building, EAS deployment, and OTA updates."*

**Real-life analogy:**
React Native is the engine. Expo is the fully equipped car around it — dashboard, air conditioning, GPS, automatic transmission — so you can just drive without worrying about engine internals.

---

### 3.3 Expo Router

> 📦 **Latest Stable Version:** `v57.0.18` (ships with Expo SDK 57) *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: File-based routing framework for React Native mobile apps.
* 🎯 **Why do we use it?**: Maps directory file structures (`app/`) directly to mobile screen navigation.
* 💡 **Key Advantage (Why this & why NOT React Navigation boilerplate?)**: **Why Expo Router over React Navigation config objects?** Traditional React Navigation requires creating giant navigation stack configuration objects. Expo Router maps `app/profile.tsx` directly to `/profile` with deep-linking included automatically.

**Simple explanation:**
Expo Router brings **file-based routing** to mobile apps. The folder/file structure of `src/app/` directly maps to the app's navigation. Create a file `src/app/profile.tsx` and the route `/profile` automatically exists.

**Quick Answer / Elevator Pitch:**
> *"Expo Router provides file-based routing for React Native mobile apps, mapping directory structures (`app/`) directly to screens."*

**Technical example:**
```text
src/app/
├── index.tsx         → Screen shown at "/"  (Home)
├── profile.tsx       → Screen shown at "/profile"
└── bookings/
    ├── index.tsx     → Screen shown at "/bookings"
    └── [id].tsx      → Screen shown at "/bookings/123"
```

---

### 3.4 Zustand (State Management)

> 📦 **Latest Stable Version:** `v5.0.15` *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Lightweight, boilerplate-free global state store for React and React Native.
* 🎯 **Why do we use it?**: Stores global client state (user profile, auth token, app settings) accessible across all components without prop drilling.
* 💡 **Key Advantage (Why this & why NOT Redux / React Context?)**: **Why Zustand over Redux or React Context?** Redux requires tons of boilerplate (actions, reducers, dispatchers). Context causes full app re-renders and requires `<Provider>` wrappers. Zustand needs 5 lines of code, no providers, and selective re-renders!

**Simple explanation:**
Zustand is a **global state store** for React / React Native. When data needs to be accessible across many unrelated components (like the logged-in user's profile, active booking, or app theme), you store it in Zustand instead of passing props down through 10 layers of components (*prop drilling*) or wrapping everything in complex React Context Providers.

**Why Developers Love Zustand (In Simple Words):**
1. 🚀 **Zero Boilerplate**: Redux requires actions, reducers, dispatchers, types, and setup files. Zustand lets you create a full global store in just 5 lines of code!
2. 🔌 **No Context Provider Wrapping Needed**: You don't need to wrap your app component tree in `<AuthProvider>` or `<StoreProvider>`. You can read or write store values anywhere — even outside React components!
3. ⚡ **High Performance (Selective Re-renders)**: Components only re-render when the exact state slice they subscribe to changes (`useAuthStore(state => state.user)`), preventing unnecessary app re-renders.

**Quick Answer / Elevator Pitch:**
> *"Zustand is a lightweight, boilerplate-free state management library for managing global client-side state in React and React Native applications."*

**Real-life Analogy — Office Whiteboard / Central Notice Board:**
* **Prop Drilling / Redux** = Whispering a message to the person next to you, who whispers it to the next person, through 10 people until it reaches the recipient.
* **Zustand Store** = Writing the message on a **Central Notice Board / Whiteboard** in the office. Any employee in any room can walk up, read it directly, or write an update. Everyone instantly gets the newest info without passing messages around!

**Technical Example — Prop Drilling vs Zustand Global Store:**

```typescript
// ❌ Old Way: Prop Drilling (passing props down through multiple component layers)
function ParentComponent() {
  const [user, setUser] = useState({ name: 'Vaibhav', role: 'admin' });
  return <Header user={user} setUser={setUser} />;
}
function Header({ user, setUser }) {
  return <UserBadge user={user} setUser={setUser} />; // Passed down again!
}
function UserBadge({ user }) {
  return <Text>Welcome, {user.name}</Text>;
}

// ✅ Clean Way: Zustand Global Store
import { create } from 'zustand';

// 1. Define Store ONCE (accessible anywhere in the app)
interface AuthState {
  user: { name: string; role: string } | null;
  setUser: (user: { name: string; role: string } | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// 2. Use directly in ANY component without props or provider wrappers!
function UserBadge() {
  // Subscribes ONLY to 'user' — re-renders ONLY when 'user' changes
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <View>
      <Text>Welcome, {user?.name}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

---

#### 💡 What is `persist` Middleware in Zustand?

**Simple explanation:**
By default, Zustand stores state only in **RAM memory**. When a user refreshes the browser page or closes and re-opens the React Native app, all data in RAM gets wiped out! 

`persist` middleware automatically connects Zustand to **permanent device storage** (`AsyncStorage` on mobile or `localStorage` on web). It saves state changes to disk automatically so that when the app restarts, your saved data (like logged-in user session, theme, or settings) is **restored automatically**.

**Why do we use `persist`? (In Simple Words):**
1. 🔑 **Keep User Logged In**: Stores auth tokens/user sessions permanently so users don't have to log in again every time they open the app.
2. ⚙️ **Save User Preferences**: Preserves app settings like dark mode, language, or saved filters across app restarts.
3. ⚡ **Zero Manual Storage Code**: You don't need to write manual `AsyncStorage.getItem()` or `localStorage.setItem()` calls inside components — `persist` handles saving and loading completely in the background.

**Real-life Analogy — Whiteboard vs Pocket Notebook:**
* **Standard Zustand (Without `persist`)** = Writing on a **Blackboard**. When the app closes/restarts, it's like a janitor erasing the board. Everything disappears!
* **Zustand with `persist`** = Writing in a **Notebook**. When the app closes/restarts, you close the notebook. When you re-open it, everything you wrote is still right there!

**Technical Example — Adding `persist` to Zustand:**

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: { name: string; token: string } | null;
  setUser: (user: { name: string; token: string } | null) => void;
}

// Wrap store definition inside `persist()`
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage', // Unique key in storage
      storage: createJSONStorage(() => AsyncStorage), // Automatically saves to phone storage!
    }
  )
);
```

---

### 3.5 TanStack React Query (v5)

> 📦 **Latest Stable Version:** `v5.102.8` (`@tanstack/react-query`) *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Server-state management library for API data fetching, caching, and state synchronization.
* 🎯 **Why do we use it?**: Fetches API data, caches responses in memory, manages loading/error flags, and refetches stale data automatically.
* 💡 **Key Advantage (Why this & why NOT useEffect + useState?)**: **Why TanStack Query over `useEffect` + `useState`?** `useEffect` requires manually writing loading state, error handling, and duplicate fetch calls. TanStack Query handles caching, background updates, and loading flags in 1 clean hook.

**Simple explanation:**
TanStack Query (React Query) is a **server-state manager** for React & React Native applications. It handles fetching data from the API, caching the results, showing loading/error states, and automatically refetching when data gets stale. It completely replaces `useEffect` + `useState` for API calls.

When your app needs data from a backend API (like fetching user profile, listing vehicles, or active bookings), TanStack Query handles the entire lifecycle — fetching, caching in memory, showing loading spinners, handling network errors, and automatically refreshing stale data when the user re-opens the app.

**Why Developers Love TanStack Query (In Simple Words):**
1. 🚫 **Zero `useEffect` & `useState` Mess**: No more writing `const [loading, setLoading] = useState(true)` or managing manual `useEffect` fetch loops for every API endpoint.
2. ⚡ **Automatic Smart Caching**: If a user navigates away from a screen and comes back 10 seconds later, TanStack Query instantly shows the cached data from memory instead of keeping the user waiting on a blank loading screen.
3. 🔄 **Auto-Refetching on Window Focus & Network Reconnect**: When the user unlocks their phone or turns on WiFi/mobile data, TanStack Query automatically refetches the newest data behind the scenes.
4. 🗑️ **Easy Data Invalidation (`invalidateQueries`)**: When a user creates a new booking via a POST request (Mutation), calling `queryClient.invalidateQueries(['bookings'])` automatically refetches and updates the booking list across the entire app!

**Quick Answer / Elevator Pitch:**
> *"TanStack Query manages server state, caching, background synchronization, and automatic re-fetching of backend data for React and React Native applications."*

**Real-life Analogy 1 — Smart Delivery Service with Tracking:**
> TanStack Query is like a **smart delivery service with tracking**. You request a package (API call). It tells you *"Arriving soon"* (loading state). When it arrives, it's stored at your door (cache). If you request it again within a short time, it gives you the one already at the door instead of ordering a new one.

**Real-life Analogy 2 — Smart Refrigerator vs Fetching Water from River:**
* **`useEffect` + `useState` (Without React Query)** = Every time you want a glass of cold water, you walk down to the river, fetch water in a bucket, boil it, cool it in ice, and serve it. You repeat this whole exhausting process EVERY single time you get thirsty!
* **TanStack Query** = A **Smart Refrigerator** right in your kitchen. When you're thirsty, you open the fridge and get cold water in 1 second (Cache). In the background, the smart fridge automatically refills itself from the water pipe so fresh cold water is always ready!

**Technical Examples — Basic & Advanced:**

#### 1. Basic Quick Comparison:
```typescript
// ❌ Old way with useEffect (messy, error-prone, zero caching)
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(false);
useEffect(() => {
  setLoading(true);
  fetch('/api/user').then(r => r.json()).then(setUser).finally(() => setLoading(false));
}, []);

// ✅ TanStack Query (clean, automatic caching, error handling)
const { data: user, isLoading } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => getUser(userId),
});
```

#### 2. Advanced Full Lifecycle Example (`useQuery`, `useMutation` & `invalidateQueries`):
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 1. READ Data (useQuery) — Automatically cached by unique key ['user', userId]
function UserProfile({ userId }) {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get(`/api/users/${userId}`),
    staleTime: 1000 * 60 * 5, // Data stays fresh in cache for 5 minutes (zero unnecessary API calls!)
  });

  if (isLoading) return <ActivityIndicator />;
  if (isError) return <Text>Error loading user!</Text>;
  return <Text>{user.name}</Text>;
}

// 2. WRITE Data (useMutation) — Automatically invalidates & updates list cache on success
function CreateBookingButton() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newBooking) => api.post('/api/bookings', newBooking),
    onSuccess: () => {
      // Automatically refetches & updates all screens listing ['bookings']!
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  return (
    <Button
      title="Create Booking"
      onPress={() => mutation.mutate({ vehicleId: 'VH-101' })}
    />
  );
}
```

---

### 3.6 Tailwind CSS

> 📦 **Latest Stable Version:** `v4.3.3` — Released July 16, 2026 *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Utility-first CSS styling framework.
* 🎯 **Why do we use it?**: Styles UI components directly inside JSX using utility classnames (`px-4 py-2 bg-blue-500`).
* 💡 **Key Advantage (Why this & why NOT StyleSheet.create?)**: **Why Tailwind over traditional `StyleSheet.create`?** Eliminates writing repetitive stylesheet objects, speeds up UI creation by 3x, and ensures design consistency across mobile and web.

**Simple explanation:**
Tailwind CSS is a **utility-first CSS framework**. Instead of writing custom CSS files, you apply small predefined classes directly in your HTML/JSX. `p-4` adds padding, `text-lg` makes text large, `bg-blue-500` makes a background blue.

**Quick Answer / Elevator Pitch:**
> *"Tailwind CSS is a utility-first styling framework that allows building custom responsive designs directly in JSX markup."*

**Real-life analogy:**
Traditional CSS is like **painting a wall from scratch every time**. Tailwind is like having **thousands of LEGO bricks** — you just snap together the pieces you need instantly.

**Technical example:**
```tsx
// ❌ Traditional CSS (write separate .css file)
<button className="submit-btn">Submit</button>
/* In CSS: .submit-btn { padding: 8px 16px; background: blue; color: white; } */

// ✅ Tailwind (everything inline, no separate file needed)
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
  Submit
</button>
```

---

### 3.7 React Hook Form + Zod

> 📦 **Latest Stable Versions:** React Hook Form `v7.87.0` (Aug 30, 2026) &nbsp;|&nbsp; Zod `v4.5.4` (Aug 29, 2026) *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: High-performance form state manager (React Hook Form) with schema validation (Zod).
* 🎯 **Why do we use it?**: Manages form inputs and validates payload data with strict TypeScript types before API submission.
* 💡 **Key Advantage (Why this & why NOT controlled component useState?)**: **Why RHF + Zod over controlled `useState` on every input?** Controlled state re-renders the entire screen on every single keypress (slow). RHF uses uncontrolled inputs for zero re-renders, and Zod validates complete form payloads before submission.

**Simple explanation:**
**React Hook Form** manages form state without re-rendering the entire component on every keystroke (making it extremely fast). **Zod** defines the validation rules using a schema. Together, they ensure form data is always valid TypeScript-typed data before it's submitted to the API.

**Technical example:**
```typescript
// 1. Define rules with Zod
const schema = z.object({
  phone: z.string().length(10, 'Phone must be 10 digits'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

// 2. Connect to React Hook Form
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
});

// 3. On submit, data is already validated and typed
const onSubmit = (data: z.infer<typeof schema>) => {
  // data.phone and data.otp are guaranteed to be correct
};
```

---

### 3.8 xior (HTTP Client)

> 📦 **Latest Stable Version:** `v0.8.4` — Released August 4, 2026 *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Lightweight HTTP client built on native `fetch` API.
* 🎯 **Why do we use it?**: Sends HTTP REST requests from frontend apps (`apps/app`, `apps/backoffice`) to NestJS API.
* 💡 **Key Advantage (Why this & why NOT Axios / raw fetch?)**: **Why xior over Axios or raw fetch?** Raw `fetch` lacks request/response interceptors and requires boilerplate error parsing. Axios has a larger bundle size. `xior` is lightweight, supports interceptors, and shares Axios-like syntax.

**Simple explanation:**
xior is the **messenger** between the frontend and the backend. When your React Native app needs to fetch a user's bookings, xior sends the HTTP request to your NestJS API and brings back the response. It is a lightweight alternative to Axios.

**Real-life analogy:**
xior is like a **courier service**. Your app (sender) writes a request letter, gives it to xior, and xior delivers it to the backend server and brings back the reply.

**Technical example:**
```typescript
// Configure once
const api = xior.create({ baseURL: 'https://api.yugo.com', timeout: 10000 });

// Use everywhere
const response = await api.get('/v1/bookings');
const booking = await api.post('/v1/bookings', { vehicleId: 'VH-123' });
```

---

### 3.9 FlashList (`@shopify/flash-list`)

> 📦 **Latest Stable Version:** `v2.3.2` — Released June 9, 2026 *(Requires React Native New Architecture) *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: High-performance recycled list component for React Native.
* 🎯 **Why do we use it?**: Renders long scrolling lists (bookings, vehicles, transactions) at buttery smooth 60 FPS.
* 💡 **Key Advantage (Why this & why NOT standard FlatList?)**: **Why FlashList over React Native FlatList?** Standard `FlatList` drops frames and lags when scrolling lists with 100+ items. `FlashList` recycles UI components in memory, maintaining 60 FPS scrolling speeds.

**Simple explanation:**
FlashList is a **high-performance list component** for React Native. The standard `FlatList` slows down significantly with long lists (hundreds of items). FlashList uses advanced recycling techniques to keep scrolling buttery smooth, even with thousands of items.

**Real-life analogy:**
Standard FlatList is like **reading from a printed book** — all pages exist in memory at once. FlashList is like an **e-reader** — it only renders the page you're looking at, reusing the display for each new page instantly.

---

## 💻 SECTION 4: Frontend Backoffice Admin

---

### 4.1 React Router v7

> 📦 **Latest Stable Version:** `v8.3.1` — Released August 2026 *(Project currently uses v7 — v8 upgrade is non-breaking) *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Routing framework for React web dashboards.
* 🎯 **Why do we use it?**: Handles file-based web routes, nested Sidebar layouts, and server data loaders in the backoffice admin app.
* 💡 **Key Advantage (Why this & why NOT client-side SPA routing?)**: **Why React Router v7 over client-side SPA routing?** Combines layout routing, server-side data loaders, and pending state transitions out of the box with zero setup.

**Simple explanation:**
React Router v7 is the **routing framework** for the admin web dashboard. It provides file-based routing (the file structure = the URL structure), nested layouts (a Sidebar that stays visible across pages), and loaders (fetch data before a page renders).

**Technical example:**
```text
app/routes/
├── layout.tsx          → Main layout (Sidebar + Header)
└── news/
    ├── route.tsx       → Wraps /news routes
    ├── _index/
    │   └── route.tsx   → /news (List page)
    └── create/
        └── route.tsx   → /news/create (Create page)
```

---

### 4.2 Radix UI

> 📦 **Latest Stable Version:** `radix-ui@1.6.7` *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Headless, accessible UI component primitives library.
* 🎯 **Why do we use it?**: Provides fully accessible UI building blocks (Dialogs, Dropdowns, Popovers, Tabs) for our admin web dashboard.
* 💡 **Key Advantage (Why this & why NOT Material UI / Ant Design?)**: **Why Radix UI over Material UI?** Material UI forces hard-to-override default styles. Radix UI provides 100% accessible logic (keyboard nav, screen readers) with zero default styling, letting us style freely with Tailwind.

**Simple explanation:**
Radix UI provides **headless, accessible UI primitives**. "Headless" means they have all the complex logic (keyboard navigation, screen reader support, focus management) built in, but absolutely no visual styling. You style them yourself with Tailwind.

**Real-life analogy:**
Radix UI is like a **car chassis from a factory** — the frame, engine, and safety systems are all there. But you choose the color, seats, and interior (Tailwind styles) yourself.

**Technical example:**
```tsx
// Radix provides the logic (open/close, keyboard nav, accessibility)
// Tailwind provides the visual style
<Dialog.Root>
  <Dialog.Trigger className="px-4 py-2 bg-blue-500 text-white rounded">
    Open Dialog
  </Dialog.Trigger>
  <Dialog.Content className="fixed inset-0 flex items-center justify-center bg-black/50">
    <div className="bg-white p-6 rounded-lg">
      <Dialog.Title>Confirm Action</Dialog.Title>
    </div>
  </Dialog.Content>
</Dialog.Root>
```

---

### 4.3 TanStack Table

> 📦 **Latest Stable Version:** `v9.2.4` (`@tanstack/react-table`) — Released August 28, 2026 *(Verified: Sep 6, 2026)*

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Headless data grid engine for React.
* 🎯 **Why do we use it?**: Manages complex admin data tables with sorting, filtering, row selection, and pagination.
* 💡 **Key Advantage (Why this & why NOT writing custom table code?)**: **Why TanStack Table over writing custom table code?** Writing custom sorting, filtering, and multi-page pagination math takes hundreds of bug-prone lines. TanStack Table handles all grid calculations headlessly.

**Simple explanation:**
TanStack Table is a **headless data grid engine** for React. It provides all the complex logic for sortable, filterable, paginated tables without any styling. You plug it in and style it with Tailwind.

**Real-life analogy:**
TanStack Table is like an **invisible spreadsheet engine**. It handles all the sorting and filtering math. You decide how the cells look.

---

## 📦 SECTION 5: Custom Internal Packages (Deep Dive)

---

### 5.1 `@yugo/cqrs`

> 🔤 **Full Form:** `@yugo/` = Internal Yugo package &nbsp;|&nbsp; `cqrs` = **C**ommand **Q**uery **R**esponsibility **S**egregation

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Custom internal shared package containing all Command & Query definitions and handlers.
* 🎯 **Why do we use it?**: Shared by `apps/api` AND `apps/henchmen` so both can execute the same business logic without duplicating code.
* 💡 **Key Advantage (Why this & why NOT copy-pasting code?)**: **Why a shared package over duplicating?** If `CreateBookingCommand` lives in `apps/api` only, `apps/henchmen` can't use it. By putting it in `@yugo/cqrs`, both apps import and execute the exact same handler. One change, both apps updated. ✅

**Simple explanation:**

Think of `@yugo/cqrs` as the **company's official action book 📖**. Every business operation in the entire Yugo system — creating a booking, activating a plan, syncing a battery — is defined as a **Command** (write) or **Query** (read) inside this one shared package.

Both `apps/api` (the REST API) and `apps/henchmen` (the background worker) read from this same action book. They never write their own version of `CreateBookingCommand` separately.

**Why do we use `@yugo/cqrs`? (In Simple Words)**
1. 📦 **Single Source of Truth**: `CreateBookingCommand`, `GetUserQuery`, `ActivatePlanCommand` — all defined once here. Zero duplication.
2. 🔄 **Shared Between Two Apps**: `apps/api` handles HTTP requests → dispatches Commands. `apps/henchmen` handles background jobs → also dispatches the same Commands. Both import from the same place.
3. 🐛 **Zero Sync Bugs**: Without this, if you rename a field in `CreateBookingCommand` in `apps/api` but forget to update it in `apps/henchmen`, you get silent bugs. With a shared package, there's only ONE file to change.

**Quick Answer / Elevator Pitch:**
> *"`@yugo/cqrs` is the central shared package containing all Command & Query definitions used by both the REST API and the background worker. One change = both apps updated."*

**Real-life Analogy — Company's Official Procedure Manual:**
> Imagine a company has two teams: **Team A** (handles customer calls) and **Team B** (handles deliveries in the background).
>
> Both teams need to follow the exact same procedure for *"How to Create a New Booking"*.
>
> **Without `@yugo/cqrs`**: Team A writes their own procedure on paper. Team B writes their own copy separately. When the process changes, someone forgets to update Team B's copy → chaos! 😱
>
> **With `@yugo/cqrs`**: There's ONE official company procedure manual on the shared shelf. Both teams read from the **same book**. Manager updates one book → both teams immediately follow the new process! 📖✅

**What's inside `@yugo/cqrs`:**

```
packages/nestjs/cqrs/
├── commands/
│   ├── create-booking.command.ts     ← defines CreateBookingCommand
│   ├── activate-plan.command.ts      ← defines ActivatePlanCommand
│   └── sync-battery.command.ts       ← defines SyncBatteryCommand
├── queries/
│   ├── get-user.query.ts             ← defines GetUserQuery
│   ├── list-bookings.query.ts        ← defines ListBookingsQuery
│   └── get-active-plan.query.ts      ← defines GetActivePlanQuery
└── handlers/
    ├── create-booking.handler.ts     ← actual logic for CreateBookingCommand
    ├── get-user.handler.ts           ← actual logic for GetUserQuery
    └── ...
```

**Technical Example — How Both Apps Use the Same Package:**

```typescript
// ✅ apps/api — HTTP request comes in, dispatches Command from shared package
import { CreateBookingCommand } from '@yugo/cqrs'; // ← shared package

@Controller('bookings')
export class BookingsController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  async createBooking(@Body() dto: CreateBookingDTO) {
    // Uses the SAME Command from @yugo/cqrs
    return this.commandBus.execute(new CreateBookingCommand(dto));
  }
}

// ✅ apps/henchmen — Background job also dispatches the SAME Command!
import { CreateBookingCommand } from '@yugo/cqrs'; // ← SAME shared package

@InngestFunction({ event: 'plan/activated' })
async handlePlanActivated({ event }) {
  // Reuses the exact SAME CreateBookingCommand — zero code duplication!
  await this.commandBus.execute(new CreateBookingCommand(event.data));
}
```

> 💡 **Key insight**: If `CreateBookingCommand` was defined inside `apps/api` only, `apps/henchmen` could never import it (circular dependency). The shared `@yugo/cqrs` package solves this cleanly.

---

### 5.2 `@yugo/nestjs-database`

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Shared package containing all TypeORM database Entities.
* 🎯 **Why do we use it?**: Defines database models (`UserEntity`, `BookingEntity`, `VehicleEntity`) in one central location.
* 💡 **Key Advantage**: Guarantees API and background worker apps interact with identical database schemas without drift.

**What it does:** Contains all TypeORM entities (the TypeScript classes that map to database tables) in one place. Every entity (User, Booking, Vehicle, Battery, etc.) lives here.

**Why it's separate:** Both `apps/api` and `apps/henchmen` read and write to the same database. Instead of defining the `UserEntity` twice, it's defined once here and imported by both.

**Simple explanation:**
Both `apps/api` and `apps/henchmen` read and write to the same database. Instead of defining `UserEntity` twice, it's defined **once here** and imported by both.

**Analogy:** 🏛️ **One official blueprint** of your database. Everyone reads from the same map — no one draws their own version and gets confused!

```typescript
// Defined ONCE in @yugo/nestjs-database
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
}

// apps/api uses it ✅
import { UserEntity } from '@yugo/nestjs-database';

// apps/henchmen uses the SAME ✅ — zero duplication
import { UserEntity } from '@yugo/nestjs-database';
```

---

### 5.3 `@yugo/nestjs-casl`

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Shared NestJS module for CASL authorization.
* 🎯 **Why do we use it?**: Provides access guards and permission services to NestJS controllers.
* 💡 **Key Advantage**: Centralizes security guards so authorization logic isn't rewritten in multiple apps.

**What it does:** Contains the CASL authorization logic — the rules that define "who can do what." The `access.service.ts` and `access.guard.ts` used in your NestJS controllers come from this package.

**Simple explanation:**
Contains the CASL authorization wiring for NestJS — `AccessGuard`, `AccessService`, and permission helpers. Any controller imports this and gets full permission checking in 1 line.

**Analogy:** 🛡️ One **shared security rulebook** for all guards at every door in the building. No one prints their own version!

```typescript
import { AccessGuard } from '@yugo/nestjs-casl';

@Controller('bookings')
@UseGuards(AccessGuard) // ← one import, full CASL protection ✅
export class BookingsController {}
```

---

### 5.4 `@yugo/nestjs-inngest`

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Shared NestJS module wrapper for Inngest background jobs.
* 🎯 **Why do we use it?**: Connects NestJS dependency injection with Inngest job handlers.
* 💡 **Key Advantage**: Lets background worker functions inject NestJS services (`@Injectable()`) cleanly.

**What it does:** Provides the NestJS wiring for Inngest background jobs — the module setup, the `@InngestFunction` decorator, and the types needed to define and trigger background functions.

**Simple explanation:**
Inngest runs in its own world. Without this package, Inngest functions have no access to NestJS services (EmailService, FcmService, etc.). This wrapper bridges the two worlds.

**Analogy:** 🔌 An **adapter plug** connecting Inngest's world to NestJS's world — so background jobs behave like normal NestJS code.

```typescript
import { InngestFunction } from '@yugo/nestjs-inngest';

@InngestFunction({ event: 'user/registered' })
async handleUserRegistered({ event }: InngestEventContext) {
  // ✅ Can use any NestJS service here — fully injected!
  await this.emailService.sendWelcome(event.data.userId);
}
```

---

### 5.5 `@yugo/nestjs-fcm`

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Shared NestJS wrapper for Firebase Cloud Messaging (FCM).
* 🎯 **Why do we use it?**: Sends push notifications to iOS and Android mobile devices.
* 💡 **Key Advantage**: Abstracts Google FCM SDK into a simple service method (`sendPushNotification()`).

**What it does:** Firebase Cloud Messaging (FCM) is Google's service for sending push notifications to mobile devices. This package wraps the FCM SDK into a clean NestJS module.

**Real-life analogy:** When you get a WhatsApp notification on your phone, WhatsApp's server told Google's FCM service "send this notification to device X." FCM delivers it to the phone. This package is the code that sends that message to FCM.

**Simple explanation:**
FCM is Google's delivery system for push notifications. This package wraps the FCM SDK into a clean NestJS service — you just call one method and the notification goes to the user's phone.

**Analogy:** 📬 **FCM = India Post** (delivers to phone). **`@yugo/nestjs-fcm` = post office counter** — hand it the message + address, it handles the rest!

```typescript
import { FcmService } from '@yugo/nestjs-fcm';

// Send push notification in 1 line ✅
await this.fcmService.sendPushNotification({
  token: user.deviceToken,
  title: 'Booking Confirmed! 🎉',
  body: 'Your vehicle is ready for pickup.',
});
```

---

### 5.6 `@yugo/shared`

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Shared package containing constants, types, and enums.
* 🎯 **Why do we use it?**: Shared across backend (`apps/*`) and frontend (`apps/app`, `apps/backoffice`).
* 💡 **Key Advantage**: Prevents enum mismatch (e.g. `BookingStatus.ACTIVE`) between backend and frontend.

**What it does:** Contains TypeScript enums and constants that are used by **both the backend and the frontend**. For example, the `BookingStatus` enum (values like `PENDING`, `ACTIVE`, `COMPLETED`) is defined here once and imported by both the NestJS API and the React Native app.

**Why it matters:** Without this, you'd have to define `BookingStatus` in two places and risk them getting out of sync.

**Simple explanation:**
If the backend sends `status: "active"` but the mobile app checks for `status: "ACTIVE"` — they'll never match! `@yugo/shared` is the **shared dictionary** both sides agree on.

**Analogy:** 📋 One **shared language dictionary** — backend and frontend both speak the same words so they always understand each other!

```typescript
// Defined ONCE in @yugo/shared
export enum BookingStatus {
  PENDING   = 'PENDING',
  ACTIVE    = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

// apps/api (backend) ✅
import { BookingStatus } from '@yugo/shared';
booking.status = BookingStatus.ACTIVE;

// apps/app (React Native) ✅ — SAME enum, zero mismatch!
import { BookingStatus } from '@yugo/shared';
if (booking.status === BookingStatus.ACTIVE) { ... }
```

---

### 5.7 `@yugo/utils`

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Shared helper functions package.
* 🎯 **Why do we use it?**: Provides date formatting, string transformations, and common math utilities.
* 💡 **Key Advantage**: Prevents copying utility helper functions across different apps in the repo.

**What it does:** A collection of pure utility/helper functions used across the project. Examples: date formatting, string manipulation, math helpers.

**Simple explanation:**
A toolbox of small reusable functions that don't belong to any one app — things like formatting dates, truncating strings, rounding numbers etc.

**Analogy:** 🧰 A **shared toolbox** in an office. Instead of every employee buying their own hammer, everyone borrows from the same shared toolbox!

```typescript
// Defined ONCE in @yugo/utils
export const formatDate = (date: Date) => date.toLocaleDateString('en-IN');
export const truncate   = (str: string, len: number) => str.slice(0, len) + '...';

// Used anywhere in the monorepo ✅
import { formatDate, truncate } from '@yugo/utils';
formatDate(booking.createdAt); // "06/09/2026"
truncate(user.bio, 50);        // "Hello I am Vaibhav..."
```

---

### 5.8 `@yugo/permissions`

**⚡ Developer Quick Summary:**
* ❓ **What is this?**: Shared policy rulebook package for CASL permissions.
* 🎯 **Why do we use it?**: Defines the central matrix of what actions each user role can perform.
* 💡 **Key Advantage**: Provides one single source of truth for company security permissions.

**What it does:** Contains the **policy map** — the central file that defines every permission rule in the system. It lists every possible action (Create, Read, Update, Delete) on every subject (User, Booking, Vehicle) and which roles can perform them.

**Real-life analogy:** This is the **official rulebook of the company's security policy** — "Admins can do X, Managers can do Y, Employees can only do Z." The CASL library then enforces these rules.

**Simple explanation:**
Every `can()` and `cannot()` permission rule for every user role lives here. `@yugo/nestjs-casl` reads these rules and enforces them everywhere automatically.

**Analogy:** 📖 **Official company security policy document.** HR writes it once. Every guard at every department door enforces the same rules from the same book!

```typescript
// Defined ONCE in @yugo/permissions
export function definePermissionsFor(user: UserEntity) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (user.role === 'admin') {
    can('manage', 'all');                          // Admin = full access ✅
  } else {
    can('read', 'Booking', { userId: user.id });   // User reads OWN bookings only
    cannot('delete', 'Booking');                   // User can NEVER delete
  }

  return build();
}
```

---

## ⚡ SECTION 6: 1-Minute Developer Cheat-Sheet (Ultimate Quick-Read Overview)

> 💡 **How to use this section**: Read this 1-minute summary once to understand what every single technology does, why it exists in our project, and its real-life analogy in super simple terms.

---

### 🏗️ Monorepo & Core Infrastructure

| # | Tech | 📦 Version | ❓ What is it? | 🎯 Why do we use it in Yugo? | ⚡ One Line |
|---|---|---|---|---|---|
| 1 | **Turborepo** | `v2.10.0` | Monorepo Build System | Runs builds, tests & lints in parallel; caches results to skip unchanged code. | Build all apps with 1 command, skip what hasn't changed. Saves 90% build time. |
| 2 | **Yarn Workspaces** | `v4.18.0` | Monorepo Package Linker | Shares `node_modules` and links internal `packages/*` directly to `apps/*`. | One shared `node_modules` for all apps. Local packages importable like npm packages. |
| 3 | **TypeScript** | `v7.0.2` | Typed JavaScript | Adds strict type labels (`: string`, `: number`) to prevent bugs while coding. | JavaScript with labels — catches typos & bugs before the app runs. |
| 4 | **ESLint & Prettier** | ESLint `v10.10.0` / Prettier `v3.9.6` | Linter & Auto-Formatter | ESLint catches bugs; Prettier auto-formats code on save across team. | ESLint = grammar checker. Prettier = auto-formats code on save. Zero style arguments. |

---

### ⚙️ Backend Services (`apps/api` & `apps/henchmen`)

| # | Tech | 📦 Version | ❓ What is it? | 🎯 Why do we use it in Yugo? | ⚡ One Line |
|---|---|---|---|---|---|
| 5 | **Henchmen** | NestJS `v12.0.0` | Dedicated Background Worker | Runs heavy background jobs (SMS, FCM push, cron tasks) via Inngest without blocking API responses. | Separate background app that handles heavy tasks so the main API stays fast. |
| 6 | **NestJS** | `v12.0.0` | Enterprise Backend Framework | Modular framework using Dependency Injection, Controllers, Services & Guards. | Structured backend framework — clean modules, controllers, services, guards. No spaghetti code. |
| 7 | **TypeORM** | `v1.0.0` | TypeScript SQL ORM | Maps TypeScript classes (Entities) to MySQL tables so you write TypeScript instead of raw SQL strings. | Write TypeScript classes instead of raw SQL. Auto-generates all queries. |
| 8 | **MySQL** | `v9.3.0` | Relational Database | Stores permanent structured data (users, bookings, vehicles, plans) in linked tables. | The main database. Stores all app data in linked tables permanently. |
| 9 | **Redis** | `v8.0.2` | Ultra-Fast In-Memory RAM Store | Stores temporary data (OTPs, session tokens, API cache) in computer RAM at 1ms speed. | Ultra-fast RAM storage for OTPs, tokens & cache. 1000x faster than MySQL. |
| 10 | **CQRS** | Custom `@yugo/cqrs` | Read/Write Separation Pattern | Separates Write actions (Commands) from Read actions (Queries) into small dedicated handlers. | Write code and Read code live in separate files. Never mix them. |
| 11 | **Inngest** | `v4.19.0` | Event-Driven Background Job Engine | Queues async background workflows with automatic retries so API responds in ~50ms. | Fire background tasks (emails, push notifications) without making users wait. Auto-retries if failed. |
| 12 | **TypeBox** | `v1.3.16` | High-Speed JSON Schema & Type Inferencer | Defines DTO schema ONCE to get both runtime validation AND TypeScript types for free (100x faster than class-validator). | Write data shape once → get validation + TypeScript type automatically. No duplicate code. |
| 13 | **CASL** | `v7.0.1` | Attribute-Based Authorization | Controls fine-grained user permissions (`can('read', 'Booking')`). | Controls who can do what — Admin sees all, User sees only their own data. |
| 14 | **Passport.js** | `v0.7.0` | Authentication Middleware | Verifies signed JWT tokens on incoming HTTP request headers to authenticate user identity. | Checks JWT token on every request — Is this user logged in? Is token expired? |
| 15 | **Swagger / OpenAPI** | `@nestjs/swagger@11.x` | Visual API Doc Generator | Auto-generates an interactive webpage from TypeBox DTOs for testing API without Postman. | Auto-generates a live webpage showing all API endpoints. No Postman needed. |
| 16 | **Pino** | `v10.3.1` | High-Speed JSON Logger | Writes ultra-fast JSON logs filterable by `userId` or `statusCode` in CloudWatch/Datadog. | Fastest Node.js logger. Writes structured JSON logs instead of messy `console.log`. |
| 17 | **Handlebars** | `v4.7.8` | Email HTML Template Engine | Compiles HTML email templates with dynamic placeholders like `{{userName}}`. | HTML email templates with `{{name}}` placeholders. Fill data at runtime, send email. |

---

### 📱 Frontend Mobile App (`apps/app`)

| # | Tech | 📦 Version | ❓ What is it? | 🎯 Why do we use it in Yugo? | ⚡ One Line |
|---|---|---|---|---|---|
| 18 | **React Native** | `v0.87.1` | Cross-Platform Mobile Framework | Writes one TypeScript codebase compiled into native iOS & Android apps. | One codebase → real native iOS & Android apps. No separate Swift/Kotlin needed. |
| 19 | **Expo** | `SDK 57` | React Native Toolkit & Platform | Accesses phone hardware (Camera, GPS), builds binaries (EAS), & pushes Over-The-Air (OTA) updates. | Toolkit on top of React Native — camera, GPS, cloud builds & OTA updates all in one. |
| 20 | **Expo Router** | `v57.0.18` | File-Based Mobile Router | Maps directory file structure (`src/app/profile.tsx`) directly to mobile screen route `/profile`. | Create a file → screen route automatically exists. Folder = URL. |
| 21 | **Zustand** | `v5.0.15` | Global Client State Store | Lightweight state store accessible across all components without prop drilling or Provider wrappers. | Global state in 5 lines. Any component reads/writes it directly. No Provider needed. |
| 22 | **Zustand Persist** | `v5.0.15` | Storage Persistence Middleware | Automatically saves Zustand state to phone storage (`AsyncStorage`) so user stays logged in on app restart. | Saves state to phone storage. User stays logged in even after app restart. |
| 23 | **TanStack Query** | `v5.102.8` | Server State & Caching Manager | Fetches API data, caches in RAM, manages loading spinners, and auto-refetches stale data. | Fetches & caches API data. No `useEffect` needed. Auto-shows loading, error, refetches stale data. |
| 24 | **Tailwind CSS** | `v4.3.3` | Utility-First Styling Framework | Styles UI components inline using utility classes (`px-4 py-2 bg-blue-500`). | Style everything with class names directly in JSX. No separate CSS files ever. |
| 25 | **React Hook Form + Zod** | RHF `v7.87.0` / Zod `v4.5.4` | Form State Manager & Schema Validator | Manages input state with zero re-renders on keypress and validates payloads with Zod schemas. | RHF = form with zero re-renders. Zod = validates data before submit. Together = fast & safe forms. |
| 26 | **xior** | `v0.8.4` | Lightweight HTTP Client | Sends REST HTTP requests from app to NestJS backend with interceptor support. | Lightweight Axios alternative. Sends HTTP requests from app to backend. Supports interceptors. |
| 27 | **FlashList** | `v2.3.2` | High-Speed Recycled List | Renders 1,000+ items at smooth 60 FPS by recycling UI components in memory. | Replaces FlatList. Renders only visible items, recycles the rest. Smooth 60 FPS always. |

---

### 💻 Frontend Backoffice Admin (`apps/backoffice`)

| # | Tech | 📦 Version | ❓ What is it? | 🎯 Why do we use it in Yugo? | ⚡ One Line |
|---|---|---|---|---|---|
| 28 | **React Router v7** | `v8.3.1` (latest) | Full-Stack Web Framework | Handles file routing, nested Sidebar layouts, and server data loaders for admin dashboard. | File = Route. Sidebar stays, inner page changes on URL change. No full reload. |
| 29 | **Radix UI** | `v1.6.7` | Headless Accessible UI Primitives | Provides 100% accessible logic (Dialogs, Dropdowns, Tabs) styled freely with Tailwind. | Ready-made Dialog/Dropdown/Tab logic with zero CSS. Style 100% yourself with Tailwind. |
| 30 | **TanStack Table** | `v9.2.4` | Headless Data Grid Engine | Manages sorting, filtering, row selection, and pagination logic for admin web tables. | Invisible spreadsheet engine — handles sorting, filtering, pagination. You just build the UI. |

---

### 📦 Custom Internal Packages (`packages/*`)

| # | Package | ❓ What does it contain? | 🎯 Why is it separate? |
|---|---|---|---|
| 31 | **`@yugo/cqrs`** | Shared Command & Query definitions & handlers | Shared between `apps/api` and `apps/henchmen` to avoid duplicate business logic code. |
| 32 | **`@yugo/nestjs-database`** | Central TypeORM Entities (`UserEntity`, `BookingEntity`) | Single database model definition shared by REST API and background worker. |
| 33 | **`@yugo/nestjs-casl`** | Shared CASL access guards & access services | Centralizes security guards so authorization logic isn't rewritten in multiple apps. |
| 34 | **`@yugo/nestjs-inngest`** | Shared Inngest module wrappers & decorators | Connects NestJS dependency injection with Inngest background job functions. |
| 35 | **`@yugo/nestjs-fcm`** | Firebase Cloud Messaging wrapper module | Simplifies sending push notifications to mobile devices via clean NestJS service method. |
| 36 | **`@yugo/shared`** | Shared TypeScript enums, types, and constants | Shared between backend (`apps/*`) and frontend (`apps/app`) to prevent enum mismatches. |
| 37 | **`@yugo/utils`** | Pure helper utility functions (dates, math, strings) | Prevents copying utility functions across different workspace projects. |
| 38 | **`@yugo/permissions`** | Central policy rulebook for CASL permissions | Official security matrix defining what actions each role (Admin, User) can perform. |

---
*End of Technology Stack Deep Dive & Ultimate 1-Minute Developer Cheat-Sheet.*

---

> 📅 **Version Note:** All latest stable versions listed in this document were verified on **September 6, 2026**. Technology versions change frequently — always cross-check with the official npm registry (`npmjs.com`) or the project's official documentation before upgrading.

---

## 📖 APPENDIX: Full Forms & Acronyms Quick Reference

> 💡 **How to use:** Every time you see a technical acronym, look it up here. Read this once and you'll never wonder what these abbreviations stand for!

| Acronym | 🔤 Full Form | 🧩 Breakdown | 💬 Simple Meaning (1 line) |
|---|---|---|---|
| **API** | **A**pplication **P**rogramming **I**nterface | Application = Software App &nbsp;\| Programming = Code &nbsp;\| Interface = Contract/Bridge | A set of rules that lets two software systems talk to each other. Like a menu at a restaurant — you order from it without knowing how the kitchen works. |
| **CASL** | **C**ode **A**ccess **S**ecurity **L**ayer | Code = Software &nbsp;\| Access = Permission &nbsp;\| Security = Protection &nbsp;\| Layer = A module on top | Authorization library that controls user permissions — answers *"Is this user allowed to do this action on this resource?"* e.g. `can('read', 'Booking')` |
| **TypeORM** | **Type**Script **O**bject-**R**elational **M**apper | Type = TypeScript &nbsp;\| ORM = Object-Relational Mapper | Maps TypeScript class objects (Entities) to SQL database tables — so you write TypeScript instead of raw SQL strings like `SELECT * FROM users`. |
| **CQRS** | **C**ommand **Q**uery **R**esponsibility **S**egregation | Command = Write/mutate data &nbsp;\| Query = Read/fetch data &nbsp;\| Responsibility Segregation = Strictly separate them | Design pattern that keeps all code that **changes** data (Commands) in completely **separate files** from code that **reads** data (Queries). No mixing allowed! |
| **ORM** | **O**bject-**R**elational **M**apper | Object = TypeScript class &nbsp;\| Relational = SQL Database &nbsp;\| Mapper = Translator between them | A translator that converts TypeScript code into SQL database queries automatically. |
| **JWT** | **J**SON **W**eb **T**oken | JSON = Data format &nbsp;\| Web = Internet &nbsp;\| Token = Digital key | A signed digital ID card that proves who you are. Sent in every API request header to authenticate the user. |
| **OTP** | **O**ne-**T**ime **P**assword | One-Time = Single use &nbsp;\| Password = Secret code | A temporary 6-digit code (like the one sent to your phone) that expires after a short time. Stored in Redis. |
| **FCM** | **F**irebase **C**loud **M**essaging | Firebase = Google's backend platform &nbsp;\| Cloud = Remote server &nbsp;\| Messaging = Notifications | Google's service for sending push notifications to Android & iOS devices. Used in `@yugo/nestjs-fcm`. |
| **DTO** | **D**ata **T**ransfer **O**bject | Data = Information &nbsp;\| Transfer = Moving between layers &nbsp;\| Object = Structured data shape | A TypeScript object that defines the exact shape of data sent in an HTTP request body. Validated by TypeBox. |
| **EAS** | **E**xpo **A**pplication **S**ervices | Expo = Expo platform &nbsp;\| Application = Mobile app &nbsp;\| Services = Cloud build/update tools | Expo's cloud service for building, submitting, and sending OTA updates for React Native mobile apps. |
| **OTA** | **O**ver-**T**he-**A**ir | Over-the-Air = Wirelessly without app store | A method to push JavaScript bundle updates to users' phones instantly — without requiring a new App Store/Play Store release. |
| **REST** | **RE**presentational **S**tate **T**ransfer | Representational = Data representation &nbsp;\| State = Resource state &nbsp;\| Transfer = Send over HTTP | A standard set of rules for how HTTP APIs should be designed. Uses `GET`, `POST`, `PUT`, `DELETE` methods. Our `apps/api` is a REST API. |
| **RDBMS** | **R**elational **D**ata**b**ase **M**anagement **S**ystem | Relational = Linked tables &nbsp;\| Database = Data store &nbsp;\| Management System = Software to manage it | Software that stores data in linked tables (like Excel sheets). MySQL is our RDBMS. |

---
*📅 Acronym reference last updated: September 6, 2026.*

