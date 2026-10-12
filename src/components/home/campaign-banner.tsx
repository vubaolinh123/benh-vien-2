"use client";
import { SiteLink } from "@/components/ui/site-link";

import { useState } from "react";
import { usePublicSite } from "@/features/dialog/dialog-provider";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { ActionButton } from "@/components/ui/action-button";

export function CampaignBanner() {
  const data = usePublicSite();
  const copy = data.homepage?.copy || {};
  const banners = data.content.filter((item) => item.kind === "banner");
  const [current, setCurrent] = useState(0);
  if (!banners.length)
    return (
      <section className="campaign-empty">
        <h2>{copy.bannerEmpty}</h2>
        <ActionButton className="button" action={{ type: "booking" }}>
          {copy.headerBooking}
        </ActionButton>
      </section>
    );
  return (
    <section className="campaign campaign-full" aria-label="Thông tin nổi bật">
      {banners.map((banner, index) => {
        // Banners are image-only: the whole picture is shown and, when a link is set, is the click target.
        const image = banner.image && (
          <ResponsiveImage
            className="cover-banner"
            src={banner.image}
            alt={banner.name}
            sizes="100vw"
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        );
        return (
          <div
            className={`campaign-slide ${current === index ? "active" : ""}`}
            key={banner._id}
            hidden={current !== index}
          >
            {banner.link ? (
              <SiteLink
                className="campaign-link"
                href={banner.link}
                aria-label={banner.name}
              >
                {image}
              </SiteLink>
            ) : (
              image
            )}
          </div>
        );
      })}
      {banners.length > 1 && (
        <>
          <button
            className="slide-arrow prev"
            aria-label="Banner trước"
            onClick={() =>
              setCurrent((current + banners.length - 1) % banners.length)
            }
          >
            ‹
          </button>
          <button
            className="slide-arrow next"
            aria-label="Banner sau"
            onClick={() => setCurrent((current + 1) % banners.length)}
          >
            ›
          </button>
          <div className="slide-dots" role="group" aria-label="Chọn banner">
            {banners.map((banner, index) => (
              <button
                key={banner._id}
                aria-label={`Banner ${index + 1}`}
                aria-pressed={current === index}
                className={current === index ? "selected" : ""}
                onClick={() => setCurrent(index)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
