"use client";

import { useState } from "react";
import { usePublicSite } from "@/features/dialog/dialog-provider";
import { ActionButton } from "@/components/ui/action-button";
import { ResponsiveImage } from "@/components/ui/responsive-image";

export function PhotoGallery() {
  const data = usePublicSite();
  const photos = data.content.filter((item) => item.kind === "gallery");
  const [selected, setSelected] = useState(() =>
    Math.max(
      0,
      photos.findIndex(
        (photo) => photo.slug === data.homepage?.galleryInitialSlug,
      ),
    ),
  );
  const thumbnails = (data.homepage?.galleryThumbnailSlugs || [])
    .map((slug) => photos.findIndex((photo) => photo.slug === slug))
    .filter((index) => index >= 0);
  const indices =
    thumbnails.length === 3
      ? thumbnails
      : photos.slice(0, 3).map((_, index) => index);
  const photo = photos[selected];
  if (!photo) return <p>Hình ảnh đang được cập nhật.</p>;
  return (
    <div className="photo-gallery">
      <div className="photo-thumbs" id="photo-thumbs">
        {indices.map((index) => (
          <button
            key={photos[index]._id}
            aria-label={`Xem ảnh: ${photos[index].name}`}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            {photos[index].image && (
              <ResponsiveImage
                src={photos[index].image}
                alt={photos[index].name}
                sizes="100px"
              />
            )}
          </button>
        ))}
      </div>
      <ActionButton
        className="photo-main"
        id="photo-main"
        action={{ type: "gallery", index: selected }}
      >
        {photo.image && <ResponsiveImage src={photo.image} alt={photo.name} />}
        <span>{photo.name}</span>
      </ActionButton>
    </div>
  );
}
