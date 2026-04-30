# 📘 Developer Guidelines

---

## ⚠️ Purpose of This Document

This document is **STRICTLY created to enforce:**

- Code readability
- Consistency across the entire project
- Predictable patterns for developers and AI agents

> ❗ This is **NOT a system design or architecture explanation**
> ❗ This is a **rulebook that MUST be followed strictly**

---

# 🧱 GLOBAL RULES

## 📁 File Naming (STRICT)

All files across backend, frontend, mobile, and workers must use **kebab-case**.

```
kebab-case
```

### ✅ Correct Examples

```
user.entity.ts
wallet-transaction.entity.ts
user-card.tsx
use-user-data.ts
create-user.command.ts
auth-guard.middleware.ts
```

### ❌ Not Allowed

```
UserEntity.ts          ← PascalCase
userCard.tsx           ← camelCase
useUserData.ts         ← camelCase
CreateUserCommand.ts   ← PascalCase
```

> **Why?** Predictable file discovery, consistent imports across platforms, avoids mixed naming chaos. Some OSes (Linux) are case-sensitive — inconsistent naming causes import failures in CI/CD.

---

## 🧠 Code Philosophy

- Keep files **small, focused, and readable**
- One file = one responsibility
- Avoid mixing UI, logic, types, and constants in the same file

### ❌ Bad — Everything Mixed in One File

```tsx
// user-card.tsx — DON'T DO THIS
const BASE_URL = 'https://api.example.com' // ← constant
type User = { id: string; name: string } // ← type

const filterActive = (
    users: User[], // ← logic
) => users.filter((u) => u.isActive)

export const UserCard = () => {
    const [users, setUsers] = useState([])
    const filtered = filterActive(users)
    return (
        <View>
            {filtered.map((u) => (
                <Text>{u.name}</Text>
            ))}
        </View>
    )
}
```

### ✅ Good — Properly Separated

```
user.types.ts       → type User = { id: string; name: string }
user.constants.ts   → export const BASE_URL = '...'
use-user-data.ts    → filtering/fetching logic in a hook
user-card.tsx       → pure UI only
```

> **Why?** Improves maintainability, reduces merge conflicts, makes AI-assisted development reliable.

---

# 1️⃣ API (NestJS + TypeORM + CQRS)

## 📁 Naming Conventions

```
user.controller.ts
user.service.ts
auth.module.ts
create-user.command.ts
create-user.handler.ts
get-users.query.ts
get-users.handler.ts
user.entity.ts
```

---

## 🧠 Controller Rules (STRICT)

Controllers handle **only** request/response. No logic, no DB operations.

### ✅ Allowed in Controllers

- Receiving requests
- Calling the query/command bus
- Returning responses

### ❌ Not Allowed in Controllers

- Business logic
- DB operations
- Conditional processing
- Data transformation

### ✅ Correct Controller

```ts
// users.controller.ts
@Controller('v1/users')
export class V1UsersController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}
    @Post()
    createUser(@Body() dto: CreateUserDto) {
        return this.commandBus.execute(new CreateUserCommand(dto))
    }

    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.commandBus.execute(new UpdateUserCommand(id, dto))
    }
}
```

> **Why?** Keeps controllers predictable, improves testability, enforces separation of concerns.

---

## ⚙️ Business Logic — Where It Goes

| Scenario                              | Where to put it  |
| ------------------------------------- | ---------------- |
| Simple pass-through                   | Controller → Bus |
| Shared/reusable across handlers       | Service          |
| Complex with multiple steps or DB ops | CQRS Handler     |

---

## 📦 CQRS (STRICT)

Use CQRS when:

- Logic is complex or multi-step
- Multiple DB operations are involved
- Business rules must be enforced

### Command (Write)

```ts
// create-user.command.ts
export class CreateUserCommand {
    constructor(public readonly payload: CreateUserDto) {}
}
```

```ts
// create-user.handler.ts
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        @InjectDataSource()
        private readonly datasource: DataSource,
        private readonly walletService: WalletService,
    ) {}

    async execute(command: CreateUserCommand) {
        const { payload } = command
        const manager = this.datasource.manager

        return manager.transaction(async (manager) => {
            const user = manager.create(UserEntity, {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
            })

            await manager.save(user)

            // Reusable service for wallet creation
            await this.walletService.createForUser(manager, user.id)

            return user
        })
    }
}
```

### Query (Read)

```ts
// get-users.query.ts
export class GetUsersQuery {
    constructor(public readonly filters: GetUsersDto) {}
}
```

```ts
// get-users.handler.ts
@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
    constructor(
        @InjectDataSource()
        private readonly datasource: DataSource,
    ) {}

    async execute(query: GetUsersQuery) {
        const { filters } = query
        const manager = this.datasource.manager

        return manager
            .createQueryBuilder(UserEntity, 'user')
            .where('user.deletedAt IS NULL')
            .andWhere(filters.search ? 'user.firstName ILIKE :search OR user.lastName ILIKE :search' : '1=1', {
                search: `%${filters.search}%`,
            })
            .orderBy('user.createdAt', 'DESC')
            .getMany()
    }
}
```

> **Why?** Separates reads from writes, makes scaling easier, prevents bloated services.

---

## 🗃️ Database Access (STRICT)

Always inject `DataSource` and derive `manager` from `this.datasource.manager`. Never use `getRepository()` or `@InjectEntityManager()`.

### ✅ Allowed

```ts
// Find one
const manager = this.datasource.manager
const user = await manager.findOne(UserEntity, {
    where: { id },
    relations: ['wallet'],
})

// Find many
const users = await manager.find(UserEntity, {
    where: { isActive: true },
    order: { createdAt: 'DESC' },
})

// Save
await manager.save(UserEntity, userEntity)

// Soft delete
await manager.softDelete(UserEntity, id)

// Query builder
const users = await manager
    .createQueryBuilder(UserEntity, 'user')
    .leftJoinAndSelect('user.wallet', 'wallet')
    .where('user.id = :id', { id })
    .getOne()
```

### ❌ Not Allowed

```ts
// ❌ NEVER use this
const userRepo = getRepository(UserEntity)
const userRepo = this.connection.getRepository(UserEntity)

// ❌ NEVER inject EntityManager directly
@InjectEntityManager() private readonly manager: EntityManager
```

> **Why?** `DataSource` is the TypeORM-recommended entry point. It gives access to the manager, exposes transaction support, and is consistent with NestJS DI best practices.

---

## 🔄 Transactions (MANDATORY for Multiple DB Operations)

Always wrap multiple DB operations in a transaction.

```ts
// ✅ Correct
const manager = this.datasource.manager
await manager.transaction(async (manager) => {
    const user = await manager.save(UserEntity, userData)

    const wallet = manager.create(UserWalletEntity, {
        userId: user.id,
        balance: 0,
    })
    await manager.save(wallet)

    const profile = manager.create(UserProfileEntity, {
        userId: user.id,
        avatar: null,
    })
    await manager.save(profile)
})
```

### ❌ Wrong — No Transaction

```ts
// ❌ If wallet save fails, user already exists — data is inconsistent
const manager = this.datasource.manager
await manager.save(UserEntity, userData)
await manager.save(UserWalletEntity, walletData) // could fail!
```

> **Why?** Prevents partial writes, ensures data consistency.

---

## 🔗 Relationships (STRICT)

Always manually define the FK column. Never rely on implicit joins.

// ✅ Example

```ts
// user-wallet-transaction.entity.ts
@Entity('user_wallet_transactions')
export class UserWalletTransactionEntity extends BaseEntity {
    // ✅ Always define FK column manually
    @Column('varchar')
    walletId: string

    // ✅ Then define the relation
    @ManyToOne(() => UserWalletEntity, (w) => w.walletTransactions, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'walletId' })
    wallet: UserWalletEntity

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number

    @Column({ type: 'enum', enum: TransactionType })
    type: TransactionType
}
```

> **Why?** Prevents unnecessary joins, improves performance, gives full control over queries.

---

## 🗄️ Entity Rules

```ts
// user.entity.ts
@Entity('users')
export class UserEntity extends BaseEntity {
    @Column('varchar', { length: 100 })
    firstName: string

    @Column('varchar', { length: 100 })
    lastName: string
}
```

---

## 🧩 Base Entity (MANDATORY)

Every entity **must** extend BaseEntity.

```ts
// base.entity.ts
export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deletedAt?: Date
}
```

> **Why?** Standardizes all tables, enables soft deletes, reduces duplication.

---

## 🔄 Migrations Strategy (STRICT)

### 🧪 Pre-Production (Until First Production Release)

- Maintain **ONLY ONE** migration file
- On every schema change: delete old migration, generate a new one

### 🚀 Post-Production

- **Never delete** existing migrations ❌
- Every schema change → generate a new migration file

> **Why?** Pre-prod: keeps schema clean, easy to reset. Post-prod: maintains history, enables safe rollbacks.

---

## 🌱 Seeders (MANDATORY)

### Initial Seeder — Required app data

```ts
// initial.seeder.ts
export class InitialSeeder implements Seeder {
    async run(manager: EntityManager): Promise<void> {
        const roles = [UserRole.ADMIN, UserRole.USER]
        for (const role of roles) {
            const exists = await manager.findOne(RoleEntity, { where: { name: role } })
            if (!exists) {
                await manager.save(RoleEntity, { name: role })
            }
        }
    }
}
```

### Dummy Seeder — Dev/testing data

```ts
// dummy.seeder.ts
export class DummySeeder implements Seeder {
    async run(manager: EntityManager): Promise<void> {
        const user = manager.create(UserEntity, {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@dev.local',
            password: await bcrypt.hash('Password@123', 10),
        })
        await manager.save(user)
    }
}
```

> **Why?** Ensures consistent dev environments, removes manual setup, speeds onboarding.

---

## 🔐 Authorization

- Must use **CASL** only
- No custom permission logic outside CASL

---

## 🌐 Versioning

All routes must be versioned from `v1`. Controller class names must include the version prefix.

```ts
// ✅ Route
;/v1/erssu / v1 / auth / login

// ✅ Controller class name
V1UsersController
V1AuthController
```

---

## 🛡️ Exception Handling (MANDATORY)

Always use NestJS built-in HTTP exceptions. Never throw raw `Error`.

```ts
// ✅ Correct
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'

if (!user) {
    throw new NotFoundException('User not found')
}

if (user.isBlocked) {
    throw new ForbiddenException('Account is blocked')
}

if (dto.email === existingUser.email) {
    throw new BadRequestException('Email already in use')
}
```

```ts
// ❌ Wrong
throw new Error('User not found') // never do this
```

---

## 📝 Logging (MANDATORY)

Use NestJS `Logger`. Never use `console.log` in production code.

```ts
// ✅ Correct
@Injectable()
export class CreateUserHandler {
    private readonly logger = new Logger(CreateUserHandler.name)

    async execute(command: CreateUserCommand) {
        this.logger.log(`Creating user: ${command.payload.email}`)
        try {
            // ...
        } catch (error) {
            this.logger.error('Failed to create user', error.stack)
            throw error
        }
    }
}
```

---

## 🧹 Handler Readability (MANDATORY)

When a CQRS handler has complex or multi-step logic, the `execute()` method **must** be split into small, focused private methods within the same class. The `execute()` method should read as a **high-level orchestration** — each step is a method call with a descriptive name.

### ✅ Correct — Split into private methods

```ts
@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
    async execute(command: CreateOrderCommand) {
        return manager.transaction(async (manager) => {
            const user = await this.validateUser(manager, command.userId)
            const plan = await this.findActivePlan(manager, command.planId)
            await this.blockIfActivePlanExists(manager, command.userId)
            return this.createOrder(manager, user, plan)
        })
    }

    private async validateUser(manager: EntityManager, userId: string) {
        const user = await manager.findOne(UserEntity, { where: { id: userId } })
        if (!user) throw new NotFoundException('User not found')
        return user
    }

    private async findActivePlan(manager: EntityManager, planId: string) { /* ... */ }
    private async blockIfActivePlanExists(manager: EntityManager, userId: string) { /* ... */ }
    private async createOrder(manager: EntityManager, user: UserEntity, plan: PlanEntity) { /* ... */ }
}
```

### ❌ Bad — Everything in one giant execute()

```ts
// ❌ 100+ lines inside execute() — hard to read and maintain
async execute(command: CreateOrderCommand) {
    // validation logic...
    // business rule checks...
    // external API calls...
    // database operations...
    // response building...
}
```

> **Why?** Improves readability, makes each step testable, and keeps `execute()` as a readable summary of the handler's flow.

---

# 2️⃣ CLIENT (SHARED FRONTEND RULES — Web & Mobile)

## 🧠 Philosophy (STRICT)

- Frontend = **Dumb UI only**
- No business logic on the frontend
- No client-side filtering or sorting of data
- Backend is the single source of truth

### ❌ Bad — Client-side filtering

```ts
// ❌ Never filter data on the frontend
const activeUsers = users?.filter((u) => u.isActive && !u.deletedAt)
```

### ✅ Good — Backend handles filtering

```ts
// ✅ Pass filters as query params to the API
const { data } = useGetUsers({ isActive: true })
```

---

## 🔌 API Handling (STRICT)

Use **only** `createQuery` and `createMutation` from `react-query-kit`. Never call `useQuery` or `useMutation` directly inside components.

### ✅ Defining Queries

```ts
// user.query.ts
import { createQuery, createMutation } from 'react-query-kit'
import { api } from '@/lib/api'
import type { User, GetUsersParams } from './user.types'

export const useGetUsers = createQuery<User[], GetUsersParams>({
    queryKey: ['users'],
    fetcher: (params) => api.get('/v1/users', { params }).then((r) => r.data),
})

export const useCreateUser = createMutation<User, CreateUserPayload>({
    mutationFn: (payload) => api.post('/v1/users', payload).then((r) => r.data),
})
```

### ✅ Using in Components

```tsx
// users-list.tsx
export const UsersList = () => {
    const { data: users, isLoading, isError } = useGetUsers({ variables: {} })

    if (isLoading) return <LoadingScreen />
    if (isError) return <ErrorScreen />

    return (
        <FlatList
            data={users}
            keyExtractor={(u) => u.id}
            renderItem={({ item }) => <UserCard user={item} />}
        />
    )
}
```

### ❌ Not Allowed

```tsx
// ❌ Direct useQuery in component
const { data } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/v1/users').then((r) => r.json()),
})
```

---

## 🗃️ State Management

Prefer local state or URL params. Use **Zustand** only when truly global state is needed.

### ✅ Prefer local / param state

```tsx
// Use URL params for shareable state
const [searchParams, setSearchParams] = useSearchParams()
const search = searchParams.get('search') ?? ''
```

### ✅ Zustand — Only when necessary

```ts
// user.store.ts
import { create } from 'zustand'

type UserStore = {
    selectedUserId: string | null
    setSelectedUserId: (id: string | null) => void
}

export const useUserStore = create<UserStore>((set) => ({
    selectedUserId: null,
    setSelectedUserId: (id) => set({ selectedUserId: id }),
}))
```

> **Why?** Prevents global state bloat, keeps data flow predictable.

---

## 🧩 Component Rules (STRICT)

- Small and focused — one component = one UI piece
- No business logic
- No API calls directly inside components (use hooks)
- Props must be typed

### ✅ Clean Component

```tsx
// user-card.tsx
export const UserCard = ({ user, onPress }: Props) => {
    return (
        <Pressable
            onPress={() => onPress?.(user.id)}
            className='p-4 bg-white rounded-xl'>
            <Text className='text-base font-semibold'>
                {user.firstName} {user.lastName}
            </Text>
            <Text className='text-sm text-gray-500'>{user.email}</Text>
        </Pressable>
    )
}
```

### ❌ Bad Component

```tsx
// ❌ Logic + API call + UI mixed
export const UserCard = ({ userId }: { userId: string }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        fetch(`/v1/users/${userId}`)
            .then((r) => r.json())
            .then(setUser) // ❌ API call in component
    }, [userId])

    const isAdmin = user?.role === 'admin' // ❌ logic in component

    return <Text>{user?.firstName}</Text>
}
```

---

## 📦 Separation of Concerns (STRICT)

| File             | Purpose                         | Example             |
| ---------------- | ------------------------------- | ------------------- |
| `*.types.ts`     | TypeScript interfaces and types | `user.types.ts`     |
| `*.schema.ts`    | Zod validation schemas          | `user.schema.ts`    |
| `*.query.ts`     | API queries and mutations       | `user.query.ts`     |
| `*.constants.ts` | Constants and enums             | `user.constants.ts` |
| `*.store.ts`     | Zustand store (if needed)       | `user.store.ts`     |
| `*.data.ts`      | Static/mock data                | `user.data.ts`      |
| `use-*.ts`       | Custom hooks with logic         | `use-user-data.ts`  |

---

## 🧠 Logic → Hooks

Move all logic out of components and into hooks.

```ts
// use-user-data.ts
export const useUserData = (userId: string) => {
    const { data: user, isLoading } = useGetUserById({ variables: userId })

    const fullName = useMemo(() => (user ? `${user.firstName} ${user.lastName}` : ''), [user])

    const isAdmin = user?.role === UserRole.ADMIN

    return { user, isLoading, fullName, isAdmin }
}
```

```tsx
// user-profile.tsx — clean, no logic
export const UserProfile = ({ userId }: { userId: string }) => {
    const { user, isLoading, fullName, isAdmin } = useUserData(userId)

    if (isLoading) return <LoadingScreen />

    return (
        <View>
            <Text>{fullName}</Text>
            {isAdmin && <Badge label='Admin' />}
        </View>
    )
}
```

---

## ⚠️ Error Handling (STRICT)

- Use reusable `<LoadingScreen />` and `<ErrorScreen />` components
- Always show toast notifications for mutation success/error

```tsx
// ✅ Correct
const createUser = useCreateUser()

const handleSubmit = (data: CreateUserForm) => {
    createUser.mutate(data, {
        onSuccess: () => {
            toast.success('User created successfully')
            navigation.goBack()
        },
        onError: (error) => {
            toast.error(error.message ?? 'Something went wrong')
        },
    })
}
```

---

## 📝 Forms (STRICT)

Use **react-hook-form** + **Zod** for all forms.

### ✅ Correct

```ts
// user.schema.ts
import { z } from 'zod'

export const createUserSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type CreateUserForm = z.infer<typeof createUserSchema>
```

```tsx
// create-user-form.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const CreateUserForm = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateUserForm>({
        resolver: zodResolver(createUserSchema),
        defaultValues: { firstName: '', lastName: '', email: '', password: '' },
    })

    const createUser = useCreateUser()

    const onSubmit = (data: CreateUserForm) => {
        createUser.mutate(data)
    }

    return (
        <View>
            <Controller
                control={control}
                name='firstName'
                render={({ field }) => (
                    <TextInput
                        value={field.value}
                        onChangeText={field.onChange}
                        placeholder='First Name'
                    />
                )}
            />
            {errors.firstName && <Text>{errors.firstName.message}</Text>}

            <Button
                onPress={handleSubmit(onSubmit)}
                title='Create User'
            />
        </View>
    )
}
```

### ❌ Not Allowed

```tsx
// ❌ useState per field — never do this
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [email, setEmail] = useState('')
```

> **Why?** Better validation, cleaner state management, easier testing.

---

## ⚡ Performance Rules

- Avoid unnecessary re-renders with `React.memo`, `useMemo`, `useCallback`
- Never create new objects/functions inline in JSX if they cause re-renders

```tsx
// ✅ Memoize callbacks
const handlePress = useCallback(() => {
    navigation.navigate('UserDetail', { id: user.id })
}, [user.id])

// ✅ Memoize expensive calculations
const sortedUsers = useMemo(() => [...users].sort((a, b) => a.firstName.localeCompare(b.firstName)), [users])

// ✅ Memoize pure components
export const UserCard = React.memo(({ user }: Props) => {
    return <View>...</View>
})
```

---

## 🎨 Styling

| Platform         | Library                   |
| ---------------- | ------------------------- |
| Web (Backoffice) | Tailwind CSS              |
| Mobile           | NativeWind & Tailwind CSS |

```tsx
// ✅ Mobile — NativeWind
<View className="flex-1 bg-white px-4 py-6">
  <Text className="text-2xl font-bold text-gray-900">Hello</Text>
</View>

// ✅ Web — Tailwind
<div className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow">
  <h1 className="text-2xl font-bold text-gray-900">Hello</h1>
</div>
```

---

# 3️⃣ HENCHMEN (Event-Driven Workers)

## ⚙️ Architecture

Fully event-driven. No direct function calls. Workers communicate via events only.

## 🔄 Flow

```ts
// ✅ Emitting an event (from API handler)
eventBus.emit('user.created', { userId: user.id, email: user.email })

// ✅ Listening to an event (in worker)
onEvent('user.created', async (payload) => {
    await emailService.sendWelcomeEmail(payload.email)
    await analyticsService.track('user_signup', payload.userId)
})
```

## Event Naming Convention

```
<entity>.<action>

user.created
user.updated
wallet.credited
order.placed
notification.sent
```

## ❌ Not Allowed

```ts
// ❌ Direct service call from handler — creates tight coupling
await emailService.sendWelcomeEmail(user.email) // ❌ Call this from an event listener instead

// ❌ Synchronous background logic
setTimeout(() => sendEmail(user.email), 1000) // ❌ Never
```

> **Why?** Loose coupling, scalable, workers can be replaced or scaled independently.

---

# 4️⃣ MOBILE APP (React Native — Obytes Starter)

## 📱 Rules

- Follow all **CLIENT rules** above strictly
- Use **NativeWind** for styling (no `StyleSheet` unless absolutely needed)
- Use Obytes starter patterns for navigation, storage, and API setup

## ⚠️ Critical Rules

- Always test in **release builds** — behavior differs from debug
- Handle timezone carefully (see Time Handling in API section)
- Use `react-native-mmkv` for local storage (not `AsyncStorage`)

```ts
// ✅ Storage
import { storage } from '@/lib/storage' // MMKV wrapper
storage.set('auth_token', token)
const token = storage.getString('auth_token')
```

```ts
// ❌ Avoid
import AsyncStorage from '@react-native-async-storage/async-storage' // Too slow
```

---

# 5️⃣ BACKOFFICE (React Router Framework)

## 🌐 Rules

- Follow all **CLIENT rules** strictly
- Use **Tailwind CSS** for styling
- Use **Radix UI** as the component library base

## 🧩 UI Library

Use **Radix UI** primitives consistently. Do not mix in other UI libraries.

```tsx
// ✅ Radix UI + Tailwind
import * as Dialog from '@radix-ui/react-dialog'

export const ConfirmDialog = ({ onConfirm }: Props) => (
    <Dialog.Root>
        <Dialog.Trigger asChild>
            <button className='px-4 py-2 bg-red-600 text-white rounded-lg'>Delete</button>
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className='fixed inset-0 bg-black/40' />
            <Dialog.Content className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl'>
                <Dialog.Title className='text-lg font-semibold'>Are you sure?</Dialog.Title>
                <div className='flex gap-3 mt-4'>
                    <button
                        onClick={onConfirm}
                        className='px-4 py-2 bg-red-600 text-white rounded-lg'>
                        Confirm
                    </button>
                    <Dialog.Close asChild>
                        <button className='px-4 py-2 border rounded-lg'>Cancel</button>
                    </Dialog.Close>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
)
```

---

## 🚀 Final Note

> Consistency > Creativity in this project.

If something is unclear → check existing implementation before creating something new.

This rulebook exists so every developer and AI agent produces code that looks like it was written by one person. Follow it without exception.
