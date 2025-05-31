import { IsEmail, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsString({ message: 'O email é obrigatório' })
  @IsEmail()
  email: string;

  @IsString({ message: 'A senha é obrigatória' })
  password: string;
}
