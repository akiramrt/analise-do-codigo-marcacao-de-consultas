import { useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Appointment, Doctor } from '../models';
import { addAppointment, loadAppointments } from '../services/appointmentsStorage';
import { fetchDoctors, mapUsersToDoctors } from '../services/doctorsService';
import { Alert } from 'react-native';

type Nav = NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;

export const useCreateAppointment = () => {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();

  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);

  // dados de médicos (User[]) para manter compatibilidade com DoctorList existente
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [error, setError] = useState('');

  // Carrega médicos ao montar
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingDoctors(true);
        setError('');
        const doctorsData = await fetchDoctors();
        if (mounted) setDoctors(doctorsData);
      } catch (e) {
        setError('Médicos carregados com dados locais (API indisponível)');
      } finally {
        if (mounted) setLoadingDoctors(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // conversor exposto para a tela (DoctorList espera Doctor[])
  const convertUsersToDoctors = (users: any[]) => mapUsersToDoctors(users);

  const handleCreateAppointment = async () => {
    try {
      setLoading(true);
      setError('');

      if (!date || !selectedTime || !selectedDoctor) {
        setError('Por favor, preencha a data e selecione um médico e horário');
        return;
      }

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

      // (opcional) validações simples, ex.: conflito de horário
      const existing = await loadAppointments();
      const hasConflict = existing.some(
        a => a.doctorId === newAppointment.doctorId &&
             a.date === newAppointment.date &&
             a.time === newAppointment.time
      );
      if (hasConflict) {
        setError('Este horário já está ocupado para o médico selecionado.');
        return;
      }

      await addAppointment(newAppointment);
      Alert.alert('Sucesso', 'Consulta agendada com sucesso!');
      navigation.goBack();
    } catch (e) {
      setError('Erro ao agendar consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigation.goBack();

  return {
    // state
    date, setDate,
    selectedTime, setSelectedTime,
    selectedDoctor, setSelectedDoctor,
    doctors,
    loadingDoctors,
    loading,
    error,

    // actions
    handleCreateAppointment,
    handleCancel,
    convertUsersToDoctors,
  };
};
