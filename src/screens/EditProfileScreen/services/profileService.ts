import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../../types/auth';
import { UserUpdate } from '../models';

const STORAGE_KEY = '@MedicalApp:user';

export async function loadStoredUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function persistUser(user: User): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function buildUpdatedUser(current: User, patch: UserUpdate): User {
  // Mescla garantindo campos obrigatórios já validados no hook
  return {
    ...current,
    ...patch,
  };
}
