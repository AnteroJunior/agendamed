import { IsDateString, IsString, Validate } from 'class-validator';
import { IsFutureDate } from '../validators/is-future-date.validator';

export class UpdateAppointmentDto {
  @IsDateString(
    { strictSeparator: true },
    { message: 'Data inválida. Separe a data da hora com o T' },
  )
  @Validate(IsFutureDate, {
    message:
      'Data inválida! Não é possivel agendar para o passado. Tente novamente.',
  })
  schedule_day: Date;

  @IsString({ message: 'Observações obrigatórias' })
  notes: string;
}
