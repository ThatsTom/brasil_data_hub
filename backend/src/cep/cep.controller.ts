
import { Controller, Get, Param } from '@nestjs/common';
import { CepService } from './cep.service.js';

@Controller('api/v1/cep')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get(':cep')
  consultar(@Param('cep') cep: string) {
    return this.cepService.consultar(cep);
  }
}
