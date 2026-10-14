"use client";
import dynamic from "next/dynamic";
import { useEffect, useState, type FormEvent } from "react";
import { api } from "@/lib/client-api";
import type { ContentItem, Paginated, PublicData } from "@/types/content";
import { ImageUpload, Message } from "./shared";
import { ImpactNote } from "./impact-note";
const Editor = dynamic(() => import("./rich-editor"), { ssr: false });
const pages = [
  {
    slug: "gioi-thieu",
    title: "Giới thiệu Bệnh viện Đa khoa Đại An",
    path: "/gioi-thieu/",
    label: "Trang chủ → Giới thiệu bệnh viện",
  },
  {
    slug: "su-menh-tam-nhin",
    title: "Sứ mệnh – tầm nhìn",
    path: "/gioi-thieu/su-menh-tam-nhin/",
    label: "Giới thiệu → Sứ mệnh – tầm nhìn",
  },
  {
    slug: "he-thong-y-te",
    title: "Hệ thống y tế Đại An",
    path: "/gioi-thieu/he-thong-y-te/",
    label: "Giới thiệu → Hệ thống y tế Đại An",
  },
  {
    slug: "hoat-dong",
    title: "Hoạt động Bệnh viện Đại An",
    path: "/gioi-thieu/hoat-dong/",
    label: "Giới thiệu → Hoạt động bệnh viện",
  },
  {
    slug: "van-hoa-doanh-nghiep",
    title: "Văn hóa doanh nghiệp tại Bệnh viện Đại An",
    path: "/gioi-thieu/van-hoa-doanh-nghiep/",
    label: "Giới thiệu → Văn hóa doanh nghiệp",
  },
];
type Draft = Pick<
  ContentItem,
  "name" | "summary" | "body" | "image" | "active"
>;
export default function PagesPanel() {
  const [slug, setSlug] = useState(pages[0].slug),
    [draft, setDraft] = useState<Draft | null>(null),
    [record, setRecord] = useState<ContentItem | null>(null),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false),
    [uploading, setUploading] = useState(false),
    [dirty, setDirty] = useState(false);
  const target = pages.find((page) => page.slug === slug)!;
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      setMessage("");
      setDraft(null);
      setRecord(null);
      setDirty(false);
      try {
        const result = await api<Paginated<ContentItem>>(
          `/admin/content?kind=page&slug=${slug}`,
        );
        const item = result.items.find((item) => item.slug === slug);
        let fallback = "";
        if (!item && slug === "gioi-thieu")
          fallback =
            (await api<PublicData>("/public/home")).settings?.introduction ||
            "";
        if (cancelled) return;
        setRecord(item || null);
        setDraft(
          item
            ? {
                name: item.name,
                summary: item.summary || "",
                body: item.body || "",
                image: item.image || "",
                active: item.active,
              }
            : {
                name: pages.find((page) => page.slug === slug)!.title,
                summary: "",
                body: fallback,
                image: "",
                active: true,
              },
        );
      } catch (error) {
        if (!cancelled) setError((error as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [slug]);
  function field<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDirty(true);
    setDraft((current) => current && { ...current, [key]: value });
    setMessage("");
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!draft || saving || uploading) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const saved = await api<ContentItem>(
        `/admin/content${record ? `/${record._id}` : ""}`,
        {
          method: record ? "PUT" : "POST",
          body: JSON.stringify({
            kind: "page",
            slug,
            ...draft,
            order: record?.order || 0,
          }),
        },
      );
      setRecord(saved);
      setDirty(false);
      setMessage(
        "Đã lưu trang. Nội dung công khai có thể cần khoảng 1–2 phút để cập nhật.",
      );
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <section>
      <div className="admin-section-heading">
        <div>
          <h2>Trang giới thiệu</h2>
          <p>Soạn và chỉnh sửa nội dung các trang trong menu Giới thiệu.</p>
        </div>
      </div>
      <label className="field">
        Chọn trang cần sửa
        <select
          aria-label="Chọn trang cần sửa"
          value={slug}
          disabled={saving || uploading}
          onChange={(event) => {
            if (
              dirty &&
              !confirm("Bạn có thay đổi chưa lưu. Chuyển trang và bỏ thay đổi?")
            )
              return;
            setSlug(event.target.value);
          }}
        >
          {pages.map((page) => (
            <option key={page.slug} value={page.slug}>
              {page.label}
            </option>
          ))}
        </select>
      </label>
      <ImpactNote>
        Sửa phần này sẽ thay đổi trang <strong>{target.label}</strong> tại{" "}
        <a href={target.path} target="_blank" rel="noopener noreferrer">
          {target.path}
        </a>
        . Đây là nội dung trang riêng; đoạn giới thiệu ngắn trên trang chủ được
        quản lý tại Thông tin bệnh viện.{" "}
        {slug === "hoat-dong" &&
          "Danh sách tin hoạt động bên dưới vẫn lấy từ Bài viết."}
      </ImpactNote>
      <Message error={error} />
      {message && <p role="status">{message}</p>}
      {loading && <p role="status">Đang tải trang…</p>}
      {draft && !loading && (
        <form className="admin-edit-form" onSubmit={save}>
          <label className="field">
            Tiêu đề trang
            <input
              required
              minLength={2}
              maxLength={200}
              value={draft.name}
              onChange={(event) => field("name", event.target.value)}
            />
          </label>
          <label className="field">
            Mô tả ngắn
            <textarea
              maxLength={600}
              value={draft.summary}
              onChange={(event) => field("summary", event.target.value)}
            />
          </label>
          <ImageUpload
            value={draft.image || ""}
            onChange={(value) => field("image", value)}
          />
          <Editor
            key={slug}
            value={draft.body}
            onChange={(value) => field("body", value)}
            onBusyChange={setUploading}
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
            <button className="button" disabled={saving || uploading}>
              {saving ? "Đang lưu…" : "Lưu trang giới thiệu"}
            </button>
            <a href={target.path} target="_blank" rel="noopener noreferrer">
              Xem trang trên website ↗
            </a>
          </div>
        </form>
      )}
    </section>
  );
}
