"use client";
import { SiteLink } from "@/components/ui/site-link";

import { useState } from "react";
import { usePublicSite } from "@/features/dialog/dialog-provider";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { Icon } from "@/components/ui/icon";

export function ServicesGrid() {
  const [expanded, setExpanded] = useState(false);
  const data = usePublicSite();
  const copy = data.homepage?.copy || {};
  const specialties = data.content.filter((item) => item.kind === "service");
  return (
    <>
      <div id="specialty-grid" className="specialty-grid">
        {specialties.slice(0, expanded ? specialties.length : 6).map((s) => (
          <SiteLink
            className="specialty-card"
            href={`/dich-vu/${s.slug}/`}
            key={s.slug}
          >
            {s.image === "/assets/design-reference.png" ? (
              <div
                className={`reference-photo ${s.slug === "tai-mui-hong" ? "ent" : ""}`}
                role="img"
                aria-label={`Ảnh minh họa ${s.name}`}
              />
            ) : (
              s.image && (
                <ResponsiveImage
                  className="specialty-photo"
                  src={s.image}
                  alt={s.name}
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              )
            )}
            <div className="specialty-body">
              <h3>{s.name}</h3>
              <p>{s.summary}</p>
              <span className="card-arrow">
                <Icon name="arrow" />
              </span>
            </div>
          </SiteLink>
        ))}
      </div>
      <div className="center-action">
        <button
          className="text-link"
          id="all-specialties"
          aria-expanded={expanded}
          aria-controls="specialty-grid"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? copy.servicesLess : copy.servicesMore}{" "}
          <Icon name="arrow" />
        </button>
      </div>
    </>
  );
}
