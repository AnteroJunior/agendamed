import { IsDateString, IsNumber, IsString, Validate } from 'class-validator';
import { IsFutureDate } from '../validators/is-future-date.validator';

export class CreateAppointmentDto {
  @IsNumber({}, { message: 'Especialidade obrigatória e deve ser um número' })
  speciality_id: number;

  @IsNumber({}, { message: 'Especialidade obrigatória e deve ser um número' })
  doctor_id: number;

  @IsNumber({}, { message: 'Especialidade obrigatória e deve ser um número' })
  user_id: number;

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
