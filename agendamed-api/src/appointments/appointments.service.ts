import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { IAppointment } from 'src/interfaces/appointment.interface';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ISpeciality } from 'src/interfaces/speciality.interface';
import { IDoctor } from 'src/interfaces/doctor.interface';
import { FilterAppointmentsDto } from './dto/filter-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllSpeciality(): Promise<ISpeciality[]> {
    return await this.prismaService.specialities.findMany();
  }

  async findDoctorBySpeciality(speciality_id: number): Promise<IDoctor[]> {
    return await this.prismaService.doctors.findMany({
      where: { speciality_id: speciality_id },
    });
  }

  async findById(id: number, user_id: number): Promise<IAppointment | null> {
    const appointment = await this.prismaService.appointments.findFirst({
      where: {
        id: id,
        user_id: user_id,
      },
      include: {
        speciality: true,
        doctor: true,
      },
    });

    return appointment;
  }

  async findAll(
    user_id: number,
    filters: FilterAppointmentsDto,
  ): Promise<{ appointments: IAppointment[]; total: number }> {
    const { page = 1, status_code, schedule_day } = filters;

    const where: any = {
      user_id,
    };

    if (status_code) {
      where.status_code = +status_code;
    }

    if (schedule_day) {
      const date = new Date(schedule_day);
      const start = new Date(date);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);

      where.schedule_day = {
        gte: start,
        lt: end,
      };
    }
    const [appointments, total] = await Promise.all([
      this.prismaService.appointments.findMany({
        where,
        skip: (page - 1) * 5,
        take: 5,
        include: {
          speciality: true,
          doctor: true,
        },
      }),
      this.prismaService.appointments.count({ where }),
    ]);

    return { appointments, total };
  }

  async create(
    createAppointmentDto: CreateAppointmentDto,
    user_id: number,
  ): Promise<{ message: string; schedule_day: string }> {
    if (new Date(createAppointmentDto.schedule_day) < new Date()) {
      throw new BadRequestException('Não é possivel agendar para o passado.');
    }

    await this.prismaService.appointments.create({
      data: {
        speciality_id: createAppointmentDto.speciality_id,
        doctor_id: createAppointmentDto.doctor_id,
        user_id: user_id,
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

  async finish(id: number, user_id: number) {
    const appointment = await this.findById(id, user_id);
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
      where: { id, user_id },
      data: { status_code: 1 },
    });

    return result;
  }

  async cancel(id: number, user_id: number) {
    const appointment = await this.findById(id, user_id);

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    const isInPast = new Date(appointment.schedule_day) < new Date();
    const status = appointment.status_code !== 0;

    if (isInPast || status) {
      throw new BadRequestException('Agendamento não pode ser cancelado!');
    }

    return await this.prismaService.appointments.update({
      where: { id: id, user_id: user_id },
      data: { status_code: 2 },
    });
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
    user_id: number,
  ) {
    const appointment = await this.findById(id, user_id);

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (appointment.status_code !== 0) {
      throw new BadRequestException('Agendamento nao pode ser atualizado!');
    }

    return await this.prismaService.appointments.update({
      where: { id: id, user_id: user_id },
      data: {
        schedule_day: updateAppointmentDto.schedule_day,
        notes: updateAppointmentDto.notes,
      },
    });
  }
}
