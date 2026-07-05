# FRONTEND ENGINEERING RULE BOOK
**The Single Source of Truth for React & React Native Development**

This document establishes the absolute laws of frontend engineering for this enterprise monorepo. It applies to all frontend applications, including the mobile app (`apps/app` - Expo) and the admin web dashboard (`apps/backoffice` - React Router 7). 

Any AI or human developer contributing to this repository **must** abide by these rules.

---

## 1. Core Technology Stack
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

## 2. Directory Structure Law

Every frontend app strictly follows this generic structure inside `src/` (mobile) or `app/` (web):

```text
my-frontend-app/
├── components/          ← All reusable UI
│   ├── ui/              ← Base primitive components (Buttons, Inputs)
│   ├── forms/           ← Reusable form components
│   └── layout/          ← Screen wrappers, headers, sidebars
├── constants/           ← Global constants, Enums, Colors
├── hooks/               ← Custom generic React hooks (NOT data fetching hooks)
├── lib/                 ← Third-party wrappers (xior setup, cn utility, dayjs)
├── queries/             ← ALL TanStack React Query hooks and mutations go here
├── routes/ (or app/)    ← File-based routing (pages/screens)
├── schema/              ← Zod validation schemas
├── services/            ← Raw API calls via xior (consumed ONLY by queries/)
├── stores/              ← Zustand global state
├── types/               ← Shared TypeScript interfaces
└── translations/        ← i18n JSON files
```

---

## 3. Data Fetching & State Rules (CRITICAL)

### 3.1 Strict Separation of API logic
UI components must **never** make direct HTTP calls.

**❌ FORBIDDEN (API call in component):**
```tsx
const UsersList = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    xior.get('/users').then(res => setUsers(res.data));
  }, []);
  // ...
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

### 3.2 Zustand for Global State Only
*   **Do NOT** use Zustand for server state (data from APIs). That is what TanStack Query is for.
*   **Do NOT** use Zustand for local component state (like toggle switches). Use `useState`.
*   **DO** use Zustand for global client-side state (e.g., Theme, Current User Session, Shopping Cart).

---

## 4. Forms & Validation Rules

Forms must **always** be uncontrolled using React Hook Form and validated via Zod.

**❌ FORBIDDEN:** Controlled state forms.
```tsx
// NO! Do not use useState for forms.
const [email, setEmail] = useState('');
```

**✅ CORRECT:**
1. Define schema in `schema/auth.schema.ts`:
```ts
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginFormData = z.infer<typeof loginSchema>;
```
2. Use React Hook Form with the resolver:
```tsx
const { control, handleSubmit } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema)
});
```

---

## 5. Styling Rules (Tailwind CSS v4)

*   **No Custom CSS Files**: Everything must be styled via Tailwind utility classes.
*   **Dynamic Classes**: Always use a class merging utility (like `tailwind-merge` + `clsx`, typically named `cn()`) when combining conditional classes.
*   **Avoid Magic Numbers**: Use standard Tailwind spacing (e.g., `p-4`, `gap-2`).

```tsx
// ✅ Correct dynamic class merging
import { cn } from '@/lib/utils';

<button className={cn('px-4 py-2 bg-blue-500', isError && 'bg-red-500')}>
```

---

## 6. Component Architecture

### 6.1 The "Dumb" UI Pattern
Put as much UI logic as possible into "dumb" (presentation) components inside `components/`. 
*   They should receive data via `props`.
*   They should NOT use `useQuery` or access `Zustand` stores directly.

### 6.2 The "Smart" Route Pattern
Files inside `routes/` (or Expo's `app/`) act as "Smart" container screens.
*   They call the `queries/` hooks.
*   They pass the data down to the "Dumb" components.

---

## 7. Performance & Optimization

*   **Avoid Inline Functions in Render**: 
    `onPress={() => doSomething()}` creates a new function reference every render. Define it outside or use `useCallback`.
*   **FlashList over FlatList (React Native)**: 
    When rendering lists in Expo/React Native, **always** use `@shopify/flash-list`, never the standard `FlatList`.
*   **Memoization**: Use `React.memo` for heavy UI components that receive complex props.

---

## 8. Naming Conventions

| Concept | Naming Rule | Example |
|---|---|---|
| **Folders** | kebab-case | `user-profile/` |
| **Components** | PascalCase | `UserProfile.tsx` |
| **Hooks** | camelCase (prefix `use`) | `useAuth.ts` |
| **Zod Schemas** | camelCase (suffix `Schema`) | `loginSchema` |
| **Zod Types** | PascalCase | `type LoginFormData` |
| **Query Hooks** | camelCase | `useGetUsers` or `useCreateUser` |
| **Services** | camelCase | `users.service.ts` |

---

## 9. The 10 Golden Frontend Rules

1. **Never write `any`.** Create a TypeScript interface or generate it from Swagger.
2. **Never fetch data in `useEffect`.** Always use TanStack Query.
3. **Never manage forms with `useState`.** Always use React Hook Form + Zod.
4. **Never hardcode strings for translation.** Always use `react-i18next`.
5. **Never use standard React Native `FlatList`.** Use `@shopify/flash-list`.
6. **Never leave console.logs.** Remove them before committing.
7. **Never write custom CSS.** Tailwind only.
8. **Never put business logic in UI components.** Keep components pure.
9. **Never ignore ESLint/TypeScript warnings.** Fix them.
10. **Never mix Server State and Client State.** APIs go in TanStack Query, App UI state goes in Zustand.

---

*This document is the definitive guide for frontend development. By reading this, you are bound to its rules.*
