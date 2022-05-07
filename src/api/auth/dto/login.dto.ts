import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'should be a string' })
  @IsEmail({}, { message: 'invalid email' })
  email: string;

  @IsString({ message: 'should be a string' })
  @Length(4, 16, { message: 'not less than 6 and not more than 16 characters' })
  password: string;
}
