
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { CepModule } from './cep/cep.module.js';
import { ConsultasModule } from './consultas/consultas.module.js';
import { CnpjModule } from './cnpj/cnpj.module.js';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CepModule,
    ConsultasModule,
    CnpjModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
