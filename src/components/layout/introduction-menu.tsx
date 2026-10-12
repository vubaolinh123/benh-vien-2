'use client';

import { useState } from 'react';
import { SiteLink } from '@/components/ui/site-link';
import { usePublicSite } from '@/features/dialog/dialog-provider';
export function IntroductionMenu({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState(false); const config=usePublicSite().homepage;
  return <div className={`introduction-menu ${open ? 'is-open' : ''}`} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={event => { if (event.target.tagName !== 'BUTTON') setOpen(true); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); setOpen(false); event.currentTarget.querySelector<HTMLButtonElement>('button')?.focus(); } }}><div className="introduction-trigger"><SiteLink href="/gioi-thieu/" onClick={onNavigate}>{config?.copy.introMenuLabel}</SiteLink><button type="button" className="introduction-toggle" aria-label={open ? 'Đóng menu Giới thiệu' : 'Mở menu Giới thiệu'} aria-controls="introduction-submenu" aria-expanded={open} onClick={() => setOpen(!open)}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></button></div><div className="introduction-submenu" id="introduction-submenu" hidden={!open}>{config?.introductionMenu.map(({label:title, href}) => <SiteLink key={href} href={href} onClick={() => { setOpen(false); onNavigate(); }}>{title}</SiteLink>)}</div></div>;
}
