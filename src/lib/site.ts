const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const site = {
  name: 'Bệnh viện Đa khoa Đại An',
  description: 'Bệnh viện Đa khoa Đại An — Sáng y đức, giỏi y thuật. Thông tin dịch vụ, chuyên khoa và hướng dẫn khám bệnh cho bạn và gia đình.',
  url: configuredOrigin ? new URL(configuredOrigin).origin : 'https://benhviendaian.vn',
  indexable: process.env.NEXT_PUBLIC_ALLOW_INDEXING !== 'false',
  phone: '0947 907 636',
  email: 'benhviendakhoadaian.vn@gmail.com',
  address: 'Quốc lộ 45, xã Thiệu Trung, tỉnh Thanh Hóa',
};

export function absoluteUrl(path: string) { return new URL(path, `${site.url}/`).toString(); }
