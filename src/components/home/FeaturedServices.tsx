import { getPublicData } from "@/lib/public-api";
import { ServicesGrid } from "./services-grid";
export async function FeaturedServices() {
  const c = (await getPublicData()).homepage?.copy || {};
  return (
    <section className="section container" id="dich-vu">
      <div className="center-heading">
        <p className="eyebrow">{c.servicesEyebrow}</p>
        <h2>{c.servicesTitle}</h2>
        <span />
      </div>
      <ServicesGrid />
    </section>
  );
}
