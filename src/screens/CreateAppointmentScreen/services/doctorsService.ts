import { authApiService } from '../../../services/authApi';
import { User } from '../../../types/auth';
import { Doctor } from '../models';

export async function fetchDoctors(): Promise<User[]> {
  // Encapsula a origem (API) e facilita mocking em testes
  return authApiService.getAllDoctors();
}

export function mapUsersToDoctors(users: User[]): Doctor[] {
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    specialty:
      user.role === 'doctor' && 'specialty' in user
        ? (user as any).specialty ?? 'Especialidade não informada'
        : 'Especialidade não informada',
    image: user.image,
  }));
}
