import { Controller, Get, Param } from '@nestjs/common';
import { CnpjService } from './cnpj.service.js';
import type { EmpresaCnpj } from './cnpj.types.js';

@Controller('api/v1/cnpj')
export class CnpjController {
  constructor(private readonly cnpjService: CnpjService) {}

  @Get(':cnpj')
  consultar(@Param('cnpj') cnpj: string): Promise<EmpresaCnpj> {
    return this.cnpjService.consultar(cnpj);
  }
}