import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { Auth } from './dto';
import { UserToken } from './interfaces';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation('signup')
  async signup(@Args() payload: Auth): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.authService.signup(payload.payload);
  }

  @Mutation('signin')
  async signin(@Args() payload: Auth): Promise<UserToken> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.authService.signin(payload.payload);
  }

  @Mutation('autoSignin')
  async autoSignin(
    @Args() payload: { accessToken: string },
  ): Promise<UserToken> {
    return this.authService.autoSignin(payload.accessToken);
  }

  @Mutation('refreshToken')
  async refreshToken(
    @Args() payload: { refreshToken: string },
  ): Promise<UserToken> {
    return this.authService.refreshToken(payload.refreshToken);
  }
}
