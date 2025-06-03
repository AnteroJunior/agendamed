import { IsDateString, IsNumber, IsString, Validate } from 'class-validator';
import { IsFutureDate } from '../validators/is-future-date.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsNumber({}, { message: 'Especialidade obrigatória e deve ser um número' })
  speciality_id: number;

  @ApiProperty()
  @IsNumber({}, { message: 'Especialidade obrigatória e deve ser um número' })
  doctor_id: number;

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
