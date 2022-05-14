import { IsString } from 'class-validator';

export class Active {
  @IsString({ message: 'should be a string' })
  link: string;
}
