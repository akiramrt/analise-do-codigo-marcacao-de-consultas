// ====== IMPORTS ======
import React from 'react'; // Biblioteca principal React.
import styled from 'styled-components/native'; // Estilização declarativa com tema.
import { Avatar } from 'react-native-elements'; // Avatar pronto para RN.
import { useAuth } from '../contexts/AuthContext'; // Contexto de autenticação para dados do usuário.
import NotificationBell from './NotificationBell'; // Componente do sino de notificações.
import theme from '../styles/theme'; // Tema centralizado de cores, tipografia e espaçamentos.

// ====== COMPONENTE HEADER ======
// Exibe o avatar do usuário autenticado, mensagem de boas-vindas e ícone de notificações.
const Header: React.FC = () => {
  const { user } = useAuth(); // Recupera usuário autenticado do contexto.

  // Caso não exista usuário logado, não renderiza o header.
  if (!user) return null;

  return (
    <Container>
      {/* Área de informações do usuário (avatar + texto de boas-vindas) */}
      <UserInfo>
        <Avatar
          size="medium"
          rounded
          source={{ uri: user.image }}
          containerStyle={styles.avatar}
        />
        <TextContainer>
          <WelcomeText>Bem-vindo(a),</WelcomeText>
          <UserName>{user.name}</UserName>
        </TextContainer>
      </UserInfo>

      {/* Sino de notificações no canto direito */}
      <NotificationBell />
    </Container>
  );
};

// ====== ESTILOS AUXILIARES ======
// Avatar com cor de fundo fallback (caso imagem não carregue).
const styles = {
  avatar: {
    backgroundColor: theme.colors.primary,
  },
};

// ====== ESTILOS COM STYLED-COMPONENTS ======
// Container principal do header: cor primária, alinhamento horizontal e espaçamento.
const Container = styled.View`
  background-color: ${theme.colors.primary};
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

// Container para agrupar avatar e textos do usuário.
const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

// Container para os textos ao lado do avatar.
const TextContainer = styled.View`
  margin-left: 12px;
`;

// Texto de boas-vindas em menor destaque.
const WelcomeText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.white};
  opacity: 0.9;
`;

// Nome do usuário em destaque.
const UserName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.white};
`;

export default Header; // Exporta o componente para uso em telas/layouts.