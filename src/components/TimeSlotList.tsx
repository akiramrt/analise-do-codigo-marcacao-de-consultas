// ====== IMPORTS ======
import React from 'react'; // Biblioteca principal React.
import styled from 'styled-components/native'; // Estilização declarativa com tema.
import { ViewStyle, TouchableOpacity } from 'react-native'; // Componentes nativos.
import theme from '../styles/theme'; // Tema centralizado do app.

// ====== TIPAGEM ======
// Propriedades aceitas pelo componente de seleção de horários.
interface TimeSlotListProps {
  onSelectTime: (time: string) => void; // Callback ao selecionar um horário.
  selectedTime?: string; // Horário atualmente selecionado.
  style?: ViewStyle; // Estilo extra para o container.
}

// Props internas para estilização condicional (selecionado ou não).
interface StyledProps {
  isSelected: boolean;
}

// ====== COMPONENTE ======
// Lista de horários disponíveis (9h às 18h, intervalos de 30min).
const TimeSlotList: React.FC<TimeSlotListProps> = ({
  onSelectTime,
  selectedTime,
  style,
}) => {
  // Função que gera horários de 30 em 30 minutos entre 9h e 18h.
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <Container style={style}>
      <TimeGrid>
        {timeSlots.map((time) => (
          <TimeCard
            key={time}
            onPress={() => onSelectTime(time)}
            isSelected={selectedTime === time}
          >
            <TimeText isSelected={selectedTime === time}>{time}</TimeText>
          </TimeCard>
        ))}
      </TimeGrid>
    </Container>
  );
};

// ====== ESTILOS COM STYLED-COMPONENTS ======
// Container externo da lista de horários.
const Container = styled.View`
  margin-bottom: 15px;
`;

// Grid flexível que distribui os botões de horário.
const TimeGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 6px;
`;

// Botão individual do horário (altera estilo se selecionado).
const TimeCard = styled(TouchableOpacity)<StyledProps>`
  width: 23%;
  padding: 8px;
  border-radius: 6px;
  background-color: ${(props) =>
    props.isSelected ? theme.colors.primary + '20' : theme.colors.background};
  border-width: 1px;
  border-color: ${(props) =>
    props.isSelected ? theme.colors.primary : theme.colors.border};
  align-items: center;
  justify-content: center;
`;

// Texto do horário dentro do botão (altera cor se selecionado).
const TimeText = styled.Text<StyledProps>`
  font-size: 12px;
  font-weight: 500;
  color: ${(props) =>
    props.isSelected ? theme.colors.primary : theme.colors.text};
`;

export default TimeSlotList; // Exporta o componente para uso em formulários de agendamento.