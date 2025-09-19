import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment } from '../models';

const STORAGE_KEY = '@MedicalApp:appointments';

export async function loadAppointments(): Promise<Appointment[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  return stored ? (JSON.parse(stored) as Appointment[]) : [];
}

export async function saveAppointments(appointments: Appointment[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

export async function addAppointment(newAppointment: Appointment): Promise<void> {
  const current = await loadAppointments();
  const next = [...current, newAppointment];
  await saveAppointments(next);
}
