import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Should be a string' })
  firstName: string;
}
