import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { CnpjController } from './cnpj.controller.js';
import { CnpjService } from './cnpj.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [CnpjController],
  providers: [CnpjService],
})
export class CnpjModule {}