export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  activationLink: string;
  activated: boolean;
  createdAt: string;
}
