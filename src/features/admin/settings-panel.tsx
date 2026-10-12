"use client";

import dynamic from "next/dynamic";
import { ImpactNote } from "./impact-note";
import { useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import type { SiteSettings } from "@/types/content";
import { Message } from "./shared";
const Editor = dynamic(() => import("./rich-editor"), { ssr: false });
export default function SettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    void api<SiteSettings & { _id?: string }>("/admin/settings")
      .then((data) =>
        setSettings({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          introduction: data.introduction || "",
          workingHours: data.workingHours || "",
          privacy: data.privacy || "",
          facebook: data.facebook || "",
          tiktok: data.tiktok || "",
        }),
      )
      .catch((error) => setError(error.message));
  }, []);
  if (!settings)
    return (
      <>
        <Message error={error} />
        <p>Đang tải cấu hình…</p>
      </>
    );
  return (
    <section>
      <h2>Thông tin bệnh viện</h2>
      <ImpactNote>
        Tên bệnh viện: giới thiệu, chân trang và dữ liệu SEO. Hotline: đầu
        trang, nút gọi và chân trang. Email, địa chỉ, giờ làm việc: chân trang
        và trang Liên hệ. Facebook/TikTok: liên kết mạng xã hội. Nội dung giới
        thiệu: đoạn giới thiệu dưới hàng ảnh trên trang chủ. Bảo mật: trang
        Chính sách bảo mật.
      </ImpactNote>
      <Message error={error} />
      <form
        className="admin-edit-form"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          setSaved(false);
          try {
            await api("/admin/settings", {
              method: "PUT",
              body: JSON.stringify(settings),
            });
            setSaved(true);
          } catch (error) {
            setError((error as Error).message);
          } finally {
            setSaving(false);
          }
        }}
      >
        <div className="form-grid">
          {(
            [
              "name",
              "phone",
              "email",
              "address",
              "workingHours",
              "facebook",
              "tiktok",
            ] as const
          ).map((key) => (
            <label className="field" key={key}>
              {
                {
                  name: "Tên bệnh viện",
                  phone: "Hotline",
                  email: "Email",
                  address: "Địa chỉ",
                  workingHours: "Thời gian làm việc",
                  facebook: "Facebook",
                  tiktok: "TikTok",
                }[key]
              }
              <input
                type={key === "email" ? "email" : "text"}
                required={!["facebook", "tiktok"].includes(key)}
                value={settings[key]}
                onChange={(event) =>
                  setSettings({ ...settings, [key]: event.target.value })
                }
              />
            </label>
          ))}
        </div>
        <h3>Giới thiệu bệnh viện</h3>
        <p className="admin-note">
          Thay đoạn văn giới thiệu trên trang chủ và trang Giới thiệu.
        </p>
        <Editor
          value={settings.introduction}
          onChange={(value) =>
            setSettings(
              (current) => current && { ...current, introduction: value },
            )
          }
        />
        <h3>Chính sách bảo mật</h3>
        <p className="admin-note">
          Thay nội dung trang Chính sách bảo mật được dẫn từ chân trang.
        </p>
        <Editor
          value={settings.privacy}
          onChange={(value) =>
            setSettings((current) => current && { ...current, privacy: value })
          }
        />
        <button className="button" disabled={saving}>
          Lưu cấu hình
        </button>
        {saved && (
          <p role="status">
            Đã lưu. Trang công khai sẽ làm mới theo chu kỳ cache.
          </p>
        )}
      </form>
    </section>
  );
}
