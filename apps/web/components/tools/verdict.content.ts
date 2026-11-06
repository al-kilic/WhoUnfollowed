import type { ArchetypeId } from '@ig-tracker/core';
import type { AppLocale } from '@/i18n/routing';

// DRAFT verdict pool, for the founder to rewrite in their own humour. Each
// archetype has a name and lines picked at random; lines can use {followBackPct},
// {oneWay}, {fans}, {followers}, {following}, {lost}, {gained}. The lines talk
// to the mutuals who will see the story. No em dashes.
export interface VerdictContent {
  label: string;
  title: string;
  sub: string;
  another: string;
  save: string;
  share: string;
  saved: string;
  footer: string; // printed on the image
  typeLabel: string; // "Your account type"
  stats: { followers: string; following: string; followBack: string };
  archetypes: Record<ArchetypeId, { name: string; lines: string[] }>;
}

const en: VerdictContent = {
  label: 'Verdict card',
  title: 'Your account, judged',
  sub: 'A verdict from your real numbers, sized for a story. Nothing about who follows you is on it.',
  another: 'Another one',
  save: 'Save image',
  share: 'Share',
  saved: 'Saved',
  footer: 'whounfollowed.co · made in my browser, no password',
  typeLabel: 'My account type',
  stats: { followers: 'followers', following: 'following', followBack: 'follow back' },
  archetypes: {
    loyal_magnet: { name: 'The Loyal Magnet', lines: ['{followBackPct}% follow me back. To the rest: I see you 👀', 'People follow me and stay. Weird flex, but okay.'] },
    main_character: { name: 'The Main Character', lines: ['{followers} watching, {following} watched. The math is mathing.', 'I don\'t chase. I get chased. Respectfully.'] },
    quiet_icon: { name: 'The Quiet Icon', lines: ['Small account, big ratio. Quality over quantity.', 'Twice as many followers as follows. Low effort, high return.'] },
    fair_trader: { name: 'The Fair Trader', lines: ['Follow me, I follow you. Perfectly balanced, as all things should be.', 'My ratio is exactly 1. I am the Switzerland of this app.'] },
    generous_giver: { name: 'The Generous Giver', lines: ['I follow everyone. Not everyone follows back. I\'m keeping a list.', 'Big heart, bad ratio. Working on one of those.'] },
    hopeful_romantic: { name: 'The Hopeful Romantic', lines: ['Only {followBackPct}% follow back and I still believe in love.', 'I follow first and hope later. {oneWay} hopes and counting.'] },
    ghost_collector: { name: 'The Ghost Collector', lines: ['{oneWay} accounts I follow have never followed back. Spooky season is all year.', 'My following list is mostly ghosts. Cleanup is coming. You know who you are.'] },
    tiny_circle: { name: 'The Tiny Circle', lines: ['Small list, real people. If you\'re here, you made the cut.', 'Under 100 and {followBackPct}% mutual. VIP section only.'] },
    open_house: { name: 'The Open House', lines: ['I follow {following} accounts. Come in, the door was never locked.', '{following} follows. I have commitment issues in the other direction.'] },
    selective: { name: 'The Selective One', lines: ['{followers} followers, barely any follows. Don\'t take it personally.', 'I follow few. If I follow you, frame it.'] },
    rising: { name: 'The Rising One', lines: ['Most of my followers found me this year. Early fans, I see you.', 'Half my audience is new. Get in before it\'s cool.'] },
    og: { name: 'The OG', lines: ['My followers have been here for years. Day ones only.', 'Almost nobody new this year. Old friends don\'t leave.'] },
    mutual_maximalist: { name: 'The Mutual Maximalist', lines: ['Almost everyone who follows me, I follow back. It\'s called manners.', 'Mutuals, mutuals everywhere. This is a community, not an audience.'] },
    fan_club: { name: 'The Fan Club President', lines: ['{fans} people follow me that I don\'t follow back. Sorry, the club is full.', 'Most of my followers are fans. I owe you all a coffee.'] },
    collector: { name: 'The Collector', lines: ['I follow three times more people than follow me. I collect accounts like stamps.', 'Following {following}, followed by {followers}. A collector, not a hoarder. Probably.'] },
    drama_magnet: { name: 'The Drama Magnet', lines: ['{lost} people left since my last check. I have the list. Sleep tight.', 'Lost {lost} followers. Was it something I posted? Don\'t answer that.'] },
    untouchable: { name: 'The Untouchable', lines: ['Zero unfollows since my last check. Nobody leaves this account.', 'Not one person unfollowed me. You\'re all stuck with me.'] },
    comeback: { name: 'The Comeback', lines: ['Gained {gained}, lost {lost}. The comeback is real.', 'For every one who left, two showed up. Thanks for the upgrade.'] },
    balanced: { name: 'The Steady Hand', lines: ['{followBackPct}% follow back. Not too clingy, not too cold.', 'Healthy ratio, no drama. Boring? No. Stable.'] },
    steady: { name: 'The Work in Progress', lines: ['Every account starts somewhere. Mine starts here.', 'Building quietly. Check back in a month.'] },
  },
};

const es: VerdictContent = {
  label: 'Veredicto',
  title: 'Tu cuenta, juzgada',
  sub: 'Un veredicto con tus números reales, en formato historia. No muestra quién te sigue.',
  another: 'Otro',
  save: 'Guardar imagen',
  share: 'Compartir',
  saved: 'Guardada',
  footer: 'whounfollowed.co · hecho en mi navegador, sin contraseña',
  typeLabel: 'Mi tipo de cuenta',
  stats: { followers: 'seguidores', following: 'seguidos', followBack: 'te siguen de vuelta' },
  archetypes: {
    loyal_magnet: { name: 'El Imán Leal', lines: ['El {followBackPct}% me sigue de vuelta. Al resto: los estoy viendo 👀', 'La gente me sigue y se queda. Raro, pero bueno.'] },
    main_character: { name: 'El Protagonista', lines: ['{followers} mirando, {following} mirados. Las cuentas cuadran.', 'Yo no persigo. Me persiguen. Con respeto.'] },
    quiet_icon: { name: 'El Ícono Discreto', lines: ['Cuenta pequeña, gran ratio. Calidad antes que cantidad.', 'El doble de seguidores que seguidos. Poco esfuerzo, mucho retorno.'] },
    fair_trader: { name: 'El Comerciante Justo', lines: ['Me sigues, te sigo. Perfectamente equilibrado.', 'Mi ratio es exactamente 1. Soy la Suiza de esta app.'] },
    generous_giver: { name: 'El Generoso', lines: ['Sigo a todo el mundo. No todos me siguen. Tengo una lista.', 'Gran corazón, mal ratio. Trabajando en uno de los dos.'] },
    hopeful_romantic: { name: 'El Romántico Esperanzado', lines: ['Solo el {followBackPct}% me sigue y sigo creyendo en el amor.', 'Primero sigo, después espero. {oneWay} esperanzas y contando.'] },
    ghost_collector: { name: 'El Coleccionista de Fantasmas', lines: ['{oneWay} cuentas que sigo nunca me siguieron. Halloween todo el año.', 'Mi lista de seguidos es puro fantasma. Viene limpieza. Ya saben quiénes son.'] },
    tiny_circle: { name: 'El Círculo Íntimo', lines: ['Lista corta, gente real. Si estás aquí, pasaste el corte.', 'Menos de 100 y {followBackPct}% mutuos. Solo zona VIP.'] },
    open_house: { name: 'La Casa Abierta', lines: ['Sigo {following} cuentas. Pasa, la puerta nunca estuvo cerrada.', '{following} seguidos. Mis problemas de compromiso van al revés.'] },
    selective: { name: 'El Selectivo', lines: ['{followers} seguidores, casi nadie seguido. No es personal.', 'Sigo a pocos. Si te sigo, enmárcalo.'] },
    rising: { name: 'El que Va en Subida', lines: ['Casi todos mis seguidores llegaron este año. Fans de la primera hora, los veo.', 'La mitad de mi audiencia es nueva. Entra antes de que sea tendencia.'] },
    og: { name: 'El OG', lines: ['Mis seguidores llevan años aquí. Solo los de siempre.', 'Casi nadie nuevo este año. Los amigos de verdad no se van.'] },
    mutual_maximalist: { name: 'El Rey de los Mutuos', lines: ['Casi a todos los que me siguen, los sigo. Se llama educación.', 'Mutuos por todas partes. Esto es una comunidad, no una audiencia.'] },
    fan_club: { name: 'El Presidente del Club de Fans', lines: ['{fans} personas me siguen y no las sigo. Perdón, el club está lleno.', 'La mayoría de mis seguidores son fans. Les debo un café a todos.'] },
    collector: { name: 'El Coleccionista', lines: ['Sigo al triple de gente de la que me sigue. Colecciono cuentas como sellos.', 'Sigo {following}, me siguen {followers}. Coleccionista, no acumulador. Creo.'] },
    drama_magnet: { name: 'El Imán de Drama', lines: ['{lost} personas se fueron desde mi última revisión. Tengo la lista. Que duerman bien.', 'Perdí {lost} seguidores. ¿Fue algo que publiqué? No contesten.'] },
    untouchable: { name: 'El Intocable', lines: ['Cero unfollows desde mi última revisión. De esta cuenta no se va nadie.', 'Nadie me dejó de seguir. Están atrapados conmigo.'] },
    comeback: { name: 'El Regreso', lines: ['Gané {gained}, perdí {lost}. El regreso es real.', 'Por cada uno que se fue, llegaron dos. Gracias por la mejora.'] },
    balanced: { name: 'El Equilibrado', lines: ['El {followBackPct}% me sigue de vuelta. Ni muy intenso, ni muy frío.', 'Ratio sano, cero drama. ¿Aburrido? No. Estable.'] },
    steady: { name: 'La Obra en Construcción', lines: ['Toda cuenta empieza en algún lado. La mía empieza aquí.', 'Construyendo en silencio. Vuelve en un mes.'] },
  },
};

const pt: VerdictContent = {
  label: 'Veredito',
  title: 'Sua conta, julgada',
  sub: 'Um veredito com seus números reais, no formato de story. Não mostra quem te segue.',
  another: 'Outro',
  save: 'Salvar imagem',
  share: 'Compartilhar',
  saved: 'Salva',
  footer: 'whounfollowed.co · feito no meu navegador, sem senha',
  typeLabel: 'Meu tipo de conta',
  stats: { followers: 'seguidores', following: 'seguindo', followBack: 'seguem de volta' },
  archetypes: {
    loyal_magnet: { name: 'O Ímã Leal', lines: ['{followBackPct}% me seguem de volta. Pro resto: tô de olho 👀', 'O pessoal me segue e fica. Estranho, mas tudo bem.'] },
    main_character: { name: 'O Protagonista', lines: ['{followers} assistindo, {following} assistidos. A conta fecha.', 'Eu não corro atrás. Correm atrás de mim. Com respeito.'] },
    quiet_icon: { name: 'O Ícone Discreto', lines: ['Conta pequena, ratio grande. Qualidade acima de quantidade.', 'O dobro de seguidores que seguidos. Pouco esforço, muito retorno.'] },
    fair_trader: { name: 'O Negociante Justo', lines: ['Me segue, eu sigo. Perfeitamente equilibrado.', 'Meu ratio é exatamente 1. Sou a Suíça deste app.'] },
    generous_giver: { name: 'O Generoso', lines: ['Sigo todo mundo. Nem todo mundo segue de volta. Tenho uma lista.', 'Coração grande, ratio ruim. Trabalhando em um dos dois.'] },
    hopeful_romantic: { name: 'O Romântico Esperançoso', lines: ['Só {followBackPct}% me seguem de volta e eu ainda acredito no amor.', 'Primeiro sigo, depois espero. {oneWay} esperanças e contando.'] },
    ghost_collector: { name: 'O Colecionador de Fantasmas', lines: ['{oneWay} contas que eu sigo nunca me seguiram. Halloween o ano todo.', 'Minha lista de seguindo é só fantasma. Vem faxina. Vocês sabem quem são.'] },
    tiny_circle: { name: 'O Círculo Fechado', lines: ['Lista curta, gente de verdade. Se você está aqui, passou no corte.', 'Menos de 100 e {followBackPct}% mútuos. Só área VIP.'] },
    open_house: { name: 'A Casa Aberta', lines: ['Sigo {following} contas. Entra, a porta nunca esteve trancada.', '{following} seguindo. Meu problema de compromisso é ao contrário.'] },
    selective: { name: 'O Seletivo', lines: ['{followers} seguidores, quase ninguém seguido. Não é pessoal.', 'Sigo poucos. Se eu te sigo, emoldura.'] },
    rising: { name: 'O que Está Subindo', lines: ['A maioria dos meus seguidores chegou este ano. Fãs da primeira hora, vejo vocês.', 'Metade da minha audiência é nova. Chega antes de virar moda.'] },
    og: { name: 'O OG', lines: ['Meus seguidores estão aqui há anos. Só os de sempre.', 'Quase ninguém novo este ano. Amigo de verdade não vai embora.'] },
    mutual_maximalist: { name: 'O Rei dos Mútuos', lines: ['Quase todo mundo que me segue, eu sigo. Chama educação.', 'Mútuos pra todo lado. Isso é comunidade, não audiência.'] },
    fan_club: { name: 'O Presidente do Fã-Clube', lines: ['{fans} pessoas me seguem e eu não sigo de volta. Desculpa, o clube lotou.', 'A maioria dos meus seguidores é fã. Devo um café pra todos.'] },
    collector: { name: 'O Colecionador', lines: ['Sigo o triplo de gente que me segue. Coleciono contas como selos.', 'Seguindo {following}, seguido por {followers}. Colecionador, não acumulador. Acho.'] },
    drama_magnet: { name: 'O Ímã de Drama', lines: ['{lost} pessoas saíram desde a última conferida. Tenho a lista. Durmam bem.', 'Perdi {lost} seguidores. Foi algo que eu postei? Não respondam.'] },
    untouchable: { name: 'O Intocável', lines: ['Zero unfollows desde a última conferida. Ninguém sai desta conta.', 'Ninguém deixou de me seguir. Vocês estão presos comigo.'] },
    comeback: { name: 'A Volta por Cima', lines: ['Ganhei {gained}, perdi {lost}. A volta por cima é real.', 'Pra cada um que saiu, chegaram dois. Obrigado pelo upgrade.'] },
    balanced: { name: 'O Equilibrado', lines: ['{followBackPct}% me seguem de volta. Nem grudento, nem frio.', 'Ratio saudável, zero drama. Chato? Não. Estável.'] },
    steady: { name: 'A Obra em Andamento', lines: ['Toda conta começa em algum lugar. A minha começa aqui.', 'Construindo em silêncio. Volta daqui a um mês.'] },
  },
};

const all: Record<AppLocale, VerdictContent> = { en, es, pt };
export const getVerdictContent = (locale: AppLocale) => all[locale];
