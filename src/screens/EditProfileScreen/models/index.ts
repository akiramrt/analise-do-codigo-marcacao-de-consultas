import { User } from '../../../types/auth';

export type Role = User['role']; // 'admin' | 'doctor' | 'patient' | ...

export type UserUpdate = Pick<User, 'id' | 'name' | 'email'> & Partial<Pick<User, 'image' | 'specialty' | 'role'>>;
