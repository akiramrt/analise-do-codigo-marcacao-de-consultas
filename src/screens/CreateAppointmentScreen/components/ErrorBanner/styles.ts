import styled from 'styled-components/native';
import theme from '../../../../styles/theme';

export const Container = styled.View<{ variant: 'error' | 'info' }>(
  ({ variant }) => ({
    padding: 10,
    borderRadius: 8,
    backgroundColor:
      variant === 'error' ? `${theme.colors.error}22` : `${theme.colors.primary}22`,
    borderWidth: 1,
    borderColor: variant === 'error' ? theme.colors.error : theme.colors.primary,
    marginBottom: 10,
  })
);

export const Text = styled.Text<{ variant: 'error' | 'info' }>(({ variant }) => ({
  color: variant === 'error' ? theme.colors.error : theme.colors.primary,
  textAlign: 'center',
}));
