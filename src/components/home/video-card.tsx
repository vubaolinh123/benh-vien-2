import { SiteLink } from "@/components/ui/site-link";
import { ActionButton } from "@/components/ui/action-button";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import type { ContentItem } from "@/types/content";

export function VideoCard({
  video,
  index,
}: {
  video: ContentItem;
  index: number;
}) {
  const content = (
    <>
      {video.image && (
        <span className="video-image">
          <ResponsiveImage src={video.image} alt={video.name} />
          <i>▶</i>
        </span>
      )}
      <strong>{video.name}</strong>
      {video.summary && <small>{video.summary}</small>}
    </>
  );
  const className = `video-card ${index === 0 ? "video-lead" : ""}`;
  return video.link?.startsWith("/assets/") ? (
    <ActionButton className={className} action={{ type: "video", index }}>
      {content}
    </ActionButton>
  ) : (
    <SiteLink
      className={className}
      href={video.link}
      target="_blank"
      rel="noopener"
    >
      {content}
    </SiteLink>
  );
}
