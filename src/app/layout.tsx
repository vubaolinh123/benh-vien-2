import { SiteLink } from "@/components/ui/site-link";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { ContactControls } from "@/components/layout/contact-controls";
import { DialogProvider } from "@/features/dialog/dialog-provider";
import { site } from "@/lib/site";
import { serializeJsonLd } from "@/lib/seo";
import "@/styles/base.css";
import "@/styles/styles.css";
import "@/styles/brand-fonts.css";
import "@/styles/migration.css";
import { getPublicData } from "@/lib/public-api";
import { VisitTracker } from "@/components/layout/visit-tracker";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: "%s | Đại An" },
  description: site.description,
  robots: { index: site.indexable, follow: site.indexable },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#294c96",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const data = await getPublicData();
  const settings = data.settings;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Hospital",
    "@id": `${site.url}/#hospital`,
    name: settings?.name || site.name,
    url: site.url,
    telephone: settings?.phone || "+84947907636",
    email: settings?.email || site.email,
    logo: new URL(data.homepage?.logo || "/assets/Dai_An-01.png", site.url)
      .href,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.address || site.address,
      addressCountry: "VN",
    },
    sameAs: [settings?.facebook, settings?.tiktok].filter(Boolean),
  };
  return (
    <html lang="vi">
      <body>
        <SiteLink className="skip" href="#main">
          Đến nội dung chính
        </SiteLink>
        <DialogProvider data={data}>
          <UtilityBar />
          <Header />
          {children}
          <Footer />
          <ContactControls />
          <VisitTracker />
        </DialogProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
        />
      </body>
    </html>
  );
}
