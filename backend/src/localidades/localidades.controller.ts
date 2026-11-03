import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { LocalidadesService } from './localidades.service.js';
import { ListarMunicipiosDto } from './dto/listar-municipios.dto.js';

import type {
  RespostaEstados,
  RespostaMunicipios,
} from './localidades.types.js';

@Controller('api/v1/localidades')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
export class LocalidadesController {
  constructor(
    private readonly localidadesService: LocalidadesService,
  ) {}

  @Get('estados')
  listarEstados(): Promise<RespostaEstados> {
    return this.localidadesService.listarEstados();
  }

  @Get('estados/:uf/municipios')
  listarMunicipios(
    @Param('uf') uf: string,
    @Query() filtros: ListarMunicipiosDto,
  ): Promise<RespostaMunicipios> {
    return this.localidadesService.listarMunicipios(
      uf,
      filtros,
    );
  }

  @Post('estados/:uf/municipios/pesquisar')
  @HttpCode(200)
  pesquisarMunicipios(
    @Param('uf') uf: string,
    @Body() filtros: ListarMunicipiosDto,
  ): Promise<RespostaMunicipios> {
    return this.localidadesService.pesquisarMunicipios(
      uf,
      filtros,
    );
  }
}