"use client";
import { useState, type FormEvent } from "react";
import { api } from "@/lib/client-api";
import type { ContentItem } from "@/types/content";
import {
  ImageUpload,
  Message,
  Pagination,
  toSlug,
  useAdminList,
} from "./shared";

type Kind = "gallery" | "video";
type Draft = Pick<
  ContentItem,
  "kind" | "slug" | "name" | "summary" | "active" | "order"
> & { image: string; link: string; body: string };
const labels = {
  gallery: {
    tab: "Hình ảnh",
    add: "Thêm hình ảnh",
    empty: "Chưa có hình ảnh nào.",
    page: "/thu-vien/hinh-anh/",
  },
  video: {
    tab: "Video",
    add: "Thêm video",
    empty: "Chưa có video nào.",
    page: "/thu-vien/video/",
  },
};
const validVideo = (link: string) =>
  /^https:\/\/(?:www\.)?(?:youtube\.com\/|youtu\.be\/|facebook\.com\/)/.test(
    link,
  ) || /^\/assets\/(?:community|facilities)-demo\.mp4$/.test(link);
export default function LibraryPanel() {
  const [kind, setKind] = useState<Kind>("gallery");
  const [page, setPage] = useState(1);
  const { data, error, busy, reload, setError } = useAdminList<ContentItem>(
    `/admin/content?kind=${kind}&page=${page}&limit=24`,
  );
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editing, setEditing] = useState("");
  const [saving, setSaving] = useState(false);
  function field<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => current && { ...current, [key]: value });
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    if (!draft.image) {
      setError(
        kind === "video"
          ? "Chọn ảnh bìa cho video."
          : "Chọn ảnh trước khi lưu.",
      );
      return;
    }
    if (kind === "video" && !validVideo(draft.link)) {
      setError("Nhập liên kết video YouTube hoặc Facebook (https://…).");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api(`/admin/content${editing ? `/${editing}` : ""}`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(draft),
      });
      setDraft(null);
      await reload();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setSaving(false);
    }
  }
  async function remove(item: ContentItem) {
    if (!confirm(`Xóa “${item.name}” khỏi thư viện?`)) return;
    try {
      await api(`/admin/content/${item._id}`, { method: "DELETE" });
      await reload();
    } catch (error) {
      setError((error as Error).message);
    }
  }
  async function toggle(item: ContentItem) {
    try {
      await api(`/admin/content/${item._id}`, {
        method: "PUT",
        body: JSON.stringify({
          kind: item.kind,
          slug: item.slug,
          name: item.name,
          summary: item.summary || "",
          body: item.body || "",
          image: item.image || "",
          link: item.link || "",
          order: item.order,
          active: !item.active,
        }),
      });
      await reload();
    } catch (error) {
      setError((error as Error).message);
    }
  }
  return (
    <section>
      <div className="admin-section-heading">
        <div>
          <h2>Thư viện hình ảnh và video</h2>
          <p>
            Nội dung hiển thị ở khối HÌNH ẢNH / VIDEO trên trang chủ và trang
            Thư viện.
          </p>
        </div>
        <button
          className="button"
          onClick={() => {
            setEditing("");
            setError("");
            setDraft({
              kind,
              slug: "",
              name: "",
              summary: "",
              body: "",
              image: "",
              link: "",
              active: true,
              order: data.total + 1,
            });
          }}
        >
          {labels[kind].add}
        </button>
      </div>
      <div className="library-tabs" role="tablist" aria-label="Loại thư viện">
        {(Object.keys(labels) as Kind[]).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={kind === key}
            onClick={() => {
              setKind(key);
              setPage(1);
              setDraft(null);
            }}
          >
            {labels[key].tab}
          </button>
        ))}
        <a href={labels[kind].page} target="_blank" rel="noopener">
          Xem trang công khai ↗
        </a>
      </div>
      <Message error={error} />
      {draft && (
        <form className="admin-edit-form" onSubmit={save}>
          <h3>
            {editing ? "Sửa" : "Thêm"} {kind === "video" ? "video" : "hình ảnh"}
          </h3>
          <div className="form-grid">
            <label className="field full">
              Tiêu đề
              <input
                required
                minLength={2}
                maxLength={200}
                value={draft.name}
                onChange={(event) => {
                  field("name", event.target.value);
                  if (!editing) field("slug", toSlug(event.target.value));
                }}
              />
            </label>
            {kind === "video" && (
              <label className="field full">
                Liên kết video
                <input
                  required
                  maxLength={300}
                  placeholder="https://www.youtube.com/watch?v=… hoặc https://www.facebook.com/…"
                  value={draft.link}
                  onChange={(event) => field("link", event.target.value.trim())}
                />
                <small>
                  Dán liên kết YouTube hoặc Facebook; video mở ở tab mới khi
                  người xem bấm vào.
                </small>
              </label>
            )}
            <label className="field full">
              Mô tả ngắn
              <textarea
                maxLength={600}
                value={draft.summary}
                onChange={(event) => field("summary", event.target.value)}
              />
            </label>
            <label className="field">
              Thứ tự hiển thị
              <input
                type="number"
                required
                min={0}
                max={10000}
                value={draft.order}
                onChange={(event) => field("order", Number(event.target.value))}
              />
              <small>Số nhỏ hơn xuất hiện trước.</small>
            </label>
            <label className="field">
              Đường dẫn (định danh)
              <input
                required
                maxLength={100}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                value={draft.slug}
                onChange={(event) => field("slug", event.target.value)}
              />
              <small>
                Tự tạo từ tiêu đề; chỉ gồm chữ thường, số và dấu gạch.
              </small>
            </label>
          </div>
          <p className="admin-note">
            {kind === "video"
              ? "Ảnh bìa hiển thị trên thẻ video."
              : "Ảnh được tải lên máy chủ và chuyển sang WebP."}
          </p>
          {draft.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="library-preview" src={draft.image} alt="" />
          )}
          <ImageUpload
            value={draft.image}
            onChange={(value) => field("image", value)}
          />
          <label className="consent-field">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(event) => field("active", event.target.checked)}
            />{" "}
            Hiển thị công khai
          </label>
          <div className="admin-actions">
            <button className="button" disabled={saving}>
              {saving ? "Đang lưu…" : "Lưu"}
            </button>
            <button type="button" onClick={() => setDraft(null)}>
              Hủy
            </button>
          </div>
        </form>
      )}
      <div className="library-admin-grid">
        {data.items.map((item) => (
          <article
            key={item._id}
            className={`library-admin-card ${item.active ? "" : "is-hidden"}`}
          >
            <div className="library-admin-thumb">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} loading="lazy" />
              ) : (
                <span>Chưa có ảnh</span>
              )}
              {kind === "video" && <i aria-hidden="true">▶</i>}
              <b>{item.active ? "Công khai" : "Đang ẩn"}</b>
            </div>
            <strong>{item.name}</strong>
            <small>
              Thứ tự {item.order}
              {kind === "video" && item.link && (
                <>
                  {" · "}
                  <a href={item.link} target="_blank" rel="noopener">
                    Mở video ↗
                  </a>
                </>
              )}
            </small>
            <div className="admin-actions">
              <button
                type="button"
                onClick={() => {
                  setEditing(item._id);
                  setError("");
                  setDraft({
                    kind,
                    slug: item.slug,
                    name: item.name,
                    summary: item.summary || "",
                    body: item.body || "",
                    image: item.image || "",
                    link: item.link || "",
                    active: item.active,
                    order: item.order,
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Sửa
              </button>
              <button type="button" onClick={() => void toggle(item)}>
                {item.active ? "Ẩn" : "Hiện"}
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => void remove(item)}
              >
                Xóa
              </button>
            </div>
          </article>
        ))}
      </div>
      {!busy && !data.items.length && (
        <p className="admin-note">{labels[kind].empty}</p>
      )}
      <Pagination
        page={page}
        total={data.total}
        limit={data.limit}
        onPage={setPage}
      />
    </section>
  );
}
