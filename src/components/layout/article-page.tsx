import { notFound } from "next/navigation";
import { getArticle } from "@/lib/public-api";
import { DetailLayout } from "./detail-layout";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { serializeJsonLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";

export async function articleMetadata(
  slug: string,
  category: string,
  prefix: string,
) {
  const article = await getArticle(slug);
  if (!article || article.category !== category) notFound();
  const metadata = pageMetadata(
    article.title,
    article.excerpt,
    `/${prefix}/${slug}/`,
    article.image,
  );
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article" } };
}
export async function ArticlePage({
  slug,
  category,
  prefix,
  categoryTitle,
}: {
  slug: string;
  category: string;
  prefix: string;
  categoryTitle: string;
}) {
  const article = await getArticle(slug);
  if (!article || article.category !== category) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    ...(article.image ? { image: absoluteUrl(article.image) } : {}),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: absoluteUrl(`/${prefix}/${slug}/`),
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
  return (
    <DetailLayout
      title={article.title}
      category={categoryTitle}
      categoryHref={`/${prefix}/`}
      path={`/${prefix}/${slug}/`}
    >
      <article className="blog-article">
        <div className="blog-article-meta">
          {article.publishedAt && (
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
              })}
            </time>
          )}
          <span>
            {Math.max(
              1,
              Math.ceil(
                article.body
                  .replace(/<[^>]*>/g, " ")
                  .split(/\s+/)
                  .filter(Boolean).length / 200,
              ),
            )}{" "}
            phút đọc
          </span>
        </div>
        <p className="blog-article-excerpt">{article.excerpt}</p>
        {article.image && (
          <ResponsiveImage
            className="detail-image"
            src={article.image}
            alt={article.title}
            sizes="(max-width: 960px) 100vw, 900px"
            loading="eager"
          />
        )}
        <div
          className="article-text blog-prose"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
      />
    </DetailLayout>
  );
}
