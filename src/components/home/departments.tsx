import { SiteLink } from "@/components/ui/site-link";
import { getPublicData } from "@/lib/public-api";
import { Icon } from "@/components/ui/icon";

export async function Departments() {
  const items = (await getPublicData()).content.filter(
    (item) => item.kind === "specialty",
  );
  return (
    <div className="department-grid" id="department-grid">
      {items.map((item) => (
        <SiteLink
          key={item._id}
          href={`/chuyen-khoa/${item.slug}/`}
          data-icon={item.icon || "cross"}
        >
          <i>
            <Icon name={item.icon || "cross"} />
          </i>
          <strong>{item.name}</strong>
        </SiteLink>
      ))}
    </div>
  );
}
