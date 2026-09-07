export interface HistoryContent {
  metaTitle: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  graceWarning: (date: string) => string;
  resubscribe: string;
  slotsSavedUnlimited: (n: number) => string;
  slotsUsedOfFree: (used: number, total: number) => string;
  addNewSnapshot: string;
  upgradeForUnlimited: string;
  proUpsellEyebrow: string;
  proUpsellTitle: string;
  proUpsellBody: string;
  unlockCompare: string;
  cloudSyncFailed: (msg: string) => string;
  cloudOnlyHeader: (n: number) => string;
  restoreBtn: string;
  restoring: string;
  restoreError: (label: string) => string;
  emptyTitle: string;
  emptyBody: string;
  uploadZip: string;
  syncedBadge: string;
  deviceBadge: string;
  followersFollowingExport: (followers: string, following: string, date: string) => string;
  nonFollowersLabel: string;
  viewResults: string;
  renameRedate: string;
  logInToSync: string;
  upgradeToSync: string;
  syncToCloud: string;
  syncing: string;
  compare: string;
  compareWithSelected: string;
  selectedPickAnother: string;
  deleteConfirm: string;
  cancel: string;
  deleteBtn: string;
  deleting: string;
  deleteAriaLabel: (label: string) => string;
  snapshotNamePlaceholder: string;
  exportDateLabel: string;
  save: string;
  editCancel: string;
}

const EN: HistoryContent = {
  metaTitle: 'Snapshot history',
  eyebrow: 'SNAPSHOT HISTORY',
  headline: 'Your snapshots.',
  subhead: 'Upload exports over time to track who unfollowed you between each snapshot.',
  graceWarning: (date) =>
    `Your subscription has ended. Your account and cloud snapshots will be deleted on ${date}.`,
  resubscribe: 'Re-subscribe to keep your data.',
  slotsSavedUnlimited: (n) => `${n} ${n === 1 ? 'snapshot' : 'snapshots'} saved · unlimited history`,
  slotsUsedOfFree: (used, total) => `${used} of ${total} free slots used`,
  addNewSnapshot: 'Add New Snapshot',
  upgradeForUnlimited: 'Upgrade to Pro for unlimited history',
  proUpsellEyebrow: 'Pro',
  proUpsellTitle: 'See who unfollowed you over time',
  proUpsellBody:
    'Free keeps one snapshot. With Pro you save unlimited exports and compare any two to see exactly who unfollowed you between them, plus Radar trends and encrypted cloud backup.',
  unlockCompare: 'Unlock compare',
  cloudSyncFailed: (msg) => `Cloud sync failed: ${msg}`,
  cloudOnlyHeader: (n) => `${n} snapshot${n === 1 ? '' : 's'} in the cloud, not in this browser yet`,
  restoreBtn: 'Restore',
  restoring: 'Restoring...',
  restoreError: (label) => `Could not restore "${label}". Try unlocking sync again.`,
  emptyTitle: 'No snapshots yet',
  emptyBody: 'Upload your first Instagram export to get started.',
  uploadZip: 'Upload ZIP',
  syncedBadge: 'SYNCED',
  deviceBadge: 'DEVICE',
  followersFollowingExport: (followers, following, date) =>
    `${followers} followers · ${following} following · export ${date}`,
  nonFollowersLabel: 'NON-FOLLOWERS',
  viewResults: 'View results',
  renameRedate: 'Rename / Redate',
  logInToSync: 'Log in to sync',
  upgradeToSync: 'Upgrade to sync',
  syncToCloud: 'Sync to cloud',
  syncing: 'Syncing...',
  compare: 'Compare',
  compareWithSelected: 'Compare with selected',
  selectedPickAnother: 'Selected. Pick another to compare.',
  deleteConfirm: 'Delete?',
  cancel: 'Cancel',
  deleteBtn: 'Delete',
  deleting: 'Deleting…',
  deleteAriaLabel: (label) => `Delete ${label}`,
  snapshotNamePlaceholder: 'Snapshot name',
  exportDateLabel: 'Export date:',
  save: 'Save',
  editCancel: 'Cancel',
};

const ES: HistoryContent = {
  metaTitle: 'Historial de snapshots',
  eyebrow: 'HISTORIAL DE SNAPSHOTS',
  headline: 'Tus snapshots.',
  subhead: 'Sube exportaciones con el tiempo para saber quién te dejó de seguir entre cada snapshot.',
  graceWarning: (date) =>
    `Tu suscripción ha terminado. Tu cuenta y tus snapshots en la nube se eliminarán el ${date}.`,
  resubscribe: 'Vuelve a suscribirte para conservar tus datos.',
  slotsSavedUnlimited: (n) => `${n} ${n === 1 ? 'snapshot guardado' : 'snapshots guardados'} · historial ilimitado`,
  slotsUsedOfFree: (used, total) => `${used} de ${total} espacios gratuitos usados`,
  addNewSnapshot: 'Añadir nuevo snapshot',
  upgradeForUnlimited: 'Mejora a Pro para historial ilimitado',
  proUpsellEyebrow: 'Pro',
  proUpsellTitle: 'Descubre quién te dejó de seguir con el tiempo',
  proUpsellBody:
    'Gratis conserva un snapshot. Con Pro guardas exportaciones ilimitadas y comparas dos cualesquiera para ver exactamente quién te dejó de seguir entre ellas, además de tendencias de Radar y respaldo cifrado en la nube.',
  unlockCompare: 'Desbloquear comparación',
  cloudSyncFailed: (msg) => `La sincronización en la nube falló: ${msg}`,
  cloudOnlyHeader: (n) => `${n} snapshot${n === 1 ? '' : 's'} en la nube, todavía no en este navegador`,
  restoreBtn: 'Restaurar',
  restoring: 'Restaurando...',
  restoreError: (label) => `No se pudo restaurar "${label}". Intenta desbloquear la sincronización de nuevo.`,
  emptyTitle: 'Aún no hay snapshots',
  emptyBody: 'Sube tu primera exportación de Instagram para empezar.',
  uploadZip: 'Subir ZIP',
  syncedBadge: 'SINCRONIZADO',
  deviceBadge: 'DISPOSITIVO',
  followersFollowingExport: (followers, following, date) =>
    `${followers} seguidores · ${following} seguidos · exportado ${date}`,
  nonFollowersLabel: 'NO TE SIGUEN',
  viewResults: 'Ver resultados',
  renameRedate: 'Renombrar / Cambiar fecha',
  logInToSync: 'Inicia sesión para sincronizar',
  upgradeToSync: 'Mejora para sincronizar',
  syncToCloud: 'Sincronizar en la nube',
  syncing: 'Sincronizando...',
  compare: 'Comparar',
  compareWithSelected: 'Comparar con el seleccionado',
  selectedPickAnother: 'Seleccionado. Elige otro para comparar.',
  deleteConfirm: '¿Eliminar?',
  cancel: 'Cancelar',
  deleteBtn: 'Eliminar',
  deleting: 'Eliminando…',
  deleteAriaLabel: (label) => `Eliminar ${label}`,
  snapshotNamePlaceholder: 'Nombre del snapshot',
  exportDateLabel: 'Fecha de exportación:',
  save: 'Guardar',
  editCancel: 'Cancelar',
};

const PT: HistoryContent = {
  metaTitle: 'Histórico de snapshots',
  eyebrow: 'HISTÓRICO DE SNAPSHOTS',
  headline: 'Seus snapshots.',
  subhead: 'Envie exportações ao longo do tempo para saber quem deixou de te seguir entre cada snapshot.',
  graceWarning: (date) =>
    `Sua assinatura terminou. Sua conta e seus snapshots na nuvem serão excluídos em ${date}.`,
  resubscribe: 'Assine novamente para manter seus dados.',
  slotsSavedUnlimited: (n) => `${n} ${n === 1 ? 'snapshot salvo' : 'snapshots salvos'} · histórico ilimitado`,
  slotsUsedOfFree: (used, total) => `${used} de ${total} vagas gratuitas usadas`,
  addNewSnapshot: 'Adicionar novo snapshot',
  upgradeForUnlimited: 'Assine o Pro para histórico ilimitado',
  proUpsellEyebrow: 'Pro',
  proUpsellTitle: 'Veja quem deixou de te seguir ao longo do tempo',
  proUpsellBody:
    'O Grátis mantém um snapshot. Com o Pro você salva exportações ilimitadas e compara duas quaisquer para ver exatamente quem deixou de te seguir entre elas, além de tendências do Radar e backup criptografado na nuvem.',
  unlockCompare: 'Desbloquear comparação',
  cloudSyncFailed: (msg) => `A sincronização na nuvem falhou: ${msg}`,
  cloudOnlyHeader: (n) => `${n} snapshot${n === 1 ? '' : 's'} na nuvem, ainda não neste navegador`,
  restoreBtn: 'Restaurar',
  restoring: 'Restaurando...',
  restoreError: (label) => `Não foi possível restaurar "${label}". Tente desbloquear a sincronização novamente.`,
  emptyTitle: 'Nenhum snapshot ainda',
  emptyBody: 'Envie sua primeira exportação do Instagram para começar.',
  uploadZip: 'Enviar ZIP',
  syncedBadge: 'SINCRONIZADO',
  deviceBadge: 'DISPOSITIVO',
  followersFollowingExport: (followers, following, date) =>
    `${followers} seguidores · ${following} seguindo · exportado em ${date}`,
  nonFollowersLabel: 'NÃO TE SEGUEM',
  viewResults: 'Ver resultados',
  renameRedate: 'Renomear / Alterar data',
  logInToSync: 'Entre para sincronizar',
  upgradeToSync: 'Assine para sincronizar',
  syncToCloud: 'Sincronizar na nuvem',
  syncing: 'Sincronizando...',
  compare: 'Comparar',
  compareWithSelected: 'Comparar com o selecionado',
  selectedPickAnother: 'Selecionado. Escolha outro para comparar.',
  deleteConfirm: 'Excluir?',
  cancel: 'Cancelar',
  deleteBtn: 'Excluir',
  deleting: 'Excluindo…',
  deleteAriaLabel: (label) => `Excluir ${label}`,
  snapshotNamePlaceholder: 'Nome do snapshot',
  exportDateLabel: 'Data de exportação:',
  save: 'Salvar',
  editCancel: 'Cancelar',
};

export function getHistoryContent(locale: string): HistoryContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
