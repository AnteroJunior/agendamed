import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  appointments: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  specialities: {
    findMany: jest.fn(),
  },
  doctors: {
    findMany: jest.fn(),
  },
};

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw BadRequestException if schedule_day is in the past', async () => {
      const dto = {
        speciality_id: 1,
        doctor_id: 1,
        schedule_day: new Date('2023-01-01T10:00:00.000Z'),
        notes: 'Teste',
      };

      await expect(service.create(dto, 1)).rejects.toThrow(BadRequestException);
    });

    it('should create appointment successfully', async () => {
      const dto = {
        speciality_id: 1,
        doctor_id: 1,
        schedule_day: new Date('2026-01-01T10:00:00.000Z'),
        notes: 'Observação',
      };

      mockPrismaService.appointments.create.mockResolvedValue({});

      const result = await service.create(dto, 1);

      expect(result.message).toBe('Consulta agendada com sucesso.');
      expect(mockPrismaService.appointments.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated appointments with total', async () => {
      mockPrismaService.appointments.findMany.mockResolvedValue([
        { id: 1, user_id: 1 },
      ]);
      mockPrismaService.appointments.count.mockResolvedValue(1);

      const result = await service.findAll(1, {});

      expect(result.total).toBe(1);
      expect(result.appointments.length).toBe(1);
    });
  });

  describe('finish', () => {
    it('should throw if appointment not found', async () => {
      mockPrismaService.appointments.findFirst.mockResolvedValue(null);

      await expect(service.finish(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw if appointment is in the future or already finalized', async () => {
      mockPrismaService.appointments.findFirst.mockResolvedValue({
        id: 1,
        user_id: 1,
        schedule_day: new Date(Date.now() + 3600 * 1000).toISOString(),
        status_code: 0,
      });

      await expect(service.finish(1, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should return an appointment', async () => {
      const appointment = { id: 1, user_id: 1 };
      mockPrismaService.appointments.findFirst.mockResolvedValue(appointment);

      const result = await service.findById(1, 1);

      expect(result).toEqual(appointment);
      expect(mockPrismaService.appointments.findFirst).toHaveBeenCalledWith({
        where: { id: 1, user_id: 1 },
        include: { speciality: true, doctor: true },
      });
    });
  });

  describe('findDoctorBySpeciality', () => {
    it('should return a list of doctors by speciality', async () => {
      const doctors = [{ id: 1, name: 'Dr. A' }];
      mockPrismaService.doctors.findMany.mockResolvedValue(doctors);

      const result = await service.findDoctorBySpeciality(1);

      expect(result).toEqual(doctors);
      expect(mockPrismaService.doctors.findMany).toHaveBeenCalledWith({
        where: { speciality_id: 1 },
      });
    });
  });

  describe('finish', () => {
    it('should successfully finish an appointment', async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // ontem
      const appointment = {
        id: 1,
        user_id: 1,
        schedule_day: pastDate,
        status_code: 0,
      };

      mockPrismaService.appointments.findFirst.mockResolvedValue(appointment);
      mockPrismaService.appointments.update.mockResolvedValue({
        ...appointment,
        status_code: 1,
      });

      const result = await service.finish(1, 1);

      expect(result.status_code).toBe(1);
      expect(mockPrismaService.appointments.update).toHaveBeenCalledWith({
        where: { id: 1, user_id: 1 },
        data: { status_code: 1 },
      });
    });
  });

  describe('cancel', () => {
    it('should throw if appointment is in the past', async () => {
      const appointment = {
        id: 1,
        user_id: 1,
        schedule_day: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status_code: 0,
      };

      mockPrismaService.appointments.findFirst.mockResolvedValue(appointment);

      await expect(service.cancel(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('should cancel a valid appointment', async () => {
      const appointment = {
        id: 1,
        user_id: 1,
        schedule_day: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status_code: 0,
      };

      mockPrismaService.appointments.findFirst.mockResolvedValue(appointment);
      mockPrismaService.appointments.update.mockResolvedValue({
        ...appointment,
        status_code: 2,
      });

      const result = await service.cancel(1, 1);

      expect(result.status_code).toBe(2);
      expect(mockPrismaService.appointments.update).toHaveBeenCalledWith({
        where: { id: 1, user_id: 1 },
        data: { status_code: 2 },
      });
    });
  });

  describe('update', () => {
    it('should throw if appointment not found', async () => {
      mockPrismaService.appointments.findFirst.mockResolvedValue(null);

      await expect(
        service.update(
          1,
          { schedule_day: new Date('2025-07-01'), notes: 'n/a' },
          1,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if status_code !== 0', async () => {
      const appointment = {
        id: 1,
        user_id: 1,
        schedule_day: new Date().toISOString(),
        status_code: 2,
      };
      mockPrismaService.appointments.findFirst.mockResolvedValue(appointment);

      await expect(
        service.update(
          1,
          { schedule_day: new Date('2025-07-01'), notes: 'n/a' },
          1,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update appointment if valid', async () => {
      const appointment = {
        id: 1,
        user_id: 1,
        schedule_day: new Date().toISOString(),
        status_code: 0,
      };
      mockPrismaService.appointments.findFirst.mockResolvedValue(appointment);
      mockPrismaService.appointments.update.mockResolvedValue({
        ...appointment,
        notes: 'Atualizado',
      });

      const dto = {
        schedule_day: new Date(),
        notes: 'Atualizado',
      };

      const result = await service.update(1, dto, 1);

      expect(result.notes).toBe('Atualizado');
      expect(mockPrismaService.appointments.update).toHaveBeenCalledWith({
        where: { id: 1, user_id: 1 },
        data: {
          schedule_day: dto.schedule_day,
          notes: dto.notes,
        },
      });
    });
  });
});
