import React from 'react';
import { ViewStyle } from 'react-native';
import { Button } from 'react-native-elements';
import Header from '../../components/Header';
import theme from '../../styles/theme';

import { Container, ScrollView, Title } from './styles';
import { useProfileScreen } from './hooks/useProfileScreen';
import ProfileCard from './components/ProfileCard';

const styles = {
  scrollContent: { padding: 20 },
  button: { marginBottom: 20, width: '100%' },
  buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12 },
  logoutButton: { backgroundColor: theme.colors.error, paddingVertical: 12 },
} satisfies Record<string, ViewStyle | any>;

const ProfileScreen: React.FC = () => {
  const { user, roleLabel, goBack, signOut } = useProfileScreen();

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Meu Perfil</Title>

        <ProfileCard user={user} roleLabel={roleLabel} />

        <Button
          title="Voltar"
          onPress={goBack}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

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

export default ProfileScreen;
