import type { AppLocale } from '@/i18n/routing';

export interface PlanContent {
  sub: string;
  newPlan: string; newPlanTitle: string; firstPlan: string; noPlanTitle: string; noPlanBody: string;
  range: (a: string, b: string) => string; done: (n: number, total: number) => string;
  month: string; list: string; view: string;
  today: string; posted: string; markPosted: string; notPosted: string; writeIt: string; hook: string;
  moveThis: string; earlier: string; later: string; noPhoto: string;
  pickDay: string; moveBanner: string; dragHint: string; postedLocked: string; undo: string; cancel: string;
  moved: (day: string) => string; swapped: (day: string) => string; target: (day: string, what: 'empty' | 'swap' | 'locked', idea: string) => string;
  calAll: string; calPost: string; calGoogle: string; calIcs: string; calTitle: (format: string) => string; calNone: string; calNote: string; remindEmail: string;
  nothing: string; weekCount: (n: number) => string; addPost: string; aboutPh: string; add: string;
  suggest: string; another: string; addToPlan: string; moveHere: string;
  thPost: string; thFormat: string; thDay: string;
  example: string; exampleIdeas: string[]; unlock: string; principles: string; saveError: string;
  setup: {
    basis: string; basisLine: (followers: string, date: string, results: number) => string; noExport: string; upload: string;
    perWeek: string; perWeekHelp: string; formats: string; photos: string; photoStates: { ready: string; weekly: string; none: string }; readyCount: string;
    places: string; placesPh: string; wants: string; wantsPh: string; avoid: string; avoidPh: string;
    time: string; times: { quick: string; hour: string; half_day: string }; submit: string; remembered: string;
  };
  reviseTitle: string; reviseSub: string; revisePh: string; reviseCta: string; freeLeft: (n: number) => string; revised: string;
}

const EN: PlanContent = {
  sub: '30 days of posts around your audience. Mark posts as you publish them.',
  newPlan: 'New plan', newPlanTitle: 'Make a new 30-day plan', firstPlan: 'Make my first plan',
  noPlanTitle: 'No plan yet', noPlanBody: 'Your coach builds 30 days of posts from what works for your account. Every day stays editable.',
  range: (a, b) => `${a} to ${b}`, done: (n, t) => `${n} of ${t} posts done`,
  month: 'Month', list: 'List', view: 'View',
  today: 'Today', posted: 'Posted', markPosted: 'Posted', notPosted: 'Not posted', writeIt: 'Write it', hook: 'Hook',
  moveThis: 'Move this post', earlier: 'One day earlier', later: 'One day later', noPhoto: 'No photo yet',
  pickDay: 'Pick a new day', moveBanner: 'Pick a new day for this post: tap a day, or use the arrow keys and Enter. Escape cancels.',
  dragHint: 'Drag to another day to move it', postedLocked: 'Posted posts stay on their day.', undo: 'Undo', cancel: 'Cancel',
  moved: (d) => `Moved to ${d}.`, swapped: (d) => `Swapped with the post on ${d}.`,
  target: (d, w, idea) => (w === 'empty' ? `${d}, free` : w === 'swap' ? `${d}, swaps with ${idea}` : `${d}, a posted post, can't move here`),
  calAll: 'Add plan to calendar', calPost: 'Add to calendar', calGoogle: 'Google Calendar', calIcs: 'Apple or Outlook (.ics)', calTitle: (f) => `Post: ${f}`, calNone: 'No upcoming posts to add.', calNote: 'Made in your browser. Nothing is sent to us.', remindEmail: 'Or get an email on your posting days',
  nothing: 'Nothing planned', weekCount: (n) => `${n} ${n === 1 ? 'post' : 'posts'} this week. Add one, or keep it as a rest day.`,
  addPost: 'Add a post', aboutPh: 'What is it about?', add: 'Add',
  suggest: 'Suggest a post for this day', another: 'Another', addToPlan: 'Add to plan', moveHere: 'Or move a planned post here',
  thPost: 'Post', thFormat: 'Format', thDay: 'Day',
  example: 'Example plan', exampleIdeas: ['Your best photo, before and after the edit', 'Five places worth the early alarm', 'A 15-second walk to your favourite corner', 'Behind the shot: the gear you took', 'A poll: which edit should go up?', 'The single best frame of the week'], unlock: 'Unlock to plan', principles: 'What this plan follows', saveError: 'Could not save. Try again.',
  reviseTitle: 'Change this plan', reviseSub: 'Tell your coach what to change. Posts you marked as posted stay where they are.', revisePh: 'For example: move the Reels to weekends, less Peru, more night street shots', reviseCta: 'Update the plan', freeLeft: () => 'Your first change is included', revised: 'Plan updated.',
  setup: {
    basis: 'Built on your account', basisLine: (f, d, r) => `${f} followers in your ${d} export · ${r} ${r === 1 ? 'post' : 'posts'} with results · your memory`,
    noExport: 'Upload an export first. The plan is built on your real numbers, so it can not start without one.', upload: 'Upload an export',
    perWeek: 'How often can you post?', perWeekHelp: 'Pick what you can keep up for a month, not what sounds good.',
    formats: 'Which formats can you make?', photos: 'Your photos', photoStates: { ready: 'I have photos ready', weekly: 'I shoot every week', none: 'I need to shoot everything' }, readyCount: 'About how many are ready?',
    places: 'Where will you be in the next 30 days?', placesPh: 'Da Nang until Dec 5, then Bali Dec 6 to 20', wants: 'What would you like to post?', wantsPh: 'Night streets, the Bali trip as a series...',
    avoid: 'Anything to avoid? (optional)', avoidPh: 'No Reels with my face, no food...', time: 'Time for one post', times: { quick: 'About 15 minutes', hour: 'About an hour', half_day: 'Up to half a day' },
    submit: 'Make my plan', remembered: 'Your answers are kept for the next plan.',
  },
};
const ES: PlanContent = {
  sub: '30 días de publicaciones pensadas para tu audiencia. Marca cada una cuando la publiques.',
  newPlan: 'Plan nuevo', newPlanTitle: 'Hacer un plan nuevo de 30 días', firstPlan: 'Hacer mi primer plan',
  noPlanTitle: 'Aún no hay plan', noPlanBody: 'Tu coach arma 30 días de publicaciones a partir de lo que le funciona a tu cuenta. Cada día se puede editar.',
  range: (a, b) => `${a} al ${b}`, done: (n, t) => `${n} de ${t} publicaciones hechas`,
  month: 'Mes', list: 'Lista', view: 'Vista',
  today: 'Hoy', posted: 'Publicada', markPosted: 'Publicada', notPosted: 'Sin publicar', writeIt: 'Escribirla', hook: 'Gancho',
  moveThis: 'Mover esta publicación', earlier: 'Un día antes', later: 'Un día después', noPhoto: 'Aún sin foto',
  pickDay: 'Elegir otro día', moveBanner: 'Elige un nuevo día para esta publicación: toca un día o usa las flechas y Enter. Escape cancela.',
  dragHint: 'Arrástrala a otro día para moverla', postedLocked: 'Las publicaciones ya publicadas se quedan en su día.', undo: 'Deshacer', cancel: 'Cancelar',
  moved: (d) => `Movida al ${d}.`, swapped: (d) => `Intercambiada con la publicación del ${d}.`,
  target: (d, w, idea) => (w === 'empty' ? `${d}, libre` : w === 'swap' ? `${d}, se intercambia con ${idea}` : `${d}, ya publicada, no se puede mover aquí`),
  calAll: 'Añadir el plan al calendario', calPost: 'Añadir al calendario', calGoogle: 'Google Calendar', calIcs: 'Apple u Outlook (.ics)', calTitle: (f) => `Publicar: ${f}`, calNone: 'No hay próximas publicaciones para añadir.', calNote: 'Se crea en tu navegador. No nos llega nada.', remindEmail: 'O recibe un email en tus días de publicación',
  nothing: 'Nada planeado', weekCount: (n) => `${n} ${n === 1 ? 'publicación' : 'publicaciones'} esta semana. Añade una o déjalo como día de descanso.`,
  addPost: 'Añadir una publicación', aboutPh: '¿De qué trata?', add: 'Añadir',
  suggest: 'Sugerir una publicación para este día', another: 'Otra', addToPlan: 'Añadir al plan', moveHere: 'O mueve aquí una publicación planeada',
  thPost: 'Publicación', thFormat: 'Formato', thDay: 'Día',
  example: 'Plan de ejemplo', exampleIdeas: ['Tu mejor foto, antes y después de editarla', 'Cinco lugares que valen el madrugón', 'Un paseo de 15 segundos a tu rincón favorito', 'Detrás de la foto: el equipo que llevaste', 'Encuesta: ¿qué edición publico?', 'La mejor foto de la semana'], unlock: 'Desbloquear para planificar', principles: 'Lo que sigue este plan', saveError: 'No se pudo guardar. Inténtalo de nuevo.',
  reviseTitle: 'Cambiar este plan', reviseSub: 'Dile a tu coach qué cambiar. Las publicaciones que marcaste como publicadas se quedan donde están.', revisePh: 'Por ejemplo: pasa los Reels al fin de semana, menos Perú, más fotos de calle de noche', reviseCta: 'Actualizar el plan', freeLeft: () => 'Tu primer cambio está incluido', revised: 'Plan actualizado.',
  setup: {
    basis: 'Basado en tu cuenta', basisLine: (f, d, r) => `${f} seguidores en tu exportación del ${d} · ${r} ${r === 1 ? 'publicación' : 'publicaciones'} con resultados · tu memoria`,
    noExport: 'Sube primero una exportación. El plan se basa en tus cifras reales, así que no puede empezar sin una.', upload: 'Subir una exportación',
    perWeek: '¿Cada cuánto puedes publicar?', perWeekHelp: 'Elige lo que puedas mantener un mes, no lo que suena bien.',
    formats: '¿Qué formatos puedes hacer?', photos: 'Tus fotos', photoStates: { ready: 'Tengo fotos listas', weekly: 'Hago fotos cada semana', none: 'Tengo que hacerlas todas' }, readyCount: '¿Cuántas tienes listas, más o menos?',
    places: '¿Dónde estarás los próximos 30 días?', placesPh: 'Da Nang hasta el 5 de dic., luego Bali del 6 al 20', wants: '¿Qué te gustaría publicar?', wantsPh: 'Calles de noche, el viaje a Bali como serie...',
    avoid: '¿Algo que evitar? (opcional)', avoidPh: 'Sin Reels con mi cara, sin comida...', time: 'Tiempo por publicación', times: { quick: 'Unos 15 minutos', hour: 'Más o menos una hora', half_day: 'Hasta media jornada' },
    submit: 'Hacer mi plan', remembered: 'Guardamos tus respuestas para el próximo plan.',
  },
};
const PT: PlanContent = {
  sub: '30 dias de posts pensados para o seu público. Marque cada um quando publicar.',
  newPlan: 'Novo plano', newPlanTitle: 'Fazer um novo plano de 30 dias', firstPlan: 'Fazer meu primeiro plano',
  noPlanTitle: 'Ainda não há plano', noPlanBody: 'Seu coach monta 30 dias de posts a partir do que funciona para a sua conta. Cada dia pode ser editado.',
  range: (a, b) => `${a} a ${b}`, done: (n, t) => `${n} de ${t} posts feitos`,
  month: 'Mês', list: 'Lista', view: 'Visualização',
  today: 'Hoje', posted: 'Postado', markPosted: 'Postado', notPosted: 'Não postado', writeIt: 'Escrever', hook: 'Gancho',
  moveThis: 'Mover este post', earlier: 'Um dia antes', later: 'Um dia depois', noPhoto: 'Ainda sem foto',
  pickDay: 'Escolher outro dia', moveBanner: 'Escolha um novo dia para este post: toque em um dia ou use as setas e Enter. Esc cancela.',
  dragHint: 'Arraste para outro dia para mover', postedLocked: 'Posts já publicados ficam no dia deles.', undo: 'Desfazer', cancel: 'Cancelar',
  moved: (d) => `Movido para ${d}.`, swapped: (d) => `Trocado com o post de ${d}.`,
  target: (d, w, idea) => (w === 'empty' ? `${d}, livre` : w === 'swap' ? `${d}, troca com ${idea}` : `${d}, já publicado, não dá para mover aqui`),
  calAll: 'Adicionar o plano ao calendário', calPost: 'Adicionar ao calendário', calGoogle: 'Google Agenda', calIcs: 'Apple ou Outlook (.ics)', calTitle: (f) => `Postar: ${f}`, calNone: 'Nenhum post futuro para adicionar.', calNote: 'Criado no seu navegador. Nada é enviado para nós.', remindEmail: 'Ou receba um email nos seus dias de postar',
  nothing: 'Nada planejado', weekCount: (n) => `${n} ${n === 1 ? 'post' : 'posts'} nesta semana. Adicione um ou deixe como dia de descanso.`,
  addPost: 'Adicionar um post', aboutPh: 'Sobre o que é?', add: 'Adicionar',
  suggest: 'Sugerir um post para este dia', another: 'Outra', addToPlan: 'Adicionar ao plano', moveHere: 'Ou mova para cá um post planejado',
  thPost: 'Post', thFormat: 'Formato', thDay: 'Dia',
  example: 'Plano de exemplo', exampleIdeas: ['Sua melhor foto, antes e depois da edição', 'Cinco lugares que valem acordar cedo', 'Uma caminhada de 15 segundos até seu canto favorito', 'Bastidores: o equipamento que você levou', 'Enquete: qual edição eu posto?', 'A melhor foto da semana'], unlock: 'Desbloquear para planejar', principles: 'O que este plano segue', saveError: 'Não foi possível salvar. Tente de novo.',
  reviseTitle: 'Mudar este plano', reviseSub: 'Diga ao seu coach o que mudar. Os posts que você marcou como publicados ficam onde estão.', revisePh: 'Por exemplo: passe os Reels para o fim de semana, menos Peru, mais fotos de rua à noite', reviseCta: 'Atualizar o plano', freeLeft: () => 'Sua primeira mudança está incluída', revised: 'Plano atualizado.',
  setup: {
    basis: 'Feito a partir da sua conta', basisLine: (f, d, r) => `${f} seguidores na sua exportação de ${d} · ${r} ${r === 1 ? 'post' : 'posts'} com resultados · sua memória`,
    noExport: 'Envie uma exportação primeiro. O plano usa seus números reais, então não começa sem uma.', upload: 'Enviar uma exportação',
    perWeek: 'Com que frequência você consegue postar?', perWeekHelp: 'Escolha o que dá para manter por um mês, não o que parece bom.',
    formats: 'Quais formatos você consegue fazer?', photos: 'Suas fotos', photoStates: { ready: 'Tenho fotos prontas', weekly: 'Fotografo toda semana', none: 'Preciso fotografar tudo' }, readyCount: 'Mais ou menos quantas estão prontas?',
    places: 'Onde você vai estar nos próximos 30 dias?', placesPh: 'Da Nang até 5 de dez., depois Bali de 6 a 20', wants: 'O que você gostaria de postar?', wantsPh: 'Ruas à noite, a viagem a Bali como série...',
    avoid: 'Algo a evitar? (opcional)', avoidPh: 'Sem Reels com meu rosto, sem comida...', time: 'Tempo por post', times: { quick: 'Uns 15 minutos', hour: 'Cerca de uma hora', half_day: 'Até meio dia' },
    submit: 'Fazer meu plano', remembered: 'Suas respostas ficam guardadas para o próximo plano.',
  },
};

export function getPlanContent(locale: AppLocale): PlanContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
