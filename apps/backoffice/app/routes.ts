import { type RouteConfig, index, layout, route, prefix } from '@react-router/dev/routes'

// Router config
export default [
    route('login', 'routes/login.tsx'),
    layout('routes/app-layout.tsx', [
        index('routes/home.tsx'),
        route('dashboard', 'routes/dashboard.tsx'),
        
        ...prefix('users', [
            index('routes/users/index.tsx'),
            route('create', 'routes/users/create.tsx'),
            route('edit/:id', 'routes/users/edit.tsx'),
        ]),

        ...prefix('stations', [
            index('routes/stations/index.tsx'),
            route('create', 'routes/stations/create.tsx'),
            route('edit/:id', 'routes/stations/edit.tsx'),
        ]),

        ...prefix('plans', [
            index('routes/plans/index.tsx'),
            route('create', 'routes/plans/create.tsx'),
            route('edit/:id', 'routes/plans/edit.tsx'),
        ]),

        ...prefix('top-up-plans', [
            index('routes/top-up-plans/index.tsx'),
            route('create', 'routes/top-up-plans/create.tsx'),
            route('edit/:id', 'routes/top-up-plans/edit.tsx'),
        ]),

        ...prefix('vehicles', [
            index('routes/vehicles/index.tsx'),
            route('create', 'routes/vehicles/create.tsx'),
            route('edit/:id', 'routes/vehicles/edit.tsx'),
            route(':id', 'routes/vehicles/view.tsx'),
        ]),

        ...prefix('bookings', [
            index('routes/bookings/index.tsx'),
            route(':id', 'routes/bookings/view.tsx'),
        ]),

        ...prefix('maintenance', [
            index('routes/maintenance/index.tsx'),
            route('create', 'routes/maintenance/create.tsx'),
            route('edit/:id', 'routes/maintenance/edit.tsx'),
        ]),

        ...prefix('inactive-vehicles', [
            index('routes/inactive-vehicles/index.tsx'),
            route('create', 'routes/inactive-vehicles/create.tsx'),
            route('edit/:id', 'routes/inactive-vehicles/edit.tsx'),
        ]),

        ...prefix('assignments', [
            index('routes/assignments/index.tsx'),
            route('create-station', 'routes/assignments/create-station.tsx'),
            route('create-customer/:customerId?', 'routes/assignments/create-customer.tsx'),
        ]),

        ...prefix('batteries', [
            index('routes/batteries/index.tsx'),
            route('create', 'routes/batteries/create.tsx'),
            route('edit/:id', 'routes/batteries/edit.tsx'),
            route('assign', 'routes/batteries/assign.tsx'),
        ]),

        ...prefix('surrender', [
            index('routes/surrender/index.tsx'),
            route('create', 'routes/surrender/create.tsx'),
            route(':bookingId', 'routes/surrender/view.tsx'),
        ]),
    ]),
] satisfies RouteConfig
