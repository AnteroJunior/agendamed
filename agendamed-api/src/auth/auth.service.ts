import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { IUser } from 'src/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ILogin } from 'src/interfaces/login.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto): Promise<ILogin> {
    const user: IUser | null = await this.usersService.findByEmail(
      loginAuthDto.email,
    );

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(
      loginAuthDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const payload = { sub: user.id, email: user.email, name: user.name };

    const token = await this.jwtService.signAsync(payload);

    return { message: 'Usuário logado com sucesso', access_token: token };
  }
}
