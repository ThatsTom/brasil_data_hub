import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { BancosController } from './bancos.controller.js';
import { BancosService } from './bancos.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [BancosController],
  providers: [BancosService],
})
export class BancosModule {}