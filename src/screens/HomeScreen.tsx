// ====== IMPORTS DE DEPENDÊNCIAS E COMPONENTES ======
import React, { useEffect, useState } from 'react'; // React e hooks para estado e efeitos.
import styled from 'styled-components/native'; // Permite criar componentes estilizados usando o tema.
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native'; // Componentes nativos para listas, atualização e botões.
import { Button, Icon } from 'react-native-elements'; // Botões e ícones prontos para uso.
import { FontAwesome } from '@expo/vector-icons'; // Ícones extras para enriquecer a interface.
import { HeaderContainer, HeaderTitle } from '../components/Header'; // Componentes personalizados para o cabeçalho.
import theme from '../styles/theme'; // Importa o tema visual padronizado.
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Tipagem para navegação entre telas.
import AsyncStorage from '@react-native-async-storage/async-storage'; // Permite salvar e recuperar dados localmente.
import { Appointment } from '../types/appointments'; // Tipos para consultas.
import { Doctor } from '../types/doctors'; // Tipos para médicos.
import { RootStackParamList } from '../types/navigation'; // Tipos para navegação.
import { useFocusEffect } from '@react-navigation/native'; // Hook para executar ações ao focar na tela.

// ====== TIPAGEM DAS PROPS DA TELA ======
type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

// ====== LISTA MOCKADA DE MÉDICOS ======
const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. João Silva',
    specialty: 'Cardiologista',
    image: 'https://mighty.tools/mockmind-api/content/human/91.jpg',
  },
  {
    id: '2',
    name: 'Dra. Maria Santos',
    specialty: 'Dermatologista',
    image: 'https://mighty.tools/mockmind-api/content/human/97.jpg',
  },
  {
    id: '3',
    name: 'Dr. Pedro Oliveira',
    specialty: 'Oftalmologista',
    image: 'https://mighty.tools/mockmind-api/content/human/79.jpg',
  },
];
// Lista fixa para testes. Futuramente será dinâmica, vinda do backend ou localStorage.

// ====== COMPONENTE PRINCIPAL DA TELA ======
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Estado para armazenar as consultas agendadas
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // Estado para controlar o refresh da lista
  const [refreshing, setRefreshing] = useState(false);

  // Função para carregar consultas do AsyncStorage
  const loadAppointments = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('appointments');
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    }
  };

  // Carrega as consultas toda vez que a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [])
  );

  // Função para atualizar a lista ao puxar para baixo
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  // Busca informações do médico pelo id
  const getDoctorInfo = (doctorId: string): Doctor | undefined => {
    return doctors.find(doctor => doctor.id === doctorId);
  };

  // Renderiza cada cartão de consulta na lista
  const renderAppointment = ({ item }: { item: Appointment }) => {
    const doctor = getDoctorInfo(item.doctorId);
    
    return (
      <AppointmentCard>
        {/* Foto do médico */}
        <DoctorImage source={{ uri: doctor?.image || 'https://via.placeholder.com/100' }} />
        <InfoContainer>
          {/* Nome do médico */}
          <DoctorName>{doctor?.name || 'Médico não encontrado'}</DoctorName>
          {/* Especialidade */}
          <DoctorSpecialty>{doctor?.specialty || 'Especialidade não encontrada'}</DoctorSpecialty>
          {/* Data e hora da consulta */}
          <DateTime>{new Date(item.date).toLocaleDateString()} - {item.time}</DateTime>
          {/* Descrição da consulta */}
          <Description>{item.description}</Description>
          {/* Status da consulta */}
          <Status status={item.status}>
            {item.status === 'pending' ? 'Pendente' : 'Confirmado'}
          </Status>
          {/* Botões de ação (editar/excluir) */}
          <ActionButtons>
            <ActionButton>
              <Icon name="edit" type="material" size={20} color={theme.colors.primary} />
            </ActionButton>
            <ActionButton>
              <Icon name="delete" type="material" size={20} color={theme.colors.error} />
            </ActionButton>
          </ActionButtons>
        </InfoContainer>
      </AppointmentCard>
    );
  };

  // ====== RETORNO DA INTERFACE VISUAL DA TELA ======
  return (
    <Container>
      {/* Cabeçalho da tela */}
      <HeaderContainer>
        <HeaderTitle>Minhas Consultas</HeaderTitle>
      </HeaderContainer>

      <Content>
        {/* Botão para agendar nova consulta */}
        <Button
          title="Agendar Nova Consulta"
          icon={
            <FontAwesome
              name="calendar-plus-o"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
          }
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
            padding: 12,
            marginBottom: theme.spacing.medium
          }}
          onPress={() => navigation.navigate('CreateAppointment')}
        />

        {/* Lista de consultas agendadas */}
        <AppointmentList
          data={appointments}
          keyExtractor={(item: Appointment) => item.id}
          renderItem={renderAppointment}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <EmptyText>Nenhuma consulta agendada</EmptyText>
          }
        />
      </Content>
    </Container>
  );
};

// ====== ESTILIZAÇÃO DOS COMPONENTES VISUAIS ======
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;
// Container principal da tela

const Content = styled.View`
  flex: 1;
  padding: ${theme.spacing.medium}px;
`;
// Área de conteúdo da tela

const AppointmentList = styled(FlatList)`
  flex: 1;
`;
// Lista de consultas

const AppointmentCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: ${theme.spacing.medium}px;
  margin-bottom: ${theme.spacing.medium}px;
  flex-direction: row;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
`;
// Cartão de consulta individual

const DoctorImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: ${theme.spacing.medium}px;
`;
// Foto do médico

const InfoContainer = styled.View`
  flex: 1;
`;
// Container das informações do médico e consulta

const DoctorName = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.text};
`;
// Nome do médico

const DoctorSpecialty = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
  margin-bottom: 4px;
`;
// Especialidade do médico

const DateTime = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.primary};
  margin-top: 4px;
`;
// Data e hora da consulta

const Description = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
  margin-top: 4px;
`;
// Descrição da consulta

const Status = styled.Text<{ status: string }>`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${(props: { status: string }) => props.status === 'pending' ? theme.colors.error : theme.colors.success};
  margin-top: 4px;
  font-weight: bold;
`;
// Status da consulta (pendente ou confirmado)

const ActionButtons = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${theme.spacing.small}px;
`;
// Container dos botões de ação

const ActionButton = styled(TouchableOpacity)`
  padding: ${theme.spacing.small}px;
  margin-left: ${theme.spacing.small}px;
`;
// Botão individual de ação

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  opacity: 0.6;
  margin-top: ${theme.spacing.large}px;
`;
// Texto exibido quando não há consultas agendadas

export default HomeScreen;
// Exporta o