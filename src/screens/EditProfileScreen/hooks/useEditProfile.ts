import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { buildUpdatedUser, persistUser } from '../services/profileService';

type Nav = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

export const useEditProfile = () => {
  const navigation = useNavigation<Nav>();
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [specialty, setSpecialty] = useState(user?.specialty ?? '');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Erro', 'Nome e email são obrigatórios');
      return false;
    }
    // validação simples de e-mail (poderia usar lib)
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      Alert.alert('Erro', 'Informe um email válido');
      return false;
    }
    return true;
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    if (!validate()) return;

    try {
      setLoading(true);

      const patch = {
        id: user.id,
        name: name.trim(),
        email: email.trim(),
        ...(user.role === 'doctor' ? { specialty: specialty.trim() } : {}),
      };

      const updated = buildUpdatedUser(user, patch);
      await updateUser(updated);      // atualiza no contexto
      await persistUser(updated);     // persiste no AsyncStorage

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.error('Erro ao atualizar perfil:', e);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigation.goBack();

  return {
    user,
    name, setName,
    email, setEmail,
    specialty, setSpecialty,
    loading,
    handleSaveProfile,
    handleCancel,
  };
};
