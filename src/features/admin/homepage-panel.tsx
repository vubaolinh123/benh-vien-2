"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import type { HomepageConfig, MenuLink } from "@/types/content";
import { ImageUpload, Message } from "./shared";
import { ImpactNote } from "./impact-note";
import { copyGroups, homeSections } from "./homepage-fields";
function LinkList({
  label,
  location,
  items,
  onChange,
}: {
  label: string;
  location: string;
  items: MenuLink[];
  onChange: (items: MenuLink[]) => void;
}) {
  return (
    <details className="home-config-group">
      <summary>
        {label}
        <span>{items.length} liên kết</span>
      </summary>
      <ImpactNote>
        {location} Nhãn, đường dẫn và thứ tự sẽ hiển thị theo danh sách này.
      </ImpactNote>
      {items.map((item, index) => (
        <div className="admin-link-row" key={index}>
          <label className="field">
            Nhãn liên kết
            <input
              required
              maxLength={100}
              value={item.label}
              onChange={(event) =>
                onChange(
                  items.map((link, i) =>
                    i === index ? { ...link, label: event.target.value } : link,
                  ),
                )
              }
            />
          </label>
          <label className="field">
            Đường dẫn
            <input
              required
              maxLength={300}
              value={item.href}
              onChange={(event) =>
                onChange(
                  items.map((link, i) =>
                    i === index ? { ...link, href: event.target.value } : link,
                  ),
                )
              }
            />
          </label>
          <button
            type="button"
            aria-label={`Di chuyển liên kết ${index + 1} lên`}
            disabled={index === 0}
            onClick={() => {
              const next = [...items];
              [next[index - 1], next[index]] = [next[index], next[index - 1]];
              onChange(next);
            }}
          >
            ↑
          </button>
          <button
            type="button"
            className="danger"
            aria-label={`Xóa liên kết ${index + 1}`}
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            Xóa
          </button>
        </div>
      ))}
      <button
        type="button"
        disabled={items.length >= 12}
        onClick={() =>
          onChange([...items, { label: "Liên kết mới", href: "/" }])
        }
      >
        + Thêm liên kết
      </button>
    </details>
  );
}
export default function HomepagePanel() {
  const [draft, setDraft] = useState<HomepageConfig | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    void api<HomepageConfig>("/admin/homepage")
      .then(setDraft)
      .catch((error) => setError(error.message));
  }, []);
  if (!draft)
    return (
      <>
        <Message error={error} />
        <p role="status">Đang tải cấu hình trang chủ…</p>
      </>
    );
  function field<K extends keyof HomepageConfig>(
    key: K,
    value: HomepageConfig[K],
  ) {
    setDraft((current) => current && { ...current, [key]: value });
    setSaved(false);
  }
  return (
    <section>
      <div className="admin-section-heading">
        <div>
          <h2>Cấu hình trang chủ</h2>
          <p>Chỉnh từng phần theo ghi chú vị trí hiển thị.</p>
        </div>
        <a className="button outline" href="/" target="_blank" rel="noopener">
          Xem trang chủ ↗
        </a>
      </div>
      <ImpactNote>
        Tiêu đề, menu, nút bấm và thứ tự các khối chỉnh tại đây. Ảnh và thẻ nội
        dung chỉnh tại “Nội dung website”; bài viết/câu trả lời chỉnh tại “Bài
        viết”. Sau khi lưu, website cập nhật theo chu kỳ cache.
      </ImpactNote>
      <Message error={error} />
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          setError("");
          setSaved(false);
          try {
            await api("/admin/homepage", {
              method: "PUT",
              body: JSON.stringify(draft),
            });
            setSaved(true);
          } catch (error) {
            setError((error as Error).message);
          } finally {
            setSaving(false);
          }
        }}
      >
        <details className="home-config-group" open>
          <summary>
            Thứ tự và hiển thị các khối<span>{draft.sections.length} khối</span>
          </summary>
          <ImpactNote>
            Di chuyển lên/xuống đổi thứ tự trên trang chủ. Tắt Hiển thị sẽ ẩn cả
            khối, dữ liệu vẫn được giữ trong quản trị.
          </ImpactNote>
          <div className="home-section-list">
            {draft.sections.map((section, index) => (
              <div className="home-section-row" key={section.key}>
                <span className="home-section-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <strong>{homeSections[section.key].label}</strong>
                  <small>{homeSections[section.key].location}</small>
                </div>
                <label>
                  <input
                    type="checkbox"
                    checked={section.visible}
                    onChange={(event) =>
                      field(
                        "sections",
                        draft.sections.map((item) =>
                          item.key === section.key
                            ? { ...item, visible: event.target.checked }
                            : item,
                        ),
                      )
                    }
                  />{" "}
                  Hiển thị
                </label>
                {[-1, 1].map((direction) => (
                  <button
                    key={direction}
                    type="button"
                    aria-label={`Di chuyển ${homeSections[section.key].label} ${direction === -1 ? "lên" : "xuống"}`}
                    disabled={
                      index + direction < 0 ||
                      index + direction >= draft.sections.length
                    }
                    onClick={() => {
                      const next = [...draft.sections];
                      [next[index], next[index + direction]] = [
                        next[index + direction],
                        next[index],
                      ];
                      field("sections", next);
                    }}
                  >
                    {direction === -1 ? "↑" : "↓"}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </details>
        <details className="home-config-group">
          <summary>Logo và cách hiển thị đội ngũ</summary>
          <ImpactNote>
            Logo xuất hiện ở đầu trang/chân trang. Chế độ đội ngũ quyết định
            khối nền xanh hiển thị bác sĩ hay ảnh hoạt động.
          </ImpactNote>
          <ImageUpload
            label="Logo bệnh viện"
            value={draft.logo}
            onChange={(value) => field("logo", value)}
          />
          <label className="field">
            Mô tả logo
            <input
              required
              maxLength={150}
              value={draft.logoAlt}
              onChange={(event) => field("logoAlt", event.target.value)}
            />
            <small>Mô tả ảnh ở đầu trang và chân trang.</small>
          </label>
          <label className="field">
            Nội dung hiển thị trong khối đội ngũ
            <select
              value={draft.teamMode}
              onChange={(event) =>
                field(
                  "teamMode",
                  event.target.value as HomepageConfig["teamMode"],
                )
              }
            >
              <option value="auto">
                Bác sĩ; dùng hoạt động khi chưa có hồ sơ
              </option>
              <option value="doctors">Chỉ hồ sơ bác sĩ</option>
              <option value="activities">Ảnh hoạt động chăm sóc</option>
            </select>
          </label>
        </details>
        {copyGroups.map((group) => (
          <details className="home-config-group" key={group.label}>
            <summary>
              {group.label}
              <span>{group.fields.length} nội dung</span>
            </summary>
            <ImpactNote>{group.location}</ImpactNote>
            <div className="form-grid">
              {group.fields.map(([key, label]) => (
                <label className="field" key={key}>
                  {label}
                  <textarea
                    rows={
                      key === "seoDescription" || key === "footerSlogan" ? 3 : 2
                    }
                    maxLength={2000}
                    value={draft.copy[key] || ""}
                    onChange={(event) =>
                      field("copy", {
                        ...draft.copy,
                        [key]: event.target.value,
                      })
                    }
                  />
                  <small>
                    Sửa mục này thay đổi {label.toLowerCase()} trong phần{" "}
                    {group.label.toLowerCase()} trên trang chủ.
                  </small>
                </label>
              ))}
            </div>
          </details>
        ))}
        <details className="home-config-group">
          <summary>Ảnh ưu tiên trong thư viện</summary>
          <ImpactNote>
            Dùng slug ảnh trong Thư viện ảnh. Cấu hình này chọn ảnh lớn cơ sở
            vật chất, ảnh mở đầu thư viện và ba ảnh thu nhỏ. Nếu ảnh bị ẩn/xóa,
            website dùng ảnh công khai còn lại.
          </ImpactNote>
          {(["galleryLeadSlug", "galleryInitialSlug"] as const).map((key) => (
            <label className="field" key={key}>
              {key === "galleryLeadSlug"
                ? "Ảnh lớn cơ sở vật chất"
                : "Ảnh mở đầu thư viện"}
              <input
                maxLength={100}
                value={draft[key]}
                onChange={(event) => field(key, event.target.value)}
              />
            </label>
          ))}
          <label className="field">
            Ba ảnh thu nhỏ (slug cách nhau bằng dấu phẩy)
            <input
              defaultValue={draft.galleryThumbnailSlugs.join(", ")}
              onBlur={(event) =>
                field(
                  "galleryThumbnailSlugs",
                  event.target.value
                    .split(",")
                    .map((value) => value.trim())
                    .filter(Boolean)
                    .slice(0, 3),
                )
              }
            />
          </label>
        </details>
        {(
          [
            "navigation",
            "introductionMenu",
            "footerSupport",
            "footerInfo",
          ] as const
        ).map((key) => (
          <LinkList
            key={key}
            label={
              {
                navigation: "Thanh menu chính",
                introductionMenu: "Dropdown Giới thiệu",
                footerSupport: "Liên kết hỗ trợ chân trang",
                footerInfo: "Liên kết thông tin chân trang",
              }[key]
            }
            location={
              {
                navigation: "Thanh điều hướng bên cạnh menu Giới thiệu.",
                introductionMenu: "Danh sách xổ xuống từ Giới thiệu.",
                footerSupport: "Cột Hỗ trợ khách hàng cuối trang.",
                footerInfo: "Nhóm Thông tin hữu ích cuối trang.",
              }[key]
            }
            items={draft[key]}
            onChange={(value) => field(key, value)}
          />
        ))}
        <div className="homepage-savebar">
          <span>
            {saved
              ? "Website cập nhật theo chu kỳ cache."
              : "Kiểm tra ghi chú vị trí trước khi lưu."}
          </span>
          <button className="button" disabled={saving}>
            {saving ? "Đang lưu…" : "Lưu cấu hình trang chủ"}
          </button>
          {saved && <span role="status">Đã lưu thành công</span>}
        </div>
      </form>
    </section>
  );
}
