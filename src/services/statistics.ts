import AsyncStorage from '@react-native-async-storage/async-storage';

// Estrutura de um agendamento (consulta médica)
interface Appointment {
  id: string; // Identificador único da consulta
  patientId: string; // ID do paciente
  patientName: string; // Nome do paciente
  doctorId: string; // ID do médico
  doctorName: string; // Nome do médico
  date: string; // Data da consulta (esperado no formato dd/MM/yyyy)
  time: string; // Horário da consulta
  specialty: string; // Especialidade da consulta
  status: 'pending' | 'confirmed' | 'cancelled'; // Status da consulta
}

// Estrutura de estatísticas que será retornada
export interface Statistics {
  totalAppointments: number; // Total de consultas
  confirmedAppointments: number; // Total de consultas confirmadas
  pendingAppointments: number; // Total de consultas pendentes
  cancelledAppointments: number; // Total de consultas canceladas
  totalPatients: number; // Número total de pacientes únicos
  totalDoctors: number; // Número total de médicos únicos
  specialties: { [key: string]: number }; // Distribuição de consultas por especialidade
  appointmentsByMonth: { [key: string]: number }; // Distribuição de consultas por mês
  statusPercentages: { // Percentual de consultas por status
    confirmed: number;
    pending: number;
    cancelled: number;
  };
}

// Serviço que fornece estatísticas gerais, por médico e por paciente
export const statisticsService = {
  // Retorna estatísticas gerais de todo o sistema
  async getGeneralStatistics(): Promise<Statistics> {
    try {
      // Busca os agendamentos salvos
      const appointmentsData = await AsyncStorage.getItem('@MedicalApp:appointments');
      const appointments: Appointment[] = appointmentsData ? JSON.parse(appointmentsData) : [];
      
      // Busca usuários cadastrados (pacientes e médicos)
      const registeredUsersData = await AsyncStorage.getItem('@MedicalApp:registeredUsers');
      const registeredUsers = registeredUsersData ? JSON.parse(registeredUsersData) : [];

      // Estatísticas básicas: contagem de consultas por status
      const totalAppointments = appointments.length;
      const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
      const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
      const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;

      // Contagem de pacientes únicos a partir dos agendamentos
      const uniquePatients = new Set(appointments.map(a => a.patientId));
      const totalPatients = uniquePatients.size;

      // Contagem de médicos únicos a partir dos agendamentos
      const uniqueDoctors = new Set(appointments.map(a => a.doctorId));
      const totalDoctors = uniqueDoctors.size;

      // Distribuição de consultas por especialidade
      const specialties: { [key: string]: number } = {};
      appointments.forEach(appointment => {
        if (specialties[appointment.specialty]) {
          specialties[appointment.specialty]++;
        } else {
          specialties[appointment.specialty] = 1;
        }
      });

      // Distribuição de consultas por mês (considerando formato dd/MM/yyyy)
      const appointmentsByMonth: { [key: string]: number } = {};
      appointments.forEach(appointment => {
        try {
          const [day, month, year] = appointment.date.split('/');
          const monthKey = `${month}/${year}`;
          if (appointmentsByMonth[monthKey]) {
            appointmentsByMonth[monthKey]++;
          } else {
            appointmentsByMonth[monthKey] = 1;
          }
        } catch (error) {
          console.warn('Data inválida encontrada:', appointment.date);
        }
      });

      // Percentuais de consultas por status em relação ao total
      const statusPercentages = {
        confirmed: totalAppointments > 0 ? (confirmedAppointments / totalAppointments) * 100 : 0,
        pending: totalAppointments > 0 ? (pendingAppointments / totalAppointments) * 100 : 0,
        cancelled: totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0,
      };

      // Retorno final das estatísticas gerais
      return {
        totalAppointments,
        confirmedAppointments,
        pendingAppointments,
        cancelledAppointments,
        totalPatients,
        totalDoctors,
        specialties,
        appointmentsByMonth,
        statusPercentages,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      throw error;
    }
  },

  // Retorna estatísticas relacionadas a um médico específico
  async getDoctorStatistics(doctorId: string): Promise<Partial<Statistics>> {
    try {
      // Busca todos os agendamentos
      const appointmentsData = await AsyncStorage.getItem('@MedicalApp:appointments');
      const allAppointments: Appointment[] = appointmentsData ? JSON.parse(appointmentsData) : [];
      
      // Filtra apenas os agendamentos do médico em questão
      const doctorAppointments = allAppointments.filter(a => a.doctorId === doctorId);

      // Estatísticas básicas do médico
      const totalAppointments = doctorAppointments.length;
      const confirmedAppointments = doctorAppointments.filter(a => a.status === 'confirmed').length;
      const pendingAppointments = doctorAppointments.filter(a => a.status === 'pending').length;
      const cancelledAppointments = doctorAppointments.filter(a => a.status === 'cancelled').length;

      // Pacientes únicos atendidos pelo médico
      const uniquePatients = new Set(doctorAppointments.map(a => a.patientId));
      const totalPatients = uniquePatients.size;

      // Percentuais por status
      const statusPercentages = {
        confirmed: totalAppointments > 0 ? (confirmedAppointments / totalAppointments) * 100 : 0,
        pending: totalAppointments > 0 ? (pendingAppointments / totalAppointments) * 100 : 0,
        cancelled: totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0,
      };

      // Retorno parcial com dados relevantes ao médico
      return {
        totalAppointments,
        confirmedAppointments,
        pendingAppointments,
        cancelledAppointments,
        totalPatients,
        statusPercentages,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas do médico:', error);
      throw error;
    }
  },

  // Retorna estatísticas relacionadas a um paciente específico
  async getPatientStatistics(patientId: string): Promise<Partial<Statistics>> {
    try {
      // Busca todos os agendamentos
      const appointmentsData = await AsyncStorage.getItem('@MedicalApp:appointments');
      const allAppointments: Appointment[] = appointmentsData ? JSON.parse(appointmentsData) : [];
      
      // Filtra apenas os agendamentos do paciente em questão
      const patientAppointments = allAppointments.filter(a => a.patientId === patientId);

      // Estatísticas básicas do paciente
      const totalAppointments = patientAppointments.length;
      const confirmedAppointments = patientAppointments.filter(a => a.status === 'confirmed').length;
      const pendingAppointments = patientAppointments.filter(a => a.status === 'pending').length;
      const cancelledAppointments = patientAppointments.filter(a => a.status === 'cancelled').length;

      // Distribuição de especialidades acessadas pelo paciente
      const specialties: { [key: string]: number } = {};
      patientAppointments.forEach(appointment => {
        if (specialties[appointment.specialty]) {
          specialties[appointment.specialty]++;
        } else {
          specialties[appointment.specialty] = 1;
        }
      });

      // Contagem de médicos diferentes que atenderam o paciente
      const uniqueDoctors = new Set(patientAppointments.map(a => a.doctorId));
      const totalDoctors = uniqueDoctors.size;

      // Percentuais por status
      const statusPercentages = {
        confirmed: totalAppointments > 0 ? (confirmedAppointments / totalAppointments) * 100 : 0,
        pending: totalAppointments > 0 ? (pendingAppointments / totalAppointments) * 100 : 0,
        cancelled: totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0,
      };

      // Retorno parcial com dados relevantes ao paciente
      return {
        totalAppointments,
        confirmedAppointments,
        pendingAppointments,
        cancelledAppointments,
        totalDoctors,
        specialties,
        statusPercentages,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas do paciente:', error);
      throw error;
    }
  },
};