import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
export function ImpactNote({ children }: { children: ReactNode }) {
  return (
    <div className="admin-impact-note">
      <Icon name="pin" />
      <div>
        <strong>Vị trí thay đổi trên website</strong>
        <p>{children}</p>
      </div>
    </div>
  );
}
