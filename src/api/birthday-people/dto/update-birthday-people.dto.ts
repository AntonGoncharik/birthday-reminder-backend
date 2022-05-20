import { IsString } from 'class-validator';

export class UpdateBirthdayManDto {
  @IsString({ message: 'should be a string' })
  id: string;

  @IsString({ message: 'should be a string' })
  firstName?: string;

  @IsString({ message: 'should be a string' })
  lastName?: string;

  @IsString({ message: 'should be a string' })
  birthDate?: string;
}
