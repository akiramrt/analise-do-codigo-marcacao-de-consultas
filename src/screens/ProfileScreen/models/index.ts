import { User } from '../../../types/auth';

export type Role = User['role']; // 'admin' | 'doctor' | 'patient' | ...

export interface RoleInfo {
  label: string;       // Ex.: "Administrador"
  badgeBg: string;     // Cor de fundo translúcida para o badge
}
