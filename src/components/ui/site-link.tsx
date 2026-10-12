import Link from 'next/link';
import type { AnchorHTMLAttributes } from 'react';

// Disable automatic prefetch to avoid background API/ISR requests for every card.
export function SiteLink({ href = '', children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith('/') && !href.startsWith('//') && !props.target) return <Link href={href} prefetch={false} {...props}>{children}</Link>;
  return <a href={href} {...props}>{children}</a>;
}
