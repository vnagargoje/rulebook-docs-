import {
    getCitiesOfState,
    getCountries,
    getStatesOfCountry,
} from '@countrystatecity/countries';
import {
    CityEntity,
    CountryEntity,
    StateEntity,
} from '@yugo/nestjs-database/entities';
import { DataSource, EntityManager } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ulid } from 'ulid';

interface CSCState {
    iso2: string;
    name: string;
    latitude: string;
    longitude: string;
}

interface CSCCity {
    name: string;
    latitude: string;
    longitude: string;
}

export class CountryStateCitiesSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<void> {
        await this.seedCountries(dataSource.manager);

        const india = await dataSource.manager.findOneBy(CountryEntity, {
            code: 'IN',
        });

        if (india) {
            await this.seedCountryStates(dataSource.manager, india);

            const states = await dataSource.manager.find(StateEntity, {
                where: { country: { code: india.code } },
                relations: { country: true },
            });

            console.log(
                `Seeding cities for ${states.length} states in India...`,
            );
            for (const state of states) {
                await this.seedStateCities(dataSource.manager, state);
            }
        }
    }

    async seedCountries(manager: EntityManager) {
        const countries = await getCountries();
        const existing = await manager.find(CountryEntity);

        // We only care about India for now as per user request
        const indiaData = countries.find((c) => c.iso2 === 'IN');
        if (!indiaData) return;

        const alreadyExists = existing.find((e) => e.code === 'IN');
        if (!alreadyExists) {
            const country = manager.create(CountryEntity, {
                code: indiaData.iso2,
                name: indiaData.name,
            });
            await manager.save(country);
        }
    }

    async seedCountryStates(manager: EntityManager, country: CountryEntity) {
        const existingStates = await manager.find(StateEntity, {
            where: { country: { code: country.code } },
        });

        const statesData = (await getStatesOfCountry(
            country.code,
        )) as CSCState[];
        const toPersist = statesData
            .filter(
                (s: CSCState) =>
                    !existingStates.some((e: StateEntity) => e.code === s.iso2),
            )
            .map((s: CSCState) => {
                return manager.create(StateEntity, {
                    id: ulid(),
                    code: s.iso2,
                    name: s.name,
                    latitude: s.latitude ? parseFloat(s.latitude) : 0,
                    longitude: s.longitude ? parseFloat(s.longitude) : 0,
                    country: country,
                });
            });

        if (toPersist.length > 0) {
            await manager.save(toPersist);
        }
    }

    async seedStateCities(manager: EntityManager, state: StateEntity) {
        const existingCities = await manager.find(CityEntity, {
            where: { state: { id: state.id } },
        });

        const citiesData = (await getCitiesOfState(
            'IN', // India
            state.code,
        )) as CSCCity[];
        const toPersist = citiesData
            .filter(
                (c: CSCCity) =>
                    !existingCities.some((e: CityEntity) => e.name === c.name),
            )
            .map((c: CSCCity) => {
                return manager.create(CityEntity, {
                    id: ulid(),
                    name: c.name,
                    latitude: c.latitude ? parseFloat(c.latitude) : 0,
                    longitude: c.longitude ? parseFloat(c.longitude) : 0,
                    state: state,
                });
            });

        if (toPersist.length > 0) {
            // Processing in chunks to avoid large query errors
            const chunkSize = 500;
            for (let i = 0; i < toPersist.length; i += chunkSize) {
                const chunk = toPersist.slice(i, i + chunkSize);
                await manager.save(chunk);
            }
        }
    }
}
