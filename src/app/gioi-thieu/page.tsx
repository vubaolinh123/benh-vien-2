import { ResponsiveImage } from "@/components/ui/responsive-image";
import { SiteLink } from "@/components/ui/site-link";
import { getPublicData, getContent } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";
export const revalidate = 60;
export async function generateMetadata() {
  const page = await getContent("page", "gioi-thieu");
  return pageMetadata(
    page?.name || "Giới thiệu",
    page?.summary ||
      "Tìm hiểu Bệnh viện Đa khoa Đại An — Sáng y đức, giỏi y thuật.",
    "/gioi-thieu/",
    page?.image,
  );
}
export default async function Page() {
  const [data, page] = await Promise.all([
    getPublicData(),
    getContent("page", "gioi-thieu"),
  ]);
  return (
    <main id="main" className="container detail-page">
      <SiteLink href="/">← Trang chủ</SiteLink>
      <h1>{page?.name || "Giới thiệu Bệnh viện Đa khoa Đại An"}</h1>
      {page?.summary && <p>{page.summary}</p>}
      {page?.image && (
        <ResponsiveImage
          className="detail-image"
          src={page.image}
          alt={page.name}
          loading="eager"
        />
      )}
      <div
        className="article-text blog-prose"
        dangerouslySetInnerHTML={{
          __html: page ? page.body : data.settings?.introduction || "",
        }}
      />
      <SiteLink className="button" href="/lien-he/">
        Liên hệ bệnh viện
      </SiteLink>
    </main>
  );
}
