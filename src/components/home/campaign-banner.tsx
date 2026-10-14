"use client";
import { SiteLink } from "@/components/ui/site-link";

import { useEffect, useState } from "react";
import { usePublicSite } from "@/features/dialog/dialog-provider";
import { ResponsiveImage } from "@/components/ui/responsive-image";

const AUTOPLAY_MS = 5000;
export function CampaignBanner() {
  const data = usePublicSite();
  // Banners are image-only and shown in the order set in the admin.
  const banners = data.content.filter(
    (item) => item.kind === "banner" && item.image,
  );
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = banners.length;
  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setCurrent((value) => (value + 1) % count),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(timer);
  }, [count, paused]);
  if (!count) return null;
  const active = Math.min(current, count - 1);
  return (
    <section
      className="campaign campaign-full"
      aria-label="Thông tin nổi bật"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {banners.map((banner, index) => {
        const image = (
          <ResponsiveImage
            className="cover-banner"
            src={banner.image!}
            alt={banner.name}
            sizes="100vw"
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        );
        return (
          <div
            className={`campaign-slide ${active === index ? "active" : ""}`}
            key={banner._id}
            hidden={active !== index}
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
      {count > 1 && (
        <>
          <button
            className="slide-arrow prev"
            aria-label="Banner trước"
            onClick={() => setCurrent((active + count - 1) % count)}
          >
            ‹
          </button>
          <button
            className="slide-arrow next"
            aria-label="Banner sau"
            onClick={() => setCurrent((active + 1) % count)}
          >
            ›
          </button>
          <div className="slide-dots" role="group" aria-label="Chọn banner">
            {banners.map((banner, index) => (
              <button
                key={banner._id}
                aria-label={`Banner ${index + 1}`}
                aria-pressed={active === index}
                className={active === index ? "selected" : ""}
                onClick={() => setCurrent(index)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
