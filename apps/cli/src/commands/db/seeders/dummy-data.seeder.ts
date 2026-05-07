import { faker } from '@faker-js/faker';
import {
    AddressEntity,
    HubStationEntity,
    PlanEntity,
    RoleEntity,
    StationEntity,
    SwapStationEntity,
    TopUpEntity,
    UserEntity,
    VehicleEntity,
} from '@yugo/nestjs-database/entities';
import { Gender, Roles, StationType } from '@yugo/shared';
import { DataSource, EntityManager, In } from 'typeorm';
import { Seeder } from 'typeorm-extension';

const FAKER_SEED = 20260413;
const HUB_MANAGER_COUNT = 10;
const SWAP_MANAGER_COUNT = 10;
const VEHICLES_PER_STATION = 5;
const DUMMY_PASSWORD = 'dummy-password';

export class DummyDataSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<void> {
        faker.seed(FAKER_SEED);

        await dataSource.transaction(async (manager) => {
            const rolesByName = await this.getRolesByName(manager);
            const managersByKey = await this.seedManagers(manager, rolesByName);
            const stationsByKey = await this.seedStations(
                manager,
                managersByKey,
            );
            await this.seedVehicles(manager, stationsByKey);
            await this.seedPlans(manager);
            await this.seedTopUps(manager);
        });
    }

    private async getRolesByName(manager: EntityManager) {
        const roles = await manager.find(RoleEntity, {
            where: {
                name: In([Roles.HUB_MANAGER, Roles.SWAP_MANAGER]),
            },
        });

        return new Map(roles.map((role) => [role.name, role]));
    }

    private async seedManagers(
        manager: EntityManager,
        rolesByName: Map<string, RoleEntity>,
    ) {
        const managersByKey = new Map<string, UserEntity>();
        const managerConfigs = [
            { count: HUB_MANAGER_COUNT, roleName: Roles.HUB_MANAGER },
            { count: SWAP_MANAGER_COUNT, roleName: Roles.SWAP_MANAGER },
        ] as const;

        let managerNumber = 1;

        for (const config of managerConfigs) {
            const role = rolesByName.get(config.roleName);
            if (!role) {
                throw new Error(
                    `Required role "${config.roleName}" not found. Run RolesSeeder first.`,
                );
            }

            for (let index = 1; index <= config.count; index += 1) {
                const managerKey = `${config.roleName}-${index}`;
                const email = `${managerKey}@yugo.local`;
                const mobilenumber = this.buildMobileNumber(managerNumber);

                let user = await manager.findOne(UserEntity, {
                    where: [{ email }, { mobilenumber }],
                    relations: { roles: true },
                });

                if (!user) {
                    user = manager.create(UserEntity, {
                        email,
                        mobilenumber,
                    });
                }

                user.firstName = faker.person.firstName();
                user.lastName = faker.person.lastName();
                user.gender = faker.helpers.arrayElement([
                    Gender.MALE,
                    Gender.FEMALE,
                    Gender.OTHER,
                ]);
                user.password = DUMMY_PASSWORD;
                user.roles = [role];
                user.properties = {
                    seeded: true,
                    seedType: 'dummy-data',
                    seedKey: managerKey,
                    roleName: config.roleName,
                };

                const savedUser = await manager.save(user);
                managersByKey.set(managerKey, savedUser);
                managerNumber += 1;
            }
        }

        return managersByKey;
    }

    private async seedStations(
        manager: EntityManager,
        managersByKey: Map<string, UserEntity>,
    ) {
        const stationsByKey = new Map<string, StationEntity>();
        let stationNumber = 1;

        for (const [managerKey, stationManager] of managersByKey) {
            const roleName = stationManager.properties?.roleName;
            const stationType =
                roleName === Roles.HUB_MANAGER
                    ? StationType.HUB_STATION
                    : StationType.SWAP_STATION;
            const stationName = this.buildStationName(stationType);

            let station = await manager.findOne(
                stationType === StationType.HUB_STATION
                    ? HubStationEntity
                    : SwapStationEntity,
                {
                    where: { name: stationName },
                    relations: { address: true, managers: true },
                },
            );

            if (!station) {
                station = manager.create(
                    stationType === StationType.HUB_STATION
                        ? HubStationEntity
                        : SwapStationEntity,
                    { name: stationName },
                );
            }

            let address = station.address;
            if (!address) {
                address = manager.create(AddressEntity, {});
            }

            address.lineOne = faker.location.streetAddress();
            address.lineTwo = faker.location.secondaryAddress();
            address.pincode = faker.string.numeric(6);
            address.user = stationManager;
            address.userId = stationManager.id;

            const savedAddress = await manager.save(address);

            station.type = stationType;
            station.name = stationName;
            station.latitude = Number(
                faker.location.latitude({
                    min: 11.5,
                    max: 13.5,
                    precision: 8,
                }),
            );
            station.longitude = Number(
                faker.location.longitude({
                    min: 76.0,
                    max: 78.5,
                    precision: 8,
                }),
            );
            station.active = true;
            station.address = savedAddress;
            station.addressId = savedAddress.id;

            const savedStation = await manager.save(station);

            stationManager.stationId = savedStation.id;
            await manager.save(stationManager);

            stationsByKey.set(
                `${managerKey}-station-${stationNumber}`,
                savedStation,
            );
            stationNumber += 1;
        }

        return stationsByKey;
    }

    private async seedVehicles(
        manager: EntityManager,
        stationsByKey: Map<string, StationEntity>,
    ) {
        let stationNumber = 1;

        for (const station of stationsByKey.values()) {
            for (
                let vehicleNumber = 1;
                vehicleNumber <= VEHICLES_PER_STATION;
                vehicleNumber += 1
            ) {
                const vehicleIdentity = this.buildVehicleNumber(
                    stationNumber,
                    vehicleNumber,
                );

                let vehicle = await manager.findOne(VehicleEntity, {
                    where: { vehicleNumber: vehicleIdentity },
                });

                if (!vehicle) {
                    vehicle = manager.create(VehicleEntity, {
                        vehicleNumber: vehicleIdentity,
                    });
                }

                vehicle.rcNumber = `RC-${faker.string.alphanumeric({
                    length: 10,
                    casing: 'upper',
                })}`;
                vehicle.chassisNumber = faker.string.alphanumeric({
                    length: 17,
                    casing: 'upper',
                });
                vehicle.gpsId = `GPS-VEH-${faker.string.alphanumeric({
                    length: 8,
                    casing: 'upper',
                })}`;
                vehicle.properties = {
                    brand: faker.vehicle.manufacturer(),
                    model: faker.vehicle.model(),
                    seeded: true,
                    seedType: 'dummy-data',
                };
                vehicle.station = station;
                vehicle.stationId = station.id;

                await manager.save(vehicle);
            }

            stationNumber += 1;
        }
    }

    private buildMobileNumber(index: number) {
        return `91${String(index).padStart(10, '0')}`;
    }

    private buildStationName(type: StationType) {
        const label =
            type === StationType.HUB_STATION ? 'Hub Station' : 'Swap Station';
        return `Yugo ${label} ${faker.location.city()}`;
    }

    private buildVehicleNumber(stationNumber: number, vehicleNumber: number) {
        return `KA${String(stationNumber).padStart(2, '0')}YU${String(vehicleNumber).padStart(4, '0')}`;
    }

    private async seedPlans(manager: EntityManager) {
        const planConfigs = [
            {
                name: 'Basic City Plan',
                validityDays: 30,
                kmLimit: 500,
                price: 999,
                deposit: 500,
                gstPercentage: 18,
            },
            {
                name: 'Pro Commuter Plan',
                validityDays: 30,
                kmLimit: 1200,
                price: 1999,
                deposit: 500,
                gstPercentage: 18,
            },
            {
                name: 'Weekend Explorer',
                validityDays: 7,
                kmLimit: 300,
                price: 499,
                deposit: 500,
                gstPercentage: 18,
            },
            {
                name: 'Quarterly Saver',
                validityDays: 90,
                kmLimit: 4000,
                price: 4999,
                deposit: 500,
                gstPercentage: 18,
            },
        ];

        for (const config of planConfigs) {
            let plan = await manager.findOne(PlanEntity, {
                where: { name: config.name },
            });
            if (!plan) {
                plan = manager.create(PlanEntity, {
                    name: config.name,
                    description: faker.lorem.paragraph(),
                    validityDays: config.validityDays,
                    kmLimit: config.kmLimit,
                    price: config.price,
                    deposit: config.deposit,
                    gstPercentage: config.gstPercentage,
                    active: true,
                });
                await manager.save(plan);
            }
        }
    }

    private async seedTopUps(manager: EntityManager) {
        const topUpConfigs = [
            {
                name: '100 KM Boost',
                validityDays: 7,
                kmLimit: 100,
                price: 199,
                gstPercentage: 18,
            },
            {
                name: '250 KM Voyager',
                validityDays: 14,
                kmLimit: 250,
                price: 399,
                gstPercentage: 18,
            },
            {
                name: '500 KM Ultimate',
                validityDays: 30,
                kmLimit: 500,
                price: 699,
                gstPercentage: 18,
            },
        ];

        for (const config of topUpConfigs) {
            let topUp = await manager.findOne(TopUpEntity, {
                where: { name: config.name },
            });
            if (!topUp) {
                topUp = manager.create(TopUpEntity, {
                    name: config.name,
                    description: faker.lorem.sentence(),
                    validityDays: config.validityDays,
                    kmLimit: config.kmLimit,
                    price: config.price,
                    gstPercentage: config.gstPercentage,
                    active: true,
                });
                await manager.save(topUp);
            }
        }
    }
}
