import type { AppLocale } from '@/i18n/routing';

export interface TermsContent {
  eyebrow: string;
  headline: string;
  lastUpdated: string;
  s1Title: string; s1Body: string;
  s2Title: string; s2Body: string;
  s3Title: string; s3Body: string;
  s4Title: string; s4Pre: string; s4LinkLabel: string; s4Post: string;
  s5Title: string; s5Pre: string; s5LinkLabel: string; s5Post: string;
  s6Title: string; s6Body: string;
  s7Title: string; s7Body: string;
  s8Title: string; s8Body: string;
  s9Title: string; s9Pre: string;
  backToHome: string;
}

const EN: TermsContent = {
  eyebrow: 'LEGAL',
  headline: 'Terms of Service',
  lastUpdated: 'Last updated: November 28, 2026',
  s1Title: '1. Acceptance of Terms',
  s1Body: 'By accessing or using WhoUnfollowed, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.',
  s2Title: '2. Description of Service',
  s2Body: 'WhoUnfollowed is a client-side tool that allows users to parse their own Instagram and Threads data exports to compare follower and following lists. The core functionality runs entirely in your browser.',
  s3Title: '3. User Responsibilities',
  s3Body: 'You are responsible for obtaining your own data from Instagram or Threads and for any actions you take based on the information provided by WhoUnfollowed. WhoUnfollowed is not responsible for any actions taken against your Instagram or Threads account by Meta.',
  s4Title: '4. Privacy & Data',
  s4Pre: 'Your privacy is important to us. Please review our',
  s4LinkLabel: 'Privacy Policy',
  s4Post: 'to understand how we handle your information.',
  s5Title: '5. Pro AI and Lifetime',
  s5Pre: 'WhoUnfollowed Pro AI is an optional paid subscription that adds a coach and other features, including AI features. Pro AI is in beta. It is new, so during the beta some features may be slow, give poor answers or stop working for a while, and we may change how they work as we improve them. By subscribing you accept that issues like these can happen during the beta. When something breaks, we fix it as quickly as we can and tell you what happened, and we will never change your plan, price or allowance without telling you first. The beta does not limit your legal rights, including any right to cancel or to a refund that the law gives you. It renews automatically each month or each year, at the price shown when you subscribed, until you cancel. Before a yearly plan renews, we email you a reminder with the date and the amount. You can cancel at any time from your account page; you keep access until the end of the period you already paid for, and we do not refund partial periods except where the law requires it. If you subscribed at a launch price, you keep that price for as long as your subscription continues. Pro AI includes a generous monthly allowance of coach use. How much each request uses depends on its size: how much of your account the coach reads and how long the answer is. A fair daily pace limit also applies, so a single day cannot use up the whole month. If you use up the month, it starts again with your next period, or you can buy a Refill: one more month of coach use for half the monthly price. A Refill is a one-time payment, is available only while you have Pro AI, is used after your monthly allowance and stays valid for 12 months. We may raise the allowance at any time. We will not quietly reduce it, and we will announce any change before it applies. AI output is generated automatically and can be wrong; you decide what you post and are responsible for it. Pro AI, Refills and Lifetime start as soon as you pay, because at checkout you ask us to start right away. Where the law gives you a right to cancel an online purchase (14 days in the EU and the UK, 7 days in Brazil), you keep it, as our Refund Policy explains. One-time Pro unlocks bought before Pro AI keep working until they expire. Goal check-in emails and the weekly brief are optional and can be turned off at any time. For a limited time we also offer a one-time Lifetime ("Insider") purchase that gives Pro access with no expiry date. Lifetime means the lifetime of the Pro service. Lifetime includes the base paid plan, currently Pro AI, with its monthly coach allowance, for as long as WhoUnfollowed offers the service. Higher plans or add-ons we introduce later are not part of Lifetime. Insiders may be offered them at a discount. Insiders also receive a badge and title, and Pro features on future tools we release, on terms we will announce with each tool. AI features that use a usage allowance are not part of this benefit. If you opt in at checkout, we may email you about those future products. You can withdraw that consent at any time from your account page. Please refer to our',
  s5LinkLabel: 'Refund Policy',
  s5Post: 'for information regarding refunds.',
  s6Title: '6. Disclaimer of Warranties',
  s6Body: 'The service is provided "as is" and "as available" without any warranties of any kind. We do not guarantee that the service will be uninterrupted or error-free.',
  s7Title: '7. Limitation of Liability',
  s7Body: 'To the maximum extent permitted by law, WhoUnfollowed shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.',
  s8Title: '8. Modifications to Terms',
  s8Body: 'We reserve the right to modify these terms at any time. Your continued use of the service after such modifications constitutes your acceptance of the new terms.',
  s9Title: '9. Contact',
  s9Pre: 'If you have any questions about these Terms, please contact us at',
  backToHome: 'Back to WhoUnfollowed',
};

const ES: TermsContent = {
  eyebrow: 'LEGAL',
  headline: 'Términos de Servicio',
  lastUpdated: 'Última actualización: 28 de noviembre de 2026',
  s1Title: '1. Aceptación de los Términos',
  s1Body: 'Al acceder o usar WhoUnfollowed, aceptas quedar sujeto a estos Términos de Servicio. Si no estás de acuerdo con estos términos, no uses el servicio.',
  s2Title: '2. Descripción del Servicio',
  s2Body: 'WhoUnfollowed es una herramienta del lado del cliente que permite a los usuarios analizar sus propias exportaciones de datos de Instagram y Threads para comparar listas de seguidores y seguidos. La funcionalidad principal se ejecuta por completo en tu navegador.',
  s3Title: '3. Responsabilidades del usuario',
  s3Body: 'Eres responsable de obtener tus propios datos de Instagram o Threads y de cualquier acción que tomes basándote en la información proporcionada por WhoUnfollowed. WhoUnfollowed no es responsable de ninguna acción tomada contra tu cuenta de Instagram o Threads por parte de Meta.',
  s4Title: '4. Privacidad y datos',
  s4Pre: 'Tu privacidad es importante para nosotros. Por favor revisa nuestra',
  s4LinkLabel: 'Política de Privacidad',
  s4Post: 'para entender cómo manejamos tu información.',
  s5Title: '5. Pro AI y Lifetime',
  s5Pre: 'WhoUnfollowed Pro AI es una suscripción opcional de pago que añade un coach y otras funciones, incluidas funciones de IA. Pro AI está en beta. Es nuevo, así que durante la beta algunas funciones pueden ir lentas, dar respuestas flojas o dejar de funcionar un tiempo, y podemos cambiar cómo funcionan a medida que las mejoramos. Al suscribirte aceptas que durante la beta pueden pasar cosas así. Cuando algo falle, lo arreglaremos lo antes posible y te contaremos qué pasó, y nunca cambiaremos tu plan, tu precio ni tu uso mensual sin avisarte antes. La beta no limita tus derechos legales, incluido cualquier derecho a cancelar o a un reembolso que te dé la ley. Se renueva automáticamente cada mes o cada año, al precio que viste al suscribirte, hasta que la canceles. Antes de que se renueve un plan anual, te enviamos un correo con la fecha y el importe. Puedes cancelar cuando quieras desde tu página de cuenta; mantienes el acceso hasta el final del período que ya pagaste, y no reembolsamos períodos parciales salvo cuando la ley lo exija. Si te suscribiste a un precio de lanzamiento, lo mantienes mientras tu suscripción continúe. Pro AI incluye un uso mensual generoso del coach. Lo que usa cada petición depende de su tamaño: cuánto de tu cuenta lee el coach y qué tan larga es la respuesta. También hay un límite diario razonable, para que un solo día no gaste todo el mes. Si usas todo el mes, vuelve a empezar con tu siguiente período, o puedes comprar una Recarga: un mes más de uso del coach por la mitad del precio mensual. Una Recarga es un pago único, solo está disponible mientras tengas Pro AI, se usa después de tu uso mensual y vale durante 12 meses. Podemos aumentar el uso incluido en cualquier momento. No lo reduciremos en silencio y anunciaremos cualquier cambio antes de que se aplique. El contenido de la IA se genera automáticamente y puede contener errores; tú decides qué publicas y eres responsable de ello. Pro AI, las Recargas y Lifetime empiezan en cuanto pagas, porque al pagar nos pides que empecemos de inmediato. Cuando la ley te da derecho a cancelar una compra en línea (14 días en la UE y el Reino Unido, 7 días en Brasil), lo conservas, como explica nuestra Política de Reembolsos. Los desbloqueos únicos de Pro comprados antes de Pro AI siguen funcionando hasta que vencen. Los correos de seguimiento de objetivos y el resumen semanal son opcionales y puedes desactivarlos cuando quieras. Por tiempo limitado también ofrecemos una compra única Lifetime ("Insider") que da acceso Pro sin fecha de vencimiento. Lifetime significa la vida útil del servicio Pro. Lifetime incluye el plan pago base, hoy Pro AI, con su uso mensual del coach, mientras WhoUnfollowed ofrezca el servicio. Los planes superiores o complementos que agreguemos más adelante no forman parte de Lifetime. Podemos ofrecérselos a los Insiders con descuento. Los Insiders también reciben una insignia y un título, y funciones Pro en futuras herramientas que lancemos, en los términos que anunciaremos con cada una. Las funciones de IA que usan un uso incluido no forman parte de este beneficio. Si lo aceptas al pagar, podremos enviarte correos sobre esos futuros productos. Puedes retirar ese consentimiento en cualquier momento desde tu página de cuenta. Consulta nuestra',
  s5LinkLabel: 'Política de Reembolsos',
  s5Post: 'para información sobre reembolsos.',
  s6Title: '6. Exención de garantías',
  s6Body: 'El servicio se proporciona "tal cual" y "según disponibilidad" sin garantías de ningún tipo. No garantizamos que el servicio esté libre de interrupciones o errores.',
  s7Title: '7. Limitación de responsabilidad',
  s7Body: 'En la máxima medida permitida por la ley, WhoUnfollowed no será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo derivado del uso del servicio.',
  s8Title: '8. Modificaciones de los Términos',
  s8Body: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado del servicio después de dichas modificaciones constituye tu aceptación de los nuevos términos.',
  s9Title: '9. Contacto',
  s9Pre: 'Si tienes alguna pregunta sobre estos Términos, contáctanos en',
  backToHome: 'Volver a WhoUnfollowed',
};

const PT: TermsContent = {
  eyebrow: 'LEGAL',
  headline: 'Termos de Serviço',
  lastUpdated: 'Última atualização: 28 de novembro de 2026',
  s1Title: '1. Aceitação dos Termos',
  s1Body: 'Ao acessar ou usar o WhoUnfollowed, você concorda em ficar vinculado a estes Termos de Serviço. Se você não concorda com estes termos, não use o serviço.',
  s2Title: '2. Descrição do Serviço',
  s2Body: 'O WhoUnfollowed é uma ferramenta do lado do cliente que permite aos usuários analisar suas próprias exportações de dados do Instagram e do Threads para comparar listas de seguidores e seguidos. A funcionalidade principal roda inteiramente no seu navegador.',
  s3Title: '3. Responsabilidades do usuário',
  s3Body: 'Você é responsável por obter seus próprios dados do Instagram ou do Threads e por quaisquer ações que tomar com base nas informações fornecidas pelo WhoUnfollowed. O WhoUnfollowed não é responsável por quaisquer ações tomadas contra sua conta do Instagram ou do Threads pela Meta.',
  s4Title: '4. Privacidade e Dados',
  s4Pre: 'Sua privacidade é importante para nós. Por favor, revise nossa',
  s4LinkLabel: 'Política de Privacidade',
  s4Post: 'para entender como tratamos suas informações.',
  s5Title: '5. Pro AI e Lifetime',
  s5Pre: 'O WhoUnfollowed Pro AI é uma assinatura paga opcional que adiciona um coach e outros recursos, incluindo recursos de IA. O Pro AI está em beta. Ele é novo, então durante a beta alguns recursos podem ficar lentos, dar respostas fracas ou parar de funcionar por um tempo, e podemos mudar como funcionam à medida que os melhoramos. Ao assinar, você aceita que coisas assim podem acontecer durante a beta. Quando algo quebrar, vamos corrigir o mais rápido possível e contar o que aconteceu, e nunca vamos mudar seu plano, seu preço ou seu uso mensal sem avisar antes. A beta não limita seus direitos legais, incluindo qualquer direito de cancelar ou de reembolso que a lei lhe dê. Ela renova automaticamente a cada mês ou a cada ano, pelo preço mostrado quando você assinou, até você cancelar. Antes de um plano anual renovar, enviamos um e-mail com a data e o valor. Você pode cancelar quando quiser na página da sua conta; você mantém o acesso até o fim do período já pago, e não reembolsamos períodos parciais, exceto quando a lei exigir. Se você assinou com um preço de lançamento, mantém esse preço enquanto sua assinatura continuar. O Pro AI inclui um uso mensal generoso do coach. O quanto cada pedido usa depende do tamanho dele: quanto da sua conta o coach lê e o tamanho da resposta. Também há um limite diário razoável, para que um único dia não gaste o mês inteiro. Se você usar todo o mês, ele recomeça no seu próximo período, ou você pode comprar uma Recarga: mais um mês de uso do coach pela metade do preço mensal. Uma Recarga é um pagamento único, só está disponível enquanto você tiver o Pro AI, é usada depois do seu uso mensal e vale por 12 meses. Podemos aumentar o uso incluído a qualquer momento. Não vamos reduzi-lo em silêncio e avisaremos qualquer mudança antes que ela valha. O conteúdo da IA é gerado automaticamente e pode ter erros; você decide o que publica e é responsável por isso. O Pro AI, as Recargas e o Lifetime começam assim que você paga, porque no checkout você nos pede para começar na hora. Quando a lei te dá o direito de cancelar uma compra online (14 dias na UE e no Reino Unido, 7 dias no Brasil), você o mantém, como explica nossa Política de Reembolso. Os desbloqueios únicos do Pro comprados antes do Pro AI continuam funcionando até vencerem. Os e-mails de acompanhamento de metas e o resumo semanal são opcionais e podem ser desligados a qualquer momento. Por tempo limitado também oferecemos uma compra única Lifetime ("Insider") que dá acesso Pro sem data de vencimento. Lifetime significa a vida útil do serviço Pro. O Lifetime inclui o plano pago base, hoje o Pro AI, com o seu uso mensal do coach, enquanto o WhoUnfollowed oferecer o serviço. Planos superiores ou complementos que lançarmos depois não fazem parte do Lifetime. Podemos oferecê-los aos Insiders com desconto. Os Insiders também recebem um selo e um título, e recursos Pro em futuras ferramentas que lançarmos, nos termos que anunciaremos com cada uma. Recursos de IA que usam um uso incluído não fazem parte deste benefício. Se você optar no checkout, poderemos enviar e-mails sobre esses futuros produtos. Você pode retirar esse consentimento a qualquer momento na sua página de conta. Consulte nossa',
  s5LinkLabel: 'Política de Reembolso',
  s5Post: 'para informações sobre reembolsos.',
  s6Title: '6. Isenção de garantias',
  s6Body: 'O serviço é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo. Não garantimos que o serviço será ininterrupto ou livre de erros.',
  s7Title: '7. Limitação de responsabilidade',
  s7Body: 'Na máxima extensão permitida por lei, o WhoUnfollowed não será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos resultantes do uso do serviço.',
  s8Title: '8. Modificações dos Termos',
  s8Body: 'Reservamo-nos o direito de modificar estes termos a qualquer momento. O uso continuado do serviço após tais modificações constitui sua aceitação dos novos termos.',
  s9Title: '9. Contato',
  s9Pre: 'Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco em',
  backToHome: 'Voltar ao WhoUnfollowed',
};

export function getTermsContent(locale: AppLocale): TermsContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
