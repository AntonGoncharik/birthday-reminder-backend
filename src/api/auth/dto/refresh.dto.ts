import { IsString } from 'class-validator';

export class RefreshDto {
  @IsString({ message: 'should be a string' })
  refreshToken: string;
}
