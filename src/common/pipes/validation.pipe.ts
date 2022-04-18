import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    try {
      const obj = plainToClass(metadata.metatype, value);
      const errors = await validate(obj);

      if (errors.length) {
        const messages = errors.map((error) => {
          return `${error.property} - ${Object.values(error.constraints).join(
            ', ',
          )}`;
        });
        throw new BadRequestException({
          message: messages,
        });
      }

      return value;
    } catch (error) {}
  }
}
