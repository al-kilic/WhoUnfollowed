import type { SampleCoach } from './types';

// La misma cuenta de ejemplo que en.ts, en español. Sin rayas largas.
export const es: SampleCoach = {
  read: {
    headline: 'Tus carruseles que enseñan traen seguidores. Tus fotos más bonitas, casi nunca.',
    happening: [
      'Desde tu exportación de junio, 113 personas te siguieron y 31 se fueron: sumas 82. Casi la mitad de las nuevas (52) llegaron en los tres días después de tu carrusel del 22 de octubre sobre por qué el carrete sale frío.',
      'Octubre fue tu mejor mes en nueve años: 72 seguidores nuevos. Julio y agosto trajeron menos de diez, y publicaste una sola vez en esos dos meses.',
      'El 32% de tus seguidores te encontró un jueves, el día en que salen tus carruseles. Ninguno de los 31 que se fueron llegó con tus publicaciones de otoño: la gente nueva se queda.',
    ],
    stop: { what: 'Publicar una sola foto bonita sin historia', why: 'Tu foto del Tranvía 28 del 5 de noviembre tuvo los mejores me gusta del otoño y 6 seguidores nuevos. Los dos carruseles que enseñan, antes y después, trajeron 31 y 52. Tus fotos gustan, pero te siguen por lo que explicas.' },
    try: [
      { what: 'Convierte un carrete en un carrusel de "qué salió mal y cómo lo arreglé" un jueves sí y otro no', why: 'Esa forma trajo 52 seguidores el 22 de octubre, tu mejor publicación desde 2017. Repite la forma, no el tema.' },
      { what: 'Cancela las 23 solicitudes de seguimiento que siguen esperando', why: 'Las enviaste tú, la más antigua en abril de 2021. Ya no las van a aceptar, y hacen que tu lista de seguidos parezca más grande de lo que es.' },
      { what: 'Revisa las 41 cuentas que seguiste en una semana de marzo de 2022', why: '41 de las 87 personas que no te siguen de vuelta son de esa única semana. Es una sola pasada, no 87 decisiones.' },
    ],
    memoryNotes: [],
  },
  chats: [
    {
      title: '¿Por qué se fue gente después del verano?',
      turns: [{
        q: '¿Por qué se fue gente después del verano?',
        a: {
          answer: 'Se fueron menos de los que parece. Entre tus exportaciones de junio y noviembre, 31 personas dejaron de seguirte, frente a 37 en los cuatro meses anteriores. Lo que cambió es quién se fue:\n- Los 31 te seguían desde antes de junio. Nadie que llegó con tus carruseles de otoño se ha ido.\n- Publicaste una sola vez en julio y agosto. Quien te encontró por publicaciones antiguas no tenía nada nuevo para quedarse.\n- Ninguno de los 31 era alguien a quien sigues, así que no perdiste mutuos.\nEl hueco fueron meses tranquilos, no malas publicaciones. Tu plan mantiene dos publicaciones por semana en las fiestas para que no se repita.',
          followUps: ['¿Quién se fue, y lo dejo de seguir?', '¿Cómo sigo publicando en un mes con mucho trabajo?'],
          memoryNotes: [],
        },
      }],
    },
    {
      title: '¿Debería publicar más Reels?',
      turns: [{
        q: 'Todo el mundo dice Reels. ¿Debería publicar más?',
        a: {
          answer: 'No más Reels por sí mismos. Mira lo que registraste:\n- Reel del 1 de octubre, cargar una Leica M6 en 20 segundos: 19 seguidores nuevos.\n- Carrusel del 22 de octubre, por qué tu carrete salía frío: 52 seguidores nuevos y 410 guardados.\n- Foto suelta del 5 de noviembre, Tranvía 28 en la hora azul: 6 seguidores nuevos.\nTu Reel funcionó porque enseñaba algo en 20 segundos, igual que el carrusel. Así que mantén un Reel corto a la semana y haz que sea un momento del carrusel que publicas ese jueves: la misma idea, dos formatos, un solo trabajo.',
          followUps: ['Escribe el Reel de este jueves', '¿Qué debería enseñar el próximo carrusel?'],
          memoryNotes: [],
        },
      }],
    },
    {
      title: '¿Voy bien para llegar a 2.000?',
      turns: [{
        q: '¿Voy a llegar a 2.000 antes de que termine marzo?',
        a: {
          answer: 'A tu ritmo actual, no, y es mejor saberlo ahora.\n- Te faltan 760 seguidores en unas 19 semanas: 40 por semana.\n- Desde junio llevas unos 4 por semana. En octubre, tu mejor mes, hiciste unos 17 por semana.\nDos opciones honestas:\n- Mantener marzo y publicar dos carruseles que enseñen por semana. Incluso a tu ritmo de octubre llegarías cerca de 1.550.\n- Mover la fecha a septiembre de 2027 y seguir con tres publicaciones por semana. Eso pide unos 17 por semana: tu ritmo de octubre.\nYo movería la fecha. Si quieres, rehago los seguimientos de la meta para septiembre.',
          followUps: ['Mueve mi meta a septiembre', 'Planifica dos carruseles por semana'],
          memoryNotes: [],
        },
      }],
    },
  ],
  sampleReply: {
    answer: 'Esta es la cuenta de ejemplo, así que esta respuesta es un ejemplo. Con tu propia exportación, el coach lee tus seguidores, quién llegó y quién se fue entre exportaciones, las publicaciones que registraste y lo que recuerda de ti, y responde con tus palabras.\nPrueba uno de los chats de ejemplo de la izquierda para ver cómo lo usa.',
    followUps: ['¿Por qué se fue gente después del verano?', '¿Debería publicar más Reels?'],
    memoryNotes: [],
  },
  draft: {
    topic: 'Por qué mis fotos de Sintra salieron verdes y cómo arreglé el siguiente carrete',
    options: [
      {
        text: 'Mi carrete de Sintra salió verde. Esto es lo que falló, y el único cambio que arregló el siguiente.\n\nDiapositiva 1: "Mi carrete de Sintra salió verde." La peor foto, a tamaño completo.\nDiapositiva 2: La causa. Sombra de bosque y Portra 400 a su sensibilidad nominal: poca luz, y las sombras se vuelven verdes.\nDiapositiva 3: La pista. Verde en las sombras, color normal en el cielo.\nDiapositiva 4: El arreglo. Exponerlo a 200 y medir para las sombras.\nDiapositiva 5: El siguiente carrete, mismo camino, misma hora.\nDiapositiva 6: "Guárdalo antes de tu próximo paseo por el bosque."\n\nTexto:\nMi carrete de Sintra salió verde, y no fue culpa del laboratorio. La sombra bajo los árboles es más oscura de lo que parece, y el Portra a 400 no lo perdona. En el siguiente lo expuse a 200 y medí para las sombras. La diapositiva 5 es la diferencia.\n¿Cuál es el carrete en el que todavía piensas?\n\nHashtags: de 3 a 5, específicos, al final: #portra400 #fotografiaanalogica #shootfilm #sintra\n\nTexto alternativo, diapositiva 1: Un camino de bosque en Sintra en película con un fuerte tono verde en las sombras.',
        why: 'La misma forma que tu carrusel del 22 de octubre (problema, causa, arreglo), que trajo 52 seguidores. Termina con una pregunta, lo que les faltaba a tus publicaciones.',
      },
      {
        text: 'Las sombras verdes en película no son culpa del laboratorio. Seis diapositivas sobre por qué pasa y el único ajuste que cambié.\n\nTexto:\nSintra, dos carretes, el mismo camino. El primero salió verde, el segundo no. El único cambio: expuse el Portra a 200 en vez de 400 y medí para la sombra. Si tus fotos de bosque salen enfermas, pruébalo en tu próximo carrete.\n¿Cuál de las dos habrías publicado?',
        why: 'Empieza por la lección, para quien pasa rápido. Un poco menos personal, así que es una buena segunda opción.',
      },
      {
        text: 'Casi tiro este carrete.\n\nTexto:\nVerde. Todas las fotos de Sintra volvieron verdes. Tardé una semana en entender por qué, y un ajuste en arreglarlo. Desliza para ver los dos carretes lado a lado.\n¿Alguna vez guardaste un carrete que odiabas?',
        why: 'Corto y personal, con tu voz de siempre. Lo mejor si quieres una publicación más tranquila entre dos carruseles que enseñan.',
      },
    ],
  },
  check: {
    format: 'carousel',
    hook: 'Unas fotos de Sintra del fin de semana pasado',
    caption: 'Unas fotos de Sintra del fin de semana pasado. Hechas con Portra 400. La luz en el bosque era increíble. #film #35mm #fotografia #sintra #portugal #viajes #analogico #filmisnotdead #portra #shootfilm #ishootfilm #fotografiadeviaje',
    result: {
      overall: 58,
      scores: [
        { criterion: 'hook', score: 4, reason: 'Tus publicaciones: los inicios que solo describen ("Tranvía 28 en la hora azul") trajeron de 2 a 6 seguidores; tu inicio con el problema del 22 de octubre trajo 52.' },
        { criterion: 'clarity', score: 7, reason: 'Un lugar, un carrete, fácil de seguir. Falta el porqué de la publicación, así que las fotos se leen como un conjunto, no como una historia.' },
        { criterion: 'value', score: 5, reason: 'Guía de la plataforma: se guarda lo que se quiere volver a usar. Nada aquí ayuda a la próxima persona en un bosque con película.' },
        { criterion: 'fit_you', score: 8, reason: 'Tus publicaciones: Portugal en Portra es lo que vinieron a ver tus seguidores. La estética es la correcta, el enfoque no.' },
        { criterion: 'fit_trend', score: 6, reason: 'Guía de la plataforma: los carruseles que enseñan van bien en fotografía este mes (resumen semanal, 23 de nov).' },
        { criterion: 'action', score: 5, reason: 'Sin pregunta y con 12 hashtags genéricos. Nada invita a responder, guardar o volver el jueves.' },
      ],
      fixes: [
        { what: 'Empieza por lo que falló: "Mi carrete de Sintra salió verde."', why: 'Un problema en la primera línea es tu mejor gancho: 52 seguidores el 22 de octubre.' },
        { what: 'Añade una diapositiva con el arreglo y termina con una pregunta', why: 'Convierte un conjunto de fotos en algo que la gente guarda y responde.' },
        { what: 'Quédate con 4 hashtags específicos y quita los otros 8', why: 'Los genéricos como #fotografia te esconden entre millones de publicaciones. Los específicos llegan a quien dispara en película.' },
      ],
      altHooks: ['Mi carrete de Sintra salió verde. Este es el arreglo.', 'El mismo bosque, dos carretes, un ajuste distinto.'],
      caption: 'Mi carrete de Sintra salió verde, y no fue culpa del laboratorio. La sombra bajo los árboles es más oscura de lo que parece, así que en el siguiente expuse el Portra a 200 y medí para las sombras. La diapositiva 5 es la diferencia.\n¿Cuál es el carrete en el que todavía piensas?\n#portra400 #fotografiaanalogica #shootfilm #sintra',
      cover: ['La primera diapositiva es la foto verde: bien, muestra el problema. Que el texto ocupe al menos 1/12 de la altura para que se lea en el móvil.'],
      memoryNotes: [],
    },
  },
  ideas: {
    theme: '',
    ideas: [
      { format: 'carousel', idea: 'Tres carretes que salieron mal este año y el arreglo de cada uno', hook: 'Tres carretes que casi tiro.', why: 'Tu carrusel de "qué salió mal" del 22 de octubre trajo 52 seguidores, tu mejor publicación desde 2017.' },
      { format: 'reel', idea: 'Portra a 200 contra 400, la misma calle, en pantalla dividida', hook: 'La misma calle. Un ajuste.', why: 'Tu Reel de 20 segundos con la Leica trajo 19 seguidores: los Reels cortos que enseñan te funcionan.' },
      { format: 'carousel', idea: 'Alfama a las 7 de la mañana, diez fotos, con los ajustes en cada una', hook: 'Alfama antes de que despierte nadie.', why: 'Tu carrusel de Alfama del 10 de septiembre trajo 31 seguidores. Con los ajustes, se convierte en algo que se guarda.' },
      { format: 'story', idea: 'Una encuesta: cuál de dos fotos será la portada del jueves', hook: '¿Izquierda o derecha para el jueves?', why: 'El 32% de tus seguidores te encontró un jueves. Una encuesta el martes los prepara.' },
      { format: 'photo', idea: 'Una foto de tu carrete más antiguo, con lo que harías distinto hoy', hook: 'Nueve años entre estas dos fotos.', why: 'Tu seguidor más antiguo está aquí desde febrero de 2017. Mirar atrás da a quien se quedó un motivo para comentar.' },
    ],
  },
  plan: {
    summary: 'Dos semanas construidas sobre lo que te trae seguidores: un carrusel que enseña cada jueves, un Reel corto que lo reaprovecha el martes y una foto más tranquila el sábado. Los recordatorios salen a las 18:30 cada día de publicación.',
    principles: ['El jueves es para carruseles que enseñan: problema, causa, arreglo', 'El martes reaprovecha la idea del jueves en un Reel de 20 segundos', 'El sábado es una sola foto con una pregunta, sin presión', 'Termina cada publicación con una pregunta de verdad'],
    weeks: [1, 2, 3, 4].map((week) => ({
      week,
      theme: ['Lo que salió mal', 'Detrás de los ajustes', 'Lisboa temprano', 'Vuestras preguntas'][week - 1]!,
      posts: [
        { day: 'Mar', format: 'reel' as const, idea: ['Portra a 200 contra 400, lado a lado', 'Medir para la sombra en 20 segundos', 'Alfama a las 7 en 15 segundos', 'Respondo la pregunta más repetida'][week - 1]!, hook: ['La misma calle. Un ajuste.', 'Mide aquí, no allí.', 'Antes de que despierte nadie.', 'Me lo preguntasteis, así que aquí está.'][week - 1]! },
        { day: 'Jue', format: 'carousel' as const, idea: ['Mi carrete de Sintra salió verde, y el arreglo', 'Cinco ajustes que reviso antes de cada carrete', 'Alfama a las 7, diez fotos con ajustes', 'Tres preguntas vuestras, respondidas con mis carretes'][week - 1]!, hook: ['Mi carrete de Sintra salió verde.', 'Los cinco números que miro primero.', 'Alfama antes de que despierte nadie.', 'Vuestras tres preguntas, mis tres carretes.'][week - 1]! },
        { day: 'Sáb', format: 'photo' as const, idea: ['Una foto del carrete verde que todavía me gusta', 'Una foto que me salió bien a la primera', 'Tranvía 28 en la hora azul, con una pregunta', 'La foto más antigua de mi móvil'][week - 1]!, hook: ['Esta me la quedé igual.', 'A la primera, por una vez.', '¿Cuál es tu parada?', 'Hace nueve años.'][week - 1]! },
      ],
    })),
    memoryNotes: [],
  },
  posted: [
    { format: 'photo', title: 'Tranvía 28 en la hora azul', postedAt: '2026-11-05T18:30:00Z', score: 71, results: { likes: 612, saves: 38, newFollowers: 6 } },
    { format: 'carousel', title: 'Por qué mis fotos en película salían frías, y el arreglo', postedAt: '2026-10-22T18:30:00Z', score: 84, results: { likes: 540, saves: 410, newFollowers: 52 } },
    { format: 'photo', title: 'Mirador al atardecer', postedAt: '2026-10-13T18:30:00Z', score: null, results: { likes: 388, saves: 21, newFollowers: 2 } },
    { format: 'reel', title: 'Cargar una Leica M6 en 20 segundos', postedAt: '2026-10-01T18:30:00Z', score: 77, results: { likes: 455, saves: 162, newFollowers: 19 } },
    { format: 'carousel', title: 'Alfama a las 7, diez fotos en Portra 400', postedAt: '2026-09-10T18:30:00Z', score: 74, results: { likes: 498, saves: 203, newFollowers: 31 } },
    { format: 'reel', title: 'Revelando un carrete en mi cocina', postedAt: '2026-08-20T18:30:00Z', score: null, results: { likes: 301, saves: 44, newFollowers: 4 } },
  ],
  insights: {
    winners: [
      { post: 'P1', why: 'Un sujeto claro (el tranvía) contra un cielo sencillo, con luz baja y cálida. Tuvo más me gusta y más compartidos del grupo, porque se entiende en un instante en el móvil.' },
      { post: 'P2', why: 'Una cara en un portal con la calle llevando hacia ella. Las fotos encuadradas así tuvieron cerca del doble de guardados que tus planos abiertos.' },
    ],
    losers: [
      { post: 'P3', why: 'Un plano abierto a mediodía: luz plana y ningún sujeto. Bonito de ver, pero tuvo un tercio de los me gusta de P1 y casi ningún compartido.' },
    ],
    patterns: [
      'Los sujetos encuadrados con luz baja y cálida ganan a los planos abiertos con luz plana, en todos los meses de la exportación.',
      'Tus publicaciones con un lugar reconocible de Lisboa en la primera foto se compartieron más que las demás.',
      'Los carruseles que empiezan con tu mejor foto mantienen a la gente deslizando; los que empiezan con un plano abierto la pierden tras la diapositiva 2.',
    ],
    shootNext: [
      { what: 'Un tranvía o una persona enmarcados por un portal o un arco, una hora antes del atardecer', why: 'Repite lo que hizo funcionar P1 y P2: un sujeto, luz baja y cálida.' },
      { what: 'La misma calle a las 7 y a las 19, para un carrusel de dos diapositivas', why: 'Los pares de antes y después son fáciles de guardar y compartir.' },
    ],
    cropAndCarousel: ['Recorta la primera diapositiva a 4:5 para que llene la pantalla del móvil.', 'Pon primero la foto encuadrada y al final el plano más abierto.'],
    tips: [
      { post: 'P1', tip: 'Conviértelo en una serie semanal: un tranvía, un arco, la misma hora.' },
      { post: 'P2', tip: 'Dispara el portal un paso más cerca para que la cara ocupe un tercio del encuadre.' },
      { post: 'P3', tip: 'Vuelve a esta vista una hora antes del atardecer y pon a una persona en ella.' },
    ],
    memoryNotes: [],
  },
  goalNote: 'Pusiste la meta de 2.000 seguidores para el 31 de marzo de 2027 cuando tenías 1.158. Vas por 1.240. A tu ritmo medio desde junio (unos 4 por semana) llegarías hacia 2030. A tu ritmo de octubre (unos 17 por semana) llegarías en septiembre de 2027, así que el coach sugiere mover la fecha a septiembre y mantener ese ritmo.',
  memory: '## Sobre ti\n- Fotógrafa analógica en Lisboa, usa Portra 400 y una Leica M6\n- Publica martes, jueves y sábado a las 18:30\n## Lo que funciona\n- 2026-10-24 Los carruseles que enseñan (problema, causa, arreglo) traen más seguidores: 52 el 22 de oct\n- 2026-10-03 Los Reels cortos que enseñan una cosa funcionan: 19 seguidores en 20 segundos\n- 2026-11-07 El jueves es el día en que te encuentran (32% de los seguidores)\n## Lo que no\n- 2026-11-07 Las fotos sueltas bonitas reciben me gusta pero pocos seguidores (6 el 5 de nov)\n- 2026-09-01 Los meses tranquilos de verano cuestan seguidores: 1 publicación en jul y ago\n## Notas\n- 2026-11-20 La meta de 2.000 para marzo no se alcanza a este ritmo; se sugirió septiembre',
};
