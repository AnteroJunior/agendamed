import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { NotFoundException, HttpException } from '@nestjs/common';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: AppointmentsService;

  const mockAppointmentsService = {
    findAll: jest.fn(),
    findAllSpeciality: jest.fn(),
    findDoctorBySpeciality: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    finish: jest.fn(),
    cancel: jest.fn(),
    update: jest.fn(),
  };

  const mockReq = { user: { id: 1 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: mockAppointmentsService,
        },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get<AppointmentsService>(AppointmentsService);

    jest.clearAllMocks();
  });

  it('should call service.findAll with correct params', async () => {
    const filters = { status: 'PENDING' };
    const result = { appointments: [], total: 0 };
    mockAppointmentsService.findAll.mockResolvedValue(result);

    expect(await controller.findAll(mockReq, filters as any)).toEqual(result);

    expect(mockAppointmentsService.findAll).toHaveBeenCalledWith(1, filters);
  });

  it('should return all specialities', async () => {
    const specialities = [{ id: 1, name: 'Cardiology' }];
    mockAppointmentsService.findAllSpeciality.mockResolvedValue(specialities);

    expect(await controller.findAllSpeciality()).toEqual(specialities);
  });

  it('should return doctors by speciality', async () => {
    const doctors = [{ id: 1, name: 'Dr. House' }];
    mockAppointmentsService.findDoctorBySpeciality.mockResolvedValue(doctors);

    expect(await controller.findDoctorBySpeciality(1)).toEqual(doctors);
    expect(mockAppointmentsService.findDoctorBySpeciality).toHaveBeenCalledWith(
      1,
    );
  });

  it('should return appointment by id', async () => {
    const appointment = { id: 1 };
    mockAppointmentsService.findById.mockResolvedValue(appointment);

    expect(await controller.findById(mockReq, 1)).toEqual(appointment);
  });

  it('should throw HttpException if appointment not found', async () => {
    mockAppointmentsService.findById.mockRejectedValue(new Error('Not found'));

    await expect(controller.findById(mockReq, 1)).rejects.toThrow(
      HttpException,
    );
  });

  it('should create appointment successfully', async () => {
    mockAppointmentsService.create.mockResolvedValue(undefined);

    const dto = { date: new Date(), doctorId: 1 };
    const result = await controller.create(mockReq, dto as any);

    expect(result).toEqual({ message: 'Consulta agendada com sucesso.' });
    expect(mockAppointmentsService.create).toHaveBeenCalledWith(dto, 1);
  });

  it('should throw NotFoundException on P2003 error', async () => {
    mockAppointmentsService.create.mockRejectedValue({ code: 'P2003' });

    const dto = { date: new Date(), doctorId: 1 };

    await expect(controller.create(mockReq, dto as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException on P2002 error', async () => {
    mockAppointmentsService.create.mockRejectedValue({ code: 'P2002' });

    const dto = { date: new Date(), doctorId: 1 };

    await expect(controller.create(mockReq, dto as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should finish appointment successfully', async () => {
    mockAppointmentsService.finish.mockResolvedValue(undefined);

    const result = await controller.finish(mockReq, 1);

    expect(result).toEqual({ message: 'Agendamento finalizado com sucesso' });
    expect(mockAppointmentsService.finish).toHaveBeenCalledWith(1, 1);
  });

  it('should throw NotFoundException on finish error', async () => {
    mockAppointmentsService.finish.mockRejectedValue(new Error('Error'));

    await expect(controller.finish(mockReq, 1)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should cancel appointment successfully', async () => {
    mockAppointmentsService.cancel.mockResolvedValue(undefined);

    const result = await controller.cancel(mockReq, 1);

    expect(result).toEqual({ message: 'Agendamento cancelado com sucesso' });
    expect(mockAppointmentsService.cancel).toHaveBeenCalledWith(1, 1);
  });

  it('should throw NotFoundException on cancel error', async () => {
    mockAppointmentsService.cancel.mockRejectedValue(new Error('Error'));

    await expect(controller.cancel(mockReq, 1)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update appointment successfully', async () => {
    mockAppointmentsService.update.mockResolvedValue(undefined);

    const dto = { date: new Date() };

    const result = await controller.update(mockReq, 1, dto as any);

    expect(result).toEqual({ message: 'Agendamento atualizado com sucesso' });
    expect(mockAppointmentsService.update).toHaveBeenCalledWith(1, dto, 1);
  });

  it('should throw NotFoundException on update error', async () => {
    mockAppointmentsService.update.mockRejectedValue(new Error('Error'));

    const dto = { date: new Date() };

    await expect(controller.update(mockReq, 1, dto as any)).rejects.toThrow(
      NotFoundException,
    );
  });
});
