import { SiteLink } from '@/components/ui/site-link';
import { getArticles } from '@/lib/public-api';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { MoreArticles } from '@/components/ui/more-articles';

export async function ArticleList({ category, prefix, title }: { category: string; prefix: string; title: string }) {
  const data = await getArticles(category);
  return <main id="main" className="container detail-page"><SiteLink href="/">← Trang chủ</SiteLink><h1>{title}</h1><div className="news-grid">{data.items.map(item => <article className="news-card" key={item._id}><SiteLink href={`/${prefix}/${item.slug}/`}>{item.image && <ResponsiveImage className="detail-image" src={item.image} alt={item.title} />}<div className="news-body"><h2>{item.title}</h2><p>{item.excerpt}</p></div></SiteLink></article>)}</div>{!data.items.length && <p>Nội dung đang được cập nhật. Vui lòng liên hệ bệnh viện nếu bạn cần hỗ trợ.</p>}{data.total > data.items.length && <MoreArticles category={category} prefix={prefix} initialPage={1} />}</main>;
}
