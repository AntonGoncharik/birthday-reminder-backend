import { User } from '@api/users/interfaces';
import { Token } from './token.interface';

export interface Signin {
  user: User;
  token: Token;
}
