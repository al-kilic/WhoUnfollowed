import type { AppLocale } from '@/i18n/routing';

export interface HowToExportContent {
  eyebrow: string;
  headline: string;
  intro: string;
  newHereLink: string;
  deviceTab: string;
  driveTab: string;
  zipCtaTitle: string;
  zipCtaBody: string;
  zipCtaButton: string;
  device: {
    tip: string;
    step1: { title: string; openButton: string; nav: string[]; hint: string };
    step2: { title: string; nav: string[] };
    step3: { title: string; nav: string[]; hint: string };
    step4: {
      title: string;
      nav: string[];
      customizeHeader: string;
      items: string[];
      required: string;
      hint: string;
    };
    step5: {
      title: string;
      jsonLabel: string;
      jsonDesc: string;
      htmlLabel: string;
      htmlDesc: string;
      hint: string;
    };
    step6: { title: string; emailSubject: string; hint: string };
    warning: string;
  };
  drive: {
    tip: string;
    step1: { title: string; openButton: string; nav: string[]; hint: string };
    step2: { title: string; nav: string[] };
    step3: { title: string; nav: string[]; hint: string };
    step4: { title: string; platforms: { name: string; note: string }[]; hint: string };
    step5: { title: string; nav: string[]; hint: string };
    step6: { title: string; hint: string };
    tip2: string;
  };
  timing: {
    eyebrow: string;
    headline: string;
    intro: string;
    items: string[];
    warning: string;
  };
  structure: {
    eyebrow: string;
    headline: string;
    folderLabel: string;
    treeComment1: string;
    treeComment2: string;
    body: string;
    jsonSampleLabel: string;
    closing: string;
    miniCtaLabel: string;
    miniCtaButton: string;
  };
  troubleshooting: {
    eyebrow: string;
    headline: string;
    items: { q: string; a: string }[];
  };
  faq: {
    eyebrow: string;
    headline: string;
    items: { q: string; a: string }[];
  };
  relatedGuideEyebrow: string;
  relatedGuideLink: string;
  backToHome: string;
}

const EN: HowToExportContent = {
  eyebrow: 'STEP-BY-STEP GUIDE',
  headline: 'How to get your Instagram data.',
  intro: 'Instagram lets you export your followers and following list directly. Pick the method that works for you.',
  newHereLink: 'New here? Learn what WhoUnfollowed does →',
  deviceTab: 'Download to device',
  driveTab: 'Export to Google Drive',
  zipCtaTitle: 'Got the ZIP?',
  zipCtaBody: 'Drop it on the home page. Parsed in your browser. Nothing leaves your device.',
  zipCtaButton: 'Upload your ZIP now',
  device: {
    tip: 'Only request Followers and Following, not your entire Instagram history. A focused export is ready in under 2 minutes.',
    step1: {
      title: 'Go to Instagram Accounts Center',
      openButton: 'Open Instagram Accounts Center',
      nav: ['Profile', 'Settings and privacy', 'Accounts Center'],
      hint: 'Or navigate manually from your Profile. Works the same on phone, tablet, or desktop.',
    },
    step2: {
      title: 'Open Your Information and Permissions',
      nav: ['Accounts Center', 'Your information and permissions'],
    },
    step3: {
      title: 'Go to Export Your Information',
      nav: ['Your information and permissions', 'Export your information', 'Export to device'],
      hint: 'Two options appear here. Pick Export to device, not "Transfer to destination".',
    },
    step4: {
      title: 'Select only Followers and Following',
      nav: ['Create export', 'Choose account', 'Download to device', 'Customize information'],
      customizeHeader: 'CUSTOMIZE INFORMATION - SELECT ONLY:',
      items: ['Followers and Following', 'Posts', 'Stories', 'Messages', 'Comments'],
      required: 'Required',
      hint: 'Date range: choose All time. A shorter range only exports recent followers, not your full list.',
    },
    step5: {
      title: 'Choose JSON format, then tap "Start export"',
      jsonLabel: 'JSON',
      jsonDesc: 'Recommended. Includes timestamps.',
      htmlLabel: 'HTML',
      htmlDesc: 'No timestamps',
      hint: 'Then tap Start export. Instagram processes it in the background.',
    },
    step6: {
      title: 'Download the ZIP from your email',
      emailSubject: 'Your Instagram data is ready',
      hint: 'Usually arrives within a few minutes.',
    },
    warning: 'The download link expires in 4 days. Download the ZIP as soon as you get the email.',
  },
  drive: {
    tip: 'Instagram can automatically send your data exports to Google Drive, Dropbox, and other platforms. Once set up, your data lands there on a schedule - no manual downloading needed.',
    step1: {
      title: 'Go to Instagram Accounts Center',
      openButton: 'Open Instagram Accounts Center',
      nav: ['Profile', 'Settings and privacy', 'Accounts Center'],
      hint: 'Works the same on phone, tablet, or desktop.',
    },
    step2: {
      title: 'Open Your Information and Permissions',
      nav: ['Accounts Center', 'Your information and permissions'],
    },
    step3: {
      title: 'Choose "Transfer to destination"',
      nav: ['Your information and permissions', 'Export your information', 'Transfer to destination'],
      hint: 'Not "Export to device", that\'s the other tab.',
    },
    step4: {
      title: 'Connect your storage platform',
      platforms: [
        { name: 'Google Drive', note: 'Recommended' },
        { name: 'Dropbox', note: 'Supported' },
        { name: 'OneDrive', note: 'Supported' },
        { name: 'Box', note: 'Supported' },
      ],
      hint: 'Follow the login steps to authorise access to your chosen platform.',
    },
    step5: {
      title: 'Select Followers and Following, set date range to All time',
      nav: ['Customize information', 'Followers and Following', 'All time'],
      hint: 'A shorter date range only exports recent followers, not your full list.',
    },
    step6: {
      title: 'Start the transfer',
      hint: 'Arrives in your cloud storage within a few minutes. Download it from there and upload it here, same as the device method.',
    },
    tip2: 'You can set up recurring transfers so Instagram automatically sends fresh exports to your Drive on a schedule. This is the foundation of the automatic sync feature coming to WhoUnfollowed Pro.',
  },
  timing: {
    eyebrow: 'TIMING',
    headline: 'How long does the export take?',
    intro: 'Most exports arrive within 1–5 minutes. If yours has not appeared after 15 minutes, here is what to check:',
    items: [
      'Check your spam or promotions folder. Instagram sends from security-noreply@instagram.com',
      'Make sure you selected JSON format, not HTML - HTML exports sometimes take longer',
      'Instagram throttles export requests. If you requested recently, wait 14 days before trying again',
      'On rare occasions Instagram can take up to 48 hours, especially during high-traffic periods',
    ],
    warning: 'The download link in the email expires in 4 days. Download the ZIP as soon as it arrives.',
  },
  structure: {
    eyebrow: 'FILE STRUCTURE',
    headline: "What's actually inside the file you download?",
    folderLabel: 'FOLDER STRUCTURE',
    treeComment1: 'everyone who follows you',
    treeComment2: 'everyone you follow',
    body: 'You only need this ZIP. You do not need to unzip it or open the files yourself. Just drop the ZIP on WhoUnfollowed and the parser reads it in your browser in about 2 seconds.',
    jsonSampleLabel: 'WHAT THE JSON LOOKS LIKE',
    closing: 'This is what our parser reads. The timestamp tells you exactly when someone followed you.',
    miniCtaLabel: 'Got the ZIP?',
    miniCtaButton: 'Drop it here',
  },
  troubleshooting: {
    eyebrow: 'TROUBLESHOOTING',
    headline: 'Common problems and how to fix them.',
    items: [
      { q: "I didn't receive the Instagram export email", a: "Check your spam folder first. The sender is security-noreply@instagram.com. If it's not there after 15 minutes, go back to Accounts Center and confirm your request was submitted. Try requesting again - sometimes the first request silently fails." },
      { q: 'The download link in the email has expired', a: "Export links expire after 4 days. Go back to Accounts Center and request a new export. You'll get a fresh link within minutes." },
      { q: 'My export only shows recent followers, not my full list', a: 'You selected the wrong date range. Go back and request again - under "Date range" select All time, not Last month or Last year. Any shorter range gives you a partial list.' },
      { q: 'Instagram is asking me to export my full archive', a: 'You navigated to the wrong option. Make sure you choose "Export to device" (not "Transfer to destination") and then under Customize information, deselect everything except Followers and Following.' },
      { q: "The ZIP file won't open or shows an error on WhoUnfollowed", a: "Make sure you're uploading the original ZIP Instagram sent - don't unzip and re-zip it, and don't rename the file. If you're on iOS, make sure you downloaded it with the Files app, not the Mail app." },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    headline: 'Frequently asked questions.',
    items: [
      { q: 'Does requesting an Instagram data export notify my followers?', a: 'No. The export is completely private. Your followers have no way of knowing you requested or downloaded your data.' },
      { q: 'How often can I request an Instagram data export?', a: 'Instagram allows one export request approximately every 14 days per account.' },
      { q: 'Is it safe to request my Instagram data export?', a: 'Yes. It is an official Instagram feature required under GDPR. No third-party app is involved at any point.' },
      { q: 'What format should I choose - JSON or HTML?', a: "Always choose JSON. It includes timestamps showing when each person followed you, and it's the format our parser is built for. HTML is only for human reading and contains less data." },
      { q: 'Can I request an Instagram data export on desktop?', a: 'Yes. Go to accountscenter.instagram.com → Your information and permissions → Export your information. The process is identical to mobile.' },
      { q: 'Why do I only need the Followers and Following export, not my full archive?', a: 'The full Instagram archive can be several gigabytes and takes much longer. Followers and Following is a small, focused export - usually under 1MB - and ready in minutes.' },
    ],
  },
  relatedGuideEyebrow: 'RELATED GUIDE',
  relatedGuideLink: 'How to download your Instagram data (step by step) →',
  backToHome: 'Back to WhoUnfollowed',
};

const ES: HowToExportContent = {
  eyebrow: 'GUÍA PASO A PASO',
  headline: 'Cómo obtener tus datos de Instagram.',
  intro: 'Instagram te permite exportar directamente tu lista de seguidores y seguidos. Elige el método que te funcione.',
  newHereLink: '¿Nuevo aquí? Descubre qué hace WhoUnfollowed →',
  deviceTab: 'Descargar al dispositivo',
  driveTab: 'Exportar a Google Drive',
  zipCtaTitle: '¿Ya tienes el ZIP?',
  zipCtaBody: 'Suéltalo en la página principal. Se procesa en tu navegador. Nada sale de tu dispositivo.',
  zipCtaButton: 'Sube tu ZIP ahora',
  device: {
    tip: 'Solicita solo Seguidores y Seguidos, no todo tu historial de Instagram. Un export enfocado está listo en menos de 2 minutos.',
    step1: {
      title: 'Ve al Centro de cuentas de Instagram',
      openButton: 'Abrir el Centro de cuentas de Instagram',
      nav: ['Perfil', 'Configuración y privacidad', 'Centro de cuentas'],
      hint: 'O navega manualmente desde tu Perfil. Funciona igual en teléfono, tablet o escritorio.',
    },
    step2: {
      title: 'Abre Tu información y permisos',
      nav: ['Centro de cuentas', 'Tu información y permisos'],
    },
    step3: {
      title: 'Ve a Exportar tu información',
      nav: ['Tu información y permisos', 'Exportar tu información', 'Exportar al dispositivo'],
      hint: 'Aquí aparecen dos opciones. Elige Exportar al dispositivo, no "Transferir a destino".',
    },
    step4: {
      title: 'Selecciona solo Seguidores y Seguidos',
      nav: ['Crear export', 'Elegir cuenta', 'Descargar al dispositivo', 'Personalizar información'],
      customizeHeader: 'PERSONALIZAR INFORMACIÓN: SELECCIONA SOLO:',
      items: ['Seguidores y Seguidos', 'Publicaciones', 'Historias', 'Mensajes', 'Comentarios'],
      required: 'Requerido',
      hint: 'Rango de fechas: elige Todo el tiempo. Un rango más corto solo exporta seguidores recientes, no tu lista completa.',
    },
    step5: {
      title: 'Elige el formato JSON y toca "Iniciar export"',
      jsonLabel: 'JSON',
      jsonDesc: 'Recomendado. Incluye marcas de tiempo.',
      htmlLabel: 'HTML',
      htmlDesc: 'Sin marcas de tiempo',
      hint: 'Luego toca Iniciar export. Instagram lo procesa en segundo plano.',
    },
    step6: {
      title: 'Descarga el ZIP desde tu correo',
      emailSubject: 'Tus datos de Instagram están listos',
      hint: 'Normalmente llega en unos minutos.',
    },
    warning: 'El enlace de descarga caduca en 4 días. Descarga el ZIP tan pronto recibas el correo.',
  },
  drive: {
    tip: 'Instagram puede enviar automáticamente tus exports de datos a Google Drive, Dropbox y otras plataformas. Una vez configurado, tus datos llegan ahí según un calendario, sin necesidad de descargar manualmente.',
    step1: {
      title: 'Ve al Centro de cuentas de Instagram',
      openButton: 'Abrir el Centro de cuentas de Instagram',
      nav: ['Perfil', 'Configuración y privacidad', 'Centro de cuentas'],
      hint: 'Funciona igual en teléfono, tablet o escritorio.',
    },
    step2: {
      title: 'Abre Tu información y permisos',
      nav: ['Centro de cuentas', 'Tu información y permisos'],
    },
    step3: {
      title: 'Elige "Transferir a destino"',
      nav: ['Tu información y permisos', 'Exportar tu información', 'Transferir a destino'],
      hint: 'No "Exportar al dispositivo", esa es la otra pestaña.',
    },
    step4: {
      title: 'Conecta tu plataforma de almacenamiento',
      platforms: [
        { name: 'Google Drive', note: 'Recomendado' },
        { name: 'Dropbox', note: 'Compatible' },
        { name: 'OneDrive', note: 'Compatible' },
        { name: 'Box', note: 'Compatible' },
      ],
      hint: 'Sigue los pasos de inicio de sesión para autorizar el acceso a la plataforma elegida.',
    },
    step5: {
      title: 'Selecciona Seguidores y Seguidos, pon el rango de fechas en Todo el tiempo',
      nav: ['Personalizar información', 'Seguidores y Seguidos', 'Todo el tiempo'],
      hint: 'Un rango de fechas más corto solo exporta seguidores recientes, no tu lista completa.',
    },
    step6: {
      title: 'Inicia la transferencia',
      hint: 'Llega a tu almacenamiento en la nube en unos minutos. Descárgalo desde ahí y súbelo aquí, igual que con el método del dispositivo.',
    },
    tip2: 'Puedes configurar transferencias recurrentes para que Instagram envíe automáticamente exports nuevos a tu Drive según un calendario. Esta es la base de la función de sincronización automática que llegará a WhoUnfollowed Pro.',
  },
  timing: {
    eyebrow: 'TIEMPO DE ESPERA',
    headline: '¿Cuánto tarda el export?',
    intro: 'La mayoría de los exports llegan en 1 a 5 minutos. Si el tuyo no ha aparecido después de 15 minutos, esto es lo que debes revisar:',
    items: [
      'Revisa tu carpeta de spam o promociones. Instagram envía desde security-noreply@instagram.com',
      'Asegúrate de haber seleccionado el formato JSON, no HTML, los exports HTML a veces tardan más',
      'Instagram limita las solicitudes de export. Si solicitaste uno recientemente, espera 14 días antes de intentarlo de nuevo',
      'En raras ocasiones Instagram puede tardar hasta 48 horas, especialmente en periodos de alto tráfico',
    ],
    warning: 'El enlace de descarga del correo caduca en 4 días. Descarga el ZIP tan pronto llegue.',
  },
  structure: {
    eyebrow: 'ESTRUCTURA DE ARCHIVOS',
    headline: '¿Qué hay realmente dentro del archivo que descargas?',
    folderLabel: 'ESTRUCTURA DE CARPETAS',
    treeComment1: 'todos los que te siguen',
    treeComment2: 'todos a los que sigues',
    body: 'Solo necesitas este ZIP. No necesitas descomprimirlo ni abrir los archivos tú mismo. Solo suelta el ZIP en WhoUnfollowed y el parser lo lee en tu navegador en unos 2 segundos.',
    jsonSampleLabel: 'CÓMO SE VE EL JSON',
    closing: 'Esto es lo que lee nuestro parser. El timestamp te dice exactamente cuándo alguien empezó a seguirte.',
    miniCtaLabel: '¿Ya tienes el ZIP?',
    miniCtaButton: 'Suéltalo aquí',
  },
  troubleshooting: {
    eyebrow: 'SOLUCIÓN DE PROBLEMAS',
    headline: 'Problemas comunes y cómo solucionarlos.',
    items: [
      { q: 'No recibí el correo de export de Instagram', a: 'Revisa primero tu carpeta de spam. El remitente es security-noreply@instagram.com. Si no está ahí después de 15 minutos, vuelve al Centro de cuentas y confirma que tu solicitud se envió. Intenta solicitarlo de nuevo, a veces la primera solicitud falla en silencio.' },
      { q: 'El enlace de descarga del correo caducó', a: 'Los enlaces de export caducan después de 4 días. Vuelve al Centro de cuentas y solicita un nuevo export. Recibirás un enlace nuevo en minutos.' },
      { q: 'Mi export solo muestra seguidores recientes, no mi lista completa', a: 'Elegiste el rango de fechas incorrecto. Vuelve a solicitarlo y en "Rango de fechas" selecciona Todo el tiempo, no Último mes o Último año. Cualquier rango más corto te da una lista parcial.' },
      { q: 'Instagram me pide exportar mi archivo completo', a: 'Navegaste a la opción incorrecta. Asegúrate de elegir "Exportar al dispositivo" (no "Transferir a destino") y luego en Personalizar información, deselecciona todo excepto Seguidores y Seguidos.' },
      { q: 'El archivo ZIP no abre o muestra un error en WhoUnfollowed', a: 'Asegúrate de subir el ZIP original que envió Instagram, no lo descomprimas y vuelvas a comprimir, ni renombres el archivo. Si usas iOS, asegúrate de haberlo descargado con la app Archivos, no con la app Mail.' },
    ],
  },
  faq: {
    eyebrow: 'PREGUNTAS FRECUENTES',
    headline: 'Preguntas frecuentes.',
    items: [
      { q: '¿Solicitar un export de datos de Instagram notifica a mis seguidores?', a: 'No. El export es completamente privado. Tus seguidores no tienen forma de saber que solicitaste o descargaste tus datos.' },
      { q: '¿Con qué frecuencia puedo solicitar un export de datos de Instagram?', a: 'Instagram permite una solicitud de export aproximadamente cada 14 días por cuenta.' },
      { q: '¿Es seguro solicitar mi export de datos de Instagram?', a: 'Sí. Es una función oficial de Instagram requerida bajo el RGPD. Ninguna app de terceros está involucrada en ningún momento.' },
      { q: '¿Qué formato debo elegir, JSON o HTML?', a: 'Siempre elige JSON. Incluye marcas de tiempo que muestran cuándo cada persona te siguió, y es el formato para el que está construido nuestro parser. HTML es solo para lectura humana y contiene menos datos.' },
      { q: '¿Puedo solicitar un export de datos de Instagram en escritorio?', a: 'Sí. Ve a accountscenter.instagram.com → Tu información y permisos → Exportar tu información. El proceso es idéntico al de móvil.' },
      { q: '¿Por qué solo necesito el export de Seguidores y Seguidos, no mi archivo completo?', a: 'El archivo completo de Instagram puede pesar varios gigabytes y tardar mucho más. Seguidores y Seguidos es un export pequeño y enfocado, normalmente menos de 1MB, y listo en minutos.' },
    ],
  },
  relatedGuideEyebrow: 'GUÍA RELACIONADA',
  relatedGuideLink: 'Cómo descargar tus datos de Instagram (paso a paso) →',
  backToHome: 'Volver a WhoUnfollowed',
};

const PT: HowToExportContent = {
  eyebrow: 'GUIA PASSO A PASSO',
  headline: 'Como obter seus dados do Instagram.',
  intro: 'O Instagram permite exportar diretamente sua lista de seguidores e seguindo. Escolha o método que funciona para você.',
  newHereLink: 'Novo por aqui? Descubra o que o WhoUnfollowed faz →',
  deviceTab: 'Baixar para o dispositivo',
  driveTab: 'Exportar para o Google Drive',
  zipCtaTitle: 'Já tem o ZIP?',
  zipCtaBody: 'Solte na página inicial. Processado no seu navegador. Nada sai do seu dispositivo.',
  zipCtaButton: 'Envie seu ZIP agora',
  device: {
    tip: 'Solicite apenas Seguidores e Seguindo, não todo o seu histórico do Instagram. Um export focado fica pronto em menos de 2 minutos.',
    step1: {
      title: 'Vá para a Central de contas do Instagram',
      openButton: 'Abrir a Central de contas do Instagram',
      nav: ['Perfil', 'Configurações e privacidade', 'Central de contas'],
      hint: 'Ou navegue manualmente pelo seu Perfil. Funciona igual no celular, tablet ou computador.',
    },
    step2: {
      title: 'Abra Suas informações e permissões',
      nav: ['Central de contas', 'Suas informações e permissões'],
    },
    step3: {
      title: 'Vá para Exportar suas informações',
      nav: ['Suas informações e permissões', 'Exportar suas informações', 'Exportar para o dispositivo'],
      hint: 'Duas opções aparecem aqui. Escolha Exportar para o dispositivo, não "Transferir para destino".',
    },
    step4: {
      title: 'Selecione apenas Seguidores e Seguindo',
      nav: ['Criar export', 'Escolher conta', 'Baixar para o dispositivo', 'Personalizar informações'],
      customizeHeader: 'PERSONALIZAR INFORMAÇÕES: SELECIONE APENAS:',
      items: ['Seguidores e Seguindo', 'Publicações', 'Stories', 'Mensagens', 'Comentários'],
      required: 'Obrigatório',
      hint: 'Período: escolha Todo o período. Um período mais curto exporta só seguidores recentes, não sua lista completa.',
    },
    step5: {
      title: 'Escolha o formato JSON e toque em "Iniciar export"',
      jsonLabel: 'JSON',
      jsonDesc: 'Recomendado. Inclui data e hora.',
      htmlLabel: 'HTML',
      htmlDesc: 'Sem data e hora',
      hint: 'Depois toque em Iniciar export. O Instagram processa em segundo plano.',
    },
    step6: {
      title: 'Baixe o ZIP do seu email',
      emailSubject: 'Seus dados do Instagram estão prontos',
      hint: 'Geralmente chega em poucos minutos.',
    },
    warning: 'O link de download expira em 4 dias. Baixe o ZIP assim que receber o email.',
  },
  drive: {
    tip: 'O Instagram pode enviar automaticamente seus exports de dados para o Google Drive, Dropbox e outras plataformas. Depois de configurado, seus dados chegam lá em um cronograma, sem precisar baixar manualmente.',
    step1: {
      title: 'Vá para a Central de contas do Instagram',
      openButton: 'Abrir a Central de contas do Instagram',
      nav: ['Perfil', 'Configurações e privacidade', 'Central de contas'],
      hint: 'Funciona igual no celular, tablet ou computador.',
    },
    step2: {
      title: 'Abra Suas informações e permissões',
      nav: ['Central de contas', 'Suas informações e permissões'],
    },
    step3: {
      title: 'Escolha "Transferir para destino"',
      nav: ['Suas informações e permissões', 'Exportar suas informações', 'Transferir para destino'],
      hint: 'Não "Exportar para o dispositivo", essa é a outra aba.',
    },
    step4: {
      title: 'Conecte sua plataforma de armazenamento',
      platforms: [
        { name: 'Google Drive', note: 'Recomendado' },
        { name: 'Dropbox', note: 'Compatível' },
        { name: 'OneDrive', note: 'Compatível' },
        { name: 'Box', note: 'Compatível' },
      ],
      hint: 'Siga os passos de login para autorizar o acesso à plataforma escolhida.',
    },
    step5: {
      title: 'Selecione Seguidores e Seguindo, defina o período como Todo o período',
      nav: ['Personalizar informações', 'Seguidores e Seguindo', 'Todo o período'],
      hint: 'Um período mais curto exporta só seguidores recentes, não sua lista completa.',
    },
    step6: {
      title: 'Inicie a transferência',
      hint: 'Chega no seu armazenamento na nuvem em poucos minutos. Baixe de lá e envie aqui, igual ao método do dispositivo.',
    },
    tip2: 'Você pode configurar transferências recorrentes para o Instagram enviar automaticamente exports novos ao seu Drive em um cronograma. Essa é a base da função de sincronização automática que está chegando ao WhoUnfollowed Pro.',
  },
  timing: {
    eyebrow: 'TEMPO DE ESPERA',
    headline: 'Quanto tempo leva o export?',
    intro: 'A maioria dos exports chega em 1 a 5 minutos. Se o seu não apareceu depois de 15 minutos, veja o que checar:',
    items: [
      'Confira sua pasta de spam ou promoções. O Instagram envia de security-noreply@instagram.com',
      'Confirme que você selecionou o formato JSON, não HTML, exports em HTML às vezes demoram mais',
      'O Instagram limita as solicitações de export. Se você solicitou recentemente, espere 14 dias antes de tentar de novo',
      'Em raras ocasiões o Instagram pode levar até 48 horas, especialmente em períodos de tráfego alto',
    ],
    warning: 'O link de download no email expira em 4 dias. Baixe o ZIP assim que chegar.',
  },
  structure: {
    eyebrow: 'ESTRUTURA DE ARQUIVOS',
    headline: 'O que realmente tem dentro do arquivo que você baixa?',
    folderLabel: 'ESTRUTURA DE PASTAS',
    treeComment1: 'todos que te seguem',
    treeComment2: 'todos que você segue',
    body: 'Você só precisa deste ZIP. Não precisa descompactá-lo nem abrir os arquivos por conta própria. Só solte o ZIP no WhoUnfollowed e o parser o lê no seu navegador em cerca de 2 segundos.',
    jsonSampleLabel: 'COMO O JSON SE PARECE',
    closing: 'É isso que nosso parser lê. O timestamp mostra exatamente quando alguém começou a te seguir.',
    miniCtaLabel: 'Já tem o ZIP?',
    miniCtaButton: 'Solte aqui',
  },
  troubleshooting: {
    eyebrow: 'SOLUÇÃO DE PROBLEMAS',
    headline: 'Problemas comuns e como resolvê-los.',
    items: [
      { q: 'Não recebi o email de export do Instagram', a: 'Confira primeiro sua pasta de spam. O remetente é security-noreply@instagram.com. Se não estiver lá depois de 15 minutos, volte à Central de contas e confirme que sua solicitação foi enviada. Tente solicitar de novo, às vezes a primeira solicitação falha silenciosamente.' },
      { q: 'O link de download no email expirou', a: 'Os links de export expiram depois de 4 dias. Volte à Central de contas e solicite um novo export. Você receberá um link novo em minutos.' },
      { q: 'Meu export só mostra seguidores recentes, não minha lista completa', a: 'Você escolheu o período errado. Volte e solicite de novo, em "Período" selecione Todo o período, não Último mês ou Último ano. Qualquer período mais curto te dá uma lista parcial.' },
      { q: 'O Instagram está pedindo para eu exportar meu arquivo completo', a: 'Você navegou para a opção errada. Confirme que escolheu "Exportar para o dispositivo" (não "Transferir para destino") e depois em Personalizar informações, desmarque tudo exceto Seguidores e Seguindo.' },
      { q: 'O arquivo ZIP não abre ou mostra um erro no WhoUnfollowed', a: 'Confirme que você está enviando o ZIP original que o Instagram mandou, não descompacte e recompacte, nem renomeie o arquivo. Se você usa iOS, confirme que baixou com o app Arquivos, não o app Mail.' },
    ],
  },
  faq: {
    eyebrow: 'PERGUNTAS FREQUENTES',
    headline: 'Perguntas frequentes.',
    items: [
      { q: 'Solicitar um export de dados do Instagram avisa meus seguidores?', a: 'Não. O export é totalmente privado. Seus seguidores não têm como saber que você solicitou ou baixou seus dados.' },
      { q: 'Com que frequência posso solicitar um export de dados do Instagram?', a: 'O Instagram permite uma solicitação de export aproximadamente a cada 14 dias por conta.' },
      { q: 'É seguro solicitar meu export de dados do Instagram?', a: 'Sim. É um recurso oficial do Instagram exigido pelo RGPD. Nenhum app de terceiros está envolvido em nenhum momento.' },
      { q: 'Qual formato devo escolher, JSON ou HTML?', a: 'Sempre escolha JSON. Ele inclui data e hora mostrando quando cada pessoa começou a te seguir, e é o formato para o qual nosso parser foi criado. HTML é só para leitura humana e contém menos dados.' },
      { q: 'Posso solicitar um export de dados do Instagram no computador?', a: 'Sim. Vá em accountscenter.instagram.com → Suas informações e permissões → Exportar suas informações. O processo é idêntico ao do celular.' },
      { q: 'Por que só preciso do export de Seguidores e Seguindo, não do meu arquivo completo?', a: 'O arquivo completo do Instagram pode ter vários gigabytes e demorar muito mais. Seguidores e Seguindo é um export pequeno e focado, geralmente com menos de 1MB, e pronto em minutos.' },
    ],
  },
  relatedGuideEyebrow: 'GUIA RELACIONADO',
  relatedGuideLink: 'Como baixar seus dados do Instagram (passo a passo) →',
  backToHome: 'Voltar ao WhoUnfollowed',
};

export function getHowToExportContent(locale: AppLocale): HowToExportContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
