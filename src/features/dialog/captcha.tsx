'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
interface Turnstile { render(element: HTMLElement, options: { sitekey: string; callback: (token: string) => void; 'expired-callback': () => void; 'error-callback': () => void }): string; remove(id: string): void }
declare global { interface Window { turnstile?: Turnstile } }
export function Captcha({ onToken, resetKey }: { onToken: (token: string) => void; resetKey: number }) {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const container = useRef<HTMLDivElement>(null); const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!key || !ready || !container.current || !window.turnstile) return;
    const id = window.turnstile.render(container.current, { sitekey: key, callback: onToken, 'expired-callback': () => onToken(''), 'error-callback': () => onToken('') });
    return () => window.turnstile?.remove(id);
  }, [key, ready, resetKey, onToken]);
  if (!key) return null;
  return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setReady(true)} /><div ref={container} /></>;
}
