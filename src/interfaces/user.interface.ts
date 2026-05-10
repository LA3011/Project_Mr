export interface User {
  id_user: string;
  name: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
}
