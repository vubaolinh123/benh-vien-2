'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function VisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    const key = `visit:${new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })}:${pathname}`;
    try { if (sessionStorage.getItem(key)) return; } catch { /* Storage is optional. */ }
    const timer = window.setTimeout(() => {
      void fetch('/api/public/visits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: pathname }), keepalive: true }).then(response => {
        if (response.ok) { try { sessionStorage.setItem(key, '1'); } catch { /* Storage is optional. */ } }
      }).catch(() => {});
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [pathname]);
  return null;
}
