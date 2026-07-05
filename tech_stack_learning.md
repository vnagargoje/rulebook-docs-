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
- **Scalability**: You can scale the API and the worker independently. If notifications are slow, add more Henchmen instances, not more API instances.
- **Fault Isolation**: If Henchmen crashes, the main API keeps running. Users can still create bookings even if notifications temporarily fail.
- **Clean Separation**: The API's job is to be fast and respond to HTTP. Henchmen's job is to be reliable and process events. Mixing them violates Single Responsibility Principle.

---

### 2.1 NestJS

**Simple explanation:**
NestJS is a **framework** built on top of Node.js that gives you a structured way to build backend applications. Instead of writing raw Express routes everywhere, NestJS gives you `Modules`, `Controllers`, `Services`, `Guards`, and `Interceptors` — each with a clear, single job.

**Real-life analogy:**
NestJS is like the **floor plan of an office building**. Every department (HR, Finance, Engineering) has its own room (Module), a reception desk (Controller) that receives requests, and specialists (Services) that do the actual work.

**Technical example:**
```typescript
// Controller = Reception desk (receives HTTP request)
@Controller('users')
export class UsersController {
  constructor(private commandBus: CommandBus) {}

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.commandBus.execute(new GetUserQuery(id));
  }
}
```

---

### 2.2 TypeORM

**Simple explanation:**
TypeORM is a translator between your **TypeScript code and the database**. Instead of writing raw SQL like `SELECT * FROM users WHERE id = 1`, you write TypeScript classes and methods, and TypeORM converts them to SQL automatically.

**Real-life analogy:**
TypeORM is like **Google Translate for databases**. You speak TypeScript, the database speaks SQL. TypeORM translates in between so you never have to learn SQL from scratch.

**Technical example:**
```typescript
// ❌ Raw SQL (hard and error-prone)
const result = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

// ✅ TypeORM (clean TypeScript)
const user = await manager.findOne(UserEntity, { where: { id: userId } });
```

---

### 2.3 MySQL

**Simple explanation:**
MySQL is a **relational database** — think of it as a collection of Excel spreadsheets. Each "table" is a spreadsheet (e.g., `users`, `bookings`, `vehicles`). Rows are records, columns are fields. Tables can be linked together (e.g., a booking is linked to a user and a vehicle).

**Real-life analogy:**
MySQL is like a **well-organized filing cabinet**. Every drawer (table) holds records (rows). When you need to find a booking, you open the Bookings drawer and find the row by ID.

---

### 2.4 Redis

**Simple explanation:**
Redis is an **ultra-fast memory-based storage**. Unlike MySQL which writes to disk, Redis keeps everything in RAM (memory). It's used to store data that needs to be read extremely quickly, like session tokens, OTP codes, or cached API responses.

**Real-life analogy:**
MySQL is a **library archive** (slow to search, permanent storage). Redis is a **sticky note on your desk** (instant to read, temporary).

**Technical example:**
```typescript
// Store OTP with 5 minute expiry in Redis
await redis.set(`otp:${phone}`, '123456', 'EX', 300);

// Retrieve it
const otp = await redis.get(`otp:${phone}`);
```

---

### 2.5 CQRS (Command Query Responsibility Segregation)

**Simple explanation:**
CQRS is a design pattern that says: **"Reading data and writing data should be completely separate code."**
- **Command** = Something that changes the world (Create User, Update Booking)
- **Query** = Something that reads the world (Get User, List Bookings)

**Real-life analogy:**
In a hospital: **Doctors (Commands)** prescribe medicine and make changes to your health plan. **Nurses (Queries)** fetch your records and report status. They have different roles and never mix responsibilities.

**Technical example:**
```typescript
// Command — changes data
class CreateUserCommand {
  constructor(public readonly name: string, public readonly phone: string) {}
}

// Query — reads data
class GetUserByIdQuery {
  constructor(public readonly id: string) {}
}

// Controller just dispatches, never does the work itself
return this.commandBus.execute(new CreateUserCommand(body.name, body.phone));
```

---

### 2.6 Inngest

**Simple explanation:**
Inngest is a **background job engine**. When a user signs up, you don't want to make them wait while the server sends a welcome email (which can take 2 seconds). Instead, you tell Inngest "send this email in the background" and immediately respond to the user. Inngest handles the rest asynchronously.

**Real-life analogy:**
When you order food at a restaurant, the waiter takes your order and immediately goes to the next table (responds fast). The kitchen (Inngest) prepares your food in the background without blocking the waiter.

**Technical example:**
```typescript
// ❌ Blocking — user waits for email to be sent (slow!)
await sendWelcomeEmail(user.email);
return { success: true };

// ✅ Non-blocking via Inngest — user gets instant response
await inngest.send({ name: 'user/registered', data: { userId: user.id } });
return { success: true }; // Returned immediately
```

---

### 2.7 TypeBox

**Simple explanation:**
TypeBox is a library that lets you write a schema **once** and get both: (1) runtime validation of incoming JSON data, and (2) automatic TypeScript types for free. It replaces decorators like `@IsString()` from `class-validator`.

**Real-life analogy:**
TypeBox is like a **custom stamp/mould**. You create one mould, and it produces both the physical shape (TypeScript type) AND a checklist (runtime validator) at the same time.

**Technical example:**
```typescript
// Define ONCE
const CreateUserPayload = Type.Object({
  name: Type.String({ minLength: 2 }),
  phone: Type.String({ pattern: '^[0-9]{10}$' }),
});

// Get TypeScript type for FREE (no duplication!)
type CreateUserDTO = Static<typeof CreateUserPayload>;

// Use in controller for both validation AND type safety
async createUser(@Body() body: CreateUserDTO) { ... }
```

---

### 2.8 CASL (Authorization)

**Simple explanation:**
CASL is an **authorization library** that defines who can do what. Authentication asks "Who are you?" (login). Authorization asks "Are you allowed to do this?" (permissions). CASL lets you define fine-grained rules like "An Admin can delete any booking, but a User can only cancel their own booking."

**Real-life analogy:**
CASL is like an **office security badge system**. An intern can enter the lobby. A manager can enter their floor. Only the CEO can enter the server room. Different access for different roles.

**Technical example:**
```typescript
// Define rules
if (user.role === 'admin') {
  can(Actions.manage, 'all'); // Can do everything
} else {
  can(Actions.read, BookingSubject, { userId: user.id }); // Can only read own bookings
  cannot(Actions.delete, BookingSubject); // Cannot delete
}
```

---

### 2.9 Passport.js (JWT Authentication)

**Simple explanation:**
Passport.js handles the "Who are you?" question. When you log in, the server gives you a **JWT token** (like a digital ID card). Every subsequent request you make carries this token. Passport verifies it is valid and tells NestJS who you are.

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

**Real-life analogy:**
Swagger is like the **menu of a restaurant**. As a customer (frontend developer), you don't need to go into the kitchen (backend code) to know what's available. The menu (Swagger UI) tells you exactly what you can order and how.

---

### 2.11 Pino (Logging)

**Simple explanation:**
Pino is an extremely fast logger. Instead of `console.log`, production applications use structured loggers like Pino that write logs in JSON format, which can be easily searched, filtered, and monitored in services like Datadog or CloudWatch.

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

**Real-life analogy:**
Without React Native, building a mobile app is like having to write the same book in two different languages separately. React Native lets you write it once and have it automatically translated into both languages.

---

### 3.2 Expo

**Simple explanation:**
Expo is a **toolkit and platform built on top of React Native** that makes development dramatically easier. It provides a standard way to access native device features (camera, GPS, biometrics), build your app (EAS Build), and push updates over-the-air (OTA).

**Real-life analogy:**
React Native is the engine. Expo is the fully equipped car around it — dashboard, air conditioning, GPS, automatic transmission — so you can just drive without worrying about engine internals.

---

### 3.3 Expo Router

**Simple explanation:**
Expo Router brings **file-based routing** to mobile apps. The folder/file structure of `src/app/` directly maps to the app's navigation. Create a file `src/app/profile.tsx` and the route `/profile` automatically exists.

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
