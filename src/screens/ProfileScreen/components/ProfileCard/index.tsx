import React from 'react';
import theme from '../../../../styles/theme';
import { User } from '../../../../types/auth';
import { Container, Avatar, Name, Email, RoleBadge, RoleText, SpecialtyText } from './styles';

type Props = {
  user?: User | null;
  roleLabel: string;
};

const ProfileCard: React.FC<Props> = ({ user, roleLabel }) => {
  const isDoctor = user?.role === 'doctor';

  return (
    <Container>
      <Avatar source={{ uri: user?.image || 'https://via.placeholder.com/150' }} />
      <Name>{user?.name}</Name>
      <Email>{user?.email}</Email>

      <RoleBadge bg={
        user?.role === 'admin'
          ? `${theme.colors.primary}20`
          : user?.role === 'doctor'
          ? `${theme.colors.success}20`
          : `${theme.colors.secondary}20`
      }>
        <RoleText>{roleLabel}</RoleText>
      </RoleBadge>

      {isDoctor && (
        <SpecialtyText>Especialidade: {user?.specialty ?? '—'}</SpecialtyText>
      )}
    </Container>
  );
};

export default ProfileCard;
