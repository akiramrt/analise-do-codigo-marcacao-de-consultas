import React from 'react';
import { Container, Text } from './styles';

type Props = {
  message: string;
  variant?: 'error' | 'info';
};

const ErrorBanner: React.FC<Props> = ({ message, variant = 'error' }) => {
  return (
    <Container variant={variant}>
      <Text variant={variant}>{message}</Text>
    </Container>
  );
};

export default ErrorBanner;
