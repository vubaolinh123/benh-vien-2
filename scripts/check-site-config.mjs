const origin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true' && !origin) {
  throw new Error('Set NEXT_PUBLIC_SITE_URL before enabling search indexing.');
}
if (origin) {
  const url = new URL(origin);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTPS origin, for example https://your-domain.vn');
  }
}
console.log(`SEO origin: ${origin || 'https://benhviendaian.vn'}; indexing: ${process.env.NEXT_PUBLIC_ALLOW_INDEXING !== 'false'}`);
