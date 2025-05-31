import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  NotFoundException,
  Patch,
  Param,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(
    @Body(new ValidationPipe()) createAppointmentDto: CreateAppointmentDto,
  ): Promise<{ message: string } | undefined> {
    try {
      await this.appointmentsService.create(createAppointmentDto);
      return { message: 'Consulta agendada com sucesso.' };
    } catch (error: any) {
      if (error.code === 'P2003') {
        if (error.meta?.constraint?.includes('speciality_id')) {
          throw new NotFoundException('Especialidade não encontrada');
        } else if (error.meta?.constraint?.includes('doctor_id')) {
          throw new NotFoundException('Médico não encontrado');
        } else if (error.meta?.constraint?.includes('user_id')) {
          throw new NotFoundException('Usuário não encontrado');
        }
      } else if (error.code === 'P2002') {
        throw new NotFoundException(
          'Agendamento não pode ser realizado. Você tem uma consulta agendada nesta data.',
        );
      }
    }
  }

  @Patch(':id/finish')
  async finish(@Param('id') id: number): Promise<{ message: string }> {
    try {
      await this.appointmentsService.finish(+id);
      return { message: 'Agendamento finalizado com sucesso' };
    } catch (error: any) {
      throw new NotFoundException(
        'Agendamento não finalizado. Tente novamente.',
      );
    }
  }
}
