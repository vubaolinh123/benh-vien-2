"use client";
import dynamic from "next/dynamic";
const MediaBrowser = dynamic(() => import("./media-browser"));
import { SiteLink } from "@/components/ui/site-link";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import type { Paginated } from "@/types/content";

export function useAdminList<T>(path: string) {
  const [data, setData] = useState<Paginated<T>>({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const reload = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      setData(await api<Paginated<T>>(path));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }, [path]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void reload();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [reload]);
  return { data, error, busy, reload, setError };
}
export function Pagination({
  page,
  total,
  limit,
  onPage,
}: {
  page: number;
  total: number;
  limit: number;
  onPage: (page: number) => void;
}) {
  return (
    <div className="admin-pagination">
      <button disabled={page <= 1} onClick={() => onPage(page - 1)}>
        ← Trước
      </button>
      <span>
        Trang {page} / {Math.max(1, Math.ceil(total / limit))} · {total} mục
      </span>
      <button disabled={page * limit >= total} onClick={() => onPage(page + 1)}>
        Sau →
      </button>
    </div>
  );
}
export function Message({ error }: { error: string }) {
  return error ? (
    <p className="admin-error" role="alert">
      {error}
    </p>
  ) : null;
}
export function ImageUpload({
  value,
  onChange,
  label = "Ảnh đại diện",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="admin-upload">
      <button type="button" onClick={() => setLibraryOpen((value) => !value)}>
        {libraryOpen ? "Đóng thư viện ảnh" : "Chọn từ thư viện ảnh"}
      </button>
      {libraryOpen && (
        <MediaBrowser
          onSelect={(url) => {
            onChange(url);
            setLibraryOpen(false);
          }}
        />
      )}
      <label className="field">
        {label}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={busy}
          onChange={async (event) => {
            const file = event.currentTarget.files?.[0];
            if (!file) return;
            setBusy(true);
            setError("");
            try {
              const data = new FormData();
              data.append("image", file);
              const result = await api<{ url: string }>("/admin/uploads", {
                method: "POST",
                body: data,
              });
              onChange(result.url);
            } catch (error) {
              setError((error as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        />
      </label>
      {busy && <p role="status">Đang tải ảnh…</p>}
      {value && (
        <div>
          <SiteLink href={value} target="_blank" rel="noopener">
            Xem ảnh đã chọn ↗
          </SiteLink>{" "}
          <button type="button" onClick={() => onChange("")}>
            Bỏ ảnh
          </button>
        </div>
      )}
      <Message error={error} />
    </div>
  );
}
export function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}
