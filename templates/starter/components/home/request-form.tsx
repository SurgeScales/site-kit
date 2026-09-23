'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { brand, contact } from '@/lib/brand';

/**
 * Two fields: what the next step needs and nothing more. Static export has no backend, so this opens the
 * visitor's mail app with the request filled in; swap `send` for a real endpoint when the site has one.
 */
export function RequestForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');

  function send(form: FormData) {
    setState('sending');
    const body = `Business: ${form.get('business')}\nReply to: ${form.get('email')}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(brand.primaryCta.label)}&body=${encodeURIComponent(body)}`;
    window.setTimeout(() => setState('sent'), 600);
  }

  if (state === 'sent') {
    return (
      <p role="status" className="text-lg">
        Your mail app has the request ready. We reply within one working day.
      </p>
    );
  }

  return (
    <form action={send} className="grid grid-cols-1 gap-4 sm:grid-cols-[1.2fr_1fr_auto] sm:items-end">
      <label className="flex flex-col gap-2 text-sm text-ink-soft">
        Business name and city
        <input name="business" required className="h-11 rounded-lg border border-input bg-foreground/[0.04] px-4 text-base text-foreground outline-none focus:border-primary" />
      </label>
      <label className="flex flex-col gap-2 text-sm text-ink-soft">
        Work email
        <input name="email" type="email" required className="h-11 rounded-lg border border-input bg-foreground/[0.04] px-4 text-base text-foreground outline-none focus:border-primary" />
      </label>
      <Button type="submit" size="lg" disabled={state === 'sending'}>
        {state === 'sending' ? <Loader2 className="animate-spin" /> : null}
        {brand.primaryCta.label}
      </Button>
    </form>
  );
}
