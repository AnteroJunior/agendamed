import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createAuthDto: CreateUserDto,
  ): Promise<{ message: string; name: string }> {
    if (createAuthDto.password !== createAuthDto.confirmPassword) {
      throw new ForbiddenException('Senhas não são iguais');
    }

    const user: IUser | null = await this.findByEmail(createAuthDto.email);

    if (user) {
      throw new ForbiddenException('Usuário já cadastrado com esse e-mail.');
    }

    await this.prismaService.clients.create({
      data: {
        name: createAuthDto.name,
        email: createAuthDto.email,
        password: await bcrypt.hash(createAuthDto.password, 12),
      },
    });

    return {
      message: 'Usuário criado com sucesso',
      name: createAuthDto.name,
    };
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.prismaService.clients.findFirst({
      where: {
        email: email,
      },
    });

    return user;
  }
}
