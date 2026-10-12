import type { ReactNode } from "react";
import type { ContentItem } from "@/types/content";
import { ActionButton } from "@/components/ui/action-button";
import { SiteLink } from "@/components/ui/site-link";

export function ContentAction({
  item,
  children,
  className,
  gallery = [],
}: {
  item: ContentItem;
  children: ReactNode;
  className?: string;
  gallery?: ContentItem[];
}) {
  if (item.action === "booking" || item.action === "feedback")
    return (
      <ActionButton className={className} action={{ type: item.action }}>
        {children}
      </ActionButton>
    );
  if (item.action === "gallery")
    return (
      <ActionButton
        className={className}
        action={{
          type: "gallery",
          index: Math.max(
            0,
            gallery.findIndex((photo) => photo.slug === item.targetSlug),
          ),
        }}
      >
        {children}
      </ActionButton>
    );
  return (
    <SiteLink className={className} href={item.link || "/lien-he/"}>
      {children}
    </SiteLink>
  );
}
