import { User } from '@api/users/interfaces';
import { Token } from './token.interface';

export interface UserToken {
  user: User;
  token: Token;
}
