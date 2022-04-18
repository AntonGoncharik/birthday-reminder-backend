import { IsString } from 'class-validator';

export class RefreshDto {
  @IsString({ message: 'Should be a string' })
  refreshToken: string;
}
