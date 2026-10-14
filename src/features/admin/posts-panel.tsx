"use client";

import dynamic from "next/dynamic";
import { ImpactNote } from "./impact-note";
import { useState, type FormEvent } from "react";
import { api } from "@/lib/client-api";
import type { Article } from "@/types/content";
import {
  ImageUpload,
  Message,
  Pagination,
  toSlug,
  useAdminList,
} from "./shared";
const Editor = dynamic(() => import("./rich-editor"), { ssr: false });
type Draft = Pick<
  Article,
  "title" | "slug" | "category" | "excerpt" | "body" | "status"
> & { image: string };
const empty: Draft = {
  title: "",
  slug: "",
  category: "news",
  excerpt: "",
  body: "<p></p>",
  image: "",
  status: "draft",
};
export default function PostsPanel({
  onManagePages,
}: {
  onManagePages?: () => void;
}) {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const { data, error, busy, reload, setError } = useAdminList<Article>(
    `/admin/posts?page=${page}&category=${category}&status=${status}&q=${encodeURIComponent(query)}`,
  );
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editing, setEditing] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  function field<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => current && { ...current, [key]: value });
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!draft || uploading) return;
    setSaving(true);
    setError("");
    try {
      await api(`/admin/posts${editing ? `/${editing}` : ""}`, {
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
  return (
    <section>
      <div className="admin-section-heading">
        <div>
          <h2>Quản lý bài viết</h2>
          <p>Tin tức, Sống khỏe và Hỏi đáp</p>
        </div>
        <button
          className="button"
          disabled={uploading || saving}
          onClick={() => {
            setEditing("");
            setDraft({ ...empty });
          }}
        >
          Thêm bài viết
        </button>
      </div>
      {onManagePages && (
        <p className="admin-note">
          Muốn sửa nội dung Trang chủ → Giới thiệu bệnh viện?{" "}
          <button
            type="button"
            disabled={Boolean(draft)}
            onClick={onManagePages}
          >
            Sửa trang Giới thiệu bệnh viện
          </button>{" "}
          Chọn mục Trang giới thiệu; nội dung này không thuộc chuyên mục tin
          tức.
        </p>
      )}
      <ImpactNote>
        Chuyên mục quyết định vị trí: Tin tức → Tin nổi bật và cột Tin tức; Sống
        khỏe → cột Sống khỏe; Hỏi đáp → thẻ Hỏi đáp chuyên gia. Tiêu đề, tóm
        tắt, ảnh hiển thị trên thẻ; đường dẫn và nội dung dùng cho trang chi
        tiết. Chỉ bài Đã đăng xuất hiện công khai, bài mới nhất đứng trước.
        Chuyển sang Bản nháp hoặc xóa sẽ gỡ bài khỏi trang chủ.
      </ImpactNote>
      <Message error={error} />
      {draft ? (
        <form className="admin-edit-form blog-post-form" onSubmit={save}>
          <h3>{editing ? "Sửa bài viết" : "Bài viết mới"}</h3>
          <div className="form-grid">
            <label className="field full">
              Tiêu đề
              <input
                required
                minLength={5}
                maxLength={200}
                value={draft.title}
                onChange={(event) => {
                  field("title", event.target.value);
                  if (!editing) field("slug", toSlug(event.target.value));
                }}
              />
            </label>
            <label className="field">
              Đường dẫn
              <input
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                maxLength={100}
                value={draft.slug}
                onChange={(event) => field("slug", event.target.value)}
              />
            </label>
            <label className="field">
              Chuyên mục
              <select
                value={draft.category}
                onChange={(event) =>
                  field("category", event.target.value as Draft["category"])
                }
              >
                <option value="news">Tin tức</option>
                <option value="health">Sống khỏe</option>
                <option value="qa">Hỏi đáp</option>
              </select>
            </label>
            <label className="field full">
              Tóm tắt
              <textarea
                required
                minLength={10}
                maxLength={500}
                value={draft.excerpt}
                onChange={(event) => field("excerpt", event.target.value)}
              />
            </label>
          </div>
          <ImageUpload
            value={draft.image}
            onChange={(value) => field("image", value)}
          />
          <label className="field">Nội dung</label>
          <Editor
            value={draft.body}
            onBusyChange={setUploading}
            onChange={(value) => field("body", value)}
          />
          <label className="field">
            Trạng thái
            <select
              value={draft.status}
              onChange={(event) =>
                field("status", event.target.value as Draft["status"])
              }
            >
              <option value="draft">Bản nháp</option>
              <option value="published">Đã đăng</option>
            </select>
          </label>
          <div className="admin-actions">
            <button className="button" disabled={saving || uploading}>
              {uploading
                ? "Đang tải ảnh…"
                : saving
                  ? "Đang lưu…"
                  : "Lưu bài viết"}
            </button>
            <button
              type="button"
              disabled={uploading || saving}
              onClick={() => setDraft(null)}
            >
              Hủy
            </button>
          </div>
        </form>
      ) : (
        <>
          <form
            className="admin-filters"
            onSubmit={(event) => {
              event.preventDefault();
              setQuery(q);
              setPage(1);
            }}
          >
            <input
              aria-label="Tìm bài viết"
              placeholder="Tìm tiêu đề…"
              value={q}
              onChange={(event) => setQ(event.target.value)}
            />
            <select
              aria-label="Chuyên mục"
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
            >
              <option value="">Tất cả chuyên mục</option>
              <option value="news">Tin tức</option>
              <option value="health">Sống khỏe</option>
              <option value="qa">Hỏi đáp</option>
            </select>
            <select
              aria-label="Trạng thái bài viết"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="draft">Nháp</option>
              <option value="published">Đã đăng</option>
            </select>
            <button>Tìm kiếm</button>
          </form>
          {busy && <p role="status">Đang tải…</p>}
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Chuyên mục</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>
                      {
                        { news: "Tin tức", health: "Sống khỏe", qa: "Hỏi đáp" }[
                          item.category
                        ]
                      }
                    </td>
                    <td>{item.status === "published" ? "Đã đăng" : "Nháp"}</td>
                    <td>
                      <button
                        onClick={() => {
                          setEditing(item._id);
                          setDraft({
                            title: item.title,
                            slug: item.slug,
                            category: item.category,
                            excerpt: item.excerpt,
                            body: item.body,
                            image: item.image || "",
                            status: item.status,
                          });
                        }}
                      >
                        Sửa
                      </button>{" "}
                      <button
                        className="danger"
                        onClick={async () => {
                          if (!confirm(`Xóa bài viết “${item.title}”?`)) return;
                          try {
                            await api(`/admin/posts/${item._id}`, {
                              method: "DELETE",
                            });
                            await reload();
                          } catch (error) {
                            setError((error as Error).message);
                          }
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            total={data.total}
            limit={data.limit}
            onPage={setPage}
          />
        </>
      )}
    </section>
  );
}
