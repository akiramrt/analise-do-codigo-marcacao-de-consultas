// ====== IMPORTS ======
import React, { createContext, useContext, useState, useEffect } from 'react'; // React e hooks.
import AsyncStorage from '@react-native-async-storage/async-storage'; // Armazenamento local persistente.
import { authService } from '../services/auth'; // Serviço de autenticação.
import { User, LoginCredentials, RegisterData, AuthContextData } from '../types/auth'; // Tipos centralizados.

// ====== CONSTANTES ======
// Chaves usadas no AsyncStorage para persistir dados de autenticação.
const STORAGE_KEYS = {
  USER: '@MedicalApp:user',
  TOKEN: '@MedicalApp:token',
};

// ====== CONTEXTO ======
// Contexto de autenticação que expõe dados do usuário e funções de login/logout.
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// ====== PROVIDER ======
// Responsável por gerenciar e fornecer os dados de autenticação para toda a aplicação.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Estado do usuário logado.
  const [loading, setLoading] = useState(true); // Estado de carregamento inicial (quando checa storage).

  // Ao montar o provider, tenta recuperar usuário armazenado e carregar usuários registrados.
  useEffect(() => {
    loadStoredUser();
    loadRegisteredUsers();
  }, []);

  // Recupera usuário armazenado no AsyncStorage.
  const loadStoredUser = async () => {
    try {
      const storedUser = await authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega lista de usuários registrados (simulação).
  const loadRegisteredUsers = async () => {
    try {
      await authService.loadRegisteredUsers();
    } catch (error) {
      console.error('Erro ao carregar usuários registrados:', error);
    }
  };

  // Realiza login com credenciais e armazena usuário/token no AsyncStorage.
  const signIn = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.signIn(credentials);
      setUser(response.user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    } catch (error) {
      throw error;
    }
  };

  // Realiza registro de novo usuário e salva dados no AsyncStorage.
  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    } catch (error) {
      throw error;
    }
  };

  // Faz logout: remove dados do usuário e token do AsyncStorage.
  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Atualiza informações do usuário e persiste no AsyncStorage.
  const updateUser = async (updatedUser: User) => {
    try {
      setUser(updatedUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  // Fornece dados e funções de autenticação para o restante da aplicação.
  return (
    <AuthContext.Provider value={{ user, loading, signIn, register, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ====== HOOK CUSTOMIZADO ======
// Hook que consome o AuthContext (garante uso dentro do AuthProvider).
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};