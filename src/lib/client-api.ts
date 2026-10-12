'use client';

let csrf = '';
export function setCsrf(value: string) { csrf = value; }
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (init.method && init.method !== 'GET') headers.set('X-CSRF-Token', csrf);
  const response = await fetch(`/api${path}`, { ...init, headers, credentials: 'same-origin', cache: 'no-store' });
  if (!response.ok) { const error = await response.json().catch(() => ({ message: 'Không thể kết nối hệ thống.' })); throw new Error(error.message ?? `Yêu cầu thất bại (${response.status})`); }
  if (response.status === 204) return undefined as T;
  return await response.json() as T;
}
