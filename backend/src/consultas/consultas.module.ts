import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { ConsultasController } from './consultas.controller.js';
import { ConsultasService } from './consultas.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [ConsultasController],
  providers: [ConsultasService],
})
export class ConsultasModule {}