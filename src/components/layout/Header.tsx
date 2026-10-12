"use client";
import { useState } from "react";
import { SiteLink } from "@/components/ui/site-link";
import { usePublicSite } from "@/features/dialog/dialog-provider";
import { Icon } from "@/components/ui/icon";
import { ActionButton } from "@/components/ui/action-button";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { IntroductionMenu } from "./introduction-menu";
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const data = usePublicSite();
  const c = data.homepage?.copy || {};
  const phone = data.settings?.phone || "";
  return (
    <header className="site-header">
      <div className="container masthead">
        <SiteLink
          className="identity"
          href="/"
          aria-label={data.homepage?.logoAlt}
        >
          {data.homepage?.logo && (
            <ResponsiveImage
              src={data.homepage.logo}
              alt={data.homepage.logoAlt}
              sizes="230px"
              loading="eager"
            />
          )}
        </SiteLink>
        <ActionButton className="header-search" action={{ type: "search" }}>
          <span>{c.headerSearch}</span>
          <Icon name="search" />
        </ActionButton>
        <SiteLink className="hotline" href={`tel:${phone.replace(/\s/g, "")}`}>
          <Icon name="phone" />
          <span>
            {c.headerConsult}
            <strong>{phone}</strong>
          </span>
        </SiteLink>
        <ActionButton className="button outline" action={{ type: "booking" }}>
          <Icon name="calendar" /> {c.headerBooking}
        </ActionButton>
        <button
          className="icon-button"
          id="menu-toggle"
          aria-controls="navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name="menu" />
        </button>
      </div>
      <div className="navigation-bar">
        <nav
          id="navigation"
          className={menuOpen ? "container open" : "container"}
          aria-label="Điều hướng chính"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setMenuOpen(false);
          }}
        >
          <IntroductionMenu onNavigate={() => setMenuOpen(false)} />
          {data.homepage?.navigation.map((link, index) => (
            <SiteLink key={index} href={link.href}>
              {link.label}
            </SiteLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
