import type { SampleCoach } from './types';

// A mesma conta de exemplo de en.ts, em português. Sem travessões.
export const pt: SampleCoach = {
  read: {
    headline: 'Seus carrosséis que ensinam trazem seguidores. Suas fotos mais bonitas, quase nunca.',
    happening: [
      'Desde a sua exportação de junho, 113 pessoas começaram a te seguir e 31 saíram: você ganhou 82. Quase metade das novas (52) chegou nos três dias depois do seu carrossel de 22 de outubro sobre por que o filme sai frio.',
      'Outubro foi o seu melhor mês em nove anos: 72 seguidores novos. Julho e agosto trouxeram menos de dez, e você postou uma vez só nesses dois meses.',
      '32% dos seus seguidores te encontraram numa quinta-feira, o dia em que seus carrosséis saem. Nenhum dos 31 que saíram chegou com seus posts de outono: as pessoas novas estão ficando.',
    ],
    stop: { what: 'Postar uma foto bonita sozinha, sem história', why: 'Sua foto do Elétrico 28 de 5 de novembro teve as melhores curtidas do outono e 6 seguidores novos. Os dois carrosséis que ensinam, antes e depois, trouxeram 31 e 52. Gostam das suas fotos, mas seguem você pelo que você explica.' },
    try: [
      { what: 'Transforme um filme num carrossel de "o que deu errado e como resolvi" a cada duas quintas', why: 'Esse formato trouxe 52 seguidores em 22 de outubro, seu melhor post desde 2017. Repita o formato, não o tema.' },
      { what: 'Cancele os 23 pedidos para seguir que ainda estão esperando', why: 'Foi você quem enviou, o mais antigo em abril de 2021. Ninguém vai aceitar agora, e eles fazem a sua lista de seguindo parecer maior do que é.' },
      { what: 'Revise as 41 contas que você seguiu numa semana de março de 2022', why: '41 das 87 pessoas que não te seguem de volta são daquela única semana. É uma passada rápida, não 87 decisões.' },
    ],
    memoryNotes: [],
  },
  chats: [
    {
      title: 'Por que gente saiu depois do verão?',
      turns: [{
        q: 'Por que gente saiu depois do verão?',
        a: {
          answer: 'Saiu menos gente do que parece. Entre as suas exportações de junho e novembro, 31 pessoas deixaram de te seguir, contra 37 nos quatro meses anteriores. O que mudou foi quem saiu:\n- Os 31 já te seguiam antes de junho. Ninguém que chegou com seus carrosséis de outono saiu.\n- Você postou uma vez só em julho e agosto. Quem te achou por posts antigos não tinha nada novo para ficar.\n- Nenhum dos 31 era alguém que você segue, então você não perdeu mútuos.\nO buraco foram meses quietos, não posts ruins. Seu plano mantém dois posts por semana nas festas para não se repetir.',
          followUps: ['Quem saiu, e deixo de seguir de volta?', 'Como continuar postando num mês corrido?'],
          memoryNotes: [],
        },
      }],
    },
    {
      title: 'Devo postar mais Reels?',
      turns: [{
        q: 'Todo mundo fala de Reels. Devo postar mais?',
        a: {
          answer: 'Não mais Reels só por serem Reels. Olhe o que você registrou:\n- Reel de 1 de outubro, colocando filme numa Leica M6 em 20 segundos: 19 seguidores novos.\n- Carrossel de 22 de outubro, por que seu filme saía frio: 52 seguidores novos e 410 salvamentos.\n- Foto única de 5 de novembro, Elétrico 28 na hora azul: 6 seguidores novos.\nSeu Reel foi bem porque ensinava algo em 20 segundos, pelo mesmo motivo do carrossel. Então mantenha um Reel curto por semana, e faça dele um momento do carrossel daquela quinta: a mesma ideia, dois formatos, um só trabalho.',
          followUps: ['Escreva o Reel desta quinta', 'O que o próximo carrossel deve ensinar?'],
          memoryNotes: [],
        },
      }],
    },
    {
      title: 'Vou chegar a 2.000?',
      turns: [{
        q: 'Vou chegar a 2.000 até o fim de março?',
        a: {
          answer: 'No ritmo atual, não, e é melhor saber agora.\n- Faltam 760 seguidores em umas 19 semanas: 40 por semana.\n- Desde junho você teve uns 4 por semana. Em outubro, seu melhor mês, foram uns 17 por semana.\nDuas opções honestas:\n- Manter março e postar dois carrosséis que ensinam por semana. Mesmo no seu ritmo de outubro, você chegaria perto de 1.550.\n- Mudar a data para setembro de 2027 e manter três posts por semana. Isso pede uns 17 por semana: o seu ritmo de outubro.\nEu mudaria a data. Se quiser, refaço os check-ins da meta para setembro.',
          followUps: ['Mude minha meta para setembro', 'Planeje dois carrosséis por semana'],
          memoryNotes: [],
        },
      }],
    },
  ],
  sampleReply: {
    answer: 'Esta é a conta de exemplo, então esta resposta é um exemplo. Com a sua própria exportação, o coach lê seus seguidores, quem chegou e quem saiu entre exportações, os posts que você registrou e o que ele lembra de você, e responde com as suas palavras.\nAbra uma das conversas de exemplo à esquerda para ver como ele usa isso.',
    followUps: ['Por que gente saiu depois do verão?', 'Devo postar mais Reels?'],
    memoryNotes: [],
  },
  draft: {
    topic: 'Por que minhas fotos de Sintra saíram verdes e como resolvi o filme seguinte',
    options: [
      {
        text: 'Meu filme de Sintra saiu verde. Aqui está o que deu errado, e a única mudança que resolveu o seguinte.\n\nSlide 1: "Meu filme de Sintra saiu verde." A pior foto, em tamanho cheio.\nSlide 2: A causa. Sombra de floresta e Portra 400 na sensibilidade nominal: pouca luz, e as sombras ficam verdes.\nSlide 3: O sinal. Verde nas sombras, cor normal no céu.\nSlide 4: A solução. Expor a 200 e medir para as sombras.\nSlide 5: O filme seguinte, mesmo caminho, mesma hora.\nSlide 6: "Salve antes do seu próximo passeio na floresta."\n\nLegenda:\nMeu filme de Sintra saiu verde, e não foi culpa do laboratório. A sombra debaixo das árvores é mais escura do que parece, e o Portra a 400 não perdoa. No filme seguinte expus a 200 e medi para as sombras. O slide 5 é a diferença.\nQual é o filme em que você ainda pensa?\n\nHashtags: de 3 a 5, específicas, no fim: #portra400 #fotografiaanalogica #shootfilm #sintra\n\nTexto alternativo, slide 1: Um caminho de floresta em Sintra em filme, com um tom verde forte nas sombras.',
        why: 'O mesmo formato do seu carrossel de 22 de outubro (problema, causa, solução), que trouxe 52 seguidores. Termina com uma pergunta, o que faltava nos seus posts.',
      },
      {
        text: 'Sombras verdes no filme não são culpa do laboratório. Seis slides sobre por que acontece e o único ajuste que mudei.\n\nLegenda:\nSintra, dois filmes, o mesmo caminho. O primeiro saiu verde, o segundo não. A única mudança: expus o Portra a 200 em vez de 400 e medi para a sombra. Se suas fotos de floresta saem doentes, teste no próximo filme.\nQual das duas você teria postado?',
        why: 'Começa pela lição, para quem rola rápido. Um pouco menos pessoal, então é uma boa segunda opção.',
      },
      {
        text: 'Quase joguei este filme fora.\n\nLegenda:\nVerde. Todas as fotos de Sintra voltaram verdes. Levei uma semana para entender por quê, e um ajuste para resolver. Arraste para ver os dois filmes lado a lado.\nVocê já guardou um filme que odiava?',
        why: 'Curto e pessoal, na sua voz de sempre. Melhor se você quer um post mais quieto entre dois carrosséis que ensinam.',
      },
    ],
  },
  check: {
    format: 'carousel',
    hook: 'Algumas fotos de Sintra do fim de semana passado',
    caption: 'Algumas fotos de Sintra do fim de semana passado. Feitas com Portra 400. A luz na floresta estava incrível. #film #35mm #fotografia #sintra #portugal #viagem #analogico #filmisnotdead #portra #shootfilm #ishootfilm #fotografiadeviagem',
    result: {
      overall: 58,
      scores: [
        { criterion: 'hook', score: 4, reason: 'Seus posts: aberturas que só descrevem ("Elétrico 28 na hora azul") trouxeram de 2 a 6 seguidores; sua abertura com o problema em 22 de outubro trouxe 52.' },
        { criterion: 'clarity', score: 7, reason: 'Um lugar, um filme, fácil de seguir. Falta o porquê do post, então as fotos parecem um conjunto, não uma história.' },
        { criterion: 'value', score: 5, reason: 'Orientação da plataforma: salvam o que querem usar de novo. Nada aqui ajuda a próxima pessoa numa floresta com filme.' },
        { criterion: 'fit_you', score: 8, reason: 'Seus posts: Portugal em Portra é o que seus seguidores vieram ver. A estética está certa, o ângulo não.' },
        { criterion: 'fit_trend', score: 6, reason: 'Orientação da plataforma: carrosséis que ensinam estão indo bem em fotografia este mês (resumo semanal, 23 de nov).' },
        { criterion: 'action', score: 5, reason: 'Sem pergunta e com 12 hashtags genéricas. Nada convida a responder, salvar ou voltar na quinta.' },
      ],
      fixes: [
        { what: 'Comece pelo que deu errado: "Meu filme de Sintra saiu verde."', why: 'Um problema na primeira linha é o seu gancho mais forte: 52 seguidores em 22 de outubro.' },
        { what: 'Adicione um slide com a solução e termine com uma pergunta', why: 'Transforma um conjunto de fotos em algo que as pessoas salvam e respondem.' },
        { what: 'Fique com 4 hashtags específicas e tire as outras 8', why: 'Genéricas como #fotografia te escondem entre milhões de posts. As específicas chegam a quem fotografa em filme.' },
      ],
      altHooks: ['Meu filme de Sintra saiu verde. Esta é a solução.', 'A mesma floresta, dois filmes, um ajuste diferente.'],
      caption: 'Meu filme de Sintra saiu verde, e não foi culpa do laboratório. A sombra debaixo das árvores é mais escura do que parece, então no filme seguinte expus o Portra a 200 e medi para as sombras. O slide 5 é a diferença.\nQual é o filme em que você ainda pensa?\n#portra400 #fotografiaanalogica #shootfilm #sintra',
      cover: ['O primeiro slide é a foto verde: ótimo, mostra o problema. Deixe o texto com pelo menos 1/12 da altura para ler no celular.'],
      memoryNotes: [],
    },
  },
  ideas: {
    theme: '',
    ideas: [
      { format: 'carousel', idea: 'Três filmes que deram errado este ano e a solução de cada um', hook: 'Três filmes que quase joguei fora.', why: 'Seu carrossel de "o que deu errado" de 22 de outubro trouxe 52 seguidores, seu melhor post desde 2017.' },
      { format: 'reel', idea: 'Portra a 200 contra 400, a mesma rua, em tela dividida', hook: 'A mesma rua. Um ajuste.', why: 'Seu Reel de 20 segundos com a Leica trouxe 19 seguidores: Reels curtos que ensinam funcionam para você.' },
      { format: 'carousel', idea: 'Alfama às 7 da manhã, dez fotos, com os ajustes em cada slide', hook: 'Alfama antes de alguém acordar.', why: 'Seu carrossel de Alfama de 10 de setembro trouxe 31 seguidores. Com os ajustes, vira algo que as pessoas salvam.' },
      { format: 'story', idea: 'Uma enquete: qual de duas fotos vira a capa de quinta', hook: 'Esquerda ou direita para quinta?', why: '32% dos seus seguidores te encontraram numa quinta. Uma enquete na terça aquece essas pessoas.' },
      { format: 'photo', idea: 'Uma foto do seu filme mais antigo, com o que você faria diferente hoje', hook: 'Nove anos entre estas duas fotos.', why: 'Seu seguidor mais antigo está aqui desde fevereiro de 2017. Olhar para trás dá a quem ficou um motivo para comentar.' },
    ],
  },
  plan: {
    summary: 'Duas semanas montadas sobre o que te traz seguidores: um carrossel que ensina toda quinta, um Reel curto que o reaproveita na terça e uma foto mais quieta no sábado. Os lembretes saem às 18:30 em cada dia de post.',
    principles: ['Quinta é para carrosséis que ensinam: problema, causa, solução', 'Terça reaproveita a ideia de quinta num Reel de 20 segundos', 'Sábado é uma foto só, com uma pergunta, sem pressão', 'Termine todo post com uma pergunta de verdade'],
    weeks: [1, 2, 3, 4].map((week) => ({
      week,
      theme: ['O que deu errado', 'Por trás dos ajustes', 'Lisboa cedo', 'Suas perguntas'][week - 1]!,
      posts: [
        { day: 'Ter', format: 'reel' as const, idea: ['Portra a 200 contra 400, lado a lado', 'Medir para a sombra em 20 segundos', 'Alfama às 7 em 15 segundos', 'Respondo a pergunta mais feita'][week - 1]!, hook: ['A mesma rua. Um ajuste.', 'Meça aqui, não ali.', 'Antes de alguém acordar.', 'Vocês perguntaram, então aqui está.'][week - 1]! },
        { day: 'Qui', format: 'carousel' as const, idea: ['Meu filme de Sintra saiu verde, e a solução', 'Cinco ajustes que confiro antes de cada filme', 'Alfama às 7, dez fotos com ajustes', 'Três perguntas de vocês, respondidas com meus filmes'][week - 1]!, hook: ['Meu filme de Sintra saiu verde.', 'Os cinco números que olho primeiro.', 'Alfama antes de alguém acordar.', 'Suas três perguntas, meus três filmes.'][week - 1]! },
        { day: 'Sáb', format: 'photo' as const, idea: ['Uma foto do filme verde de que ainda gosto', 'Uma foto que saiu certa de primeira', 'Elétrico 28 na hora azul, com uma pergunta', 'A foto mais antiga do meu celular'][week - 1]!, hook: ['Guardei esta mesmo assim.', 'De primeira, para variar.', 'Qual é a sua parada?', 'Nove anos atrás.'][week - 1]! },
      ],
    })),
    memoryNotes: [],
  },
  posted: [
    { format: 'photo', title: 'Elétrico 28 na hora azul', postedAt: '2026-11-05T18:30:00Z', score: 71, results: { likes: 612, saves: 38, newFollowers: 6 } },
    { format: 'carousel', title: 'Por que minhas fotos em filme saíam frias, e a solução', postedAt: '2026-10-22T18:30:00Z', score: 84, results: { likes: 540, saves: 410, newFollowers: 52 } },
    { format: 'photo', title: 'Miradouro ao entardecer', postedAt: '2026-10-13T18:30:00Z', score: null, results: { likes: 388, saves: 21, newFollowers: 2 } },
    { format: 'reel', title: 'Colocando filme numa Leica M6 em 20 segundos', postedAt: '2026-10-01T18:30:00Z', score: 77, results: { likes: 455, saves: 162, newFollowers: 19 } },
    { format: 'carousel', title: 'Alfama às 7, dez fotos em Portra 400', postedAt: '2026-09-10T18:30:00Z', score: 74, results: { likes: 498, saves: 203, newFollowers: 31 } },
    { format: 'reel', title: 'Revelando um filme na minha cozinha', postedAt: '2026-08-20T18:30:00Z', score: null, results: { likes: 301, saves: 44, newFollowers: 4 } },
  ],
  insights: {
    winners: [
      { post: 'P1', why: 'Um assunto claro (o elétrico) contra um céu simples, com luz baixa e quente. Teve mais curtidas e compartilhamentos do grupo, porque se entende num instante no celular.' },
      { post: 'P2', why: 'Um rosto numa porta com a rua levando até ele. Fotos enquadradas assim tiveram cerca do dobro de salvamentos dos seus planos abertos.' },
    ],
    losers: [
      { post: 'P3', why: 'Um plano aberto ao meio-dia: luz chapada e nenhum assunto. Bonito de ver, mas teve um terço das curtidas de P1 e quase nenhum compartilhamento.' },
    ],
    patterns: [
      'Assuntos enquadrados com luz baixa e quente vencem planos abertos com luz chapada, em todos os meses da exportação.',
      'Seus posts com um lugar reconhecível de Lisboa na primeira foto foram mais compartilhados que os outros.',
      'Carrosséis que abrem com a sua melhor foto mantêm as pessoas arrastando; os que abrem com um plano aberto perdem gente depois do slide 2.',
    ],
    shootNext: [
      { what: 'Um elétrico ou uma pessoa emoldurados por uma porta ou um arco, uma hora antes do pôr do sol', why: 'Repete o que fez P1 e P2 funcionarem: um assunto, luz baixa e quente.' },
      { what: 'A mesma rua às 7 e às 19, para um carrossel de dois slides', why: 'Pares de antes e depois são fáceis de salvar e compartilhar.' },
    ],
    cropAndCarousel: ['Corte o primeiro slide em 4:5 para encher a tela do celular.', 'Coloque a foto enquadrada primeiro e o plano mais aberto por último.'],
    tips: [
      { post: 'P1', tip: 'Transforme isso numa série semanal: um bonde, um arco, a mesma hora.' },
      { post: 'P2', tip: 'Fotografe a porta um passo mais perto para o rosto ocupar um terço do quadro.' },
      { post: 'P3', tip: 'Volte a esta vista uma hora antes do pôr do sol e coloque uma pessoa nela.' },
    ],
    memoryNotes: [],
  },
  goalNote: 'Você definiu a meta de 2.000 seguidores até 31 de março de 2027 quando tinha 1.158. Está com 1.240. No seu ritmo médio desde junho (uns 4 por semana), chegaria lá por volta de 2030. No seu ritmo de outubro (uns 17 por semana), chegaria em setembro de 2027, então o coach sugere mudar a data para setembro e manter esse ritmo.',
  memory: '## Sobre você\n- Fotógrafa analógica em Lisboa, usa Portra 400 e uma Leica M6\n- Posta terça, quinta e sábado às 18:30\n## O que funciona\n- 2026-10-24 Carrosséis que ensinam (problema, causa, solução) trazem mais seguidores: 52 em 22 de out\n- 2026-10-03 Reels curtos que ensinam uma coisa funcionam: 19 seguidores em 20 segundos\n- 2026-11-07 Quinta é o dia em que te encontram (32% dos seguidores)\n## O que não funciona\n- 2026-11-07 Fotos únicas bonitas recebem curtidas mas poucos seguidores (6 em 5 de nov)\n- 2026-09-01 Meses quietos de verão custam seguidores: 1 post em jul e ago\n## Notas\n- 2026-11-20 A meta de 2.000 para março não é alcançável neste ritmo; sugerido setembro',
};
