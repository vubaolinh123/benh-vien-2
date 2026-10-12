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
    <section className="campaign" aria-label="Thông tin nổi bật">
      {banners.map((banner, index) => (
        <div
          className={`campaign-slide ${banner.summary ? "community-slide" : ""} ${current === index ? "active" : ""}`}
          key={banner._id}
          hidden={current !== index}
        >
          {banner.summary ? (
            <div className="container campaign-inner">
              <div>
                <p className="eyebrow">
                  {banner.eyebrow || copy.bannerEyebrow}
                </p>
                <h2>
                  {banner.name.split(". ").map((line, order) => (
                    <span
                      key={order}
                      className={order === 0 ? "banner-title-first" : undefined}
                    >
                      {line}
                      {order === 0 && ". "}
                      {order === 0 && <br />}
                    </span>
                  ))}
                </h2>
                <p>{banner.summary}</p>
                {banner.link ? (
                  <SiteLink className="button" href={banner.link}>
                    {banner.buttonLabel || copy.bannerMore}
                  </SiteLink>
                ) : (
                  <ActionButton className="button" action={{ type: "booking" }}>
                    {banner.buttonLabel || copy.bannerBooking}
                  </ActionButton>
                )}
              </div>
              {banner.image && (
                <ResponsiveImage
                  src={banner.image}
                  alt={banner.name}
                  sizes="(max-width:800px) 90vw, 590px"
                  loading="lazy"
                />
              )}
            </div>
          ) : (
            <>
              {banner.image && (
                <ResponsiveImage
                  className="cover-banner"
                  src={banner.image}
                  alt={banner.name}
                  sizes="100vw"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
              )}
              {banner.link ? (
                <SiteLink className="banner-book" href={banner.link}>
                  {banner.buttonLabel || copy.bannerMore}
                </SiteLink>
              ) : (
                <ActionButton
                  className="banner-book"
                  action={{ type: "booking" }}
                >
                  {banner.buttonLabel || copy.bannerBooking}
                </ActionButton>
              )}
            </>
          )}
        </div>
      ))}
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
