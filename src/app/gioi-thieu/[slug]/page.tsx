import { ResponsiveImage } from "@/components/ui/responsive-image";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";
import { DetailLayout } from "@/components/layout/detail-layout";
import { SiteLink } from "@/components/ui/site-link";
import { Editorial } from "@/components/home/editorial";
const titles: Record<string, string> = {
  "su-menh-tam-nhin": "Sứ mệnh – tầm nhìn",
  "he-thong-y-te": "Hệ thống y tế Đại An",
  "hoat-dong": "Hoạt động Bệnh viện Đại An",
  "van-hoa-doanh-nghiep": "Văn hóa doanh nghiệp tại Bệnh viện Đại An",
};
export const revalidate = 60;
export function generateStaticParams() {
  return Object.keys(titles).map((slug) => ({ slug }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!titles[slug]) notFound();
  const page = await getContent("page", slug);
  return pageMetadata(
    page?.name || titles[slug],
    page?.summary || `${titles[slug]} tại Bệnh viện Đa khoa Đại An.`,
    `/gioi-thieu/${slug}/`,
    page?.image,
  );
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!titles[slug]) notFound();
  const page = await getContent("page", slug);
  return (
    <DetailLayout
      title={page?.name || titles[slug]}
      category="Giới thiệu"
      categoryHref="/gioi-thieu/"
      path={`/gioi-thieu/${slug}/`}
    >
      {page?.summary && <p>{page.summary}</p>}
      {page?.image && (
        <ResponsiveImage
          className="detail-image"
          src={page.image}
          alt={page.name}
          loading="eager"
        />
      )}
      {page?.body ? (
        <div
          className="article-text blog-prose"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
      ) : (
        slug !== "hoat-dong" && (
          <p>
            Nội dung đang được cập nhật. Vui lòng liên hệ bệnh viện để biết thêm
            thông tin.
          </p>
        )
      )}
      {slug === "hoat-dong" && <Editorial variant="featured" />}
      <div className="detail-actions">
        <SiteLink className="button" href="/lien-he/">
          Liên hệ Đại An
        </SiteLink>
      </div>
    </DetailLayout>
  );
}
