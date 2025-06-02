import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  NotFoundException,
  Patch,
  Param,
  ParseIntPipe,
  Put,
  Get,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { IAppointment } from 'src/interfaces/appointment.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req): Promise<IAppointment[]> {
    return await this.appointmentsService.findAll(+req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IAppointment | null> {
    try {
      return (
        (await this.appointmentsService.findById(id, +req.user?.id)) || null
      );
    } catch (error: any) {
      throw new HttpException(
        'Agendamento não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req: any,
    @Body(new ValidationPipe()) createAppointmentDto: CreateAppointmentDto,
  ): Promise<{ message: string } | undefined> {
    try {
      await this.appointmentsService.create(
        createAppointmentDto,
        +req.user?.id,
      );
      return { message: 'Consulta agendada com sucesso.' };
    } catch (error) {
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id/finish')
  async finish(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    try {
      await this.appointmentsService.finish(id, +req.user?.id);
      return { message: 'Agendamento finalizado com sucesso' };
    } catch (error: any) {
      throw new NotFoundException(
        'Agendamento não finalizado. Tente novamente.',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancel(
    @Req() req: any,
    @Param('id') id: number,
  ): Promise<{ message: string }> {
    try {
      await this.appointmentsService.cancel(+id, +req.user?.id);
      return { message: 'Agendamento cancelado com sucesso' };
    } catch (error: any) {
      console.log(error);
      throw new NotFoundException(
        'Agendamento não cancelado. Tente novamente.',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<{ message: string }> {
    try {
      await this.appointmentsService.update(
        id,
        updateAppointmentDto,
        +req.user?.id,
      );
      return { message: 'Agendamento atualizado com sucesso' };
    } catch (error: any) {
      console.log(error);
      throw new NotFoundException(
        'Agendamento não atualizado. Tente novamente.',
      );
    }
  }
}
