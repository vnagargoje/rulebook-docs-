# FRONTEND ENGINEERING CONSTITUTION
**The Single Source of Truth for React & React Native Development**

This document establishes the absolute laws of frontend engineering for this enterprise monorepo. It applies to all frontend applications, including the mobile app (`apps/app` - Expo) and the admin web dashboard (`apps/backoffice` - React Router v7). 

Any AI or human developer contributing to this repository **must** abide by these rules.

---

## 1. FRONTEND ARCHITECTURE SECTION

### What is Frontend Architecture?
Frontend architecture is the structural blueprint of our application. It defines how data flows, how state is managed, how files are organized, and how the user interface is composed. Good architecture is invisible when things go right and prevents disasters when requirements change.

### Why folder structure matters?
A predictable folder structure is the UX of the codebase for developers. It eliminates decision fatigue. When a bug occurs, or a feature is added, every developer (and AI) should instantly know exactly where to look and where to put new code.

### Why Feature-Based Architecture is preferred?
Instead of grouping files by type (e.g., putting all components in one folder, all hooks in another), we group by **feature** or **domain** (e.g., `news`, `tasks`, `tokens`). This aligns the codebase with business requirements. If you delete the `news` folder, the entire News feature is removed cleanly without leaving orphaned hooks or types.

### How large companies structure React applications?
Companies like Stripe, Shopify, and Linear use Feature-Based (or Domain-Driven) architecture combined with File-Based Routing. They strictly separate Server State (TanStack Query) from UI State (React `useState`), enforce unidirectional data flow, and ban "God components" in favor of small, single-responsibility modules.

### How to keep code scalable when the team grows?
1. **Zero Duplication:** Reusable components live in `app/design-system` (Web) or `src/components/ui` (Mobile). 
2. **Strict Boundaries:** A feature (e.g., `news`) cannot import internal components from another feature (e.g., `tokens`).
3. **Opinionated Tooling:** Linting, TypeScript strict mode, and CI pipelines enforce the architecture automatically.

---

## 2. CORE TECHNOLOGY STACK
All frontend apps share this core architectural DNA:
*   **UI Framework**: React 19
*   **Routing**: Expo Router (Mobile) / React Router v7 (Web)
*   **Styling**: Tailwind CSS v4 (with Radix UI primitives on web)
*   **Data Fetching**: TanStack Query (React Query) v5
*   **HTTP Client**: `xior` (Axios alternative)
*   **Forms**: React Hook Form + Zod (`@hookform/resolvers/zod`)
*   **State Management**: Zustand (No Redux)
*   **API Types**: Auto-generated via `swagger-typescript-api`

---

## 3. DIRECTORY STRUCTURE LAWS

### Mobile Structure (Expo)
```text
my-expo-app/src/
├── app/                 ← Expo Router file-based routing
├── components/          ← All reusable UI
│   ├── ui/              ← Base primitive components (Buttons, Inputs)
│   ├── forms/           ← Reusable form components
│   └── layout/          ← Screen wrappers, headers
├── constants/           ← Global constants, Enums, Colors
├── hooks/               ← Custom generic React hooks (NOT data fetching hooks)
├── lib/                 ← Third-party wrappers (xior setup, cn utility)
├── queries/             ← ALL TanStack React Query hooks go here
├── schema/              ← Zod validation schemas
├── services/            ← Raw API calls via xior
├── stores/              ← Zustand global state
├── types/               ← Shared TypeScript interfaces
└── translations/        ← i18n JSON files
```

### Backoffice Structure (React Router v7)
```text
app/
└── routes/
    ├── auth/
    ├── home/
    ├── news/
    ├── notifications/
    ├── quiz/
    ├── tasks/
    ├── tokens/
    └── videos/
```

### Route Terminology
*   **`route.tsx`**: The core file that defines the route's UI and data requirements. If it's inside `app/routes/news/route.tsx`, it maps to `/news`.
*   **`layout.tsx`**: Defines a UI shell that wraps all child routes. If `app/routes/news/layout.tsx` exists, it wraps everything under `/news/*`.
*   **Nested Routes**: Child folders within a route folder (e.g., `app/routes/news/create/route.tsx` maps to `/news/create`). They render *inside* the parent's `<Outlet />`.
*   **Index Routes**: Typically named `_index/route.tsx`. They render at the parent's exact URL (e.g., `/news`) inside the parent's `<Outlet />`.
*   **Protected Routes**: Routes guarded by a loader that checks authentication and redirects if unauthenticated.
*   **Route Grouping**: Folders wrapped in parentheses `(admin)` or `_layout` that do not add a URL segment but group related routes under a common layout.

---

## 4. LAYOUT ARCHITECTURE

### Example Layout
```tsx
import { Outlet } from 'react-router';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function Layout() {
    return (
        <div className='flex h-screen w-full bg-gray-50'>
            <Sidebar />
            <div className='flex-1 flex flex-col min-w-0'>
                <Header />
                <main className='flex-1 overflow-y-auto p-6'>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
```

### What problems do Layouts solve?
They prevent remounting of heavy UI elements (like Sidebars and Headers) during navigation. This preserves state (like a collapsed sidebar menu) and vastly improves performance by reducing duplicate code.

### Explanation of Areas
*   **Sidebar**: Contains main navigation links. Persists state across the app.
*   **Header**: Contains global actions (Search, User Profile, Notifications).
*   **Main Content Area**: The scrollable container where the actual page content renders.
*   **Authentication Layouts**: Used for login/signup pages (usually centered, no sidebar).
*   **Admin Layouts**: Heavy dashboards requiring sidebars, breadcrumbs, and persistent headers.

---

## 5. OUTLET DEEP DIVE (IMPORTANT)

### What is Outlet?
`<Outlet />` is a placeholder component from React Router (and Expo Router). It tells the parent layout: *"Render my matching child route right here."*

### Why is Outlet important?
It enables **Nested Routing**. Without `<Outlet />`, every page would have to import and render the Sidebar and Header individually.

### How Nested Routing Works Internally
When a user visits `/news/create`:
1. Router matches the root layout (`app/routes/layout.tsx`).
2. Router matches the `news` layout (`app/routes/news/layout.tsx` if it exists).
3. Router matches the `create` route (`app/routes/news/create/route.tsx`).

### Render Tree Diagram
```text
Root Layout (app/routes/layout.tsx)
 ├── <Sidebar />
 ├── <Header />
 └── <main>
      └── <Outlet /> ---> (React Router injects News Layout here)
           └── News Layout (app/routes/news/route.tsx)
                ├── <NewsHeader />
                └── <Outlet /> ---> (React Router injects Create Form here)
                     └── News Create Page (app/routes/news/create/route.tsx)
```

### Without Outlet vs With Outlet
*   **Without Outlet**: Navigating from `/news` to `/news/create` unmounts the entire DOM and rebuilds it. The screen flashes. State is lost.
*   **With Outlet**: Only the content *inside* the `<Outlet />` changes. The Sidebar and Header never unmount.

### Common Mistakes
*   Forgetting to put `<Outlet />` in a layout file (resulting in a blank screen).
*   Putting margins/paddings inside the child route instead of standardizing them on the layout's `<main>` tag.

---

## 6. ROUTE STRUCTURE RULES (ENTERPRISE STANDARD)

### The Enterprise Standard Structure for a Feature (e.g., News)
```text
app/
└── routes/
    └── news/
        ├── _index/
        │   └── route.tsx          <-- List Page (/news)
        ├── create/
        │   └── route.tsx          <-- Create Page (/news/create)
        ├── $id/
        │   ├── edit/
        │   │   └── route.tsx      <-- Edit Page (/news/123/edit)
        │   └── route.tsx          <-- View Page (/news/123)
        ├── route.tsx              <-- News Layout (wraps all above)
        │
        │   # Colocated Feature Modules (Strictly for News)
        ├── components/            <-- News-specific UI (NewsCard, StatusBadge)
        ├── forms/                 <-- NewsForm.tsx (reused by create/edit)
        ├── hooks/                 <-- useNewsSubscription()
        ├── queries/               <-- TanStack queries specific to News
        ├── schemas/               <-- Zod validation schemas
        ├── services/              <-- API calls (e.g. using xior)
        └── types/                 <-- News DTOs
```

### Strict Standards
*   **List Pages (`_index/route.tsx`)**: Must implement pagination, filtering, and sorting via URL Search Params, not `useState`. 
*   **Create Pages (`create/route.tsx`)**: Renders a wrapper around a shared `Form` component. Passes an `onSubmit` mutation.
*   **Edit Pages (`$id/edit/route.tsx`)**: Fetches data by ID, passes it as `defaultValues` to the exact same shared `Form` component.
*   **Forms (`forms/`)**: Forms must be presentation components. They do not fetch their own data or trigger mutations. They accept `defaultValues` and an `onSubmit` callback.

---

## 7. DATA FETCHING & STATE RULES (CRITICAL)

### Strict Separation of API logic
UI components must **never** make direct HTTP calls. Server state is managed by TanStack Query.

**❌ FORBIDDEN (API call in component):**
```tsx
const UsersList = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    xior.get('/users').then(res => setUsers(res.data));
  }, []);
}
```

**✅ CORRECT FLOW:**
1. Define the raw API call in `services/users.service.ts`:
   ```ts
   export const getUsers = async () => xior.get('/users');
   ```
2. Wrap it in a React Query hook in `queries/users.query.ts`:
   ```ts
   export const useGetUsers = () => useQuery({
     queryKey: ['users'],
     queryFn: getUsers
   });
   ```
3. Consume it in the component:
   ```tsx
   const UsersList = () => {
     const { data, isLoading } = useGetUsers();
     // ...
   }
   ```

### Strict Query Rules
1. **Query Keys MUST be centralized:** Define a query key factory.
   ```ts
   export const newsKeys = {
     all: ['news'] as const,
     lists: () => [...newsKeys.all, 'list'] as const,
     list: (filters: string) => [...newsKeys.lists(), { filters }] as const,
     details: () => [...newsKeys.all, 'detail'] as const,
     detail: (id: string) => [...newsKeys.details(), id] as const,
   };
   ```
2. **Invalidation:** Mutations must invalidate specific keys to trigger refetches.
3. **Loading States:** Never use manual `isLoading` state. Always use the hook's `isPending`.

### Zustand for Global State Only
*   **Do NOT** use Zustand for server state (data from APIs). That is what TanStack Query is for.
*   **Do NOT** use Zustand for local component state (like toggle switches). Use `useState`.
*   **DO** use Zustand for global client-side state (e.g., Theme, Current User Session).

---

## 8. FORM ARCHITECTURE

All forms use **React Hook Form** + **Zod**. Forms must always be uncontrolled.

1. **Schema (`schemas/news.schema.ts`)**:
   ```ts
   export const newsSchema = z.object({ title: z.string().min(5) });
   export type NewsFormData = z.infer<typeof newsSchema>;
   ```
2. **Form Component (`forms/news-form.tsx`)**:
   ```tsx
   export function NewsForm({ defaultValues, onSubmit }: Props) {
     const form = useForm<NewsFormData>({ resolver: zodResolver(newsSchema), defaultValues });
     return <form onSubmit={form.handleSubmit(onSubmit)}>{/* inputs */}</form>;
   }
   ```
3. **Submission Flow**: The Page Component (`route.tsx`) passes the TanStack Mutation function to the Form Component via the `onSubmit` prop.

---

## 9. COMPONENT & STYLING RULES (Tailwind CSS v4)

*   **No Custom CSS Files**: Everything must be styled via Tailwind utility classes.
*   **Dynamic Classes**: Always use a class merging utility (like `tailwind-merge` + `clsx`, typically named `cn()`) when combining conditional classes.
*   **Avoid Magic Numbers**: Use standard Tailwind spacing (e.g., `p-4`, `gap-2`).

### Naming Conventions
*   **Folders**: `kebab-case` (`user-profile/`)
*   **Components**: `PascalCase` (`UserProfile.tsx`)
*   **Hooks**: `camelCase` (prefix `use`, e.g., `useAuth.ts`)
*   **Zod Schemas**: `camelCase` (suffix `Schema`, e.g., `loginSchema`)
*   **Query Hooks**: `camelCase` (`useGetUsers` or `useCreateUser`)

---

## 10. TYPE SAFETY RULES

1. **No `any`:** `any` is strictly banned. Use `unknown` if truly unknown.
2. **API Contracts:** DTOs (Data Transfer Objects) must match the backend exactly. Types should be generated (e.g., via `swagger-typescript-api`).
3. **Interfaces vs Types:** Use `type` for compositions and unions. Use `interface` for object shapes.
4. **Props:** Always define `interface Props { ... }` at the top of the component file.

---

## 11. REUSABILITY RULES

Before writing any new code, an engineer or AI **MUST** search the codebase.

1. **Do we have a Button?** Don't create a new one. Import from `design-system`.
2. **Do we have a utility to format dates?** Don't write `new Date()`. Import from `lib/utils`.
3. **Do we already fetch Users?** Don't write a new query. Reuse `useGetUsers()`.

Duplication of UI, API calls, or business logic is a critical architectural violation.

---

## 12. FRONTEND REVIEW CHECKLIST

Every PR must pass this checklist:
- [ ] Are route files named exactly `route.tsx` or `layout.tsx`?
- [ ] Is data fetching exclusively handled by TanStack Query?
- [ ] Are query keys derived from a centralized factory object?
- [ ] Is the UI built using existing Design System primitives?
- [ ] Is the form uncontrolled using React Hook Form and Zod?
- [ ] Are feature-specific components colocated inside the feature folder?
- [ ] Are there ZERO uses of `any`?
- [ ] Does the URL represent the UI state? (Pagination/Filters must be in URL params).

---

## 13. 50 NON-NEGOTIABLE FRONTEND RULES

1. Never fetch data directly inside components using `useEffect` and `fetch`.
2. Always use TanStack Query for server state.
3. Always reuse existing query keys via a query key factory.
4. Never place business logic (data manipulation) directly inside JSX.
5. Never duplicate components; extend existing ones via props.
6. Always colocate feature-specific files inside the feature folder (`routes/<feature>/`).
7. Layouts own the page structure (Headers, Sidebars).
8. `<Outlet />` owns child rendering.
9. Route folders own routing logic and URLs.
10. Components must have a single responsibility.
11. State that belongs in the URL (filters, tabs, search) MUST live in the URL search params, not `useState`.
12. Forms MUST be uncontrolled (React Hook Form).
13. Form validation MUST be schema-driven (Zod).
14. Forms MUST NOT fetch their own default data; it must be passed in via props.
15. Forms MUST NOT trigger mutations directly; pass an `onSubmit` handler via props.
16. Never use Redux. Use Zustand for global UI state only (if needed).
17. Server state and Client state MUST NOT be mixed in the same store.
18. Never write custom CSS if a Tailwind utility exists.
19. Dynamic Tailwind classes MUST be merged safely (using `clsx` and `tailwind-merge`).
20. Avoid magic numbers in Tailwind (e.g., use `w-64`, not `w-[250px]`).
21. All text should ideally be internationalized.
22. Accessibility (a11y) is mandatory (aria-labels, role attributes).
23. Radix UI primitives must be used for complex accessible components.
24. File names must be `kebab-case`.
25. Component exports must be named exports (no `export default` for components, EXCEPT for `route.tsx`/`layout.tsx` which require defaults).
26. Prop types must be explicitly defined using TypeScript interfaces.
27. The `any` type is completely banned. Use `unknown` or create a generic.
28. Third-party integrations must be wrapped in a custom hook or component (avoid direct vendor lock-in everywhere).
29. Never mutate state directly in React (no `state.value = x`).
30. Use `useCallback` and `useMemo` strictly when passing props to heavily memoized children, otherwise avoid premature optimization.
31. Large lists must be virtualized.
32. Loaders in `route.tsx` should only be used for critical path data or route protection, not heavy data fetching that blocks the UI (defer to TanStack Query).
33. Protected routes must redirect unauthenticated users at the loader level.
34. SVG icons must be imported from a standardized icon library (`lucide-react` or `@tabler/icons-react`).
35. `index` routes must be named `_index/route.tsx`.
36. Directory names defining a URL parameter must be prefixed with `$` (e.g., `$id`).
37. Use strict equality `===` instead of `==`.
38. Imports should be grouped and ordered logically.
39. Services (API calls) must be pure asynchronous functions that return data or throw errors.
40. Errors from mutations must be handled with a global toast notification system.
41. Loading states must display skeletons or spinners, never blank screens.
42. "Empty States" must be designed and implemented for every list or table.
43. Avoid prop drilling deeper than 3 levels; use Composition or Context.
44. Keep components under 200 lines of code. Split into sub-components if larger.
45. Shared types must live in `types/` or `@shared`, not randomly scattered.
46. Zod schemas must have strict type inference (`z.infer`).
47. Do not use `window` or `document` directly without checking if the environment is a browser.
48. Write self-documenting code. Use comments only for "Why", not "What".
49. Destructure props in the function signature `function MyComponent({ title, id }: Props)`.
50. If you break a rule, you must leave a comment with a written justification.

---
*End of Constitution.*
