import { getPublicData } from "@/lib/public-api";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { ContentAction } from "./content-action";
export async function PromotionRow({
  variant,
}: {
  variant: "introduction" | "specialties";
}) {
  const data = await getPublicData();
  const cards = data.content.filter(
    (item) =>
      item.kind === "promotion" &&
      item.placement === (variant === "introduction" ? "intro" : "specialties"),
  );
  if (!cards.length) return null;
  return (
    <div className="container promo-row">
      {cards.map((item) => (
        <ContentAction
          key={item._id}
          item={item}
          className="promo-card"
          gallery={data.content.filter((photo) => photo.kind === "gallery")}
        >
          <span>
            <small>{item.eyebrow || data.homepage?.copy.promoEyebrow}</small>
            <strong>{item.name}</strong>
            {item.summary && <p>{item.summary}</p>}
            <em>{item.buttonLabel || data.homepage?.copy.promoButton}</em>
          </span>
          {item.image && (
            <ResponsiveImage
              src={item.image}
              alt={item.name}
              sizes="(max-width:540px) 32vw, 160px"
            />
          )}
        </ContentAction>
      ))}
    </div>
  );
}
