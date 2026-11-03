import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { BancosService } from './bancos.service.js';
import { ListarBancosDto } from './dto/listar-bancos.dto.js';

import type {
  Banco,
  RespostaBancos,
} from './bancos.types.js';

@Controller('api/v1/bancos')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
export class BancosController {
  constructor(private readonly bancosService: BancosService) {}

  @Get()
  listar(
    @Query() filtros: ListarBancosDto,
  ): Promise<RespostaBancos> {
    return this.bancosService.listar(filtros);
  }

  @Post('pesquisar')
  @HttpCode(200)
  pesquisar(
    @Body() filtros: ListarBancosDto,
  ): Promise<RespostaBancos> {
    return this.bancosService.pesquisar(filtros);
  }

  @Get(':codigo')
  obter(
    @Param('codigo', ParseIntPipe) codigo: number,
  ): Promise<Banco> {
    return this.bancosService.obterPorCodigo(codigo);
  }
}