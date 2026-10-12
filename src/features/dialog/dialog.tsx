'use client';

import { useEffect, useRef } from 'react';
import { usePublicSite } from './dialog-provider';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { BookingForm, FeedbackForm } from './forms';
import { Search } from './search';
import type { DialogAction } from './types';

export default function Dialog({ action, onClose, onNavigate }: { action: DialogAction; onClose: () => void; onNavigate: (action: DialogAction) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const gallery = usePublicSite().content.filter(item => item.kind === 'gallery');
  const videos = usePublicSite().content.filter(item => item.kind === 'video');
  useEffect(() => { const dialog = ref.current; const previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; dialog?.showModal(); dialog?.querySelector<HTMLElement>('input,select,textarea,button,a')?.focus(); return () => { document.body.style.overflow = previousOverflow; }; }, []);
  let title = 'Thông tin Đại An'; let content;
  if (action.type === 'booking') { title = 'Đặt lịch khám'; content = <BookingForm specialty={action.specialty} />; }
  else if (action.type === 'feedback') { title = 'Góp ý – phản hồi'; content = <FeedbackForm />; }
  else if (action.type === 'search') { title = 'Tìm kiếm thông tin'; content = <Search />; }
  else if (action.type === 'video') { const video = videos[action.index]; title = video?.name || 'Thư viện video'; content = <>{video?.link?.startsWith('/assets/') && <video className="demo-video" controls playsInline preload="metadata" poster={video.image}><source src={video.link} type="video/mp4" /></video>}<p className="source-note">Video trình chiếu ảnh hoạt động từ fanpage Đại An.</p></>; }
  else if (action.type === 'gallery') { const photo = gallery[action.index]; title = photo?.name || 'Thư viện hình ảnh'; content = <>{photo?.image && <ResponsiveImage className="gallery-full" src={photo.image} alt={photo.name} sizes="90vw" loading="eager" />}<div className="gallery-nav">{gallery.map((item, index) => <button key={item._id} className="text-link" onClick={() => onNavigate({ type: 'gallery', index })}>{item.name}</button>)}</div></>; }
  return <dialog ref={ref} id="modal" aria-labelledby="modal-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target !== event.currentTarget) return; const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose(); }}><div id="modal-content"><p className="eyebrow modal-eyebrow">BỆNH VIỆN ĐA KHOA ĐẠI AN</p><h2 id="modal-title">{title}</h2>{content}</div><button className="modal-close icon-button" aria-label="Đóng hộp thoại" onClick={onClose}>×</button></dialog>;
}
