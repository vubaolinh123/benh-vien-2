"use client";
import { SiteLink } from "@/components/ui/site-link";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { AdminSidebar, useAdminMobile } from "./admin-sidebar";
import { AdminIcon } from "./admin-icon";
import { ImpactNote } from "./impact-note";
import { api, setCsrf } from "@/lib/client-api";
import type { Role, StaffUser } from "@/types/content";
import { Message } from "./shared";

const loading = () => <p role="status">Đang mở chức năng…</p>;
const Dashboard = dynamic(() => import("./dashboard-panel"), { loading });
const MediaLibrary = dynamic(() => import("./media-panel"), { loading });
const Pages = dynamic(() => import("./pages-panel"), { loading });
const Posts = dynamic(() => import("./posts-panel"), { loading });
const Users = dynamic(() => import("./users-panel"), { loading });
const Appointments = dynamic(() => import("./appointments-panel"), { loading });
const Feedback = dynamic(() => import("./feedback-panel"), { loading });
const Content = dynamic(() => import("./content-panel"), { loading });
const Settings = dynamic(() => import("./settings-panel"), { loading });
const Homepage = dynamic(() => import("./homepage-panel"), { loading });
const Library = dynamic(() => import("./library-panel"), { loading });
const tabs: { id: string; name: string; roles: Role[] }[] = [
  { id: "dashboard", name: "Tổng quan", roles: ["administrator"] },
  { id: "homepage", name: "Trang chủ", roles: ["administrator"] },
  {
    id: "media",
    name: "Thư viện ảnh",
    roles: ["administrator", "communications"],
  },
  {
    id: "pages",
    name: "Trang giới thiệu",
    roles: ["administrator", "communications"],
  },
  { id: "posts", name: "Bài viết", roles: ["administrator", "communications"] },
  {
    id: "library",
    name: "Hình ảnh & Video",
    roles: ["administrator", "communications"],
  },
  {
    id: "appointments",
    name: "Đăng ký khám",
    roles: ["administrator", "customer_service"],
  },
  {
    id: "feedback",
    name: "Góp ý",
    roles: ["administrator", "customer_service"],
  },
  { id: "content", name: "Nội dung website", roles: ["administrator"] },
  { id: "users", name: "Tài khoản", roles: ["administrator"] },
  { id: "settings", name: "Thông tin bệnh viện", roles: ["administrator"] },
];
interface Session {
  user: StaffUser;
  csrf: string;
}

export default function AdminApp() {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notices, setNotices] = useState({ appointments: 0, feedback: 0 });
  const toggle = useRef<HTMLButtonElement>(null);
  const role = user?.role;
  const refreshNotices = useCallback(() => {
    void api<{ appointments: number; feedback: number }>("/admin/notifications")
      .then(setNotices)
      .catch(() => {});
  }, []);
  // Staff who handle requests see new ones without reloading the page.
  useEffect(() => {
    if (role !== "administrator" && role !== "customer_service") return;
    refreshNotices();
    const timer = window.setInterval(refreshNotices, 30000);
    return () => window.clearInterval(timer);
  }, [role, refreshNotices]);
  useEffect(() => {
    const count = notices.appointments + notices.feedback;
    const title = document.title.replace(/^\(\d+\+?\) /, "");
    document.title = count ? `(${count > 99 ? "99+" : count}) ${title}` : title;
  }, [notices]);
  const isMobile = useAdminMobile();
  function closeMenu() {
    setMobileOpen(false);
    if (isMobile) requestAnimationFrame(() => toggle.current?.focus());
  }
  function accept(session: Session) {
    setCsrf(session.csrf);
    setUser(session.user);
    setTab(
      session.user.role === "administrator"
        ? "dashboard"
        : session.user.role === "communications"
          ? "posts"
          : "appointments",
    );
  }
  useEffect(() => {
    let cancelled = false;
    void api<Session>("/auth/session")
      .then((session) => {
        if (!cancelled) accept(session);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      accept(
        await api<Session>("/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: data.get("email"),
            password: data.get("password"),
          }),
        }),
      );
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    try {
      await api("/auth/logout", { method: "POST" });
      setUser(null);
      setCsrf("");
      setError("");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (!ready)
    return (
      <main id="main" className="admin-app">
        <div className="admin-login">
          <p role="status">Đang kiểm tra phiên đăng nhập…</p>
        </div>
      </main>
    );
  if (!user)
    return (
      <main id="main" className="admin-app">
        <div className="admin-login">
          <SiteLink href="/">← Website bệnh viện</SiteLink>
          <p className="eyebrow">BỆNH VIỆN ĐA KHOA ĐẠI AN</p>
          <h1>Đăng nhập nhân sự</h1>
          <p>Quản lý nội dung và tiếp nhận đăng ký khám.</p>
          <Message error={error} />
          <form onSubmit={login}>
            <label className="field">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="username"
              />
            </label>
            <label className="field">
              Mật khẩu
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </label>
            <button className="button form-submit" disabled={busy}>
              {busy ? "Đang đăng nhập…" : "Đăng nhập"}
            </button>
          </form>
          <p className="admin-note">
            Nếu quên mật khẩu, hãy liên hệ Administrator để được cấp lại.
          </p>
        </div>
      </main>
    );
  const available = tabs.filter((item) => item.roles.includes(user.role));
  const pending = notices.appointments + notices.feedback;
  return (
    <main id="main" className="admin-app">
      <AdminSidebar
        items={[...available, { id: "password", name: "Đổi mật khẩu" }]}
        badges={notices}
        user={user}
        selected={tab}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        busy={busy}
        onSelect={setTab}
        onCollapse={() => setCollapsed((value) => !value)}
        onClose={closeMenu}
        onLogout={() => void logout()}
      />
      <div className="admin-workspace" inert={isMobile && mobileOpen}>
        <header className="admin-topbar">
          <button
            type="button"
            ref={toggle}
            className="admin-mobile-toggle"
            aria-label="Mở thanh điều hướng"
            aria-controls="admin-sidebar"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <AdminIcon name="menu" />
          </button>
          <div>
            <span>ĐẠI AN / QUẢN TRỊ</span>
            <h1>
              {tab === "password"
                ? "Đổi mật khẩu"
                : available.find((item) => item.id === tab)?.name}
            </h1>
          </div>
          {available.some((item) => item.id === "appointments") && (
            <button
              type="button"
              className="admin-bell"
              aria-label={
                pending
                  ? `Thông báo: ${notices.appointments} đăng ký khám mới, ${notices.feedback} góp ý chưa xử lý`
                  : "Thông báo: không có mục mới"
              }
              title={
                pending
                  ? `${notices.appointments} đăng ký khám mới · ${notices.feedback} góp ý chưa xử lý`
                  : "Không có đăng ký hoặc góp ý mới"
              }
              onClick={() =>
                setTab(
                  notices.appointments || !notices.feedback
                    ? "appointments"
                    : "feedback",
                )
              }
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7 2.5 7h-17S6 15 6 9ZM10 20a2 2 0 0 0 4 0" />
              </svg>
              {pending > 0 && <b>{pending > 99 ? "99+" : pending}</b>}
            </button>
          )}
          <SiteLink href="/" target="_blank" rel="noopener">
            Xem website ↗
          </SiteLink>
        </header>
        <div className="admin-panel">
          <Message error={error} />
          {tab === "homepage" && user.role === "administrator" && <Homepage />}
          {["appointments", "feedback", "users", "password"].includes(tab) && (
            <ImpactNote>
              {
                {
                  appointments:
                    "Đăng ký nhận từ các nút đặt lịch. Đổi trạng thái xử lý không thay đổi nội dung trang chủ.",
                  feedback:
                    "Góp ý nhận từ nút phản hồi; không công khai trên trang chủ.",
                  users:
                    "Tài khoản và vai trò quyết định quyền quản trị; không hiển thị trên trang chủ.",
                  password:
                    "Chỉ đổi mật khẩu đăng nhập; không thay đổi nội dung trang chủ.",
                }[tab]
              }
            </ImpactNote>
          )}
          {tab === "dashboard" && user.role === "administrator" && (
            <Dashboard />
          )}
          {tab === "media" && available.some((item) => item.id === tab) && (
            <MediaLibrary />
          )}
          {tab === "posts" && available.some((item) => item.id === tab) && (
            <Posts onManagePages={() => setTab("pages")} />
          )}
          {tab === "library" && available.some((item) => item.id === tab) && (
            <Library />
          )}
          {tab === "appointments" &&
            available.some((item) => item.id === tab) && (
              <Appointments onChange={refreshNotices} />
            )}
          {tab === "feedback" && available.some((item) => item.id === tab) && (
            <Feedback onChange={refreshNotices} />
          )}
          {tab === "pages" && available.some((item) => item.id === tab) && (
            <Pages />
          )}
          {tab === "content" && user.role === "administrator" && <Content />}
          {tab === "users" && user.role === "administrator" && <Users />}
          {tab === "settings" && user.role === "administrator" && <Settings />}
          {tab === "password" && (
            <form
              className="admin-edit-form"
              onSubmit={async (event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                setBusy(true);
                setError("");
                try {
                  await api("/auth/password", {
                    method: "POST",
                    body: JSON.stringify({
                      currentPassword: data.get("currentPassword"),
                      newPassword: data.get("newPassword"),
                    }),
                  });
                  setUser(null);
                  setCsrf("");
                  setError("Đã đổi mật khẩu. Vui lòng đăng nhập lại.");
                } catch (error) {
                  setError((error as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <h2>Đổi mật khẩu</h2>
              <label className="field">
                Mật khẩu hiện tại
                <input
                  name="currentPassword"
                  type="password"
                  required
                  autoComplete="current-password"
                />
              </label>
              <label className="field">
                Mật khẩu mới
                <input
                  name="newPassword"
                  type="password"
                  required
                  minLength={12}
                  maxLength={72}
                  autoComplete="new-password"
                />
              </label>
              <p>
                Ít nhất 12 ký tự. Các phiên đăng nhập hiện tại sẽ kết thúc sau
                khi đổi mật khẩu.
              </p>
              <button className="button" disabled={busy}>
                Đổi mật khẩu
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
