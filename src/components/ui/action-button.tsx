'use client';

import type { ButtonHTMLAttributes } from 'react';
import { useDialog } from '@/features/dialog/dialog-provider';
import type { DialogAction } from '@/features/dialog/types';

export function ActionButton({ action, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { action: DialogAction }) {
  const open = useDialog();
  return <button type="button" {...props} onClick={() => open(action)}>{children}</button>;
}
