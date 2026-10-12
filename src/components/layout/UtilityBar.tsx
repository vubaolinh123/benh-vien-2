import { SiteLink } from "@/components/ui/site-link";
import { getPublicData } from "@/lib/public-api";
export async function UtilityBar() {
  const data = await getPublicData();
  const c = data.homepage?.copy || {};
  const phone = data.settings?.phone || "";
  return (
    <div className="utility">
      <div className="container">
        <span>{c.tagline}</span>
        <div>
          <SiteLink href="/gioi-thieu/">{c.utilityExplore}</SiteLink>
          <SiteLink href={`tel:${phone.replace(/\s/g, "")}`}>
            Hotline: <b>{phone}</b>
          </SiteLink>
        </div>
      </div>
    </div>
  );
}
