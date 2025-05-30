import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'O nome é obrigatório' })
  name: string;

  @IsEmail()
  email: string;

  @IsString({ message: 'A senha é obrigatória' })
  password: string;

  @IsString({ message: 'A confirmação da senha é obrigatória' })
  confirmPassword: string;
}
