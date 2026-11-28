import type { AppLocale } from '@/i18n/routing';

// Three short Q&As per comparison, the questions people (and AI answer
// engines) ask about a named app: does it need my password, is it safe, what
// is a free alternative. Built from the page's own "requires password" row,
// so the answer can never contradict the table above it.
export interface CompareFaq { q: string; a: string }

export function compareFaq(name: string, needsPassword: boolean, locale: AppLocale): CompareFaq[] {
  if (locale === 'es') {
    return [
      { q: `¿${name} necesita tu contraseña de Instagram?`, a: needsPassword
        ? `Sí. ${name} funciona con tu inicio de sesión de Instagram. WhoUnfollowed lee el export oficial de datos que te da Instagram y nunca te pide la contraseña.`
        : `No. ${name} lee tu export de datos de Instagram, igual que WhoUnfollowed, así que no necesita tu contraseña.` },
      { q: `¿Es seguro usar ${name}?`, a: needsPassword
        ? `Usa tu cuenta, y los términos de Instagram no permiten acceder a información de formas no autorizadas; las cuentas que usan apps con inicio de sesión pueden ser marcadas o limitadas. La vía más segura es el export oficial, que nunca toca tu cuenta.`
        : `No necesita tu inicio de sesión, así que no pone tu cuenta en riesgo. Las diferencias están en el precio, los dispositivos y si puedes revisar su código.` },
      { q: `¿Cuál es una alternativa gratis a ${name}?`, a: 'WhoUnfollowed. Sube el export que te da Instagram y ve gratis quién no te sigue de vuelta, en tu navegador y sin cuenta. Pro AI añade por nombre quién te dejó de seguir y un coach para tus posts.' },
    ];
  }
  if (locale === 'pt') {
    return [
      { q: `O ${name} precisa da sua senha do Instagram?`, a: needsPassword
        ? `Sim. O ${name} funciona com o seu login do Instagram. O WhoUnfollowed lê o export oficial de dados que o Instagram te dá e nunca pede a sua senha.`
        : `Não. O ${name} lê o seu export de dados do Instagram, como o WhoUnfollowed, então não precisa da sua senha.` },
      { q: `É seguro usar o ${name}?`, a: needsPassword
        ? `Ele usa a sua conta, e os termos do Instagram não permitem acessar informações de formas não autorizadas; contas que usam apps com login podem ser sinalizadas ou limitadas. O caminho mais seguro é o export oficial, que nunca mexe na sua conta.`
        : `Ele não precisa do seu login, então não coloca a sua conta em risco. As diferenças estão no preço, nos aparelhos e em poder conferir o código.` },
      { q: `Qual é uma alternativa grátis ao ${name}?`, a: 'O WhoUnfollowed. Envie o export que o Instagram te dá e veja de graça quem não te segue de volta, no seu navegador e sem conta. O Pro AI adiciona pelo nome quem deixou de te seguir e um coach para os seus posts.' },
    ];
  }
  return [
    { q: `Does ${name} need your Instagram password?`, a: needsPassword
      ? `Yes. ${name} works through your Instagram login. WhoUnfollowed reads the official data export Instagram gives you and never asks for your password.`
      : `No. ${name} reads your Instagram data export, like WhoUnfollowed does, so it doesn't need your password.` },
    { q: `Is ${name} safe to use?`, a: needsPassword
      ? "It uses your account, and Instagram's terms don't allow accessing information in unauthorized ways; accounts that use login-based apps can be flagged or limited. The safer route is the official export, which never touches your account."
      : "It doesn't need your login, so it doesn't put your account at risk. The differences are price, devices and whether you can check its code." },
    { q: `What is a free alternative to ${name}?`, a: "WhoUnfollowed. Upload the export Instagram gives you and see who doesn't follow you back free, in your browser, with no account. Pro AI adds who unfollowed you by name and a coach for your posts." },
  ];
}
