"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { ResponsiveImage } from "@/components/ui/responsive-image";
type Asset = {
  _id: string;
  url: string;
  originalName: string;
  bytes: number;
  width: number;
  height: number;
  deleteAfter?: string;
  lastError?: string;
  usage: { type: string; id: string; label: string }[];
};
type Result = {
  items: Asset[];
  total: number;
  page: number;
  limit: number;
  canManage: boolean;
};
export default function MediaBrowser({
  onSelect,
}: {
  onSelect?: (url: string) => void;
}) {
  const [data, setData] = useState<Result | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [page, setPage] = useState(1),
    [q, setQ] = useState(""),
    [query, setQuery] = useState(""),
    [usage, setUsage] = useState(""),
    [revision, setRevision] = useState(0),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void api<Result>(
      `/admin/media?page=${page}&limit=12&q=${encodeURIComponent(query)}&usage=${usage}`,
    )
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((error) => {
        if (!cancelled) setError(error.message);
      });
    return () => {
      cancelled = true;
    };
  }, [page, query, usage, revision]);
  return (
    <div className="media-browser">
      <p className="admin-note">
        Ảnh upload được lưu trên backend. Ảnh đang dùng trong bài viết (kể cả
        bản nháp), trang chủ hoặc nội dung khác được giữ lại. Ảnh mới chưa gắn
        vào nội dung sẽ được dọn sau 7 ngày; ảnh gỡ khỏi nội dung được dọn sau
        24 giờ, khi không còn nơi sử dụng.
      </p>
      <div className="admin-filters">
        <input
          aria-label="Tìm ảnh theo tên"
          placeholder="Tên ảnh…"
          value={q}
          onChange={(event) => setQ(event.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            setQuery(q);
            setPage(1);
          }}
        >
          Tìm ảnh
        </button>
        <select
          aria-label="Tình trạng sử dụng ảnh"
          value={usage}
          onChange={(event) => {
            setUsage(event.target.value);
            setPage(1);
          }}
        >
          <option value="">Tất cả ảnh</option>
          <option value="used">Đang sử dụng</option>
          <option value="unused">Chưa sử dụng</option>
        </select>
        <label className="field">
          Tải ảnh lên
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={busy}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setBusy(true);
              setError("");
              try {
                const body = new FormData();
                body.append("image", file);
                const result = await api<{ url: string }>("/admin/uploads", {
                  method: "POST",
                  body,
                });
                setRevision((value) => value + 1);
                if (onSelect) onSelect(result.url);
                else setNotice("Đã tải ảnh lên thư viện.");
              } catch (error) {
                setError((error as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
      </div>
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      {notice && <p role="status">{notice}</p>}
      {!data ? (
        <p role="status">Đang tải thư viện ảnh…</p>
      ) : (
        <>
          <div className="admin-media-grid">
            {data.items.map((item) => (
              <article className="admin-media-card" key={item._id}>
                <a href={item.url} target="_blank" rel="noopener">
                  <ResponsiveImage
                    src={item.url}
                    alt={item.originalName}
                    sizes="240px"
                  />
                </a>
                <div>
                  <strong>{item.originalName}</strong>
                  <small>
                    {item.width} × {item.height} px ·{" "}
                    {(item.bytes / 1024).toFixed(1)} KB
                  </small>
                  <span
                    className={`status-pill ${item.usage.length ? "confirmed" : "new"}`}
                  >
                    {item.usage.length
                      ? `Đang dùng: ${item.usage.length} nơi`
                      : "Chưa sử dụng"}
                  </span>
                  {item.usage.length > 0 ? (
                    <details>
                      <summary>Xem nơi sử dụng</summary>
                      <ul>
                        {item.usage.map((entry) => (
                          <li key={entry.type + entry.id}>{entry.label}</li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    item.deleteAfter && (
                      <p className="admin-note">
                        Dọn sau:{" "}
                        {new Date(item.deleteAfter).toLocaleString("vi-VN")}
                      </p>
                    )
                  )}
                  {item.lastError && (
                    <p className="admin-error">{item.lastError}</p>
                  )}
                  <div className="admin-actions">
                    {onSelect && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={async () => {
                          setBusy(true);
                          setError("");
                          try {
                            const result = await api<{ url: string }>(
                              `/admin/media/${item._id}/select`,
                              { method: "POST" },
                            );
                            onSelect(result.url);
                          } catch (error) {
                            setError((error as Error).message);
                          } finally {
                            setBusy(false);
                          }
                        }}
                      >
                        Chọn ảnh này
                      </button>
                    )}
                    {!onSelect && data.canManage && (
                      <button
                        type="button"
                        className="danger"
                        disabled={busy || item.usage.length > 0}
                        onClick={async () => {
                          if (
                            !confirm(
                              "Lên lịch xóa ảnh này sau 24 giờ? Hệ thống sẽ kiểm tra lại nơi sử dụng trước khi xóa file.",
                            )
                          )
                            return;
                          setBusy(true);
                          setError("");
                          try {
                            await api(`/admin/media/${item._id}`, {
                              method: "DELETE",
                            });
                            setNotice(
                              "Đã lên lịch xóa sau 24 giờ; ảnh dùng lại sẽ được giữ.",
                            );
                            setRevision((value) => value + 1);
                          } catch (error) {
                            setError((error as Error).message);
                          } finally {
                            setBusy(false);
                          }
                        }}
                      >
                        Dọn ảnh
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!data.items.length && (
            <p>
              Chưa có ảnh phù hợp. Ảnh có sẵn trong bộ giao diện không nằm trong
              thư viện upload.
            </p>
          )}
          <div className="admin-pagination">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
            >
              ← Trước
            </button>
            <span>
              Trang {page} · {data.total} ảnh
            </span>
            <button
              type="button"
              disabled={page * data.limit >= data.total}
              onClick={() => setPage((value) => value + 1)}
            >
              Sau →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
