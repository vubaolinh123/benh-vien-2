import { getPublicData } from "@/lib/public-api";
import { Icon } from "@/components/ui/icon";
import { ContentAction } from "./content-action";
export async function QuickServices() {
  const data = await getPublicData();
  return (
    <div className="quick-services">
      {data.content
        .filter((item) => item.kind === "support_link")
        .map((item) => (
          <ContentAction
            key={item._id}
            item={item}
            className="quick-item"
            gallery={data.content.filter((photo) => photo.kind === "gallery")}
          >
            <span className="quick-icon">
              <Icon name={item.icon || "cross"} />
            </span>
            <span>
              <strong>{item.name}</strong>
              <small>{item.summary}</small>
            </span>
          </ContentAction>
        ))}
    </div>
  );
}
