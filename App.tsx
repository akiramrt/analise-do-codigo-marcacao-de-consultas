import React from 'react';
// Importa o React, necessário para criar componentes.

import { AuthProvider } from './src/contexts/AuthContext';
// Provedor de contexto de autenticação. Permite que toda a árvore de componentes acesse informações do usuário logado.

import { AppNavigator } from './src/navigation/AppNavigator';
// Gerencia a navegação entre as telas do app (ex: Login, Home, Perfil).

import { ThemeProvider } from 'styled-components/native';
import theme from './src/styles/theme';
// Permite usar temas personalizados (cores, fontes) em todos os componentes.

import { StatusBar } from 'react-native';
// Componente nativo para controlar a barra de status do dispositivo (cor, estilo dos ícones).

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Aplica o tema personalizado em toda a aplicação */}
      <AuthProvider>
        {/* Permite acesso ao contexto de autenticação em todas as telas */}
        <StatusBar 
          barStyle="light-content" 
          backgroundColor={theme.colors.primary} 
        />
        {/* Define a cor e o estilo da barra de status do celular */}
        <AppNavigator />
        {/* Renderiza as telas do app conforme a navegação do usuário */}
      </AuthProvider>
    </ThemeProvider>
  );
}