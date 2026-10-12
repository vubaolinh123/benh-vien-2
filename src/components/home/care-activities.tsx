"use client";
import { useState } from "react";
import { usePublicSite } from "@/features/dialog/dialog-provider";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { ActionButton } from "@/components/ui/action-button";
export function CareActivities() {
  const data = usePublicSite();
  const activities = data.content.filter(
    (item) => item.kind === "care_activity",
  );
  const copy = data.homepage?.copy || {};
  const [selected, setSelected] = useState(0);
  const item = activities[selected] || activities[0];
  if (!item) return null;
  return (
    <>
      <div
        className="doctor-cards"
        id="doctor-cards"
        role="group"
        aria-label="Chọn hoạt động đội ngũ"
      >
        {activities.map((activity, index) => (
          <button
            key={activity._id}
            className="doctor-card"
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            {activity.image && (
              <ResponsiveImage
                src={activity.image}
                alt={activity.name}
                sizes="(max-width:800px) 180px, 220px"
              />
            )}
            <span>
              <small>{activity.eyebrow}</small>
              <strong>{activity.name}</strong>
              <small>{activity.qualification}</small>
            </span>
          </button>
        ))}
      </div>
      <div className="doctor-detail" id="doctor-detail" aria-live="polite">
        {item.image && (
          <ResponsiveImage src={item.image} alt={item.name} sizes="235px" />
        )}
        <div>
          <p className="eyebrow">{copy.teamEyebrow}</p>
          <h3>{item.name}</h3>
          <p>{item.summary}</p>
          <p className="profile-note">{copy.teamNote}</p>
          <ActionButton className="button outline" action={{ type: "booking" }}>
            {copy.teamBooking}
          </ActionButton>
        </div>
      </div>
    </>
  );
}
