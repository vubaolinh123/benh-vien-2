"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { SiteLink } from "@/components/ui/site-link";
import type { StaffUser } from "@/types/content";
import { AdminIcon } from "./admin-icon";
const subscribe = (notify: () => void) => {
  const query = window.matchMedia("(max-width:760px)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
export const useAdminMobile = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(max-width:760px)").matches,
    () => false,
  );
export const roleTitles = {
  administrator: "Administrator",
  communications: "Truyền thông",
  customer_service: "Chăm sóc khách hàng",
};
const groups = [
  { label: "Điều hành", ids: ["dashboard"] },
  {
    label: "Website",
    ids: ["homepage", "posts", "library", "media", "content", "settings"],
  },
  { label: "Tiếp nhận", ids: ["appointments", "feedback"] },
  { label: "Hệ thống", ids: ["users", "password"] },
];
export function AdminSidebar({
  items,
  badges = {},
  user,
  selected,
  collapsed,
  mobileOpen,
  busy,
  onSelect,
  onCollapse,
  onClose,
  onLogout,
}: {
  items: { id: string; name: string }[];
  badges?: Record<string, number>;
  user: StaffUser;
  selected: string;
  collapsed: boolean;
  mobileOpen: boolean;
  busy: boolean;
  onSelect: (id: string) => void;
  onCollapse: () => void;
  onClose: () => void;
  onLogout: () => void;
}) {
  const isMobile = useAdminMobile();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLElement>("a,button")?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMobile, mobileOpen]);
  return (
    <>
      {isMobile && mobileOpen && (
        <button
          className="admin-sidebar-backdrop"
          aria-label="Đóng thanh điều hướng"
          onClick={onClose}
        />
      )}
      <aside
        ref={ref}
        id="admin-sidebar"
        className={`admin-sidebar ${collapsed ? "is-collapsed" : ""} ${mobileOpen ? "is-mobile-open" : ""}`}
        inert={isMobile && !mobileOpen}
        aria-label="Điều hướng quản trị"
        role={isMobile && mobileOpen ? "dialog" : undefined}
        aria-modal={isMobile && mobileOpen ? true : undefined}
        onKeyDown={(event) => {
          if (!isMobile || !mobileOpen) return;
          if (event.key === "Escape") {
            event.preventDefault();
            onClose();
          }
          if (event.key === "Tab") {
            const controls = ref.current?.querySelectorAll<HTMLElement>(
              "a,button:not(:disabled)",
            );
            if (!controls?.length) return;
            const first = controls[0],
              last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <div className="admin-sidebar-head">
          <SiteLink className="admin-brand" href="/" title="Website Đại An">
            <span className="admin-brand-copy">
              ĐẠI AN<small>Quản trị bệnh viện</small>
            </span>
          </SiteLink>
          <button
            type="button"
            className="admin-collapse"
            aria-label={
              isMobile
                ? "Đóng thanh điều hướng"
                : collapsed
                  ? "Mở rộng sidebar"
                  : "Thu gọn sidebar"
            }
            aria-expanded={isMobile ? mobileOpen : !collapsed}
            onClick={isMobile ? onClose : onCollapse}
          >
            <AdminIcon
              name={isMobile ? "close" : collapsed ? "expand" : "collapse"}
            />
          </button>
        </div>
        <nav className="admin-sidebar-nav" aria-label="Chức năng quản trị">
          {groups.map((group) => {
            const entries = items.filter((item) => group.ids.includes(item.id));
            return entries.length ? (
              <div className="admin-nav-group" key={group.label}>
                <p className="admin-nav-heading">{group.label}</p>
                {entries.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`admin-nav-item ${selected === item.id ? "selected" : ""}`}
                    aria-label={item.name}
                    title={collapsed ? item.name : undefined}
                    aria-current={selected === item.id ? "page" : undefined}
                    onClick={() => {
                      onSelect(item.id);
                      if (isMobile) onClose();
                    }}
                  >
                    <AdminIcon name={item.id} />
                    <span>{item.name}</span>
                    {badges[item.id] > 0 && (
                      <b className="admin-nav-badge" aria-hidden="true">
                        {badges[item.id] > 99 ? "99+" : badges[item.id]}
                      </b>
                    )}
                    {selected === item.id && <i className="admin-nav-active" />}
                  </button>
                ))}
              </div>
            ) : null;
          })}
        </nav>
        <div className="admin-sidebar-bottom">
          <SiteLink
            className="admin-website-link"
            href="/"
            target="_blank"
            rel="noopener"
            title="Xem website"
          >
            <AdminIcon name="external" />
            <span>Xem website</span>
          </SiteLink>
          <div className="admin-profile">
            <span className="admin-avatar">
              {user.name
                .trim()
                .split(/\s+/)
                .slice(-2)
                .map((part) => part[0])
                .join("")
                .toUpperCase()}
            </span>
            <div className="admin-profile-copy">
              <strong>{user.name}</strong>
              <small>{roleTitles[user.role]}</small>
            </div>
            <button
              type="button"
              disabled={busy}
              aria-label="Đăng xuất"
              title="Đăng xuất"
              onClick={onLogout}
            >
              <AdminIcon name="logout" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
