"use client";

import type { ButtonHTMLAttributes } from "react";
import { useDialog } from "@/features/dialog/dialog-provider";
import type { DialogAction } from "@/features/dialog/types";

import { BOOKING_URL } from "@/lib/booking";

export function ActionButton({
  action,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { action: DialogAction }) {
  const open = useDialog();
  if (action.type === "booking")
    return (
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={["booking-link", props.className].filter(Boolean).join(" ")}
        id={props.id}
        title={props.title}
        aria-label={props["aria-label"]}
      >
        {children}
      </a>
    );
  return (
    <button type="button" {...props} onClick={() => open(action)}>
      {children}
    </button>
  );
}
