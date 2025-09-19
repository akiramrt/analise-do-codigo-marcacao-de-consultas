import React from 'react';
import { ViewStyle } from 'react-native';
import { Button } from 'react-native-elements';
import Header from '../../components/Header';
import theme from '../../styles/theme';

import { Container, ScrollView, Title } from './styles';
import { useEditProfile } from './hooks/useEditProfile';
import ProfileForm from './components/ProfileForm';

const styles = {
  scrollContent: { padding: 20 },
  button: { marginBottom: 15, width: '100%' },
  saveButton: { backgroundColor: theme.colors.success, paddingVertical: 12 },
  cancelButton: { backgroundColor: theme.colors.secondary, paddingVertical: 12 },
} satisfies Record<string, ViewStyle | any>;

const EditProfileScreen: React.FC = () => {
  const {
    user,
    name, setName,
    email, setEmail,
    specialty, setSpecialty,
    loading,
    handleSaveProfile,
    handleCancel,
  } = useEditProfile();

  return (
    <Container>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Editar Perfil</Title>

        <ProfileForm
          user={user}
          name={name}
          onChangeName={setName}
          email={email}
          onChangeEmail={setEmail}
          specialty={specialty}
          onChangeSpecialty={setSpecialty}
        />

        <Button
          title="Salvar Alterações"
          onPress={handleSaveProfile}
          loading={loading}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.saveButton}
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

export default EditProfileScreen;
