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

**Simple explanation:**
MySQL is a **relational database** — think of it as a collection of Excel spreadsheets. Each "table" is a spreadsheet (e.g., `users`, `bookings`, `vehicles`). Rows are records, columns are fields. Tables can be linked together (e.g., a booking is linked to a user and a vehicle).

**Quick Answer / Elevator Pitch:**
> *"MySQL is our primary relational database for storing structured application data across linked tables."*

**Real-life analogy:**
MySQL is like a **well-organized filing cabinet**. Every drawer (table) holds records (rows). When you need to find a booking, you open the Bookings drawer and find the row by ID.

---

### 2.4 Redis

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

**Simple explanation:**
Passport.js handles the "Who are you?" question. When you log in, the server gives you a **JWT token** (like a digital ID card). Every subsequent request you make carries this token. Passport verifies it is valid and tells NestJS who you are.

**Quick Answer / Elevator Pitch:**
> *"Passport.js handles user authentication by verifying signed JSON Web Tokens (JWT) on incoming requests."*

**Real-life analogy:**
Logging in = Getting a hotel key card at check-in. Every time you want to enter your room (make an API request), you scan the key card (send the JWT). The door (Passport) checks if the card is valid.

**Technical example:**
```typescript
// Every protected request automatically validated by Passport
// The JWT is decoded and user is attached to req.user
@Get('profile')
@UseGuards(AppAuthGuard) // Passport runs here
getProfile(@Req() req: Request) {
  return req.user; // Already decoded from JWT
}
```

---

### 2.10 Swagger / OpenAPI

**Simple explanation:**
Swagger automatically generates a **visual documentation website** for your API. It shows every available endpoint, what parameters they accept, and what they return. Developers and frontend teams use it to understand how to use the backend without reading source code.

**Quick Answer / Elevator Pitch:**
> *"Swagger automatically generates interactive OpenAPI documentation for testing and integrating backend REST APIs."*

**Real-life analogy:**
Swagger is like the **menu of a restaurant**. As a customer (frontend developer), you don't need to go into the kitchen (backend code) to know what's available. The menu (Swagger UI) tells you exactly what you can order and how.

---

### 2.11 Pino (Logging)

**Simple explanation:**
Pino is an extremely fast logger. Instead of `console.log`, production applications use structured loggers like Pino that write logs in JSON format, which can be easily searched, filtered, and monitored in services like Datadog or CloudWatch.

**Quick Answer / Elevator Pitch:**
> *"Pino is a low-overhead, high-speed structured JSON logger for Node.js production applications."*

**Technical example:**
```typescript
// ❌ console.log — unstructured, slow
console.log('User created: ' + userId);

// ✅ Pino — structured, fast, filterable
logger.info({ userId, action: 'user.created' }, 'User created successfully');
```

---

### 2.12 Handlebars (Email Templates)

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

**Simple explanation:**
React Native lets you write **one codebase in JavaScript/TypeScript** and deploy it as a real native app on both iOS and Android. Unlike a website in a browser, React Native apps use actual native UI components (real buttons, real text inputs) from iOS and Android.

**Quick Answer / Elevator Pitch:**
> *"React Native is a cross-platform mobile framework allowing us to build native iOS and Android apps using React and TypeScript."*

**Real-life analogy:**
Without React Native, building a mobile app is like having to write the same book in two different languages separately. React Native lets you write it once and have it automatically translated into both languages.

---

### 3.2 Expo

**Simple explanation:**
Expo is a **toolkit and platform built on top of React Native** that makes development dramatically easier. It provides a standard way to access native device features (camera, GPS, biometrics), build your app (EAS Build), and push updates over-the-air (OTA).

**Quick Answer / Elevator Pitch:**
> *"Expo is a development ecosystem and native module framework built on React Native for rapid building, EAS deployment, and OTA updates."*

**Real-life analogy:**
React Native is the engine. Expo is the fully equipped car around it — dashboard, air conditioning, GPS, automatic transmission — so you can just drive without worrying about engine internals.

---

### 3.3 Expo Router

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

**Simple explanation:**
Zustand is a **global state store** for React. When data needs to be accessible across many unrelated components (like the logged-in user's name in both the header and the settings page), you store it in Zustand instead of passing it as props through every component.

**Quick Answer / Elevator Pitch:**
> *"Zustand is a lightweight, boilerplate-free state management library for managing global client-side state."*

**Real-life analogy:**
Zustand is like a **shared whiteboard** in an office. Anyone can walk up and read what's written on it. Anyone can update it. Everyone automatically sees the latest version.

**Technical example:**
```typescript
// Define the store
const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// Use in any component anywhere in the app
const { user } = useAuthStore();
```

---

### 3.5 TanStack React Query (v5)

**Simple explanation:**
TanStack Query is a **server state manager**. It handles fetching data from the API, caching the results, showing loading/error states, and automatically refetching when data gets stale. It completely replaces `useEffect` + `useState` for API calls.

**Quick Answer / Elevator Pitch:**
> *"TanStack Query manages server state, caching, synchronization, and automatic re-fetching of backend data."*

**Real-life analogy:**
TanStack Query is like a **smart delivery service with tracking**. You request a package (API call). It tells you "Arriving soon" (loading state). When it arrives, it's stored at your door (cache). If you request it again within a short time, it gives you the one already at the door instead of ordering a new one.

**Technical example:**
```typescript
// ❌ Old way with useEffect (messy, error-prone)
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

---

### 3.6 Tailwind CSS

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

**Simple explanation:**
FlashList is a **high-performance list component** for React Native. The standard `FlatList` slows down significantly with long lists (hundreds of items). FlashList uses advanced recycling techniques to keep scrolling buttery smooth, even with thousands of items.

**Real-life analogy:**
Standard FlatList is like **reading from a printed book** — all pages exist in memory at once. FlashList is like an **e-reader** — it only renders the page you're looking at, reusing the display for each new page instantly.

---

## 💻 SECTION 4: Frontend Backoffice Admin

---

### 4.1 React Router v7

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

**Simple explanation:**
TanStack Table is a **headless data grid engine** for React. It provides all the complex logic for sortable, filterable, paginated tables without any styling. You plug it in and style it with Tailwind.

**Real-life analogy:**
TanStack Table is like an **invisible spreadsheet engine**. It handles all the sorting and filtering math. You decide how the cells look.

---

## 📦 SECTION 5: Custom Internal Packages (Deep Dive)

---

### 5.1 `@yugo/cqrs`

**What it does:** Contains all the Command definitions, Query definitions, and their handlers for the entire application's business logic. Shared between `apps/api` and `apps/henchmen`.

**Why it's separate:** Both the REST API and the Henchmen background worker need to execute the same commands (e.g., `CreateUserCommand`). By putting them in a shared package, we avoid code duplication.

---

### 5.2 `@yugo/nestjs-database`

**What it does:** Contains all TypeORM entities (the TypeScript classes that map to database tables) in one place. Every entity (User, Booking, Vehicle, Battery, etc.) lives here.

**Why it's separate:** Both `apps/api` and `apps/henchmen` read and write to the same database. Instead of defining the `UserEntity` twice, it's defined once here and imported by both.

---

### 5.3 `@yugo/nestjs-casl`

**What it does:** Contains the CASL authorization logic — the rules that define "who can do what." The `access.service.ts` and `access.guard.ts` used in your NestJS controllers come from this package.

---

### 5.4 `@yugo/nestjs-inngest`

**What it does:** Provides the NestJS wiring for Inngest background jobs — the module setup, the `@InngestFunction` decorator, and the types needed to define and trigger background functions.

---

### 5.5 `@yugo/nestjs-fcm`

**What it does:** Firebase Cloud Messaging (FCM) is Google's service for sending push notifications to mobile devices. This package wraps the FCM SDK into a clean NestJS module.

**Real-life analogy:** When you get a WhatsApp notification on your phone, WhatsApp's server told Google's FCM service "send this notification to device X." FCM delivers it to the phone. This package is the code that sends that message to FCM.

---

### 5.6 `@yugo/shared`

**What it does:** Contains TypeScript enums and constants that are used by **both the backend and the frontend**. For example, the `BookingStatus` enum (values like `PENDING`, `ACTIVE`, `COMPLETED`) is defined here once and imported by both the NestJS API and the React Native app.

**Why it matters:** Without this, you'd have to define `BookingStatus` in two places and risk them getting out of sync.

---

### 5.7 `@yugo/utils`

**What it does:** A collection of pure utility/helper functions used across the project. Examples: date formatting, string manipulation, math helpers.

---

### 5.8 `@yugo/permissions`

**What it does:** Contains the **policy map** — the central file that defines every permission rule in the system. It lists every possible action (Create, Read, Update, Delete) on every subject (User, Booking, Vehicle) and which roles can perform them.

**Real-life analogy:** This is the **official rulebook of the company's security policy** — "Admins can do X, Managers can do Y, Employees can only do Z." The CASL library then enforces these rules.

---
*End of Technology Stack Deep Dive.*
