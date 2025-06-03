import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilterAppointmentsDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status_code?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  schedule_day?: string;
}
