'use client';

import dynamic from 'next/dynamic';
import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import type { DialogAction } from './types';
import type { PublicData } from '@/types/content';

const Dialog = dynamic(() => import('./dialog'), {
  ssr: false,
  loading: () => <div className="dialog-loading" role="status">Đang mở nội dung…</div>,
});
const DialogContext = createContext<((action: DialogAction) => void) | null>(null);
const SiteContext = createContext<PublicData>({ content: [], posts: [], settings: null });
export const usePublicSite = () => useContext(SiteContext);

export function DialogProvider({ children, data }: { children: ReactNode; data: PublicData }) {
  const [action, setAction] = useState<DialogAction | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  function open(next: DialogAction) {
    if (!action) previousFocus.current = document.activeElement as HTMLElement | null;
    setAction(next);
  }
  function close() {
    setAction(null);
    const target = previousFocus.current;
    requestAnimationFrame(() => target?.focus());
  }
  return <SiteContext.Provider value={data}><DialogContext.Provider value={open}>{children}{action && <Dialog key={JSON.stringify(action)} action={action} onClose={close} onNavigate={open} />}</DialogContext.Provider></SiteContext.Provider>;
}

export function useDialog() {
  const open = useContext(DialogContext);
  if (!open) throw new Error('Dialog controls must be inside DialogProvider');
  return open;
}
