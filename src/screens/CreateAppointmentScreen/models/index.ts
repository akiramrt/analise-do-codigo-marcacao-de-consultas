import { User } from '../../../types/auth';

// Mantém compatibilidade com o app existente
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: AppointmentStatus;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

// Tipagem utilitária para médicos vindos da API (User -> Doctor)
export type DoctorUser = User & { role: 'doctor'; specialty?: string };
