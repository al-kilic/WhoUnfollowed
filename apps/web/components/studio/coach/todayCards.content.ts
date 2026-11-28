import type { AppLocale } from '@/i18n/routing';

// Copy for the redesigned Today cards: Since your last export and Goal.
export interface TodayCardsContent {
  since: {
    net: string; joined: string; left: string; more: (n: string) => string; none: string;
    seeWho: string; followersNow: (n: string) => string; barLabel: (j: string, l: string) => string;
  };
  goal: {
    done: string; status: Record<'ahead' | 'on_track' | 'behind' | 'no_deadline' | 'no_data' | 'done', string>;
    pace: string; needed: string; perWeek: (n: string) => string; projected: string; projectedAt: (d: string) => string;
    notYet: string; nextCheckin: string; trend: string; target: string; current: string; open: string;
  };
}

const EN: TodayCardsContent = {
  since: {
    net: 'net change', joined: 'Joined', left: 'Left', more: (n) => `+${n} more`, none: 'Nobody',
    seeWho: 'See everyone in Results', followersNow: (n) => `${n} followers now`,
    barLabel: (j, l) => `${j} joined and ${l} left since your last export`,
  },
  goal: {
    done: 'Reached', status: { ahead: 'Ahead of pace', on_track: 'On pace', behind: 'Behind pace', no_deadline: 'No deadline', no_data: 'Updates with your next export', done: 'Goal reached' },
    pace: 'Your pace', needed: 'Needed', perWeek: (n) => `${n} a week`, projected: 'At this pace',
    projectedAt: (d) => `around ${d}`, notYet: 'not enough data yet', nextCheckin: 'Next check-in',
    trend: 'Followers since you set the goal', target: 'Target', current: 'Now', open: 'Open goals',
  },
};

const ES: TodayCardsContent = {
  since: {
    net: 'cambio neto', joined: 'Llegaron', left: 'Se fueron', more: (n) => `+${n} más`, none: 'Nadie',
    seeWho: 'Ver a todos en Resultados', followersNow: (n) => `${n} seguidores ahora`,
    barLabel: (j, l) => `${j} llegaron y ${l} se fueron desde tu última exportación`,
  },
  goal: {
    done: 'Logrado', status: { ahead: 'Por delante del ritmo', on_track: 'A buen ritmo', behind: 'Por detrás del ritmo', no_deadline: 'Sin fecha', no_data: 'Se actualiza con tu próxima exportación', done: 'Objetivo logrado' },
    pace: 'Tu ritmo', needed: 'Necesario', perWeek: (n) => `${n} por semana`, projected: 'A este ritmo',
    projectedAt: (d) => `hacia ${d}`, notYet: 'aún no hay datos suficientes', nextCheckin: 'Próximo repaso',
    trend: 'Seguidores desde que fijaste el objetivo', target: 'Meta', current: 'Ahora', open: 'Abrir objetivos',
  },
};

const PT: TodayCardsContent = {
  since: {
    net: 'mudança líquida', joined: 'Chegaram', left: 'Saíram', more: (n) => `+${n} a mais`, none: 'Ninguém',
    seeWho: 'Ver todos em Resultados', followersNow: (n) => `${n} seguidores agora`,
    barLabel: (j, l) => `${j} chegaram e ${l} saíram desde sua última exportação`,
  },
  goal: {
    done: 'Alcançada', status: { ahead: 'À frente do ritmo', on_track: 'No ritmo', behind: 'Atrás do ritmo', no_deadline: 'Sem prazo', no_data: 'Atualiza com sua próxima exportação', done: 'Meta alcançada' },
    pace: 'Seu ritmo', needed: 'Necessário', perWeek: (n) => `${n} por semana`, projected: 'Nesse ritmo',
    projectedAt: (d) => `por volta de ${d}`, notYet: 'ainda faltam dados', nextCheckin: 'Próxima revisão',
    trend: 'Seguidores desde que você definiu a meta', target: 'Meta', current: 'Agora', open: 'Abrir metas',
  },
};

// Today's greeting with the member's name when they set one (You > profile).
export function greetWithName(greet: string, name: string | null | undefined): string {
  const n = name?.trim();
  return n ? `${greet}, ${n}` : greet;
}

export function getTodayCardsContent(locale: AppLocale | string): TodayCardsContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
