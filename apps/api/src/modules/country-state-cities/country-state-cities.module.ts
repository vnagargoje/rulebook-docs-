import { Module } from '@nestjs/common';
import { V1StatesController } from './controllers/v1/states.controller.js';
import { V1CitiesController } from './controllers/v1/cities.controller.js';

@Module({
    controllers: [V1StatesController, V1CitiesController],
})
export class CountryStateCitiesModule {}
