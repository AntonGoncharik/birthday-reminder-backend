import { Controller, Get, Param, Redirect } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Active } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/active/:link')
  @Redirect()
  active(@Param() params: Active) {
    return this.authService.active(params.link);
  }
}
