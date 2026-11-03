import { Type } from 'class-transformer';

import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class DashboardFiltrosDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([7, 30, 90])
  periodo: number = 30;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  inicio?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fim?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Matches(/^[A-Za-z_]+$/)
  tipo?: string;
}