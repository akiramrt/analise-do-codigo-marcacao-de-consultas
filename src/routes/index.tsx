// ====== IMPORTS ======
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Stack Navigator para navegação em pilha.
import HomeScreen from '../screens/HomeScreen'; // Tela inicial (dashboard/home).
import CreateAppointmentScreen from '../screens/CreateAppointmentScreen'; // Tela para criação de consultas.
import ProfileScreen from '../screens/ProfileScreen'; // Tela de perfil do usuário.

// Cria o objeto de navegação do tipo "stack" (navegação empilhada).
const Stack = createNativeStackNavigator();

// ====== ROTAS PRINCIPAIS ======
// Define as rotas principais da aplicação quando o usuário está autenticado.
export default function AppRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Esconde o header padrão.
        animation: 'slide_from_right', // Animação de transição entre telas.
      }}
    >
      {/* Tela inicial */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Tela de criação de consulta */}
      <Stack.Screen name="CreateAppointment" component={CreateAppointmentScreen} />

      {/* Tela de perfil do usuário */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}