import { IsEmail, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString({ message: 'O nome é obrigatório' })
  name: string;

  @IsString({ message: 'O email é obrigatório' })
  @IsEmail()
  email: string;

  @IsString({ message: 'A senha é obrigatória' })
  password: string;

  @IsString({ message: 'A confirmação de senha é obrigatória' })
  confirmPassword: string;
}
