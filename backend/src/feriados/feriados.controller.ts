import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { FeriadosService } from './feriados.service.js';

import type {
  RespostaFeriados,
} from './feriados.types.js';

@Controller('api/v1/feriados')
export class FeriadosController {
  constructor(
    private readonly feriadosService: FeriadosService,
  ) {}

  @Get(':ano')
  listar(
    @Param('ano', ParseIntPipe) ano: number,
  ): Promise<RespostaFeriados> {
    return this.feriadosService.listar(ano);
  }

  @Post(':ano/consultar')
  @HttpCode(200)
  consultar(
    @Param('ano', ParseIntPipe) ano: number,
  ): Promise<RespostaFeriados> {
    return this.feriadosService.consultar(ano);
  }
}