import { Controller, Get, Param } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Active } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/active/:link')
  // @Redirect('http://localhost:3000/auth', 301)
  active(@Param() params: Active) {
    return this.authService.active(params.link);
  }
}
