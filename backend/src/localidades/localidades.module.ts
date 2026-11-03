import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module.js';
import { LocalidadesController } from './localidades.controller.js';
import { LocalidadesService } from './localidades.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [LocalidadesController],
  providers: [LocalidadesService],
})
export class LocalidadesModule {}