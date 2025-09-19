import styled from 'styled-components/native';
import theme from '../../../../styles/theme';

export const Card = styled.View({
  backgroundColor: theme.colors.white,
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

export const RoleBadge = styled.View<{ bg: string }>(({ bg }) => ({
  backgroundColor: bg,
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 4,
  marginTop: 10,
}));

export const RoleText = styled.Text({
  color: theme.colors.text,
  fontSize: 14,
  fontWeight: '500',
});
