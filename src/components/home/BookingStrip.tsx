import { getPublicData } from "@/lib/public-api";
import { Icon } from "@/components/ui/icon";
import { ActionButton } from "@/components/ui/action-button";
export async function BookingStrip() {
  const c = (await getPublicData()).homepage?.copy || {};
  return (
    <section className="booking-strip">
      <div className="container">
        <div>
          <p>{c.bookingEyebrow}</p>
          <h2>{c.bookingTitle}</h2>
        </div>
        <ActionButton className="button white" action={{ type: "booking" }}>
          <Icon name="calendar" /> {c.bookingButton}
        </ActionButton>
      </div>
    </section>
  );
}
