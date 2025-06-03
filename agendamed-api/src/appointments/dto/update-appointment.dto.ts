import { IsDateString, IsString, Validate } from 'class-validator';
import { IsFutureDate } from '../validators/is-future-date.validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentDto {
  @ApiProperty()
  @IsDateString(
    { strictSeparator: true },
    { message: 'Data inválida. Separe a data da hora com o T' },
  )
  @Validate(IsFutureDate, {
    message:
      'Data inválida! Não é possivel agendar para o passado. Tente novamente.',
  })
  schedule_day: Date;

  @ApiProperty()
  @IsString({ message: 'Observações obrigatórias' })
  notes: string;
}
