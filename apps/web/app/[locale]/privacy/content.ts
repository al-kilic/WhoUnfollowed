import type { AppLocale } from '@/i18n/routing';

export interface PrivacyContent {
  eyebrow: string;
  headline: string;
  dates: string;
  disclaimerBold: string;
  disclaimerRest: string;
  tldrLabel: string;
  tldrBody: string;
  s1Title: string; s1Body: string;
  s2Title: string; s2Intro: string;
  legalBases: { label: string; text: string }[];
  s3Title: string; s3Body1: string; s3Body2: string;
  s4Title: string;
  neverCollect: string[];
  s5Title: string; s5Body1: string; s5Body2: string; s5Body3: string;
  s6Title: string; s6Body1: string; s6Body2: string;
  s7Title: string; s7Body1: string; s7Body2: string;
  s8Title: string; s8FreeLabel: string; s8FreeBody: string; s8ProLabel: string; s8ProBody: string;
  s9Title: string; s9Intro: string;
  gdprRights: string[];
  s9Outro: string;
  s10Title: string; s10Body: string;
  s11Title: string; s11Body: string;
  s12Title: string; s12Intro: string; s12Footer: string;
  backToHome: string;
}

const EN: PrivacyContent = {
  eyebrow: 'LEGAL',
  headline: 'Privacy Policy',
  dates: 'Effective date: April 28, 2026 · Last updated: August 31, 2026',
  disclaimerBold: 'WhoUnfollowed is an independent service.',
  disclaimerRest: 'It is not affiliated with, endorsed by, sponsored by, or in any way officially connected with Instagram, Meta Platforms, Inc., or any of their subsidiaries or affiliates. "Instagram" is a registered trademark of Meta Platforms, Inc. All references to Instagram are for descriptive purposes only.',
  tldrLabel: 'THE SHORT VERSION',
  tldrBody: 'By default, WhoUnfollowed collects nothing. Your Instagram data export is processed entirely within your browser. No data is transmitted to our servers. We cannot see what you upload or what results you receive.',
  s1Title: '1. About this Service',
  s1Body: 'WhoUnfollowed ("the Service," "we," "us") provides a tool that allows users to analyse their own Instagram data exports to identify follower and following relationships. The Service operates exclusively by processing data files that users have lawfully obtained directly from Instagram via Instagram\'s official data export feature, as permitted under applicable data protection legislation including GDPR Article 20 (Right to Data Portability).',
  s2Title: '2. Legal basis for data processing',
  s2Intro: 'Our processing relies on the following legal bases:',
  legalBases: [
    { label: 'Legitimate interest', text: 'Providing the analytical service you have explicitly requested.' },
    { label: 'GDPR Article 20', text: 'Supporting your right to receive and reuse your own personal data from a controller, in a structured, commonly used, and machine-readable format.' },
    { label: 'Performance of contract', text: 'Providing the features of the Pro tier to users who have purchased it.' },
  ],
  s3Title: '3. Data processed by the Service',
  s3Body1: 'When you use WhoUnfollowed, the data you provide (your Instagram export ZIP file) is processed exclusively within your own browser using client-side JavaScript. No file contents, follower lists, usernames, or any portion of the data export are transmitted to our servers at any time during the analysis process.',
  s3Body2: 'If you elect to save snapshots using the Free tier, those snapshots are stored exclusively in your browser\'s local IndexedDB storage on your device. We have no access to this data.',
  s4Title: '4. Data we do not collect',
  neverCollect: [
    'Instagram credentials, usernames, or passwords',
    'Follower lists, following lists, or any content from your data export',
    'The files you upload in any form',
    'Personal data beyond what is strictly necessary to provide the Pro tier service',
    'Tracking cookies, advertising identifiers, or cross-site tracking data',
  ],
  s5Title: '5. Pro tier data processing',
  s5Body1: 'Users who create a Pro account provide an email address and password. Passwords are hashed using argon2id and are never stored in plaintext. Snapshot data uploaded for cloud sync is encrypted client-side before transmission using a key derived from the user\'s password. This key is never stored on our servers, and we are technically unable to decrypt user snapshot data.',
  s5Body2: 'Pro account data is stored on infrastructure located within the European Union (Germany), and processing is governed by GDPR.',
  s5Body3: 'Pro is a one-time payment (not a recurring subscription) that unlocks access for a fixed period. Payments are handled by Stripe, our payment processor. You enter your card details directly with Stripe. Your full card number never reaches our servers, and we do not store it. We retain only a Stripe customer reference, the date your Pro access expires, and the email address on your account, which is the minimum needed to manage billing. Stripe processes your payment information under its own privacy policy and is PCI-DSS compliant.',
  s6Title: '6. Relationship with Meta and Instagram',
  s6Body1: 'WhoUnfollowed does not interact with Instagram\'s servers, APIs, or infrastructure in any way. The Service does not use Instagram\'s Graph API or any other Instagram or Meta API. Users obtain their own data directly from Instagram pursuant to Instagram\'s "Download Your Information" feature, which Instagram provides in compliance with GDPR Article 20.',
  s6Body2: 'WhoUnfollowed does not facilitate any action that violates Instagram\'s Terms of Service. The Service does not automate any interactions with Instagram, does not scrape Instagram, and does not perform any action on behalf of users within the Instagram platform.',
  s7Title: '7. Analytics',
  s7Body1: 'We use Umami, a privacy-friendly analytics tool we host ourselves on our own EU servers. It is cookieless, does not track you across other websites, and the data never leaves our infrastructure. We collect aggregate page views and anonymous product events (for example, which buttons get clicked) to understand how the app is used.',
  s7Body2: 'We also use Umami\'s session recording for aggregate heatmaps and anonymised replays of on-site interactions, which helps us improve the interface. Form inputs such as passwords and email addresses are masked and are never recorded. Your uploaded Instagram data is processed entirely in your browser and is never part of any recording. Everything runs on our own self-hosted infrastructure, with no third parties involved.',
  s8Title: '8. Data retention',
  s8FreeLabel: 'Free tier:',
  s8FreeBody: 'All data is stored exclusively in your browser\'s local storage (IndexedDB). We hold no copy of this data. Clearing your browser\'s site data permanently removes all locally stored snapshots.',
  s8ProLabel: 'Pro tier:',
  s8ProBody: 'Encrypted account data is retained for the duration of the account. You may request complete account deletion at any time via your account settings. Deletion is processed immediately and is irreversible.',
  s9Title: '9. Your rights (GDPR)',
  s9Intro: 'If you are located in the European Economic Area, you have the following rights regarding any personal data we process:',
  gdprRights: [
    'Right of access (Article 15)',
    'Right to rectification (Article 16)',
    'Right to erasure (Article 17)',
    'Right to data portability (Article 20)',
    'Right to object to processing (Article 21)',
  ],
  s9Outro: 'As the Free tier processes no personal data on our servers, most rights are not practically applicable. Pro users may exercise all rights by contacting us at the address below.',
  s10Title: '10. Limitation of liability',
  s10Body: 'WhoUnfollowed is provided "as is" without warranty of any kind, express or implied. We are not responsible for any actions taken by users based on results produced by the Service. Users are solely responsible for how they use the information provided and for compliance with any applicable platform terms of service, including those of Instagram and Meta Platforms, Inc.',
  s11Title: '11. Changes to this policy',
  s11Body: 'We may update this Privacy Policy from time to time. Material changes will be communicated via the changelog. Continued use of the Service after changes constitutes acceptance of the updated policy.',
  s12Title: '12. Contact',
  s12Intro: 'Data protection enquiries and rights requests:',
  s12Footer: 'WhoUnfollowed · Not affiliated with Instagram or Meta Platforms, Inc.',
  backToHome: 'Back to WhoUnfollowed',
};

const ES: PrivacyContent = {
  eyebrow: 'LEGAL',
  headline: 'Política de Privacidad',
  dates: 'Fecha de vigencia: 28 de abril de 2026 · Última actualización: 31 de agosto de 2026',
  disclaimerBold: 'WhoUnfollowed es un servicio independiente.',
  disclaimerRest: 'No está afiliado, respaldado, patrocinado ni conectado oficialmente de ninguna manera con Instagram, Meta Platforms, Inc., ni con ninguna de sus subsidiarias o afiliadas. "Instagram" es una marca registrada de Meta Platforms, Inc. Todas las referencias a Instagram son únicamente con fines descriptivos.',
  tldrLabel: 'LA VERSIÓN CORTA',
  tldrBody: 'Por defecto, WhoUnfollowed no recopila nada. Tu exportación de datos de Instagram se procesa por completo dentro de tu navegador. No se transmiten datos a nuestros servidores. No podemos ver lo que subes ni los resultados que recibes.',
  s1Title: '1. Sobre este Servicio',
  s1Body: 'WhoUnfollowed ("el Servicio", "nosotros") ofrece una herramienta que permite a los usuarios analizar sus propias exportaciones de datos de Instagram para identificar relaciones de seguidores y seguidos. El Servicio funciona exclusivamente procesando archivos de datos que los usuarios han obtenido legalmente y directamente de Instagram a través de su función oficial de exportación de datos, según lo permitido por la legislación de protección de datos aplicable, incluyendo el Artículo 20 del RGPD (Derecho a la portabilidad de los datos).',
  s2Title: '2. Base legal para el procesamiento de datos',
  s2Intro: 'Nuestro procesamiento se basa en las siguientes bases legales:',
  legalBases: [
    { label: 'Interés legítimo', text: 'Prestar el servicio analítico que has solicitado explícitamente.' },
    { label: 'Artículo 20 del RGPD', text: 'Apoyar tu derecho a recibir y reutilizar tus propios datos personales de un responsable del tratamiento, en un formato estructurado, de uso común y lectura mecánica.' },
    { label: 'Ejecución de un contrato', text: 'Proporcionar las funciones del nivel Pro a los usuarios que lo han adquirido.' },
  ],
  s3Title: '3. Datos procesados por el Servicio',
  s3Body1: 'Cuando usas WhoUnfollowed, los datos que proporcionas (tu archivo ZIP de exportación de Instagram) se procesan exclusivamente dentro de tu propio navegador mediante JavaScript del lado del cliente. Ningún contenido de archivo, lista de seguidores, nombre de usuario, ni ninguna parte de la exportación de datos se transmite a nuestros servidores en ningún momento del proceso de análisis.',
  s3Body2: 'Si decides guardar snapshots usando el nivel Gratuito, esos snapshots se almacenan exclusivamente en el almacenamiento local IndexedDB de tu navegador, en tu dispositivo. No tenemos acceso a estos datos.',
  s4Title: '4. Datos que no recopilamos',
  neverCollect: [
    'Credenciales, nombres de usuario o contraseñas de Instagram',
    'Listas de seguidores, listas de seguidos, o cualquier contenido de tu exportación de datos',
    'Los archivos que subes, en cualquier forma',
    'Datos personales más allá de lo estrictamente necesario para prestar el servicio del nivel Pro',
    'Cookies de seguimiento, identificadores publicitarios, o datos de seguimiento entre sitios',
  ],
  s5Title: '5. Procesamiento de datos del nivel Pro',
  s5Body1: 'Los usuarios que crean una cuenta Pro proporcionan una dirección de correo electrónico y una contraseña. Las contraseñas se cifran con argon2id y nunca se almacenan en texto plano. Los datos de snapshots subidos para la sincronización en la nube se cifran del lado del cliente antes de la transmisión, usando una clave derivada de la contraseña del usuario. Esta clave nunca se almacena en nuestros servidores, y somos técnicamente incapaces de descifrar los datos de snapshots de los usuarios.',
  s5Body2: 'Los datos de las cuentas Pro se almacenan en infraestructura ubicada dentro de la Unión Europea (Alemania), y el procesamiento se rige por el RGPD.',
  s5Body3: 'Pro es un pago único (no una suscripción recurrente) que desbloquea el acceso durante un período fijo. Los pagos son gestionados por Stripe, nuestro procesador de pagos. Introduces los datos de tu tarjeta directamente con Stripe. Tu número de tarjeta completo nunca llega a nuestros servidores, y no lo almacenamos. Conservamos únicamente una referencia de cliente de Stripe, la fecha en que expira tu acceso Pro, y el correo electrónico de tu cuenta, lo mínimo necesario para gestionar la facturación. Stripe procesa tu información de pago bajo su propia política de privacidad y cumple con el estándar PCI-DSS.',
  s6Title: '6. Relación con Meta e Instagram',
  s6Body1: 'WhoUnfollowed no interactúa de ninguna manera con los servidores, APIs o infraestructura de Instagram. El Servicio no utiliza la Graph API de Instagram ni ninguna otra API de Instagram o Meta. Los usuarios obtienen sus propios datos directamente de Instagram a través de la función "Descargar tu información" de Instagram, que Instagram proporciona en cumplimiento del Artículo 20 del RGPD.',
  s6Body2: 'WhoUnfollowed no facilita ninguna acción que viole los Términos de Servicio de Instagram. El Servicio no automatiza ninguna interacción con Instagram, no hace scraping de Instagram, y no realiza ninguna acción en nombre de los usuarios dentro de la plataforma de Instagram.',
  s7Title: '7. Analítica',
  s7Body1: 'Usamos Umami, una herramienta de analítica respetuosa con la privacidad que alojamos nosotros mismos en nuestros propios servidores en la UE. No usa cookies, no te rastrea en otros sitios web, y los datos nunca salen de nuestra infraestructura. Recopilamos vistas de página agregadas y eventos de producto anónimos (por ejemplo, qué botones se pulsan) para entender cómo se usa la aplicación.',
  s7Body2: 'También usamos la grabación de sesiones de Umami para mapas de calor agregados y repeticiones anonimizadas de interacciones en el sitio, lo que nos ayuda a mejorar la interfaz. Los campos de formulario como contraseñas y correos electrónicos están enmascarados y nunca se graban. Tus datos de Instagram subidos se procesan por completo en tu navegador y nunca forman parte de ninguna grabación. Todo funciona en nuestra propia infraestructura autoalojada, sin terceros involucrados.',
  s8Title: '8. Retención de datos',
  s8FreeLabel: 'Nivel Gratuito:',
  s8FreeBody: 'Todos los datos se almacenan exclusivamente en el almacenamiento local de tu navegador (IndexedDB). No conservamos ninguna copia de estos datos. Borrar los datos del sitio en tu navegador elimina permanentemente todos los snapshots almacenados localmente.',
  s8ProLabel: 'Nivel Pro:',
  s8ProBody: 'Los datos cifrados de la cuenta se conservan mientras dure la cuenta. Puedes solicitar la eliminación completa de tu cuenta en cualquier momento desde la configuración de tu cuenta. La eliminación se procesa de inmediato y es irreversible.',
  s9Title: '9. Tus derechos (RGPD)',
  s9Intro: 'Si te encuentras en el Espacio Económico Europeo, tienes los siguientes derechos respecto a cualquier dato personal que procesemos:',
  gdprRights: [
    'Derecho de acceso (Artículo 15)',
    'Derecho de rectificación (Artículo 16)',
    'Derecho de supresión (Artículo 17)',
    'Derecho a la portabilidad de los datos (Artículo 20)',
    'Derecho de oposición al procesamiento (Artículo 21)',
  ],
  s9Outro: 'Dado que el nivel Gratuito no procesa datos personales en nuestros servidores, la mayoría de los derechos no son prácticamente aplicables. Los usuarios Pro pueden ejercer todos los derechos contactándonos en la dirección indicada abajo.',
  s10Title: '10. Limitación de responsabilidad',
  s10Body: 'WhoUnfollowed se proporciona "tal cual", sin garantía de ningún tipo, expresa o implícita. No somos responsables de ninguna acción tomada por los usuarios basándose en los resultados producidos por el Servicio. Los usuarios son los únicos responsables de cómo usan la información proporcionada y del cumplimiento de cualquier término de servicio de plataforma aplicable, incluidos los de Instagram y Meta Platforms, Inc.',
  s11Title: '11. Cambios a esta política',
  s11Body: 'Podemos actualizar esta Política de Privacidad de vez en cuando. Los cambios materiales se comunicarán a través del registro de cambios. El uso continuado del Servicio después de los cambios constituye la aceptación de la política actualizada.',
  s12Title: '12. Contacto',
  s12Intro: 'Consultas sobre protección de datos y solicitudes de derechos:',
  s12Footer: 'WhoUnfollowed · No afiliado con Instagram ni con Meta Platforms, Inc.',
  backToHome: 'Volver a WhoUnfollowed',
};

const PT: PrivacyContent = {
  eyebrow: 'LEGAL',
  headline: 'Política de Privacidade',
  dates: 'Data de vigência: 28 de abril de 2026 · Última atualização: 31 de agosto de 2026',
  disclaimerBold: 'O WhoUnfollowed é um serviço independente.',
  disclaimerRest: 'Não é afiliado, endossado, patrocinado nem conectado oficialmente de forma alguma ao Instagram, à Meta Platforms, Inc., ou a qualquer uma de suas subsidiárias ou afiliadas. "Instagram" é uma marca registrada da Meta Platforms, Inc. Todas as referências ao Instagram têm fins meramente descritivos.',
  tldrLabel: 'A VERSÃO RESUMIDA',
  tldrBody: 'Por padrão, o WhoUnfollowed não coleta nada. Sua exportação de dados do Instagram é processada inteiramente dentro do seu navegador. Nenhum dado é transmitido aos nossos servidores. Não conseguimos ver o que você envia nem os resultados que recebe.',
  s1Title: '1. Sobre este Serviço',
  s1Body: 'O WhoUnfollowed ("o Serviço", "nós") oferece uma ferramenta que permite aos usuários analisar suas próprias exportações de dados do Instagram para identificar relações de seguidores e seguidos. O Serviço opera exclusivamente processando arquivos de dados que os usuários obtiveram legalmente e diretamente do Instagram por meio do recurso oficial de exportação de dados do Instagram, conforme permitido pela legislação de proteção de dados aplicável, incluindo o Artigo 20 do RGPD (Direito à portabilidade dos dados).',
  s2Title: '2. Base legal para o processamento de dados',
  s2Intro: 'Nosso processamento se baseia nas seguintes bases legais:',
  legalBases: [
    { label: 'Interesse legítimo', text: 'Fornecer o serviço analítico que você solicitou explicitamente.' },
    { label: 'Artigo 20 do RGPD', text: 'Apoiar seu direito de receber e reutilizar seus próprios dados pessoais de um controlador, em um formato estruturado, de uso comum e leitura mecânica.' },
    { label: 'Execução de contrato', text: 'Fornecer os recursos do nível Pro aos usuários que o adquiriram.' },
  ],
  s3Title: '3. Dados processados pelo Serviço',
  s3Body1: 'Quando você usa o WhoUnfollowed, os dados que você fornece (seu arquivo ZIP de exportação do Instagram) são processados exclusivamente dentro do seu próprio navegador usando JavaScript do lado do cliente. Nenhum conteúdo de arquivo, lista de seguidores, nome de usuário, ou qualquer parte da exportação de dados é transmitido aos nossos servidores em nenhum momento do processo de análise.',
  s3Body2: 'Se você optar por salvar snapshots usando o nível Gratuito, esses snapshots são armazenados exclusivamente no armazenamento local IndexedDB do seu navegador, no seu dispositivo. Não temos acesso a esses dados.',
  s4Title: '4. Dados que não coletamos',
  neverCollect: [
    'Credenciais, nomes de usuário ou senhas do Instagram',
    'Listas de seguidores, listas de seguidos, ou qualquer conteúdo da sua exportação de dados',
    'Os arquivos que você envia, de qualquer forma',
    'Dados pessoais além do estritamente necessário para fornecer o serviço do nível Pro',
    'Cookies de rastreamento, identificadores publicitários, ou dados de rastreamento entre sites',
  ],
  s5Title: '5. Processamento de dados do nível Pro',
  s5Body1: 'Usuários que criam uma conta Pro fornecem um endereço de e-mail e senha. As senhas são criptografadas com argon2id e nunca armazenadas em texto simples. Os dados de snapshots enviados para sincronização na nuvem são criptografados no lado do cliente antes da transmissão, usando uma chave derivada da senha do usuário. Essa chave nunca é armazenada em nossos servidores, e somos tecnicamente incapazes de descriptografar os dados de snapshots dos usuários.',
  s5Body2: 'Os dados das contas Pro são armazenados em infraestrutura localizada na União Europeia (Alemanha), e o processamento é regido pelo RGPD.',
  s5Body3: 'O Pro é um pagamento único (não uma assinatura recorrente) que desbloqueia o acesso por um período fixo. Os pagamentos são processados pela Stripe, nosso processador de pagamentos. Você insere os dados do seu cartão diretamente com a Stripe. O número completo do seu cartão nunca chega aos nossos servidores, e não o armazenamos. Retemos apenas uma referência de cliente da Stripe, a data em que seu acesso Pro expira, e o e-mail da sua conta, o mínimo necessário para gerenciar a cobrança. A Stripe processa suas informações de pagamento sob sua própria política de privacidade e é compatível com o PCI-DSS.',
  s6Title: '6. Relação com a Meta e o Instagram',
  s6Body1: 'O WhoUnfollowed não interage de forma alguma com os servidores, APIs ou infraestrutura do Instagram. O Serviço não usa a Graph API do Instagram nem qualquer outra API do Instagram ou da Meta. Os usuários obtêm seus próprios dados diretamente do Instagram por meio do recurso "Baixar suas informações" do Instagram, que o Instagram fornece em conformidade com o Artigo 20 do RGPD.',
  s6Body2: 'O WhoUnfollowed não facilita nenhuma ação que viole os Termos de Serviço do Instagram. O Serviço não automatiza nenhuma interação com o Instagram, não faz scraping do Instagram, e não realiza nenhuma ação em nome dos usuários dentro da plataforma do Instagram.',
  s7Title: '7. Análises',
  s7Body1: 'Usamos o Umami, uma ferramenta de análise que respeita a privacidade e que hospedamos nós mesmos em nossos próprios servidores na UE. Não usa cookies, não rastreia você em outros sites, e os dados nunca saem da nossa infraestrutura. Coletamos visualizações de página agregadas e eventos de produto anônimos (por exemplo, quais botões são clicados) para entender como o aplicativo é usado.',
  s7Body2: 'Também usamos a gravação de sessões do Umami para mapas de calor agregados e repetições anonimizadas de interações no site, o que nos ajuda a melhorar a interface. Campos de formulário como senhas e e-mails são mascarados e nunca são gravados. Seus dados do Instagram enviados são processados inteiramente no seu navegador e nunca fazem parte de nenhuma gravação. Tudo roda em nossa própria infraestrutura auto-hospedada, sem terceiros envolvidos.',
  s8Title: '8. Retenção de dados',
  s8FreeLabel: 'Nível Gratuito:',
  s8FreeBody: 'Todos os dados são armazenados exclusivamente no armazenamento local do seu navegador (IndexedDB). Não mantemos nenhuma cópia desses dados. Limpar os dados do site no seu navegador remove permanentemente todos os snapshots armazenados localmente.',
  s8ProLabel: 'Nível Pro:',
  s8ProBody: 'Os dados criptografados da conta são retidos durante a existência da conta. Você pode solicitar a exclusão completa da conta a qualquer momento através das configurações da sua conta. A exclusão é processada imediatamente e é irreversível.',
  s9Title: '9. Seus direitos (RGPD)',
  s9Intro: 'Se você estiver localizado no Espaço Econômico Europeu, você tem os seguintes direitos em relação a quaisquer dados pessoais que processamos:',
  gdprRights: [
    'Direito de acesso (Artigo 15)',
    'Direito de retificação (Artigo 16)',
    'Direito de apagamento (Artigo 17)',
    'Direito à portabilidade dos dados (Artigo 20)',
    'Direito de oposição ao processamento (Artigo 21)',
  ],
  s9Outro: 'Como o nível Gratuito não processa dados pessoais em nossos servidores, a maioria dos direitos não é praticamente aplicável. Usuários Pro podem exercer todos os direitos entrando em contato conosco pelo endereço abaixo.',
  s10Title: '10. Limitação de responsabilidade',
  s10Body: 'O WhoUnfollowed é fornecido "no estado em que se encontra", sem garantia de qualquer tipo, expressa ou implícita. Não somos responsáveis por quaisquer ações tomadas pelos usuários com base nos resultados produzidos pelo Serviço. Os usuários são os únicos responsáveis por como usam as informações fornecidas e pela conformidade com quaisquer termos de serviço de plataforma aplicáveis, incluindo os do Instagram e da Meta Platforms, Inc.',
  s11Title: '11. Alterações a esta política',
  s11Body: 'Podemos atualizar esta Política de Privacidade periodicamente. Alterações materiais serão comunicadas através do changelog. O uso continuado do Serviço após as alterações constitui aceitação da política atualizada.',
  s12Title: '12. Contato',
  s12Intro: 'Consultas sobre proteção de dados e solicitações de direitos:',
  s12Footer: 'WhoUnfollowed · Não afiliado ao Instagram ou à Meta Platforms, Inc.',
  backToHome: 'Voltar ao WhoUnfollowed',
};

export function getPrivacyContent(locale: AppLocale): PrivacyContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
