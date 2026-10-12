import { SiteLink } from "@/components/ui/site-link";
import { getPublicData } from "@/lib/public-api";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { ActionButton } from "@/components/ui/action-button";
export async function Footer() {
  const data = await getPublicData();
  const settings = data.settings;
  const config = data.homepage;
  const c = config?.copy || {};
  const phone = settings?.phone || "";
  return (
    <footer id="lien-he">
      <div className="container footer-grid expanded-footer">
        <div className="footer-brand">
          <SiteLink href="/">
            {config?.logo && (
              <ResponsiveImage
                src={config.logo}
                alt={config.logoAlt}
                sizes="230px"
              />
            )}
          </SiteLink>
          <h3>{settings?.name}</h3>
          <p className="home-multiline">{c.footerSlogan}</p>
          <p>
            {c.footerConsult}
            <SiteLink href={`tel:${phone.replace(/\s/g, "")}`}>
              <strong>{phone}</strong>
            </SiteLink>
          </p>
          <div className="footer-divider">
            <SiteLink href="/chinh-sach/privacy/">
              {c.footerPolicyLabel}
            </SiteLink>
            <SiteLink href="/chinh-sach/disclaimer/">
              {c.footerTermsLabel}
            </SiteLink>
          </div>
          <h3>{c.footerSocialTitle}</h3>
          <div className="social-links">
            {settings?.facebook && (
              <SiteLink
                href={settings.facebook}
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
              >
                f
              </SiteLink>
            )}
            {settings?.tiktok && (
              <SiteLink
                href={settings.tiktok}
                target="_blank"
                rel="noopener"
                aria-label="TikTok"
              >
                ♪
              </SiteLink>
            )}
          </div>
          <p>{c.footerSocialNote}</p>
        </div>
        <div>
          <h3>{settings?.name}</h3>
          <p>{settings?.address}</p>
          <SiteLink
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${settings?.name || ""} ${settings?.address || ""}`)}`}
            target="_blank"
            rel="noopener"
          >
            {c.footerMapLabel}
          </SiteLink>
          <SiteLink href={`tel:${phone.replace(/\s/g, "")}`}>
            {c.footerHotline} <strong>{phone}</strong>
          </SiteLink>
          {settings?.email && (
            <SiteLink href={`mailto:${settings.email}`}>
              {settings.email}
            </SiteLink>
          )}
          <div className="footer-divider">
            <h3>{c.footerHoursTitle}</h3>
            <p>{settings?.workingHours}</p>
            <ActionButton className="button" action={{ type: "booking" }}>
              {c.headerBooking}
            </ActionButton>
          </div>
        </div>
        <div>
          <h3>{c.footerSupportTitle}</h3>
          {config?.footerSupport.map((link, index) => (
            <SiteLink key={index} href={link.href}>
              {link.label}
            </SiteLink>
          ))}
          <ActionButton action={{ type: "feedback" }}>
            {c.footerFeedback}
          </ActionButton>
          <div className="footer-divider">
            <h3>{c.footerInfoTitle}</h3>
            {config?.footerInfo.map((link, index) => (
              <SiteLink key={index} href={link.href}>
                {link.label}
              </SiteLink>
            ))}
            <SiteLink href="/admin/">{c.footerStaff}</SiteLink>
          </div>
        </div>
      </div>
      <div className="copyright">
        © {new Date().getFullYear()} {c.footerCopyright}
      </div>
    </footer>
  );
}
