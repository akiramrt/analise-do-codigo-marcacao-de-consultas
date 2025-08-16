// Importa React e hook de estado
import React, { useState } from 'react';
// Biblioteca para estilização com styled-components
import styled from 'styled-components/native';
// Importa componentes nativos do React Native
import { ScrollView, ViewStyle, TextStyle } from 'react-native';
// Importa botões, listas e textos prontos do React Native Elements
import { Button, ListItem, Text } from 'react-native-elements';
// Hook de autenticação (contexto customizado da aplicação)
import { useAuth } from '../contexts/AuthContext';
// Hook de navegação da lib react-navigation
import { useNavigation } from '@react-navigation/native';
// Tipo para navegação tipada
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Hook que executa quando a tela volta a estar em foco
import { useFocusEffect } from '@react-navigation/native';
// Tipagem das rotas principais
import { RootStackParamList } from '../types/navigation';
// Importa tema de cores e estilos globais
import theme from '../styles/theme';
// Componente de cabeçalho da aplicação
import Header from '../components/Header';
// Card de estatísticas (componente de UI reutilizável)
import StatisticsCard from '../components/StatisticsCard';
// Serviço que calcula estatísticas gerais
import { statisticsService, Statistics } from '../services/statistics';
// Persistência local (armazenamento assíncrono)
import AsyncStorage from '@react-native-async-storage/async-storage';

type AdminDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AdminDashboard'>;
};

// Tipagem para consultas (appointments)
interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// Tipagem para usuários do sistema
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
}

// Tipagem para componentes estilizados que recebem status
interface StyledProps {
  status: string;
}

// Função utilitária para escolher cor de acordo com status da consulta
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return theme.colors.success;
    case 'cancelled':
      return theme.colors.error;
    default:
      return theme.colors.warning;
  }
};

// Função utilitária para exibir texto legível do status
const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmada';
    case 'cancelled':
      return 'Cancelada';
    default:
      return 'Pendente';
  }
};

/**
 * Tela do Painel Administrativo
 * Representa a tela principal do ADMIN, onde o gestor acessa estatísticas,
 * usuários, consultas e pode sair do sistema.
 */
const AdminDashboardScreen: React.FC = () => {
  // Pega usuário autenticado e função de logout
  const { user, signOut } = useAuth();
  // Controle de navegação tipado
  const navigation = useNavigation<AdminDashboardScreenProps['navigation']>();
  // Estado local para consultas
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // Estado local para usuários
  const [users, setUsers] = useState<User[]>([]);
  // Estado local para estatísticas
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  // Estado de loading
  const [loading, setLoading] = useState(true);

  // Função que carrega dados do AsyncStorage e serviço de estatísticas
  const loadData = async () => {
    try {
      // Carrega consultas armazenadas
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
        setAppointments(allAppointments);
      }

      // Carrega usuários armazenados
      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) {
        const allUsers: User[] = JSON.parse(storedUsers);
        setUsers(allUsers);
      }

      // Busca estatísticas gerais (API/service)
      const stats = await statisticsService.getGeneralStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hook que carrega os dados sempre que a tela é exibida novamente
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  // Atualiza status de uma consulta (confirmar/cancelar)
  const handleUpdateStatus = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
        // Atualiza apenas a consulta alterada
        const updatedAppointments = allAppointments.map(appointment => {
          if (appointment.id === appointmentId) {
            return { ...appointment, status: newStatus };
          }
          return appointment;
        });
        // Salva de volta no AsyncStorage
        await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(updatedAppointments));
        loadData(); // Recarrega dados para refletir na tela
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  return (
    // Container principal da tela
    <Container>
      {/* Componente de cabeçalho fixo */}
      <Header />

      {/* Conteúdo scrollável */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Título da tela */}
        <Title>Painel Administrativo</Title>

        {/* Botão que navega para gerenciamento de usuários
            -> Abre tela UserManagement */}
        <Button
          title="Gerenciar Usuários"
          onPress={() => navigation.navigate('UserManagement')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Botão que navega para o Perfil do usuário
            -> Abre tela Profile */}
        <Button
          title="Meu Perfil"
          onPress={() => navigation.navigate('Profile')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Estatísticas Gerais do sistema */}
        <SectionTitle>Estatísticas Gerais</SectionTitle>
        {statistics && (
          <StatisticsGrid>
            {/* Cada StatisticsCard representa um número importante */}
            <StatisticsCard
              title="Total de Consultas"
              value={statistics.totalAppointments}
              color={theme.colors.primary}
              subtitle="Todas as consultas"
            />
            <StatisticsCard
              title="Consultas Confirmadas"
              value={statistics.confirmedAppointments}
              color={theme.colors.success}
              subtitle={`${statistics.statusPercentages.confirmed.toFixed(1)}% do total`}
            />
            <StatisticsCard
              title="Pacientes Ativos"
              value={statistics.totalPatients}
              color={theme.colors.secondary}
              subtitle="Pacientes únicos"
            />
            <StatisticsCard
              title="Médicos Ativos"
              value={statistics.totalDoctors}
              color={theme.colors.warning}
              subtitle="Médicos com consultas"
            />
          </StatisticsGrid>
        )}

        {/* Especialidades mais procuradas */}
        <SectionTitle>Especialidades Mais Procuradas</SectionTitle>
        {statistics && Object.entries(statistics.specialties).length > 0 && (
          <SpecialtyContainer>
            {Object.entries(statistics.specialties)
              .sort(([,a], [,b]) => b - a) // Ordena por maior número
              .slice(0, 3) // Mostra top 3
              .map(([specialty, count]) => (
                <SpecialtyItem key={specialty}>
                  <SpecialtyName>{specialty}</SpecialtyName>
                  <SpecialtyCount>{count} consultas</SpecialtyCount>
                </SpecialtyItem>
              ))
            }
          </SpecialtyContainer>
        )}

        {/* Últimas consultas agendadas */}
        <SectionTitle>Últimas Consultas</SectionTitle>
        {loading ? (
          // Estado de carregamento
          <LoadingText>Carregando dados...</LoadingText>
        ) : appointments.length === 0 ? (
          // Caso não haja nenhuma consulta
          <EmptyText>Nenhuma consulta agendada</EmptyText>
        ) : (
          // Lista de consultas
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id}>
              <ListItem.Content>
                {/* Nome do médico */}
                <ListItem.Title style={styles.doctorName as TextStyle}>
                  {appointment.doctorName}
                </ListItem.Title>
                {/* Especialidade */}
                <ListItem.Subtitle style={styles.specialty as TextStyle}>
                  {appointment.specialty}
                </ListItem.Subtitle>
                {/* Data e hora */}
                <Text style={styles.dateTime as TextStyle}>
                  {appointment.date} às {appointment.time}
                </Text>
                {/* Badge com status */}
                <StatusBadge status={appointment.status}>
                  <StatusText status={appointment.status}>
                    {getStatusText(appointment.status)}
                  </StatusText>
                </StatusBadge>
                {/* Caso esteja pendente, mostra botões de ação */}
                {appointment.status === 'pending' && (
                  <ButtonContainer>
                    <Button
                      title="Confirmar"
                      onPress={() => handleUpdateStatus(appointment.id, 'confirmed')}
                      containerStyle={styles.actionButton as ViewStyle}
                      buttonStyle={styles.confirmButton}
                    />
                    <Button
                      title="Cancelar"
                      onPress={() => handleUpdateStatus(appointment.id, 'cancelled')}
                      containerStyle={styles.actionButton as ViewStyle}
                      buttonStyle={styles.cancelButton}
                    />
                  </ButtonContainer>
                )}
              </ListItem.Content>
            </AppointmentCard>
          ))
        )}

        {/* Botão de logout */}
        <Button
          title="Sair"
          onPress={signOut}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.logoutButton}
        />
      </ScrollView>
    </Container>
  );
};

// Estilos centralizados
const styles = {
  scrollContent: {
    padding: 20,
  },
  button: {
    marginBottom: 20,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 12,
  },
  actionButton: {
    marginTop: 8,
    width: '48%',
  },
  confirmButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 8,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 8,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  specialty: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  },
  dateTime: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  },
};

// Componentes estilizados
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 15px;
  margin-top: 10px;
`;

// Card para exibir cada consulta
const AppointmentCard = styled(ListItem)`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

// Textos auxiliares
const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

// Badge de status
const StatusBadge = styled.View<StyledProps>`
  background-color: ${(props: StyledProps) => getStatusColor(props.status) + '20'};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;

const StatusText = styled.Text<StyledProps>`
  color: ${(props: StyledProps) => getStatusColor(props.status)};
  font-size: 12px;
  font-weight: 500;
`;

// Container para botões de ação
const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;

// Grid para estatísticas
const StatisticsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
`;

// Bloco de especialidades
const SpecialtyContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const SpecialtyItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border}20;
`;

const SpecialtyName = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${theme.colors.text};
`;

const SpecialtyCount = styled.Text`
  font-size: 14px;
  color: ${theme.colors.primary};
  font-weight: 600;
`;

export default AdminDashboardScreen;
