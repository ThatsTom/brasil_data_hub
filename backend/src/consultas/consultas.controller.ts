import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ConsultasService } from './consultas.service.js';
import { ListarConsultasDto } from './dto/listar-consultas.dto.js';

@Controller('api/v1/consultas')
export class ConsultasController {
  constructor(
    private readonly consultasService: ConsultasService,
  ) {}

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  listar(@Query() filtros: ListarConsultasDto) {
    return this.consultasService.listar(filtros);
  }
}