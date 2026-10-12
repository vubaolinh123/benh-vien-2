"use client";
import { SiteLink } from "@/components/ui/site-link";

import { ActionButton } from "@/components/ui/action-button";
import { Icon } from "@/components/ui/icon";
import { usePublicSite } from "@/features/dialog/dialog-provider";

export function ContactControls() {
  const data = usePublicSite();
  const settings = data.settings;
  const phone = settings?.phone || "0947 907 636";
  return (
    <>
      <div className="sticky-contact">
        <SiteLink href={`tel:${phone.replace(/\s/g, "")}`}>
          <Icon name="phone" /> {phone}
        </SiteLink>
        <ActionButton action={{ type: "booking" }}>
          <Icon name="calendar" /> {data.homepage?.copy.stickyBooking}
        </ActionButton>
      </div>
      <div className="floating-contact">
        <SiteLink
          href={settings?.facebook || "https://www.facebook.com/bvdkdaian/"}
          target="_blank"
          rel="noopener"
          aria-label="Liên hệ fanpage"
        >
          <Icon name="message" />
        </SiteLink>
        <button
          id="back-top"
          aria-label="Về đầu trang"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "instant"
                : "smooth",
            })
          }
        >
          ↑
        </button>
      </div>
    </>
  );
}
