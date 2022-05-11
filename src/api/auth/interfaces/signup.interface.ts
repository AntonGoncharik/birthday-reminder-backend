import { User } from '@api/users/interfaces';
import { Token } from './token.interface';

export interface Signup {
  user: User;
  token: Token;
}
