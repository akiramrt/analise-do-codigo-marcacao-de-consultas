import styled from 'styled-components/native';
import theme from '../../../../styles/theme';

export const Container = styled.View({
  backgroundColor: theme.colors.background,
  borderRadius: 8,
  padding: 20,
  marginBottom: 20,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: theme.colors.border,
});

export const Avatar = styled.Image({
  width: 120,
  height: 120,
  borderRadius: 60,
  marginBottom: 16,
});

export const Name = styled.Text({
  fontSize: 20,
  fontWeight: 'bold',
  color: theme.colors.text,
  marginBottom: 8,
});

export const Email = styled.Text({
  fontSize: 16,
  color: theme.colors.text,
  marginBottom: 8,
});

export const RoleBadge = styled.View<{ bg: string }>(({ bg }) => ({
  backgroundColor: bg,
  paddingVertical: 4,
  paddingHorizontal: 12,
  borderRadius: 4,
  marginBottom: 8,
}));

export const RoleText = styled.Text({
  color: theme.colors.text,
  fontSize: 14,
  fontWeight: '500',
});

export const SpecialtyText = styled.Text({
  fontSize: 16,
  color: theme.colors.text,
  marginTop: 8,
});
