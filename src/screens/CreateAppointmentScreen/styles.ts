import styled from 'styled-components/native';
import theme from '../../styles/theme';

export const Container = styled.View({
  flex: 1,
  backgroundColor: theme.colors.background,
});

export const Title = styled.Text({
  fontSize: 24,
  fontWeight: 'bold',
  color: theme.colors.text,
  marginBottom: 20,
  textAlign: 'center',
});

export const SectionTitle = styled.Text({
  fontSize: 18,
  fontWeight: 'bold',
  color: theme.colors.text,
  marginBottom: 10,
  marginTop: 10,
});
