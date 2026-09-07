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
  lastUpdated: 'Last updated: August 31, 2026',
  s1Title: '1. Acceptance of Terms',
  s1Body: 'By accessing or using WhoUnfollowed, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.',
  s2Title: '2. Description of Service',
  s2Body: 'WhoUnfollowed is a client-side tool that allows users to parse their own Instagram data exports to compare follower and following lists. The core functionality runs entirely in your browser.',
  s3Title: '3. User Responsibilities',
  s3Body: 'You are responsible for obtaining your own data from Instagram and for any actions you take based on the information provided by WhoUnfollowed. WhoUnfollowed is not responsible for any actions taken against your Instagram account by Meta/Instagram.',
  s4Title: '4. Privacy & Data',
  s4Pre: 'Your privacy is important to us. Please review our',
  s4LinkLabel: 'Privacy Policy',
  s4Post: 'to understand how we handle your information.',
  s5Title: '5. Pro',
  s5Pre: 'WhoUnfollowed Pro is an optional paid upgrade that provides additional features. It is a one-time payment that unlocks Pro access for a fixed period (30 or 365 days), not a recurring subscription, and there is no auto-renewal or ongoing billing. Please refer to our',
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
  lastUpdated: 'Última actualización: 31 de agosto de 2026',
  s1Title: '1. Aceptación de los Términos',
  s1Body: 'Al acceder o usar WhoUnfollowed, aceptas quedar sujeto a estos Términos de Servicio. Si no estás de acuerdo con estos términos, no uses el servicio.',
  s2Title: '2. Descripción del Servicio',
  s2Body: 'WhoUnfollowed es una herramienta del lado del cliente que permite a los usuarios analizar sus propias exportaciones de datos de Instagram para comparar listas de seguidores y seguidos. La funcionalidad principal se ejecuta por completo en tu navegador.',
  s3Title: '3. Responsabilidades del usuario',
  s3Body: 'Eres responsable de obtener tus propios datos de Instagram y de cualquier acción que tomes basándote en la información proporcionada por WhoUnfollowed. WhoUnfollowed no es responsable de ninguna acción tomada contra tu cuenta de Instagram por Meta/Instagram.',
  s4Title: '4. Privacidad y datos',
  s4Pre: 'Tu privacidad es importante para nosotros. Por favor revisa nuestra',
  s4LinkLabel: 'Política de Privacidad',
  s4Post: 'para entender cómo manejamos tu información.',
  s5Title: '5. Pro',
  s5Pre: 'WhoUnfollowed Pro es una mejora opcional de pago que ofrece funciones adicionales. Es un pago único que desbloquea el acceso Pro durante un período fijo (30 o 365 días), no una suscripción recurrente, y no hay renovación automática ni facturación continua. Consulta nuestra',
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
  lastUpdated: 'Última atualização: 31 de agosto de 2026',
  s1Title: '1. Aceitação dos Termos',
  s1Body: 'Ao acessar ou usar o WhoUnfollowed, você concorda em ficar vinculado a estes Termos de Serviço. Se você não concorda com estes termos, não use o serviço.',
  s2Title: '2. Descrição do Serviço',
  s2Body: 'O WhoUnfollowed é uma ferramenta do lado do cliente que permite aos usuários analisar suas próprias exportações de dados do Instagram para comparar listas de seguidores e seguidos. A funcionalidade principal roda inteiramente no seu navegador.',
  s3Title: '3. Responsabilidades do usuário',
  s3Body: 'Você é responsável por obter seus próprios dados do Instagram e por quaisquer ações que tomar com base nas informações fornecidas pelo WhoUnfollowed. O WhoUnfollowed não é responsável por quaisquer ações tomadas contra sua conta do Instagram pela Meta/Instagram.',
  s4Title: '4. Privacidade e Dados',
  s4Pre: 'Sua privacidade é importante para nós. Por favor, revise nossa',
  s4LinkLabel: 'Política de Privacidade',
  s4Post: 'para entender como tratamos suas informações.',
  s5Title: '5. Pro',
  s5Pre: 'O WhoUnfollowed Pro é um upgrade pago opcional que fornece recursos adicionais. É um pagamento único que desbloqueia o acesso Pro por um período fixo (30 ou 365 dias), não uma assinatura recorrente, e não há renovação automática nem cobrança contínua. Consulte nossa',
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
