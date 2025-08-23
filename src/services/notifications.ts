import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface que define a estrutura de uma notificação no sistema
export interface Notification {
  id: string; // Identificador único da notificação
  userId: string; // ID do usuário destinatário
  title: string; // Título da notificação
  message: string; // Mensagem exibida na notificação
  type: 'appointment_confirmed' | 'appointment_cancelled' | 'appointment_reminder' | 'general'; // Tipo da notificação
  read: boolean; // Indica se a notificação foi lida ou não
  createdAt: string; // Data de criação
  appointmentId?: string; // ID do agendamento relacionado (opcional)
}

// Chave usada para armazenar as notificações no AsyncStorage
const STORAGE_KEY = '@MedicalApp:notifications';

// Serviço responsável pela manipulação das notificações
export const notificationService = {
  // Busca todas as notificações de um usuário específico, ordenadas da mais recente para a mais antiga
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      return allNotifications
        .filter(n => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      return [];
    }
  },

  // Cria uma nova notificação e a adiciona ao armazenamento
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      // Estrutura da nova notificação com ID único e status "não lida"
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        read: false,
      };

      allNotifications.push(newNotification);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allNotifications));
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  },

  // Marca uma notificação específica como lida
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      const updatedNotifications = allNotifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  },

  // Marca todas as notificações de um usuário como lidas
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      const updatedNotifications = allNotifications.map(n => 
        n.userId === userId ? { ...n, read: true } : n
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
    }
  },

  // Remove uma notificação específica pelo seu ID
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      const filteredNotifications = allNotifications.filter(n => n.id !== notificationId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotifications));
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  },

  // Retorna a quantidade de notificações não lidas de um usuário
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const notifications = await this.getNotifications(userId);
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Erro ao contar notificações não lidas:', error);
      return 0;
    }
  },

  // Cria uma notificação quando a consulta do paciente é confirmada
  async notifyAppointmentConfirmed(patientId: string, appointmentDetails: any): Promise<void> {
    await this.createNotification({
      userId: patientId,
      type: 'appointment_confirmed',
      title: 'Consulta Confirmada',
      message: `Sua consulta com ${appointmentDetails.doctorName} foi confirmada para ${appointmentDetails.date} às ${appointmentDetails.time}.`,
      appointmentId: appointmentDetails.id,
    });
  },

  // Cria uma notificação quando a consulta do paciente é cancelada
  async notifyAppointmentCancelled(patientId: string, appointmentDetails: any, reason?: string): Promise<void> {
    await this.createNotification({
      userId: patientId,
      type: 'appointment_cancelled',
      title: 'Consulta Cancelada',
      message: `Sua consulta com ${appointmentDetails.doctorName} foi cancelada.${reason ? ` Motivo: ${reason}` : ''}`,
      appointmentId: appointmentDetails.id,
    });
  },

  // Cria uma notificação para o médico quando um novo agendamento é feito
  async notifyNewAppointment(doctorId: string, appointmentDetails: any): Promise<void> {
    await this.createNotification({
      userId: doctorId,
      type: 'general',
      title: 'Nova Consulta Agendada',
      message: `${appointmentDetails.patientName} agendou uma consulta para ${appointmentDetails.date} às ${appointmentDetails.time}.`,
      appointmentId: appointmentDetails.id,
    });
  },

  // Cria uma notificação de lembrete de consulta para o usuário (paciente ou médico)
  async notifyAppointmentReminder(userId: string, appointmentDetails: any): Promise<void> {
    await this.createNotification({
      userId: userId,
      type: 'appointment_reminder',
      title: 'Lembrete de Consulta',
      message: `Você tem uma consulta agendada para amanhã às ${appointmentDetails.time} com ${appointmentDetails.doctorName || appointmentDetails.patientName}.`,
      appointmentId: appointmentDetails.id,
    });
  },
};