// ====== IMPORTS ======
import React from 'react'; // Biblioteca principal e tipagem de componentes React.
import styled from 'styled-components/native'; // Estilização com styled-components para RN.
import { ViewStyle } from 'react-native'; // Tipagem para estilos inline no RN.
import { ListItem, Avatar } from 'react-native-elements'; // Componentes prontos de UI.
import theme from '../styles/theme'; // Tema centralizado de cores/spacing/tipografia.

// ====== TIPOS ======
// Representa um médico listado no componente.
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

// Props aceitas pelo componente de lista de médicos.
interface DoctorListProps {
  doctors: Doctor[]; // Coleção de médicos para renderização.
  onSelectDoctor: (doctor: Doctor) => void; // Callback ao selecionar um médico.
  selectedDoctorId?: string; // ID do médico selecionado (para destaque visual).
  style?: ViewStyle; // Estilo opcional aplicado ao container externo.
}

// ====== COMPONENTE ======
// Lista de médicos com destaque para o item selecionado e ação de seleção por item.
const DoctorList: React.FC<DoctorListProps> = ({
  doctors,
  onSelectDoctor,
  selectedDoctorId,
  style,
}) => {
  return (
    <Container style={style}>
      {doctors.map((doctor) => (
        <ListItem
          key={doctor.id} // Chave única para reconciliação do React.
          onPress={() => onSelectDoctor(doctor)} // Dispara callback com o médico selecionado.
          containerStyle={[
            styles.listItem, // Estilo base do item.
            selectedDoctorId === doctor.id && styles.selectedItem, // Aplica estilo de selecionado condicionalmente.
          ]}
        >
          {/* Avatar do médico, com fallback de cor de fundo via tema */}
          <Avatar
            size="medium"
            rounded
            source={{ uri: doctor.image }}
            containerStyle={styles.avatar}
          />

          {/* Área de conteúdo do item (nome + especialidade) */}
          <ListItem.Content>
            <ListItem.Title style={styles.name}>{doctor.name}</ListItem.Title>
            <ListItem.Subtitle style={styles.specialty}>
              {doctor.specialty}
            </ListItem.Subtitle>
          </ListItem.Content>

          {/* Chevron indicativo de ação/toque */}
          <ListItem.Chevron />
        </ListItem>
      ))}
    </Container>
  );
};

// ====== ESTILOS (react-native-elements + inline) ======
const styles = {
  // Estilo padrão de cada item da lista.
  listItem: {
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  // Estilo aplicado quando o item está selecionado (realce com a cor primária).
  selectedItem: {
    backgroundColor: theme.colors.primary + '20', // Sufixo '20' = transparência em hex (aprox. 12.5%).
    borderColor: theme.colors.primary,
  },
  // Estilo do container do avatar (cor de fundo caso a imagem não carregue).
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  // Tipografia do nome do médico.
  name: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
  },
  // Tipografia da especialidade (com menor contraste).
  specialty: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.7,
  },
};

// ====== ESTILOS (styled-components) ======
// Container externo da lista para espaçamento inferior entre seções.
const Container = styled.View`
  margin-bottom: 15px;
`;

export default DoctorList; // Exporta o componente para uso em outras telas.