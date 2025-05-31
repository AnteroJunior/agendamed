import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    if (new Date(createAppointmentDto.schedule_day) < new Date()) {
      throw new BadRequestException('Não é possivel agendar para o passado.');
    }

    await this.prismaService.appointments.create({
      data: {
        speciality_id: createAppointmentDto.speciality_id,
        doctor_id: createAppointmentDto.doctor_id,
        user_id: createAppointmentDto.user_id, // trocar para verificar o JWT
        schedule_day: createAppointmentDto.schedule_day,
        notes: (createAppointmentDto.notes || 'Sem observações').toUpperCase(),
      },
    });

    return {
      message: 'Consulta agendada com sucesso.',
      schedule_day: new Date(
        createAppointmentDto.schedule_day,
      ).toLocaleString(),
    };
  }
}
