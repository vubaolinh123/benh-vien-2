"use client";
import { SiteLink } from "@/components/ui/site-link";

import { useState } from "react";
import { usePublicSite } from "@/features/dialog/dialog-provider";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { ActionButton } from "@/components/ui/action-button";
import { CareActivities } from "./care-activities";

export function CareTeam() {
  const data = usePublicSite();
  const doctors = data.content.filter((item) => item.kind === "doctor");
  const copy = data.homepage?.copy || {};
  const [selected, setSelected] = useState(0);
  const doctor = doctors[selected];
  if (
    data.homepage?.teamMode === "activities" ||
    (!doctor && data.homepage?.teamMode !== "doctors")
  )
    return <CareActivities />;
  if (!doctor) return null;
  return (
    <>
      <div
        className="doctor-cards"
        id="doctor-cards"
        role="group"
        aria-label="Chọn hồ sơ bác sĩ"
      >
        {doctors.map((item, index) => (
          <button
            className="doctor-card"
            key={item._id}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            {item.image && (
              <ResponsiveImage
                src={item.image}
                alt={item.name}
                sizes="(max-width: 800px) 180px, 220px"
              />
            )}
            <span>
              <small>{item.qualification}</small>
              <strong>{item.name}</strong>
              <small>{item.specialty}</small>
            </span>
          </button>
        ))}
      </div>
      <div className="doctor-detail" id="doctor-detail" aria-live="polite">
        {doctor.image && (
          <ResponsiveImage src={doctor.image} alt={doctor.name} sizes="235px" />
        )}
        <div>
          <p className="eyebrow">{copy.teamEyebrow}</p>
          <h3>{doctor.name}</h3>
          <p>{doctor.summary}</p>
          <p>{doctor.schedule}</p>
          <SiteLink className="text-link" href={`/doi-ngu/${doctor.slug}/`}>
            {copy.doctorProfile}
          </SiteLink>
          <ActionButton className="button outline" action={{ type: "booking" }}>
            {copy.teamBooking}
          </ActionButton>
        </div>
      </div>
    </>
  );
}
