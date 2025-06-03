import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    users: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: '123456',
    };

    it('should throw ForbiddenException if passwords do not match', async () => {
      const invalidDto = { ...dto, confirmPassword: 'wrong' };

      await expect(service.create(invalidDto as any)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException if user already exists', async () => {
      mockPrismaService.users.findFirst.mockResolvedValue({ id: 1, ...dto });

      await expect(service.create(dto as any)).rejects.toThrow(
        ForbiddenException,
      );

      expect(mockPrismaService.users.findFirst).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
    });

    it('should create user and return success message', async () => {
      mockPrismaService.users.findFirst.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.users.create.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto as any);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 12);
      expect(mockPrismaService.users.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          email: dto.email,
          password: 'hashedPassword',
        },
      });

      expect(result).toEqual({
        message: 'Usuário criado com sucesso',
        name: dto.name,
      });
    });
  });

  describe('findByEmail', () => {
    it('should return user if found', async () => {
      const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
      mockPrismaService.users.findFirst.mockResolvedValue(user);

      const result = await service.findByEmail('john@example.com');

      expect(mockPrismaService.users.findFirst).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockPrismaService.users.findFirst.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });
});
