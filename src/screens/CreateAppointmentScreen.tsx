// Importa React e hook de estado
import React, { useState } from 'react';
// Biblioteca para estilização com styled-components
import styled from 'styled-components/native';
// Importa componentes nativos do React Native
import { ScrollView, ViewStyle } from 'react-native';
// Importa componentes de UI prontos
import { Button, Input } from 'react-native-elements';
// Hook de autenticação (contexto customizado)
import { useAuth } from '../contexts/AuthContext';
// Hook de navegação
import { useNavigation } from '@react-navigation/native';
// Tipagem de navegação
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Tipos de rotas principais
import { RootStackParamList } from '../types/navigation';
// Importa tema global
import theme from '../styles/theme';
// Componente de cabeçalho
import Header from '../components/Header';
// Lista de médicos
import DoctorList from '../components/DoctorList';
// Lista de horários disponíveis
import TimeSlotList from '../components/TimeSlotList';
// Serviço de notificações
import { notificationService } from '../services/notifications';
// Persistência local
import AsyncStorage from '@react-native-async-storage/async-storage';

type CreateAppointmentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;
};

// Tipagem de uma consulta
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// Tipagem de médico
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

// Lista de médicos disponíveis (mock)
const availableDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. João Silva',
    specialty: 'Cardiologia',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Dra. Maria Santos',
    specialty: 'Pediatria',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '3',
    name: 'Dr. Pedro Oliveira',
    specialty: 'Ortopedia',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '4',
    name: 'Dra. Ana Costa',
    specialty: 'Dermatologia',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '5',
    name: 'Dr. Carlos Mendes',
    specialty: 'Oftalmologia',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

/**
 * Tela de Criação de Consulta
 * Permite ao paciente selecionar data, horário e médico,
 * salvando a consulta no AsyncStorage e notificando o médico.
 */
const CreateAppointmentScreen: React.FC = () => {
  // Usuário logado
  const { user } = useAuth();
  // Navegação tipada
  const navigation = useNavigation<CreateAppointmentScreenProps['navigation']>();
  // Estados da tela
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cria nova consulta
  const handleCreateAppointment = async () => {
    try {
      setLoading(true);
      setError('');

      // Valida preenchimento
      if (!date || !selectedTime || !selectedDoctor) {
        setError('Por favor, preencha a data e selecione um médico e horário');
        return;
      }

      // Recupera consultas existentes
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      const appointments: Appointment[] = storedAppointments ? JSON.parse(storedAppointments) : [];

      // Monta nova consulta
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        patientId: user?.id || '',
        patientName: user?.name || '',
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date,
        time: selectedTime,
        specialty: selectedDoctor.specialty,
        status: 'pending',
      };

      // Adiciona à lista
      appointments.push(newAppointment);

      // Salva no AsyncStorage
      await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(appointments));

      // Envia notificação ao médico
      await notificationService.notifyNewAppointment(selectedDoctor.id, newAppointment);

      alert('Consulta agendada com sucesso!');
      navigation.goBack(); // Volta para tela anterior
    } catch (err) {
      setError('Erro ao agendar consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {/* Cabeçalho fixo */}
      <Header />

      {/* Conteúdo scrollável */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Agendar Consulta</Title>

        {/* Campo de data */}
        <Input
          placeholder="Data (DD/MM/AAAA)"
          value={date}
          onChangeText={setDate}
          containerStyle={styles.input}
          keyboardType="numeric"
        />

        {/* Lista de horários */}
        <SectionTitle>Selecione um Horário</SectionTitle>
        <TimeSlotList
          onSelectTime={setSelectedTime}
          selectedTime={selectedTime}
        />

        {/* Lista de médicos */}
        <SectionTitle>Selecione um Médico</SectionTitle>
        <DoctorList
          doctors={availableDoctors}
          onSelectDoctor={setSelectedDoctor}
          selectedDoctorId={selectedDoctor?.id}
        />

        {/* Mensagem de erro */}
        {error ? <ErrorText>{error}</ErrorText> : null}

        {/* Botão de confirmar agendamento */}
        <Button
          title="Agendar"
          onPress={handleCreateAppointment}
          loading={loading}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Botão de cancelar (volta para tela anterior) */}
        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cancelButton}
        />
      </ScrollView>
    </Container>
  );
};

// Estilos centrais
const styles = {
  scrollContent: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
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
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 10px;
  margin-top: 10px;
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

export default CreateAppointmentScreen;
