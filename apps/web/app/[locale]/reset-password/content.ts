import type { AppLocale } from '@/i18n/routing';

// resetPasswordAction (actions.ts) returns one of these codes instead of
// English text, so the client component can translate it via this file.
// invalid_or_expired_token covers both messages lib/auth/password-reset.ts
// can return for a bad token — they mean the same thing to the user.
export type ResetPasswordErrorCode =
  | 'weak_password'
  | 'password_mismatch'
  | 'rate_limited'
  | 'invalid_or_expired_token';

export interface ResetPasswordContent {
  title: string;
  subtitle: string;
  newPasswordLabel: string;
  confirmPasswordLabel: string;
  minCharsHint: string;
  cloudWarning: string;
  updating: string;
  updatePassword: string;
  invalidLinkTitle: string;
  invalidLinkSubtitle: string;
  requestNewLink: string;
  expiresHint: string;
  doneTitle: string;
  doneSubtitle: string;
  signedOutHint: string;
  goToLogIn: string;
  errors: Record<ResetPasswordErrorCode, string>;
}

const EN: ResetPasswordContent = {
  title: 'Set a new password',
  subtitle: 'Choose a new password for your account.',
  newPasswordLabel: 'New password',
  confirmPasswordLabel: 'Confirm new password',
  minCharsHint: 'Minimum 8 characters.',
  cloudWarning: "This permanently deletes your cloud-synced snapshots. They're encrypted with a key based on your current password, and resetting it makes that key unrecoverable. Your local snapshots on this device are not affected.",
  updating: 'Updating...',
  updatePassword: 'Update password',
  invalidLinkTitle: 'Invalid reset link',
  invalidLinkSubtitle: 'This link is missing or malformed. Request a new password reset to continue.',
  requestNewLink: 'Request a new link',
  expiresHint: 'Reset links expire after 1 hour.',
  doneTitle: 'Password updated',
  doneSubtitle: 'Your password has been changed. Log in with your new password.',
  signedOutHint: 'For your security, all existing sessions were signed out.',
  goToLogIn: 'Go to log in',
  errors: {
    weak_password: 'Password must be at least 8 characters.',
    password_mismatch: 'Passwords do not match.',
    rate_limited: 'Too many attempts. Try again in 15 minutes.',
    invalid_or_expired_token: 'This reset link is invalid or has expired. Request a new one.',
  },
};

const ES: ResetPasswordContent = {
  title: 'Establece una nueva contraseña',
  subtitle: 'Elige una nueva contraseña para tu cuenta.',
  newPasswordLabel: 'Nueva contraseña',
  confirmPasswordLabel: 'Confirmar nueva contraseña',
  minCharsHint: 'Mínimo 8 caracteres.',
  cloudWarning: 'Esto elimina permanentemente tus snapshots sincronizados en la nube. Están cifrados con una clave basada en tu contraseña actual, y restablecerla hace que esa clave sea irrecuperable. Tus snapshots locales en este dispositivo no se ven afectados.',
  updating: 'Actualizando...',
  updatePassword: 'Actualizar contraseña',
  invalidLinkTitle: 'Enlace de restablecimiento inválido',
  invalidLinkSubtitle: 'Este enlace falta o está mal formado. Solicita un nuevo restablecimiento de contraseña para continuar.',
  requestNewLink: 'Solicitar un nuevo enlace',
  expiresHint: 'Los enlaces de restablecimiento caducan después de 1 hora.',
  doneTitle: 'Contraseña actualizada',
  doneSubtitle: 'Tu contraseña ha sido cambiada. Inicia sesión con tu nueva contraseña.',
  signedOutHint: 'Por tu seguridad, se cerraron todas las sesiones existentes.',
  goToLogIn: 'Ir a iniciar sesión',
  errors: {
    weak_password: 'La contraseña debe tener al menos 8 caracteres.',
    password_mismatch: 'Las contraseñas no coinciden.',
    rate_limited: 'Demasiados intentos. Vuelve a intentarlo en 15 minutos.',
    invalid_or_expired_token: 'Este enlace de restablecimiento es inválido o ha caducado. Solicita uno nuevo.',
  },
};

const PT: ResetPasswordContent = {
  title: 'Defina uma nova senha',
  subtitle: 'Escolha uma nova senha para sua conta.',
  newPasswordLabel: 'Nova senha',
  confirmPasswordLabel: 'Confirmar nova senha',
  minCharsHint: 'Mínimo de 8 caracteres.',
  cloudWarning: 'Isso apaga permanentemente seus snapshots sincronizados na nuvem. Eles são criptografados com uma chave baseada na sua senha atual, e redefini-la torna essa chave irrecuperável. Seus snapshots locais neste dispositivo não são afetados.',
  updating: 'Atualizando...',
  updatePassword: 'Atualizar senha',
  invalidLinkTitle: 'Link de redefinição inválido',
  invalidLinkSubtitle: 'Este link está ausente ou malformado. Solicite uma nova redefinição de senha para continuar.',
  requestNewLink: 'Solicitar um novo link',
  expiresHint: 'Links de redefinição expiram após 1 hora.',
  doneTitle: 'Senha atualizada',
  doneSubtitle: 'Sua senha foi alterada. Faça login com sua nova senha.',
  signedOutHint: 'Por segurança, todas as sessões existentes foram encerradas.',
  goToLogIn: 'Ir para o login',
  errors: {
    weak_password: 'A senha deve ter pelo menos 8 caracteres.',
    password_mismatch: 'As senhas não coincidem.',
    rate_limited: 'Muitas tentativas. Tente novamente em 15 minutos.',
    invalid_or_expired_token: 'Este link de redefinição é inválido ou expirou. Solicite um novo.',
  },
};

export function getResetPasswordContent(locale: AppLocale): ResetPasswordContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
