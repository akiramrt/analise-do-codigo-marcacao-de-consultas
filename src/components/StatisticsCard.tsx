// ====== IMPORTS ======
import React from 'react'; // Biblioteca principal React.
import styled from 'styled-components/native'; // Estilização declarativa.
import { ViewStyle } from 'react-native'; // Tipagem para estilos customizados via props.
import theme from '../styles/theme'; // Tema centralizado (cores, tipografia, espaçamentos).

// ====== TIPAGEM ======
// Propriedades aceitas pelo componente de cartão de estatísticas.
interface StatisticsCardProps {
  title: string; // Título da métrica (ex: "Consultas Confirmadas").
  value: string | number; // Valor principal exibido.
  subtitle?: string; // Texto auxiliar opcional (ex: "Últimos 30 dias").
  color?: string; // Cor de destaque do valor e borda lateral.
  icon?: React.ReactNode; // Ícone opcional exibido no cabeçalho.
  style?: ViewStyle; // Estilo extra aplicado ao container externo.
}

// ====== COMPONENTE ======
// Cartão visual para exibir estatísticas com título, valor, subtítulo e ícone opcional.
const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  subtitle,
  color = theme.colors.primary,
  icon,
  style,
}) => {
  return (
    <Container style={style} color={color}>
      {/* Cabeçalho do cartão: ícone (opcional) + título */}
      <Header>
        {icon && <IconContainer>{icon}</IconContainer>}
        <Title>{title}</Title>
      </Header>

      {/* Valor principal em destaque */}
      <Value color={color}>{value}</Value>

      {/* Subtítulo opcional */}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Container>
  );
};

// ====== ESTILOS COM STYLED-COMPONENTS ======
// Container principal do cartão.
const Container = styled.View<{ color: string }>`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  margin: 8px;
  min-height: 120px;
  justify-content: space-between;

  /* Destaque com borda colorida à esquerda */
  border-left-width: 4px;
  border-left-color: ${(props) => props.color};

  /* Sombras (iOS e Android) */
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

// Cabeçalho (linha com ícone e título).
const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

// Container para ícone opcional.
const IconContainer = styled.View`
  margin-right: 8px;
`;

// Título da estatística.
const Title = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 500;
  opacity: 0.8;
`;

// Valor principal em destaque.
const Value = styled.Text<{ color: string }>`
  font-size: 28px;
  font-weight: bold;
  color: ${(props) => props.color};
  margin-bottom: 4px;
`;

// Subtítulo auxiliar.
const Subtitle = styled.Text`
  font-size: 12px;
  color: ${theme.colors.text};
  opacity: 0.6;
`;

export default StatisticsCard; // Exporta o componente para uso em dashboards.