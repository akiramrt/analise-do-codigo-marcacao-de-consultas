// ====== IMPORTS ======
import React, { useState, useEffect } from 'react'; // React e hooks para estado e ciclo de vida.
import styled from 'styled-components/native'; // Estilização declarativa com tema.
import { TouchableOpacity } from 'react-native'; // Área clicável nativa.
import { Badge } from 'react-native-elements'; // Componente pronto de badge (contador).
import { useAuth } from '../contexts/AuthContext'; // Contexto de autenticação.
import { useNavigation } from '@react-navigation/native'; // Navegação para telas.
import { notificationService } from '../services/notifications'; // Serviço de notificações.
import theme from '../styles/theme'; // Tema centralizado do app.

// ====== COMPONENTE ======
// Ícone de sino que exibe quantidade de notificações não lidas e navega para tela de notificações.
const NotificationBell: React.FC = () => {
  const { user } = useAuth(); // Usuário logado.
  const navigation = useNavigation(); // Hook para navegação.
  const [unreadCount, setUnreadCount] = useState(0); // Estado do contador de notificações não lidas.

  // Função que carrega o número de notificações não lidas.
  const loadUnreadCount = async () => {
    if (!user?.id) return;
    
    try {
      const count = await notificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Erro ao carregar contador de notificações:', error);
    }
  };

  // Carrega inicialmente e recarrega a cada 30 segundos.
  useEffect(() => {
    loadUnreadCount();
    
    const interval = setInterval(loadUnreadCount, 30000); // Atualiza a cada 30s.
    return () => clearInterval(interval); // Limpa intervalo ao desmontar.
  }, [user?.id]);

  // Atualiza sempre que a tela volta ao foco.
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadUnreadCount);
    return unsubscribe;
  }, [navigation, user?.id]);

  // Navega para tela de notificações ao clicar no sino.
  const handlePress = () => {
    navigation.navigate('Notifications' as never);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <BellContainer>
        <BellIcon>🔔</BellIcon>
        {unreadCount > 0 && (
          <Badge
            value={unreadCount > 99 ? '99+' : unreadCount.toString()} // Limita exibição a "99+".
            status="error"
            containerStyle={styles.badge}
            textStyle={styles.badgeText}
          />
        )}
      </BellContainer>
    </TouchableOpacity>
  );
};

// ====== ESTILOS AUXILIARES ======
// Estilos aplicados ao Badge.
const styles = {
  badge: {
    position: 'absolute' as const,
    top: -8,
    right: -8,
  },
  badgeText: {
    fontSize: 10,
  },
};

// ====== ESTILOS COM STYLED-COMPONENTS ======
// Container do sino (com posição relativa para o badge).
const BellContainer = styled.View`
  position: relative;
  padding: 8px;
`;

// Ícone de sino (pode ser substituído por um ícone de lib de ícones no futuro).
const BellIcon = styled.Text`
  font-size: 24px;
  color: ${theme.colors.white};
`;

export default NotificationBell; // Exporta o componente para uso no Header.