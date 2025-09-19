import theme from '../../../styles/theme';
import { Role, RoleInfo } from '../models';

export function getRoleInfo(role?: Role): RoleInfo {
  switch (role) {
    case 'admin':
      return { label: 'Administrador', badgeBg: `${theme.colors.primary}20` };
    case 'doctor':
      return { label: 'Médico',        badgeBg: `${theme.colors.success}20` };
    case 'patient':
      return { label: 'Paciente',      badgeBg: `${theme.colors.secondary}20` };
    default:
      return { label: role ?? '—',     badgeBg: `${theme.colors.secondary}20` };
  }
}
