import type { AppLocale } from '@/i18n/routing';

// The guide behind the info button next to every Studio page title: what the
// page is, a few quick steps, and one thing worth knowing. Plain and honest;
// no em dashes. Keyed by the route without the locale prefix.
export interface Guide { lead: string; steps: string[]; good: string }
export interface GuideLabels { open: (page: string) => string; eyebrow: string; steps: string; good: string }

export const STUDIO_ROUTES = [
  '/app/today', '/app/results', '/app/history', '/app/history/compare',
  '/app/radar', '/app/radar/fixes', '/app/radar/growth', '/app/radar/people', '/app/radar/why', '/app/radar/benchmarks',
  '/app/ask', '/app/create', '/app/create/check', '/app/create/ideas',
  '/app/plan', '/app/plan/posted', '/app/plan/insights', '/app/plan/goals', '/app/plan/brief',
  '/app/you', '/app/you/credits', '/app/you/memory', '/app/you/kit', '/app/you/guides',
] as const;
export type StudioRoute = (typeof STUDIO_ROUTES)[number];

type Pack = { labels: GuideLabels; guides: Record<StudioRoute, Guide> };

const en: Pack = {
  labels: { open: (p) => `About ${p}`, eyebrow: 'Guide', steps: 'Quick steps', good: 'Good to know' },
  guides: {
    '/app/today': {
      lead: 'Your day at a glance: what changed in your latest export, your goal, this week\'s plan and one thing worth doing next.',
      steps: ['Read the top card first: it is your coach\'s read of the newest export.', 'Check the week strip to see what is planned and what you already posted.', 'Use the blind spot card when it shows up: it points at something you are missing.'],
      good: 'Today follows the platform you last opened in Results. It opens on Instagram when you have an Instagram export.',
    },
    '/app/results': {
      lead: 'Everyone from your export, sorted into who does not follow you back, fans, mutuals and who unfollowed you.',
      steps: ['Pick a tab, then search or sort the list.', 'Mark each account Keep, To unfollow, Unfollowed or Later. Your marks stay on this device.', 'Tap a username to open the profile on the app.', 'Export the list as CSV when you want it elsewhere.'],
      good: 'Worked out in your browser. Your follower list never leaves this device. Works for Instagram, Threads and TikTok.',
    },
    '/app/history': {
      lead: 'Every export you kept, newest first, so you can see how your account moved over time.',
      steps: ['Upload a newer export to add a point to the trend.', 'Pick two exports and compare them to see who came and who left.', 'Rename an export or fix its date if it was saved wrong.'],
      good: 'Each platform keeps its own history. Exports are stored in this browser unless you turn on cloud sync.',
    },
    '/app/history/compare': {
      lead: 'Two exports side by side: who started following you, who left and how your counts changed in between.',
      steps: ['Read the totals first, then open the lists.', 'Use who left to decide who to follow back or let go.', 'Go back to History to pick a different pair.'],
      good: 'Compare only matches exports from the same platform.',
    },
    '/app/radar': {
      lead: 'A health check of your account built from your exports: ratios, reach and the things worth fixing first.',
      steps: ['Start with the summary tiles at the top.', 'Open Fixes for the quickest wins.', 'Come back after your next export to see what moved.'],
      good: 'Radar works for Instagram, Threads and TikTok. Some tiles need data only Instagram exports include.',
    },
    '/app/radar/fixes': {
      lead: 'Concrete clean ups ranked by impact: ghost followers, old follow requests and accounts that never followed back.',
      steps: ['Take the top fix first: it moves your numbers the most.', 'Open the list behind a fix and work through it in Results.', 'Mark a fix done when you finish it.'],
      good: 'Nothing is changed on your account for you. You decide and do every unfollow yourself, at a safe pace.',
    },
    '/app/radar/growth': {
      lead: 'How your followers changed from one export to the next, with gains and losses per check.',
      steps: ['Read the line for the overall direction.', 'Look at the biggest drop and what you posted around it.', 'Export again every few weeks to keep the chart useful.'],
      good: 'The chart needs at least two exports of the same platform.',
    },
    '/app/radar/people': {
      lead: 'Who is around you: your circle of fans and mutuals, the requests you sent and a planner for unfollowing calmly.',
      steps: ['Read the circle to see how many follow you back.', 'Check requests you sent that are still waiting.', 'Use the unfollow planner to spread unfollows over days.'],
      good: 'Instagram limits fast unfollowing. The planner keeps you under a safe daily number.',
    },
    '/app/radar/why': {
      lead: 'Why people left: patterns behind unfollows, matched with what you posted at the time.',
      steps: ['This page is coming later.', 'Keep exporting every few weeks so there is history to read when it arrives.'],
      good: 'Nothing is behind this page yet. It says so plainly until it is ready.',
    },
    '/app/radar/benchmarks': {
      lead: 'How your numbers compare with accounts of a similar size.',
      steps: ['This page is coming later.', 'Your own trend in Growth is the best benchmark for now.'],
      good: 'Nothing is behind this page yet. It says so plainly until it is ready.',
    },
    '/app/ask': {
      lead: 'A chat with a coach that knows your account: your memory, your exports and the posts you checked.',
      steps: ['Tap a suggested question or type your own.', 'Ask for a deeper answer when you need more detail.', 'Start a new chat for a new topic so answers stay focused.'],
      good: 'The coach sees your counts, your notes and your own words. Never your followers\' usernames.',
    },
    '/app/create': {
      lead: 'Write a hook, caption or Reel script in your own voice, then check it before it goes live.',
      steps: ['Say what the post is about and pick the format.', 'Pick one of the three options and edit it in the preview.', 'Send it to Check a post when you are happy with it.'],
      good: 'Create is built for Instagram posts. The coach learns your voice from your export and your edits.',
    },
    '/app/create/check': {
      lead: 'A score and clear fixes for a post before you share it: hook, caption, format and timing.',
      steps: ['Paste the caption and add the photo if you have it.', 'Read the fixes in order and use the ones that fit.', 'Mark it posted later so your results teach the coach.'],
      good: 'Check is built for Instagram posts. Photos are only read for this check and are not kept.',
    },
    '/app/create/ideas': {
      lead: 'Five post ideas at a time, built from your memory and your numbers.',
      steps: ['Add a theme if you have one in mind, or leave it open.', 'Save the ideas you like to the idea bank.', 'Tap Write this one to turn an idea into a draft.'],
      good: 'Ideas use Instagram formats: Reels, carousels, photos and stories.',
    },
    '/app/plan': {
      lead: 'A 30-day post plan built around your audience, your best days and your goal.',
      steps: ['Set your niche and how often you can post, then make the plan.', 'Drag a post to another day to move it, or swap two.', 'Open a day to write the post or mark it posted.'],
      good: 'The first change to a plan is included. Plans are built for Instagram.',
    },
    '/app/plan/posted': {
      lead: 'Your posts and how they did. Results you add here teach the coach what works for you.',
      steps: ['Mark a post as posted after you share it.', 'Add the numbers a few days later: reach, saves, new followers.', 'Look for the formats and topics that keep winning.'],
      good: 'Only your own numbers are used. Posted is built for Instagram posts.',
    },
    '/app/plan/insights': {
      lead: 'Your coach looks at your own photos and their results and tells you what worked, what did not and what to shoot next.',
      steps: ['Pull recent posts from your export or add photos by hand.', 'Add the numbers you know for each one.', 'Read the patterns, then use Shoot next for your next post.'],
      good: 'Photos are resized in your browser and only sent for the analysis. Earlier runs stay here to reopen.',
    },
    '/app/plan/goals': {
      lead: 'A clear goal per platform, the pace you are on and whether you will reach it in time.',
      steps: ['Pick the platform, then set a follower or habit goal.', 'Export again now and then so the pace stays accurate.', 'Turn on check-ins for a short email at the rhythm you choose.'],
      good: 'Follower goals count only that platform\'s exports. You can keep one goal per platform.',
    },
    '/app/plan/brief': {
      lead: 'What changed on Instagram, Threads and TikTok this week, and what to do about it.',
      steps: ['Read the general edition first.', 'Switch to your niche edition for ideas made for you.', 'Try the one small experiment at the end.'],
      good: 'A new brief comes out every week. Changes a platform rolls back are marked as no longer true.',
    },
    '/app/you': {
      lead: 'Your profile, how the coach writes for you, your memory, your plan and your notifications.',
      steps: ['Set your tone and length once so every draft starts right.', 'Check your plan and billing in one place.', 'Choose which emails you want and how often.'],
      good: 'You can download or delete what the coach knows about you at any time.',
    },
    '/app/you/credits': {
      lead: 'How much of this month\'s coach use you have used, when it resets and any refills you hold.',
      steps: ['Glance at the bar: short questions use very little.', 'Check the reset date before a busy week.', 'Refill a full month for half price if you run out early.'],
      good: 'Use follows real cost, so a quick question costs far less than a long post check. Failed answers never count.',
    },
    '/app/you/memory': {
      lead: 'What your coach knows about your account, in plain notes you can read, edit or delete.',
      steps: ['Read the notes and fix anything that is wrong.', 'Teach it your voice and photo style from your export.', 'Archive notes that no longer apply instead of deleting them.'],
      good: 'Memory never holds your followers\' usernames. Download all gives you everything as a file.',
    },
    '/app/you/kit': {
      lead: 'A media kit for brands: your numbers and best posts on one shareable page.',
      steps: ['This page is coming later.', 'Keep adding results in Posted so your kit has real numbers when it arrives.'],
      good: 'Nothing is behind this page yet. It says so plainly until it is ready.',
    },
    '/app/you/guides': {
      lead: 'Short guides on growing an account, written for photographers and creators.',
      steps: ['This page is coming later.', 'The weekly brief in Plan is the best place to learn in the meantime.'],
      good: 'Nothing is behind this page yet. It says so plainly until it is ready.',
    },
  },
};

const es: Pack = {
  labels: { open: (p) => `Sobre ${p}`, eyebrow: 'Guía', steps: 'Pasos rápidos', good: 'Bueno saber' },
  guides: {
    '/app/today': {
      lead: 'Tu día de un vistazo: qué cambió en tu última exportación, tu meta, el plan de la semana y lo próximo que vale la pena hacer.',
      steps: ['Lee primero la tarjeta de arriba: es lo que tu coach ve en la exportación más nueva.', 'Mira la franja de la semana para ver qué está planeado y qué ya publicaste.', 'Usa la tarjeta de punto ciego cuando aparezca: señala algo que te estás perdiendo.'],
      good: 'Hoy sigue la plataforma que abriste por última vez en Resultados. Abre en Instagram cuando tienes una exportación de Instagram.',
    },
    '/app/results': {
      lead: 'Todas las cuentas de tu exportación, ordenadas en quién no te sigue de vuelta, fans, mutuos y quién dejó de seguirte.',
      steps: ['Elige una pestaña y luego busca u ordena la lista.', 'Marca cada cuenta como Mantener, Dejar de seguir, Dejada o Después. Tus marcas se quedan en este dispositivo.', 'Toca un nombre de usuario para abrir el perfil en la app.', 'Exporta la lista en CSV cuando la quieras en otro lado.'],
      good: 'Se calcula en tu navegador. Tu lista de seguidores nunca sale de este dispositivo. Funciona con Instagram, Threads y TikTok.',
    },
    '/app/history': {
      lead: 'Cada exportación que guardaste, de la más nueva a la más vieja, para ver cómo se movió tu cuenta con el tiempo.',
      steps: ['Sube una exportación más nueva para sumar un punto a la tendencia.', 'Elige dos exportaciones y compáralas para ver quién llegó y quién se fue.', 'Cambia el nombre o la fecha de una exportación si se guardó mal.'],
      good: 'Cada plataforma tiene su propio historial. Las exportaciones se guardan en este navegador salvo que actives la sincronización en la nube.',
    },
    '/app/history/compare': {
      lead: 'Dos exportaciones lado a lado: quién empezó a seguirte, quién se fue y cómo cambiaron tus números entre ellas.',
      steps: ['Lee primero los totales y luego abre las listas.', 'Usa quién se fue para decidir a quién seguir de vuelta o dejar ir.', 'Vuelve al Historial para elegir otro par.'],
      good: 'Comparar solo une exportaciones de la misma plataforma.',
    },
    '/app/radar': {
      lead: 'Un chequeo de salud de tu cuenta hecho con tus exportaciones: proporciones, alcance y lo que conviene arreglar primero.',
      steps: ['Empieza por los indicadores de arriba.', 'Abre Arreglos para las mejoras más rápidas.', 'Vuelve después de tu próxima exportación para ver qué cambió.'],
      good: 'Radar funciona con Instagram, Threads y TikTok. Algunos indicadores necesitan datos que solo traen las exportaciones de Instagram.',
    },
    '/app/radar/fixes': {
      lead: 'Limpiezas concretas ordenadas por impacto: seguidores fantasma, solicitudes viejas y cuentas que nunca te siguieron de vuelta.',
      steps: ['Haz primero el arreglo de arriba: es el que más mueve tus números.', 'Abre la lista de un arreglo y trabájala en Resultados.', 'Marca un arreglo como hecho cuando lo termines.'],
      good: 'Nada se cambia en tu cuenta por ti. Tú decides y haces cada dejar de seguir, a un ritmo seguro.',
    },
    '/app/radar/growth': {
      lead: 'Cómo cambiaron tus seguidores de una exportación a la siguiente, con ganancias y pérdidas en cada revisión.',
      steps: ['Lee la línea para ver la dirección general.', 'Mira la caída más grande y qué publicaste en ese momento.', 'Exporta de nuevo cada pocas semanas para que el gráfico siga siendo útil.'],
      good: 'El gráfico necesita al menos dos exportaciones de la misma plataforma.',
    },
    '/app/radar/people': {
      lead: 'Quién te rodea: tu círculo de fans y mutuos, las solicitudes que enviaste y un planificador para dejar de seguir con calma.',
      steps: ['Lee el círculo para ver cuántos te siguen de vuelta.', 'Revisa las solicitudes que enviaste y siguen esperando.', 'Usa el planificador para repartir los dejar de seguir en varios días.'],
      good: 'Instagram limita dejar de seguir rápido. El planificador te mantiene por debajo de un número diario seguro.',
    },
    '/app/radar/why': {
      lead: 'Por qué se fue la gente: patrones detrás de los dejar de seguir, cruzados con lo que publicaste en ese momento.',
      steps: ['Esta página llega más adelante.', 'Sigue exportando cada pocas semanas para que haya historial cuando llegue.'],
      good: 'Todavía no hay nada detrás de esta página. Lo dice claramente hasta que esté lista.',
    },
    '/app/radar/benchmarks': {
      lead: 'Cómo se comparan tus números con cuentas de tamaño parecido.',
      steps: ['Esta página llega más adelante.', 'Por ahora tu propia tendencia en Crecimiento es la mejor referencia.'],
      good: 'Todavía no hay nada detrás de esta página. Lo dice claramente hasta que esté lista.',
    },
    '/app/ask': {
      lead: 'Un chat con un coach que conoce tu cuenta: tu memoria, tus exportaciones y los posts que revisaste.',
      steps: ['Toca una pregunta sugerida o escribe la tuya.', 'Pide una respuesta más profunda cuando necesites más detalle.', 'Empieza un chat nuevo para un tema nuevo, así las respuestas no se mezclan.'],
      good: 'El coach ve tus números, tus notas y tus propias palabras. Nunca los nombres de usuario de tus seguidores.',
    },
    '/app/create': {
      lead: 'Escribe un gancho, un texto o un guion de Reel con tu propia voz, y revísalo antes de publicarlo.',
      steps: ['Di de qué trata el post y elige el formato.', 'Elige una de las tres opciones y edítala en la vista previa.', 'Mándala a Revisar un post cuando te guste.'],
      good: 'Crear está pensado para posts de Instagram. El coach aprende tu voz de tu exportación y de tus ediciones.',
    },
    '/app/create/check': {
      lead: 'Una puntuación y arreglos claros para un post antes de compartirlo: gancho, texto, formato y momento.',
      steps: ['Pega el texto y agrega la foto si la tienes.', 'Lee los arreglos en orden y usa los que te sirvan.', 'Márcalo como publicado después para que tus resultados le enseñen al coach.'],
      good: 'Revisar está pensado para posts de Instagram. Las fotos solo se leen para esta revisión y no se guardan.',
    },
    '/app/create/ideas': {
      lead: 'Cinco ideas de posts a la vez, hechas con tu memoria y tus números.',
      steps: ['Agrega un tema si tienes uno en mente, o déjalo abierto.', 'Guarda en el banco de ideas las que te gusten.', 'Toca Escribir esta para convertir una idea en un borrador.'],
      good: 'Las ideas usan formatos de Instagram: Reels, carruseles, fotos e historias.',
    },
    '/app/plan': {
      lead: 'Un plan de publicaciones de 30 días pensado para tu audiencia, tus mejores días y tu meta.',
      steps: ['Define tu nicho y cada cuánto puedes publicar, y crea el plan.', 'Arrastra un post a otro día para moverlo, o intercambia dos.', 'Abre un día para escribir el post o marcarlo como publicado.'],
      good: 'El primer cambio a un plan está incluido. Los planes están pensados para Instagram.',
    },
    '/app/plan/posted': {
      lead: 'Tus posts y cómo les fue. Los resultados que agregas aquí le enseñan al coach qué te funciona.',
      steps: ['Marca un post como publicado después de compartirlo.', 'Agrega los números unos días después: alcance, guardados, nuevos seguidores.', 'Busca los formatos y temas que siguen ganando.'],
      good: 'Solo se usan tus propios números. Publicados está pensado para posts de Instagram.',
    },
    '/app/plan/insights': {
      lead: 'Tu coach mira tus propias fotos y sus resultados y te dice qué funcionó, qué no y qué fotografiar después.',
      steps: ['Trae posts recientes de tu exportación o agrega fotos a mano.', 'Agrega los números que sepas de cada una.', 'Lee los patrones y usa Fotografía después para tu próximo post.'],
      good: 'Las fotos se achican en tu navegador y solo se envían para el análisis. Los análisis anteriores quedan aquí para reabrirlos.',
    },
    '/app/plan/goals': {
      lead: 'Una meta clara por plataforma, el ritmo que llevas y si llegarás a tiempo.',
      steps: ['Elige la plataforma y define una meta de seguidores o de hábito.', 'Exporta de nuevo de vez en cuando para que el ritmo sea preciso.', 'Activa los recordatorios para recibir un correo corto al ritmo que elijas.'],
      good: 'Las metas de seguidores cuentan solo las exportaciones de esa plataforma. Puedes tener una meta por plataforma.',
    },
    '/app/plan/brief': {
      lead: 'Qué cambió esta semana en Instagram, Threads y TikTok, y qué hacer al respecto.',
      steps: ['Lee primero la edición general.', 'Cambia a la edición de tu nicho para ideas pensadas para ti.', 'Prueba el pequeño experimento del final.'],
      good: 'Sale un resumen nuevo cada semana. Lo que una plataforma revierte se marca como ya no vigente.',
    },
    '/app/you': {
      lead: 'Tu perfil, cómo escribe el coach para ti, tu memoria, tu plan y tus notificaciones.',
      steps: ['Define tu tono y largo una vez para que cada borrador empiece bien.', 'Revisa tu plan y tus pagos en un solo lugar.', 'Elige qué correos quieres y con qué frecuencia.'],
      good: 'Puedes descargar o borrar lo que el coach sabe de ti cuando quieras.',
    },
    '/app/you/credits': {
      lead: 'Cuánto del uso del coach de este mes llevas, cuándo se renueva y las recargas que tienes.',
      steps: ['Mira la barra: las preguntas cortas usan muy poco.', 'Revisa la fecha de renovación antes de una semana intensa.', 'Recarga un mes completo a mitad de precio si se te acaba antes.'],
      good: 'El uso sigue el costo real, así que una pregunta rápida cuesta mucho menos que una revisión larga. Las respuestas fallidas nunca cuentan.',
    },
    '/app/you/memory': {
      lead: 'Lo que tu coach sabe de tu cuenta, en notas simples que puedes leer, editar o borrar.',
      steps: ['Lee las notas y corrige lo que esté mal.', 'Enséñale tu voz y tu estilo de foto desde tu exportación.', 'Archiva las notas que ya no aplican en vez de borrarlas.'],
      good: 'La memoria nunca guarda los nombres de usuario de tus seguidores. Descargar todo te da todo en un archivo.',
    },
    '/app/you/kit': {
      lead: 'Un media kit para marcas: tus números y tus mejores posts en una página para compartir.',
      steps: ['Esta página llega más adelante.', 'Sigue agregando resultados en Publicados para que tu kit tenga números reales cuando llegue.'],
      good: 'Todavía no hay nada detrás de esta página. Lo dice claramente hasta que esté lista.',
    },
    '/app/you/guides': {
      lead: 'Guías cortas para hacer crecer una cuenta, escritas para fotógrafos y creadores.',
      steps: ['Esta página llega más adelante.', 'Mientras tanto, el resumen semanal en Plan es el mejor lugar para aprender.'],
      good: 'Todavía no hay nada detrás de esta página. Lo dice claramente hasta que esté lista.',
    },
  },
};

const pt: Pack = {
  labels: { open: (p) => `Sobre ${p}`, eyebrow: 'Guia', steps: 'Passos rápidos', good: 'Bom saber' },
  guides: {
    '/app/today': {
      lead: 'Seu dia em um olhar: o que mudou na sua última exportação, sua meta, o plano da semana e a próxima coisa que vale fazer.',
      steps: ['Leia primeiro o cartão do topo: é o que seu coach vê na exportação mais nova.', 'Veja a faixa da semana para saber o que está planejado e o que você já postou.', 'Use o cartão de ponto cego quando aparecer: ele aponta algo que você está deixando passar.'],
      good: 'Hoje segue a plataforma que você abriu por último em Resultados. Abre no Instagram quando você tem uma exportação do Instagram.',
    },
    '/app/results': {
      lead: 'Todas as contas da sua exportação, separadas em quem não te segue de volta, fãs, mútuos e quem deixou de te seguir.',
      steps: ['Escolha uma aba e depois busque ou ordene a lista.', 'Marque cada conta como Manter, Deixar de seguir, Deixada ou Depois. Suas marcas ficam neste dispositivo.', 'Toque em um nome de usuário para abrir o perfil no app.', 'Exporte a lista em CSV quando quiser usá-la em outro lugar.'],
      good: 'Calculado no seu navegador. Sua lista de seguidores nunca sai deste dispositivo. Funciona com Instagram, Threads e TikTok.',
    },
    '/app/history': {
      lead: 'Cada exportação que você guardou, da mais nova para a mais antiga, para ver como sua conta mudou com o tempo.',
      steps: ['Envie uma exportação mais nova para somar um ponto à tendência.', 'Escolha duas exportações e compare para ver quem chegou e quem saiu.', 'Renomeie ou corrija a data de uma exportação se ela foi salva errado.'],
      good: 'Cada plataforma tem seu próprio histórico. As exportações ficam neste navegador, a menos que você ative a sincronização na nuvem.',
    },
    '/app/history/compare': {
      lead: 'Duas exportações lado a lado: quem começou a te seguir, quem saiu e como seus números mudaram entre elas.',
      steps: ['Leia primeiro os totais e depois abra as listas.', 'Use quem saiu para decidir quem seguir de volta ou deixar ir.', 'Volte ao Histórico para escolher outro par.'],
      good: 'Comparar só junta exportações da mesma plataforma.',
    },
    '/app/radar': {
      lead: 'Um check-up da sua conta feito com suas exportações: proporções, alcance e o que vale corrigir primeiro.',
      steps: ['Comece pelos indicadores do topo.', 'Abra Ajustes para os ganhos mais rápidos.', 'Volte depois da próxima exportação para ver o que mudou.'],
      good: 'O Radar funciona com Instagram, Threads e TikTok. Alguns indicadores precisam de dados que só as exportações do Instagram trazem.',
    },
    '/app/radar/fixes': {
      lead: 'Limpezas concretas ordenadas por impacto: seguidores fantasma, solicitações antigas e contas que nunca te seguiram de volta.',
      steps: ['Faça primeiro o ajuste do topo: é o que mais move seus números.', 'Abra a lista de um ajuste e trabalhe nela em Resultados.', 'Marque um ajuste como feito quando terminar.'],
      good: 'Nada é alterado na sua conta por você. Você decide e faz cada deixar de seguir, num ritmo seguro.',
    },
    '/app/radar/growth': {
      lead: 'Como seus seguidores mudaram de uma exportação para a outra, com ganhos e perdas em cada checagem.',
      steps: ['Leia a linha para ver a direção geral.', 'Veja a maior queda e o que você postou naquela época.', 'Exporte de novo a cada poucas semanas para o gráfico continuar útil.'],
      good: 'O gráfico precisa de pelo menos duas exportações da mesma plataforma.',
    },
    '/app/radar/people': {
      lead: 'Quem está ao seu redor: seu círculo de fãs e mútuos, as solicitações que você enviou e um planejador para deixar de seguir com calma.',
      steps: ['Leia o círculo para ver quantos te seguem de volta.', 'Confira as solicitações que você enviou e ainda estão esperando.', 'Use o planejador para espalhar os deixar de seguir em vários dias.'],
      good: 'O Instagram limita deixar de seguir rápido. O planejador mantém você abaixo de um número diário seguro.',
    },
    '/app/radar/why': {
      lead: 'Por que as pessoas saíram: padrões por trás dos deixar de seguir, cruzados com o que você postou na época.',
      steps: ['Esta página chega mais tarde.', 'Continue exportando a cada poucas semanas para ter histórico quando ela chegar.'],
      good: 'Ainda não há nada por trás desta página. Ela diz isso claramente até ficar pronta.',
    },
    '/app/radar/benchmarks': {
      lead: 'Como seus números se comparam com contas de tamanho parecido.',
      steps: ['Esta página chega mais tarde.', 'Por enquanto, sua própria tendência em Crescimento é a melhor referência.'],
      good: 'Ainda não há nada por trás desta página. Ela diz isso claramente até ficar pronta.',
    },
    '/app/ask': {
      lead: 'Um chat com um coach que conhece sua conta: sua memória, suas exportações e os posts que você checou.',
      steps: ['Toque em uma pergunta sugerida ou escreva a sua.', 'Peça uma resposta mais profunda quando precisar de mais detalhe.', 'Comece um chat novo para um assunto novo, assim as respostas não se misturam.'],
      good: 'O coach vê seus números, suas notas e suas próprias palavras. Nunca os nomes de usuário dos seus seguidores.',
    },
    '/app/create': {
      lead: 'Escreva um gancho, uma legenda ou um roteiro de Reel com a sua voz e cheque antes de publicar.',
      steps: ['Diga do que o post trata e escolha o formato.', 'Escolha uma das três opções e edite na prévia.', 'Mande para Checar um post quando gostar.'],
      good: 'Criar foi feito para posts do Instagram. O coach aprende sua voz pela sua exportação e pelas suas edições.',
    },
    '/app/create/check': {
      lead: 'Uma nota e ajustes claros para um post antes de compartilhar: gancho, legenda, formato e horário.',
      steps: ['Cole a legenda e adicione a foto se tiver.', 'Leia os ajustes em ordem e use os que fizerem sentido.', 'Marque como postado depois para que seus resultados ensinem o coach.'],
      good: 'Checar foi feito para posts do Instagram. As fotos só são lidas para esta checagem e não ficam guardadas.',
    },
    '/app/create/ideas': {
      lead: 'Cinco ideias de posts por vez, feitas com sua memória e seus números.',
      steps: ['Adicione um tema se tiver um em mente, ou deixe livre.', 'Salve no banco de ideias as que gostar.', 'Toque em Escrever esta para transformar uma ideia em rascunho.'],
      good: 'As ideias usam formatos do Instagram: Reels, carrosséis, fotos e stories.',
    },
    '/app/plan': {
      lead: 'Um plano de posts de 30 dias pensado para seu público, seus melhores dias e sua meta.',
      steps: ['Defina seu nicho e com que frequência pode postar, e crie o plano.', 'Arraste um post para outro dia para movê-lo, ou troque dois.', 'Abra um dia para escrever o post ou marcá-lo como postado.'],
      good: 'A primeira mudança em um plano está incluída. Os planos foram feitos para o Instagram.',
    },
    '/app/plan/posted': {
      lead: 'Seus posts e como foram. Os resultados que você adiciona aqui ensinam o coach o que funciona para você.',
      steps: ['Marque um post como postado depois de compartilhar.', 'Adicione os números alguns dias depois: alcance, salvamentos, novos seguidores.', 'Procure os formatos e temas que continuam ganhando.'],
      good: 'Só seus próprios números são usados. Postados foi feito para posts do Instagram.',
    },
    '/app/plan/insights': {
      lead: 'Seu coach olha suas próprias fotos e os resultados delas e diz o que funcionou, o que não e o que fotografar depois.',
      steps: ['Traga posts recentes da sua exportação ou adicione fotos à mão.', 'Adicione os números que souber de cada uma.', 'Leia os padrões e use Fotografe depois no seu próximo post.'],
      good: 'As fotos são reduzidas no seu navegador e só enviadas para a análise. Análises anteriores ficam aqui para reabrir.',
    },
    '/app/plan/goals': {
      lead: 'Uma meta clara por plataforma, o ritmo em que você está e se vai chegar a tempo.',
      steps: ['Escolha a plataforma e defina uma meta de seguidores ou de hábito.', 'Exporte de novo de vez em quando para o ritmo ficar preciso.', 'Ative os lembretes para receber um e-mail curto no ritmo que escolher.'],
      good: 'Metas de seguidores contam só as exportações daquela plataforma. Você pode ter uma meta por plataforma.',
    },
    '/app/plan/brief': {
      lead: 'O que mudou no Instagram, Threads e TikTok nesta semana, e o que fazer a respeito.',
      steps: ['Leia primeiro a edição geral.', 'Mude para a edição do seu nicho para ideias feitas para você.', 'Teste o pequeno experimento do final.'],
      good: 'Sai um resumo novo toda semana. O que uma plataforma desfaz é marcado como não vale mais.',
    },
    '/app/you': {
      lead: 'Seu perfil, como o coach escreve para você, sua memória, seu plano e suas notificações.',
      steps: ['Defina seu tom e tamanho uma vez para cada rascunho começar certo.', 'Veja seu plano e pagamentos em um só lugar.', 'Escolha quais e-mails quer e com que frequência.'],
      good: 'Você pode baixar ou apagar o que o coach sabe sobre você a qualquer momento.',
    },
    '/app/you/credits': {
      lead: 'Quanto do uso do coach deste mês você já usou, quando renova e as recargas que você tem.',
      steps: ['Olhe a barra: perguntas curtas usam muito pouco.', 'Confira a data de renovação antes de uma semana cheia.', 'Recarregue um mês inteiro pela metade do preço se acabar antes.'],
      good: 'O uso segue o custo real, então uma pergunta rápida custa bem menos que uma checagem longa. Respostas com falha nunca contam.',
    },
    '/app/you/memory': {
      lead: 'O que seu coach sabe sobre sua conta, em notas simples que você pode ler, editar ou apagar.',
      steps: ['Leia as notas e corrija o que estiver errado.', 'Ensine sua voz e seu estilo de foto a partir da sua exportação.', 'Arquive as notas que não valem mais em vez de apagá-las.'],
      good: 'A memória nunca guarda os nomes de usuário dos seus seguidores. Baixar tudo te dá tudo em um arquivo.',
    },
    '/app/you/kit': {
      lead: 'Um media kit para marcas: seus números e melhores posts em uma página para compartilhar.',
      steps: ['Esta página chega mais tarde.', 'Continue adicionando resultados em Postados para seu kit ter números reais quando chegar.'],
      good: 'Ainda não há nada por trás desta página. Ela diz isso claramente até ficar pronta.',
    },
    '/app/you/guides': {
      lead: 'Guias curtos para crescer uma conta, escritos para fotógrafos e criadores.',
      steps: ['Esta página chega mais tarde.', 'Enquanto isso, o resumo semanal em Plano é o melhor lugar para aprender.'],
      good: 'Ainda não há nada por trás desta página. Ela diz isso claramente até ficar pronta.',
    },
  },
};

const PACKS: Record<AppLocale, Pack> = { en, es, pt };

export function getGuideLabels(locale: AppLocale): GuideLabels {
  return (PACKS[locale] ?? en).labels;
}

// The guide for a Studio path (locale prefix already stripped by usePathname).
// Unknown paths fall back to the longest matching parent route.
export function guideFor(path: string, locale: AppLocale): Guide | null {
  const pack = PACKS[locale] ?? en;
  const clean = (path.replace(/\/+$/, '') || '/') === '/app' ? '/app/today' : path.replace(/\/+$/, '');
  const hit = [...STUDIO_ROUTES].sort((a, b) => b.length - a.length).find((r) => clean === r || clean.startsWith(`${r}/`));
  return hit ? pack.guides[hit] : null;
}

export const GUIDE_PACKS = PACKS;
