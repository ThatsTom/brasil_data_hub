import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module.js';
import { FeriadosController } from './feriados.controller.js';
import { FeriadosService } from './feriados.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [FeriadosController],
  providers: [FeriadosService],
})
export class FeriadosModule {}