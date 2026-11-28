'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import type { AppLocale } from '@/i18n/routing';

const COPY: Record<'en' | 'es' | 'pt', { label: string; ph: string; save: string; saved: string; failed: string; hint: string }> = {
  en: { label: 'Your name', ph: 'How Today should greet you', save: 'Save', saved: 'Saved', failed: 'Could not save. Try again.', hint: 'Optional. Only used to greet you.' },
  es: { label: 'Tu nombre', ph: 'Cómo te saluda Hoy', save: 'Guardar', saved: 'Guardado', failed: 'No se pudo guardar. Inténtalo de nuevo.', hint: 'Opcional. Solo lo usamos para saludarte.' },
  pt: { label: 'Seu nome', ph: 'Como o Hoje deve te cumprimentar', save: 'Salvar', saved: 'Salvo', failed: 'Não foi possível salvar. Tente de novo.', hint: 'Opcional. Só usamos para te cumprimentar.' },
};

// You > profile: the optional name Today greets with (max 40 characters).
export function YouName({ initial, locale }: { initial: string | null; locale: AppLocale | string }) {
  const c = COPY[(locale === 'es' || locale === 'pt' ? locale : 'en') as 'en' | 'es' | 'pt'];
  const [name, setName] = useState(initial ?? '');
  const [state, setState] = useState<'idle' | 'busy' | 'saved' | 'error'>('idle');
  async function save() {
    setState('busy');
    const r = await fetch('/api/account/name', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name }) }).catch(() => null);
    if (!r?.ok) { setState('error'); return; }
    setName(((await r.json()) as { name: string | null }).name ?? '');
    setState('saved');
  }
  return (
    <form className="s-col" style={{ gap: 6, minWidth: 0 }} onSubmit={(e) => { e.preventDefault(); void save(); }}>
      <label className="s-lab" htmlFor="you-name">{c.label}</label>
      <span className="s-row" style={{ gap: 8 }}>
        <input id="you-name" className="s-in" value={name} maxLength={40} autoComplete="given-name" placeholder={c.ph}
          onChange={(e) => { setName(e.target.value); setState('idle'); }} style={{ maxWidth: 260 }} aria-describedby="you-name-hint" />
        <button type="submit" className="s-btn sec" disabled={state === 'busy'}>{state === 'saved' ? <><Check size={14} />{c.saved}</> : c.save}</button>
      </span>
      <span id="you-name-hint" className="s-sub-t" style={{ fontSize: 12 }} role={state === 'error' ? 'alert' : undefined}>{state === 'error' ? c.failed : c.hint}</span>
    </form>
  );
}
