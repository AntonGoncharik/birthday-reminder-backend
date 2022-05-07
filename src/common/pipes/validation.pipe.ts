import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    try {
      const obj = plainToClass(metadata.metatype, value.payload);
      const errors = await validate(obj);

      if (errors.length) {
        const messages = errors.map((error) => {
          return `${error.property} - ${Object.values(error.constraints).join(
            ', ',
          )}`;
        });

        throw new Error(messages.join('; '));
      }

      return value;
    } catch (error) {
      throw new Error((error as { message: string }).message);
    }
  }
}
