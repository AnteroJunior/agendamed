import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty()
  @IsString({ message: 'O email é obrigatório' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString({ message: 'A senha é obrigatória' })
  password: string;
}
