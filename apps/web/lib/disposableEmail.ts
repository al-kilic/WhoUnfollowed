// Throwaway inbox providers people use to make one account after another.
// Not exhaustive on purpose: it covers the big public ones, which is most of
// the abuse, without a dependency or a list that needs constant updating.
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com', '10minutemail.net', '20minutemail.com', 'anonaddy.me', 'burnermail.io',
  'byom.de', 'dispostable.com', 'dropmail.me', 'emailondeck.com', 'fakeinbox.com',
  'fakemail.net', 'getairmail.com', 'getnada.com', 'guerrillamail.biz', 'guerrillamail.com',
  'guerrillamail.de', 'guerrillamail.info', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamailblock.com',
  'harakirimail.com', 'inboxbear.com', 'incognitomail.org', 'mail.tm', 'mail-temp.com',
  'mailcatch.com', 'maildrop.cc', 'mailinator.com', 'mailinator.net', 'mailnesia.com',
  'mailpoof.com', 'mintemail.com', 'moakt.com', 'mohmal.com', 'mytemp.email',
  'nada.email', 'sharklasers.com', 'spam4.me', 'spamgourmet.com', 'temp-mail.io',
  'temp-mail.org', 'tempail.com', 'tempmail.com', 'tempmail.dev', 'tempmail.net',
  'tempmailo.com', 'tempr.email', 'throwawaymail.com', 'tmail.ws', 'tmpmail.net',
  'tmpmail.org', 'trashmail.com', 'trashmail.de', 'yopmail.com', 'yopmail.fr',
  'yopmail.net', 'emailnax.com', 'tempinbox.com', 'mailsac.com', 'inboxkitten.com',
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split('@')[1];
  if (!domain) return false;
  if (DISPOSABLE_DOMAINS.has(domain)) return true;
  // Catch subdomains like "abc.mailinator.com".
  const parts = domain.split('.');
  for (let i = 1; i < parts.length - 1; i++) {
    if (DISPOSABLE_DOMAINS.has(parts.slice(i).join('.'))) return true;
  }
  return false;
}
