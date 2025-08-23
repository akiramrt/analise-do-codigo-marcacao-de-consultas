import React from 'react';
import styled from 'styled-components/native';
import { Modal, ViewStyle } from 'react-native';
import { Button, Input } from 'react-native-elements';
import theme from '../styles/theme';

// Props esperadas pelo componente de modal de ação em consultas
interface AppointmentActionModalProps {
  visible: boolean; // Define se o modal está visível
  onClose: () => void; // Função para fechar o modal
  onConfirm: (reason?: string) => void; // Função chamada ao confirmar ação, podendo receber motivo
  actionType: 'confirm' | 'cancel'; // Tipo da ação (confirmar ou cancelar)
  appointmentDetails: {
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    specialty: string;
  };
}

// Componente principal do modal
const AppointmentActionModal: React.FC<AppointmentActionModalProps> = ({
  visible,
  onClose,
  onConfirm,
  actionType,
  appointmentDetails,
}) => {
  // Estado local para armazenar o motivo do cancelamento (se necessário)
  const [reason, setReason] = React.useState('');

  // Confirma a ação (confirmação ou cancelamento) e limpa o campo de motivo
  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined);
    setReason('');
    onClose();
  };

  // Fecha o modal e reseta o campo de motivo
  const handleClose = () => {
    setReason('');
    onClose();
  };

  // Define se a ação é de cancelamento
  const isCancel = actionType === 'cancel';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Overlay>
        <ModalContainer>
          {/* Cabeçalho com título dinâmico */}
          <Header>
            <Title>
              {isCancel ? 'Cancelar Consulta' : 'Confirmar Consulta'}
            </Title>
          </Header>

          {/* Conteúdo principal do modal */}
          <Content>
            {/* Informações da consulta */}
            <AppointmentInfo>
              <InfoRow>
                <InfoLabel>Paciente:</InfoLabel>
                <InfoValue>{appointmentDetails.patientName}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Médico:</InfoLabel>
                <InfoValue>{appointmentDetails.doctorName}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Especialidade:</InfoLabel>
                <InfoValue>{appointmentDetails.specialty}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Data/Hora:</InfoLabel>
                <InfoValue>{appointmentDetails.date} às {appointmentDetails.time}</InfoValue>
              </InfoRow>
            </AppointmentInfo>

            {/* Campo para inserir motivo do cancelamento (aparece apenas se ação for cancelar) */}
            {isCancel && (
              <ReasonContainer>
                <Input
                  label="Motivo do cancelamento (opcional)"
                  placeholder="Digite o motivo..."
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  numberOfLines={3}
                  containerStyle={styles.reasonInput}
                />
              </ReasonContainer>
            )}

            {/* Texto de confirmação da ação */}
            <ConfirmationText isCancel={isCancel}>
              {isCancel 
                ? 'Tem certeza que deseja cancelar esta consulta?'
                : 'Tem certeza que deseja confirmar esta consulta?'
              }
            </ConfirmationText>
          </Content>

          {/* Botões de ação: cancelar ou confirmar */}
          <ButtonContainer>
            <Button
              title="Cancelar"
              onPress={handleClose}
              containerStyle={styles.cancelButton as ViewStyle}
              buttonStyle={styles.cancelButtonStyle}
            />
            <Button
              title={isCancel ? 'Confirmar Cancelamento' : 'Confirmar'}
              onPress={handleConfirm}
              containerStyle={styles.confirmButton as ViewStyle}
              buttonStyle={[
                styles.confirmButtonStyle,
                { backgroundColor: isCancel ? theme.colors.error : theme.colors.success }
              ]}
            />
          </ButtonContainer>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

// Estilos usados em componentes específicos do React Native Elements
const styles = {
  reasonInput: {
    marginBottom: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
  },
  cancelButtonStyle: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  confirmButtonStyle: {
    paddingVertical: 12,
  },
};

// Estilização com styled-components
const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ModalContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const Header = styled.View`
  padding: 20px 20px 10px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  text-align: center;
`;

const Content = styled.View`
  padding: 20px;
`;

const AppointmentInfo = styled.View`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 500;
`;

const InfoValue = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 400;
  flex: 1;
  text-align: right;
`;

const ReasonContainer = styled.View`
  margin-bottom: 16px;
`;

const ConfirmationText = styled.Text<{ isCancel: boolean }>`
  font-size: 16px;
  color: ${(props: { isCancel: boolean }) => props.isCancel ? theme.colors.error : theme.colors.success};
  text-align: center;
  margin-bottom: 20px;
  font-weight: 500;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  padding: 0 20px 20px 20px;
`;

export default AppointmentActionModal;