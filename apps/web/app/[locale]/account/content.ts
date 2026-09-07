export interface AccountContent {
  metaTitle: string;
  metaDescription: string;
  headline: string;
  subhead: string;
  graceWarning: (date: string) => string;
  resubscribe: string;
  planBilling: string;
  free: string;
  pro: string;
  proBadge: string;
  freeBadge: string;
  proUntil: (date: string) => string;
  complimentaryAccess: string;
  onFreePlan: string;
  extendPro: string;
  upgradeToPro: string;
  betaBanner: string;
  emailLabel: string;
  memberSinceLabel: string;
  whatsIncluded: string;
  unlockWithPro: string;
  freeSummary: string;
  proFeatures: { title: string; desc: string }[];
  pricingLine: (monthlyDays: string, yearlyPrice: string) => string;
  cloudSync: string;
  security: string;
  securityDesc: string;
  dangerZone: string;
  dangerDesc: string;
  changePassword: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    changePasswordBtn: string;
    updating: string;
    passwordUpdated: string;
    errors: {
      tooShort: string;
      mismatch: string;
      reencryptFailed: string;
      generic: string;
      notAuthenticated: string;
      accountNotFound: string;
      incorrectPassword: string;
    };
  };
  syncSetup: {
    cloudSyncTitle: string;
    proBadge: string;
    lockedDesc: string;
    upgradeToPro: string;
    onTitle: string;
    onDesc: string;
    enabledOn: (date: string) => string;
  };
  deleteAccount: {
    triggerLabel: string;
    dialogTitle: string;
    areYouSure: string;
    permanentWarning: string;
    subCancelWarning: string;
    confirmBtn: string;
    deleting: string;
    cancelBtn: string;
    closeAria: string;
    errorMessage: string;
  };
}

const EN: AccountContent = {
  metaTitle: 'Account',
  metaDescription: 'Manage your plan, billing, and data.',
  headline: 'Account',
  subhead: 'Manage your plan, billing, and data.',
  graceWarning: (date) =>
    `Your subscription has ended. Your account and cloud snapshots will be deleted on ${date}.`,
  resubscribe: 'Re-subscribe to keep your data.',
  planBilling: 'Plan & billing',
  free: 'Free',
  pro: 'Pro',
  proBadge: 'PRO',
  freeBadge: 'FREE',
  proUntil: (date) => `Pro until ${date}`,
  complimentaryAccess: 'Complimentary access. Thanks for being here early.',
  onFreePlan: 'You are on the free plan.',
  extendPro: 'Extend Pro',
  upgradeToPro: 'Upgrade to Pro',
  betaBanner: 'Free during beta. You have full Pro access at no cost until we launch paid plans. No billing yet.',
  emailLabel: 'Email',
  memberSinceLabel: 'Member since',
  whatsIncluded: "What's included",
  unlockWithPro: 'Unlock with Pro',
  freeSummary:
    "You're on Free: one snapshot, the full non-followers list, and one CSV export. Pro turns that one-off check into an ongoing picture of your account.",
  proFeatures: [
    { title: 'Unlimited history', desc: 'Keep every export and watch your account evolve over time.' },
    { title: 'Compare snapshots', desc: 'See exactly who unfollowed you between any two exports.' },
    { title: 'Encrypted cloud sync', desc: 'Your snapshots backed up and on every device, end-to-end encrypted.' },
    { title: 'Full Radar', desc: 'Health score, growth charts, follow-age, and audience breakdown.' },
    { title: 'Triage that carries over', desc: 'Never re-triage the same accounts after a new export.' },
    { title: 'Ghost-follower radar', desc: 'Surface long-tenure accounts that never engage back.' },
    { title: 'Unlimited CSV export', desc: 'Pull any list, as often as you like.' },
    { title: 'Email alerts', desc: 'Get pinged when a new export reveals unfollowers. (soon)' },
  ],
  pricingLine: (monthlyDays, yearlyPrice) =>
    `for ${monthlyDays}, or $${yearlyPrice} for a year · one-time, no auto-renewal`,
  cloudSync: 'Cloud sync',
  security: 'Security',
  securityDesc: 'Change your password. Any cloud snapshots are re-encrypted under the new password automatically.',
  dangerZone: 'Danger zone',
  dangerDesc:
    'Deleting your account removes all your data permanently, including cloud snapshots. If you have an active Pro subscription, it is cancelled immediately so you are not charged again. This cannot be undone.',
  changePassword: {
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmNewPassword: 'Confirm new password',
    changePasswordBtn: 'Change password',
    updating: 'Updating...',
    passwordUpdated: 'Password updated.',
    errors: {
      tooShort: 'New password must be at least 8 characters.',
      mismatch: 'New passwords do not match.',
      reencryptFailed: 'Could not re-encrypt your cloud snapshots. Check your current password.',
      generic: 'Something went wrong. Please try again.',
      notAuthenticated: 'Not authenticated.',
      accountNotFound: 'Account not found.',
      incorrectPassword: 'Your current password is incorrect.',
    },
  },
  syncSetup: {
    cloudSyncTitle: 'Cloud sync',
    proBadge: 'PRO',
    lockedDesc:
      'Back up your snapshots, encrypted with a key derived from your password, and pick up your history on any device. Included with Pro.',
    upgradeToPro: 'Upgrade to Pro',
    onTitle: 'Cloud sync is on',
    onDesc:
      'Your snapshots are encrypted in your browser with a key derived from your account password before they are stored. We never see your unencrypted data. Nothing to set up or remember.',
    enabledOn: (date) => ` Enabled ${date}.`,
  },
  deleteAccount: {
    triggerLabel: 'Delete account and all data',
    dialogTitle: 'Delete account',
    areYouSure: 'Are you sure?',
    permanentWarning: 'This permanently deletes your account and all data, including cloud snapshots. This cannot be undone.',
    subCancelWarning:
      'If you have an active Pro subscription, it will be cancelled immediately as part of this — you will not be charged again.',
    confirmBtn: 'Yes, delete everything',
    deleting: 'Deleting…',
    cancelBtn: 'Cancel',
    closeAria: 'Close',
    errorMessage:
      'Something went wrong and your account was not deleted. If you have an active subscription, this can happen if Stripe could not be reached, please try again, or contact support before retrying.',
  },
};

const ES: AccountContent = {
  metaTitle: 'Cuenta',
  metaDescription: 'Gestiona tu plan, facturación y datos.',
  headline: 'Cuenta',
  subhead: 'Gestiona tu plan, facturación y datos.',
  graceWarning: (date) =>
    `Tu suscripción ha terminado. Tu cuenta y tus snapshots en la nube se eliminarán el ${date}.`,
  resubscribe: 'Vuelve a suscribirte para conservar tus datos.',
  planBilling: 'Plan y facturación',
  free: 'Gratis',
  pro: 'Pro',
  proBadge: 'PRO',
  freeBadge: 'GRATIS',
  proUntil: (date) => `Pro hasta el ${date}`,
  complimentaryAccess: 'Acceso de cortesía. Gracias por estar aquí desde el principio.',
  onFreePlan: 'Estás en el plan gratuito.',
  extendPro: 'Extender Pro',
  upgradeToPro: 'Mejorar a Pro',
  betaBanner: 'Gratis durante la beta. Tienes acceso completo a Pro sin coste hasta que lancemos los planes de pago. Sin facturación por ahora.',
  emailLabel: 'Correo',
  memberSinceLabel: 'Miembro desde',
  whatsIncluded: 'Qué incluye',
  unlockWithPro: 'Desbloquea con Pro',
  freeSummary:
    'Estás en el plan Gratis: un snapshot, la lista completa de no seguidores y una exportación CSV. Pro convierte esa comprobación puntual en una visión continua de tu cuenta.',
  proFeatures: [
    { title: 'Historial ilimitado', desc: 'Guarda cada exportación y observa cómo evoluciona tu cuenta con el tiempo.' },
    { title: 'Comparar snapshots', desc: 'Ve exactamente quién te dejó de seguir entre dos exportaciones cualesquiera.' },
    { title: 'Sincronización cifrada en la nube', desc: 'Tus snapshots respaldados y disponibles en todos tus dispositivos, con cifrado de extremo a extremo.' },
    { title: 'Radar completo', desc: 'Puntuación de salud, gráficos de crecimiento, antigüedad de seguimiento y desglose de audiencia.' },
    { title: 'Triaje que se conserva', desc: 'No vuelvas a clasificar las mismas cuentas después de una nueva exportación.' },
    { title: 'Radar de seguidores fantasma', desc: 'Detecta cuentas de larga duración que nunca interactúan.' },
    { title: 'Exportación CSV ilimitada', desc: 'Descarga cualquier lista, tantas veces como quieras.' },
    { title: 'Alertas por correo', desc: 'Recibe un aviso cuando una nueva exportación revele quién dejó de seguirte. (próximamente)' },
  ],
  pricingLine: (monthlyDays, yearlyPrice) =>
    `durante ${monthlyDays}, o $${yearlyPrice} al año · pago único, sin renovación automática`,
  cloudSync: 'Sincronización en la nube',
  security: 'Seguridad',
  securityDesc: 'Cambia tu contraseña. Cualquier snapshot en la nube se recifra automáticamente con la nueva contraseña.',
  dangerZone: 'Zona de peligro',
  dangerDesc:
    'Eliminar tu cuenta borra todos tus datos de forma permanente, incluidos los snapshots en la nube. Si tienes una suscripción Pro activa, se cancela de inmediato para que no se te vuelva a cobrar. Esta acción no se puede deshacer.',
  changePassword: {
    currentPassword: 'Contraseña actual',
    newPassword: 'Nueva contraseña',
    confirmNewPassword: 'Confirmar nueva contraseña',
    changePasswordBtn: 'Cambiar contraseña',
    updating: 'Actualizando...',
    passwordUpdated: 'Contraseña actualizada.',
    errors: {
      tooShort: 'La nueva contraseña debe tener al menos 8 caracteres.',
      mismatch: 'Las contraseñas nuevas no coinciden.',
      reencryptFailed: 'No se pudieron recifrar tus snapshots en la nube. Comprueba tu contraseña actual.',
      generic: 'Algo salió mal. Inténtalo de nuevo.',
      notAuthenticated: 'No has iniciado sesión.',
      accountNotFound: 'Cuenta no encontrada.',
      incorrectPassword: 'Tu contraseña actual es incorrecta.',
    },
  },
  syncSetup: {
    cloudSyncTitle: 'Sincronización en la nube',
    proBadge: 'PRO',
    lockedDesc:
      'Respalda tus snapshots, cifrados con una clave derivada de tu contraseña, y continúa tu historial en cualquier dispositivo. Incluido con Pro.',
    upgradeToPro: 'Mejorar a Pro',
    onTitle: 'La sincronización en la nube está activa',
    onDesc:
      'Tus snapshots se cifran en tu navegador con una clave derivada de la contraseña de tu cuenta antes de guardarse. Nunca vemos tus datos sin cifrar. No hay nada que configurar ni recordar.',
    enabledOn: (date) => ` Activado el ${date}.`,
  },
  deleteAccount: {
    triggerLabel: 'Eliminar cuenta y todos los datos',
    dialogTitle: 'Eliminar cuenta',
    areYouSure: '¿Estás seguro?',
    permanentWarning: 'Esto elimina tu cuenta y todos tus datos de forma permanente, incluidos los snapshots en la nube. Esta acción no se puede deshacer.',
    subCancelWarning:
      'Si tienes una suscripción Pro activa, se cancelará de inmediato como parte de este proceso. No se te volverá a cobrar.',
    confirmBtn: 'Sí, eliminar todo',
    deleting: 'Eliminando…',
    cancelBtn: 'Cancelar',
    closeAria: 'Cerrar',
    errorMessage:
      'Algo salió mal y tu cuenta no se eliminó. Si tienes una suscripción activa, esto puede ocurrir si no se pudo contactar con Stripe. Inténtalo de nuevo o contacta con soporte antes de reintentar.',
  },
};

const PT: AccountContent = {
  metaTitle: 'Conta',
  metaDescription: 'Gerencie seu plano, cobrança e dados.',
  headline: 'Conta',
  subhead: 'Gerencie seu plano, cobrança e dados.',
  graceWarning: (date) =>
    `Sua assinatura terminou. Sua conta e seus snapshots na nuvem serão excluídos em ${date}.`,
  resubscribe: 'Assine novamente para manter seus dados.',
  planBilling: 'Plano e cobrança',
  free: 'Grátis',
  pro: 'Pro',
  proBadge: 'PRO',
  freeBadge: 'GRÁTIS',
  proUntil: (date) => `Pro até ${date}`,
  complimentaryAccess: 'Acesso de cortesia. Obrigado por estar aqui desde o início.',
  onFreePlan: 'Você está no plano gratuito.',
  extendPro: 'Estender Pro',
  upgradeToPro: 'Assinar Pro',
  betaBanner: 'Grátis durante a beta. Você tem acesso completo ao Pro sem custo até lançarmos os planos pagos. Sem cobrança por enquanto.',
  emailLabel: 'E-mail',
  memberSinceLabel: 'Membro desde',
  whatsIncluded: 'O que está incluído',
  unlockWithPro: 'Desbloqueie com o Pro',
  freeSummary:
    'Você está no plano Grátis: um snapshot, a lista completa de não seguidores e uma exportação CSV. O Pro transforma essa checagem pontual em uma visão contínua da sua conta.',
  proFeatures: [
    { title: 'Histórico ilimitado', desc: 'Guarde cada exportação e acompanhe a evolução da sua conta ao longo do tempo.' },
    { title: 'Comparar snapshots', desc: 'Veja exatamente quem deixou de te seguir entre duas exportações quaisquer.' },
    { title: 'Sincronização em nuvem criptografada', desc: 'Seus snapshots com backup e disponíveis em todos os dispositivos, com criptografia de ponta a ponta.' },
    { title: 'Radar completo', desc: 'Pontuação de saúde, gráficos de crescimento, tempo de seguimento e detalhamento da audiência.' },
    { title: 'Triagem que continua', desc: 'Nunca mais re-triagem as mesmas contas após uma nova exportação.' },
    { title: 'Radar de seguidores fantasmas', desc: 'Identifique contas antigas que nunca interagem de volta.' },
    { title: 'Exportação CSV ilimitada', desc: 'Baixe qualquer lista, quantas vezes quiser.' },
    { title: 'Alertas por e-mail', desc: 'Seja avisado quando uma nova exportação revelar quem deixou de te seguir. (em breve)' },
  ],
  pricingLine: (monthlyDays, yearlyPrice) =>
    `por ${monthlyDays}, ou $${yearlyPrice} por ano · pagamento único, sem renovação automática`,
  cloudSync: 'Sincronização em nuvem',
  security: 'Segurança',
  securityDesc: 'Altere sua senha. Todos os snapshots na nuvem são recriptografados automaticamente com a nova senha.',
  dangerZone: 'Zona de risco',
  dangerDesc:
    'Excluir sua conta remove todos os seus dados permanentemente, incluindo os snapshots na nuvem. Se você tiver uma assinatura Pro ativa, ela é cancelada imediatamente para que você não seja cobrado novamente. Isso não pode ser desfeito.',
  changePassword: {
    currentPassword: 'Senha atual',
    newPassword: 'Nova senha',
    confirmNewPassword: 'Confirmar nova senha',
    changePasswordBtn: 'Alterar senha',
    updating: 'Atualizando...',
    passwordUpdated: 'Senha atualizada.',
    errors: {
      tooShort: 'A nova senha deve ter pelo menos 8 caracteres.',
      mismatch: 'As novas senhas não coincidem.',
      reencryptFailed: 'Não foi possível recriptografar seus snapshots na nuvem. Verifique sua senha atual.',
      generic: 'Algo deu errado. Tente novamente.',
      notAuthenticated: 'Não autenticado.',
      accountNotFound: 'Conta não encontrada.',
      incorrectPassword: 'Sua senha atual está incorreta.',
    },
  },
  syncSetup: {
    cloudSyncTitle: 'Sincronização em nuvem',
    proBadge: 'PRO',
    lockedDesc:
      'Faça backup dos seus snapshots, criptografados com uma chave derivada da sua senha, e continue seu histórico em qualquer dispositivo. Incluído no Pro.',
    upgradeToPro: 'Assinar Pro',
    onTitle: 'A sincronização em nuvem está ativa',
    onDesc:
      'Seus snapshots são criptografados no seu navegador com uma chave derivada da senha da sua conta antes de serem armazenados. Nunca vemos seus dados sem criptografia. Nada para configurar ou lembrar.',
    enabledOn: (date) => ` Ativado em ${date}.`,
  },
  deleteAccount: {
    triggerLabel: 'Excluir conta e todos os dados',
    dialogTitle: 'Excluir conta',
    areYouSure: 'Tem certeza?',
    permanentWarning: 'Isso exclui permanentemente sua conta e todos os dados, incluindo os snapshots na nuvem. Isso não pode ser desfeito.',
    subCancelWarning:
      'Se você tiver uma assinatura Pro ativa, ela será cancelada imediatamente como parte deste processo. Você não será cobrado novamente.',
    confirmBtn: 'Sim, excluir tudo',
    deleting: 'Excluindo…',
    cancelBtn: 'Cancelar',
    closeAria: 'Fechar',
    errorMessage:
      'Algo deu errado e sua conta não foi excluída. Se você tem uma assinatura ativa, isso pode acontecer se não foi possível contatar o Stripe. Tente novamente ou entre em contato com o suporte antes de tentar de novo.',
  },
};

export function getAccountContent(locale: string): AccountContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
