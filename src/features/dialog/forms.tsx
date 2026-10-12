'use client';
import { SiteLink } from '@/components/ui/site-link';


import { useRef, useState, type FormEvent } from 'react';
import { usePublicSite } from './dialog-provider';
import { api } from '@/lib/client-api';
import { Captcha } from './captcha';

function localDate() { return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }); }
function Honeypot() { return <label className="form-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>; }
function Consent() { return <label className="consent-field"><input type="checkbox" name="consent" required /> Tôi đồng ý cung cấp thông tin để bệnh viện liên hệ xử lý yêu cầu theo <SiteLink href="/chinh-sach/privacy/" target="_blank" rel="noopener">chính sách bảo mật</SiteLink>.</label>; }

export function BookingForm({ specialty = '' }: { specialty?: string }) {
  const services = usePublicSite().content.filter(item => item.kind === 'service');
  const [reference, setReference] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const [captcha, setCaptcha] = useState(''); const [resetKey, setResetKey] = useState(0); const requestId = useRef('');
  const [dateBounds] = useState(() => ({ min: localDate(), max: new Date(Date.now() + 180 * 86400000).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }) }));
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const data = new FormData(event.currentTarget); setBusy(true); setError('');
    requestId.current ||= crypto.randomUUID();
    try {
      const result = await api<{ reference: string }>('/public/appointments', { method: 'POST', headers: { 'X-Idempotency-Key': requestId.current }, body: JSON.stringify({ name: data.get('name'), phone: data.get('phone'), service: data.get('service'), date: data.get('date'), session: data.get('session'), message: data.get('message'), consent: data.get('consent') === 'on', website: data.get('website'), captcha }) });
      setReference(result.reference);
    } catch (error) { setError((error as Error).message); setCaptcha(''); setResetKey(value => value + 1); } finally { setBusy(false); }
  }
  if (reference) return <div className="success" role="status"><div className="success-icon">✓</div><h3>Đã tiếp nhận yêu cầu đặt lịch</h3><p>Mã đăng ký: <strong>{reference}</strong></p><p>Bộ phận chăm sóc khách hàng sẽ liên hệ để xác nhận lịch khám. Việc gửi yêu cầu chưa tự động tạo lịch khám đã xác nhận.</p><SiteLink className="button" href="/lien-he/">Thông tin liên hệ</SiteLink></div>;
  if (!services.length) return <p>Vui lòng gọi hotline để được hướng dẫn đặt lịch khám.</p>;
  return <><p className="modal-intro">Gửi thông tin để bộ phận chăm sóc khách hàng liên hệ xác nhận. Không nhập bệnh án hoặc thông tin sức khỏe nhạy cảm.</p><form id="booking-form" onSubmit={submit}><div className="form-grid"><label className="field">Họ và tên *<input name="name" required minLength={2} maxLength={80} autoComplete="name" /></label><label className="field">Số điện thoại *<input name="phone" required type="tel" inputMode="tel" pattern="0[0-9]{9}" title="Nhập 10 chữ số, bắt đầu bằng 0" autoComplete="tel" /></label><label className="field">Dịch vụ *<select name="service" required defaultValue={specialty}><option value="">Chọn dịch vụ</option>{services.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label><label className="field">Ngày khám dự kiến *<input name="date" type="date" min={dateBounds.min} max={dateBounds.max} required /></label><label className="field full">Buổi khám<select name="session"><option value="morning">Buổi sáng</option><option value="afternoon">Buổi chiều</option></select></label><label className="field full">Lời nhắn<textarea name="message" maxLength={1000} placeholder="Nhu cầu hỗ trợ về lịch khám…" /></label></div><Honeypot /><Consent /><Captcha onToken={setCaptcha} resetKey={resetKey} />{error && <p className="form-error" role="alert">{error}</p>}<button className="button form-submit" type="submit" disabled={busy || Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !captcha)}>{busy ? 'Đang gửi…' : 'Gửi đăng ký khám'}</button></form></>;
}

export function FeedbackForm() {
  const [sent, setSent] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const [captcha, setCaptcha] = useState(''); const [resetKey, setResetKey] = useState(0);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return; const data = new FormData(event.currentTarget); setBusy(true); setError('');
    try { await api('/public/feedback', { method: 'POST', body: JSON.stringify({ name: data.get('name'), phone: data.get('phone'), message: data.get('message'), consent: data.get('consent') === 'on', website: data.get('website'), captcha }) }); setSent(true); }
    catch (error) { setError((error as Error).message); setCaptcha(''); setResetKey(value => value + 1); } finally { setBusy(false); }
  }
  if (sent) return <div role="status"><h3>Đã tiếp nhận góp ý của bạn</h3><p>Bộ phận chăm sóc khách hàng sẽ xem xét và phản hồi khi có thông tin liên hệ.</p></div>;
  return <form id="feedback-form" onSubmit={submit}><div className="form-grid"><label className="field">Họ và tên<input name="name" maxLength={80} autoComplete="name" /></label><label className="field">Số điện thoại<input name="phone" type="tel" pattern="0[0-9]{9}" autoComplete="tel" /></label><label className="field full">Nội dung góp ý *<textarea name="message" required minLength={10} maxLength={2000} /></label></div><Honeypot /><Consent /><Captcha onToken={setCaptcha} resetKey={resetKey} />{error && <p role="alert">{error}</p>}<button className="button form-submit" disabled={busy || Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !captcha)}>{busy ? 'Đang gửi…' : 'Gửi góp ý'}</button></form>;
}
