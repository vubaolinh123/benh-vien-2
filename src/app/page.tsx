import { CampaignBanner } from "@/components/home/campaign-banner";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { BookingStrip } from "@/components/home/BookingStrip";
import {
  Introduction,
  Team,
  Specialties,
  Facilities,
  PriceSection,
  Media,
  QuestionSection,
  News,
  Health,
  Support,
} from "@/components/home/home-content";
import { PromotionRow } from "@/components/home/promotion-row";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { getPublicData } from "@/lib/public-api";
import type { HomeSectionKey } from "@/types/content";
import { Fragment, type ReactNode } from "react";

export const revalidate = 60;
export async function generateMetadata() {
  const c = (await getPublicData()).homepage?.copy || {};
  return pageMetadata(
    c.seoTitle || site.name,
    c.seoDescription || site.description,
    "/",
  );
}
export default async function HomePage() {
  const data = await getPublicData();
  const sections: Record<HomeSectionKey, ReactNode> = {
    banner: <CampaignBanner />,
    services: <FeaturedServices />,
    introduction: <Introduction />,
    team: <Team />,
    specialties: <Specialties />,
    specialtyPromos: <PromotionRow variant="specialties" />,
    facilities: <Facilities />,
    price: <PriceSection />,
    media: <Media />,
    qa: <QuestionSection />,
    news: <News />,
    health: <Health />,
    support: <Support />,
    booking: <BookingStrip />,
  };
  return (
    <main id="main">
      <h1 className="visually-hidden">{data.homepage?.copy.mainTitle}</h1>
      {data.homepage?.sections
        .filter((section) => section.visible)
        .map((section) => (
          <Fragment key={section.key}>{sections[section.key]}</Fragment>
        ))}
    </main>
  );
}
