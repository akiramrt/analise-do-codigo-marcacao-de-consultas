import React from 'react';
import { ScrollView, ViewStyle } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Header from '../../components/Header';
import DoctorList from '../../components/DoctorList';
import TimeSlotList from '../../components/TimeSlotList';
import theme from '../../styles/theme';

import { Container, Title, SectionTitle } from './styles';
import { useCreateAppointment } from './hooks/useCreateAppointment';
import ErrorBanner from './components/ErrorBanner';

const styles = {
  scrollContent: { padding: 20 },
  input: { marginBottom: 15 },
  button: { marginTop: 10, width: '100%' },
  buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12 },
  cancelButton: { backgroundColor: theme.colors.secondary, paddingVertical: 12 },
} satisfies Record<string, ViewStyle | any>;

const CreateAppointmentScreen: React.FC = () => {
  const {
    date,
    setDate,
    selectedTime,
    setSelectedTime,
    selectedDoctor,
    setSelectedDoctor,
    doctors,
    loadingDoctors,
    error,
    loading,
    handleCreateAppointment,
    handleCancel,
    convertUsersToDoctors,
  } = useCreateAppointment();

  return (
    <Container>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Agendar Consulta</Title>

        <Input
          placeholder="Data (DD/MM/AAAA)"
          value={date}
          onChangeText={setDate}
          containerStyle={styles.input}
          keyboardType="numeric"
        />

        <SectionTitle>Selecione um Horário</SectionTitle>
        <TimeSlotList
          onSelectTime={setSelectedTime}
          selectedTime={selectedTime}
        />

        <SectionTitle>Selecione um Médico</SectionTitle>
        {loadingDoctors ? (
          <ErrorBanner message="Carregando médicos..." variant="info" />
        ) : (
          <DoctorList
            doctors={convertUsersToDoctors(doctors)}
            onSelectDoctor={setSelectedDoctor}
            selectedDoctorId={selectedDoctor?.id}
          />
        )}

        {!!error && <ErrorBanner message={error} />}

        <Button
          title="Agendar"
          onPress={handleCreateAppointment}
          loading={loading}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        <Button
          title="Cancelar"
          onPress={handleCancel}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cancelButton}
        />
      </ScrollView>
    </Container>
  );
};

export default CreateAppointmentScreen;
