import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString({ message: 'O nome é obrigatório' })
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString({ message: 'A senha é obrigatória' })
  password: string;

  @ApiProperty()
  @IsString({ message: 'A confirmação da senha é obrigatória' })
  confirmPassword: string;
}
