import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUser } from 'src/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async login(
    loginAuthDto: LoginAuthDto,
  ): Promise<{ message: string; token: string }> {
    const user: IUser | null = await this.usersService.findByEmail(
      loginAuthDto.email,
    );

    if (!user) {
      throw new ForbiddenException('Usuário não encontrado');
    }

    if (user.password !== loginAuthDto.password) {
      throw new ForbiddenException('Senha incorreta');
    }

    return { message: 'Usuário logado com sucesso', token: 'token' };
  }
}
