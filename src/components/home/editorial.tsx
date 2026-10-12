import { SiteLink } from "@/components/ui/site-link";
import { getPublicData } from "@/lib/public-api";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { ContentAction } from "./content-action";
export async function Editorial({
  variant,
}: {
  variant: "featured" | "health" | "hospital";
}) {
  const data = await getPublicData();
  const limit = variant === "featured" ? 5 : 2;
  const stories = data.posts
    .filter((item) =>
      variant === "featured"
        ? item.category !== "qa"
        : item.category === (variant === "health" ? "health" : "news"),
    )
    .slice(0, limit);
  const extras = data.content
    .filter(
      (item) => item.kind === "editorial_link" && item.placement === variant,
    )
    .slice(0, Math.max(0, limit - stories.length));
  return (
    <div
      id={
        variant === "featured"
          ? "featured-news"
          : variant === "health"
            ? "health-stories"
            : "hospital-stories"
      }
      className={
        variant === "featured"
          ? "featured-news"
          : variant === "hospital"
            ? "hospital-stories"
            : undefined
      }
    >
      {stories.map((story, order) => (
        <article
          key={story._id}
          className={`editorial-card ${variant === "health" ? "horizontal-story" : variant === "featured" && order === 0 ? "editorial-lead" : ""}`}
        >
          <SiteLink
            href={`/${story.category === "health" ? "song-khoe" : "tin-tuc"}/${story.slug}/`}
          >
            {story.image && (
              <ResponsiveImage src={story.image} alt={story.title} />
            )}
            <h3>{story.title}</h3>
          </SiteLink>
          <p>{story.excerpt}</p>
        </article>
      ))}
      {extras.map((item) => (
        <article
          key={item._id}
          className={`editorial-card ${variant === "health" ? "horizontal-story" : ""}`}
        >
          <ContentAction
            item={item}
            gallery={data.content.filter((photo) => photo.kind === "gallery")}
          >
            {item.image && <ResponsiveImage src={item.image} alt={item.name} />}
            <h3>{item.name}</h3>
          </ContentAction>
          <p>{item.summary}</p>
        </article>
      ))}
    </div>
  );
}
