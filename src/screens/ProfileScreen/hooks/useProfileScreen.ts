import { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { getRoleInfo } from '../services/userService';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export const useProfileScreen = () => {
  const navigation = useNavigation<Nav>();
  const { user, signOut } = useAuth();

  const roleInfo = useMemo(() => getRoleInfo(user?.role), [user?.role]);

  return {
    user,
    roleLabel: roleInfo.label,
    badgeBg: roleInfo.badgeBg,
    goBack: () => navigation.goBack(),
    signOut,
  };
};
