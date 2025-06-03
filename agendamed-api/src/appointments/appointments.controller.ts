import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Patch,
  Param,
  ParseIntPipe,
  Put,
  Get,
  UseGuards,
  Req,
  Query,
  UseFilters,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { IAppointment } from 'src/interfaces/appointment.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ISpeciality } from 'src/interfaces/speciality.interface';
import { IDoctor } from 'src/interfaces/doctor.interface';
import { FilterAppointmentsDto } from './dto/filter-appointment.dto';
import { PrismaClientExceptionFilter } from 'src/filters/prisma-exception.filter';

@UseGuards(JwtAuthGuard)
@UseFilters(PrismaClientExceptionFilter)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async findAll(
    @Req() req,
    @Query() filters: FilterAppointmentsDto,
  ): Promise<{ appointments: IAppointment[]; total: number }> {
    return await this.appointmentsService.findAll(+req.user?.id, filters);
  }

  @Get('speciality')
  async findAllSpeciality(): Promise<ISpeciality[]> {
    return await this.appointmentsService.findAllSpeciality();
  }

  @Get('speciality/:speciality_id')
  async findDoctorBySpeciality(
    @Param('speciality_id', ParseIntPipe) speciality_id: number,
  ): Promise<IDoctor[]> {
    return await this.appointmentsService.findDoctorBySpeciality(speciality_id);
  }

  @Get(':id')
  async findById(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IAppointment | null> {
    return (await this.appointmentsService.findById(id, +req.user?.id)) || null;
  }

  @Post()
  async create(
    @Req() req: any,
    @Body(new ValidationPipe()) createAppointmentDto: CreateAppointmentDto,
  ): Promise<{ message: string } | undefined> {
    await this.appointmentsService.create(createAppointmentDto, +req.user?.id);
    return { message: 'Consulta agendada com sucesso.' };
  }

  @Patch(':id/finish')
  async finish(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.appointmentsService.finish(id, +req.user?.id);
    return { message: 'Agendamento finalizado com sucesso' };
  }

  @Patch(':id/cancel')
  async cancel(
    @Req() req: any,
    @Param('id') id: number,
  ): Promise<{ message: string }> {
    await this.appointmentsService.cancel(+id, +req.user?.id);
    return { message: 'Agendamento cancelado com sucesso' };
  }

  @Put(':id')
  async update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<{ message: string }> {
    await this.appointmentsService.update(
      id,
      updateAppointmentDto,
      +req.user?.id,
    );
    return { message: 'Agendamento atualizado com sucesso' };
  }
}
