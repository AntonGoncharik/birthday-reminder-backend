import { IsString } from 'class-validator';

export class CreateBirthdayManDto {
  @IsString({ message: 'should be a string' })
  userId: string;

  @IsString({ message: 'should be a string' })
  firstName: string;

  @IsString({ message: 'should be a string' })
  lastName: string;

  @IsString({ message: 'should be a string' })
  birthDate: string;
}
