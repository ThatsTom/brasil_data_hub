
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { CepController } from './cep.controller.js';
import { CepService } from './cep.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [CepController],
  providers: [CepService],
})
export class CepModule {}
