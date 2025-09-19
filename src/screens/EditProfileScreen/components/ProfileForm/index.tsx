import React from 'react';
import { Input } from 'react-native-elements';
import theme from '../../../../styles/theme';
import { User } from '../../../../types/auth';
import {
  Card,
  Avatar,
  RoleBadge,
  RoleText,
} from './styles';

type Props = {
  user?: User | null;
  name: string;
  onChangeName: (v: string) => void;
  email: string;
  onChangeEmail: (v: string) => void;
  specialty: string;
  onChangeSpecialty: (v: string) => void;
};

const formStyles = {
  input: { marginBottom: 15 },
};

const ProfileForm: React.FC<Props> = ({
  user,
  name, onChangeName,
  email, onChangeEmail,
  specialty, onChangeSpecialty,
}) => {
  const role = user?.role ?? 'patient';

  return (
    <Card>
      <Avatar source={{ uri: user?.image || 'https://via.placeholder.com/150' }} />

      <Input
        label="Nome"
        value={name}
        onChangeText={onChangeName}
        containerStyle={formStyles.input}
        placeholder="Digite seu nome"
      />

      <Input
        label="Email"
        value={email}
        onChangeText={onChangeEmail}
        containerStyle={formStyles.input}
        placeholder="Digite seu email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {role === 'doctor' && (
        <Input
          label="Especialidade"
          value={specialty}
          onChangeText={onChangeSpecialty}
          containerStyle={formStyles.input}
          placeholder="Digite sua especialidade"
        />
      )}

      <RoleBadge
        bg={
          role === 'admin'
            ? `${theme.colors.primary}20`
            : role === 'doctor'
            ? `${theme.colors.success}20`
            : `${theme.colors.secondary}20`
        }
      >
        <RoleText>
          {role === 'admin' ? 'Administrador' : role === 'doctor' ? 'Médico' : 'Paciente'}
        </RoleText>
      </RoleBadge>
    </Card>
  );
};

export default ProfileForm;
