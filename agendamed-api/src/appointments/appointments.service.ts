import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IAppointment } from 'src/interfaces/appointment.interface';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: number): Promise<IAppointment | null> {
    const appointment = await this.prismaService.appointments.findFirst({
      where: {
        id: id,
      },
    });

    return appointment;
  }

  async findAll() {
    return await this.prismaService.appointments.findMany();
  }

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<{ message: string; schedule_day: string }> {
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

  async finish(id: number) {
    const appointment = await this.findById(id);
    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    const isInFuture = new Date(appointment.schedule_day) > new Date();
    const status = appointment.status_code !== 0;
    if (isInFuture || status) {
      throw new BadRequestException(
        'Agendamento não pode ser finalizado! Somente datas passadas podem ser finalizadas ou consultas pendentes.',
      );
    }

    const result = await this.prismaService.appointments.update({
      where: { id },
      data: { status_code: 1 },
    });

    return result;
  }

  async cancel(id: number) {
    const appointment = await this.findById(id);

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    const isInPast = new Date(appointment.schedule_day) < new Date();
    const status = appointment.status_code !== 0;

    if (isInPast || status) {
      throw new BadRequestException('Agendamento não pode ser cancelado!');
    }

    return await this.prismaService.appointments.update({
      where: { id: id },
      data: { status_code: 2 },
    });
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.findById(id);

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (appointment.status_code !== 0) {
      throw new BadRequestException('Agendamento nao pode ser atualizado!');
    }

    return await this.prismaService.appointments.update({
      where: { id: id },
      data: {
        schedule_day: updateAppointmentDto.schedule_day,
        notes: updateAppointmentDto.notes,
      },
    });
  }
}
