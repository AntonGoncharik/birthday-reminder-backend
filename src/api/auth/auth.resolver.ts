import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation('signup')
  async signup(@Args() args: LoginDto): Promise<void> {
    // return this.authService.signup(signupDto);
  }
}
