"use client";
import dynamic from "next/dynamic";
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
import { ImpactNote } from "./impact-note";
const Editor = dynamic(() => import("./rich-editor"), { ssr: false });
type Draft = Omit<ContentItem, "_id" | "updatedAt">;
const kinds: Record<ContentItem["kind"], string> = {
  service: "Dịch vụ y tế",
  specialty: "Chuyên khoa",
  doctor: "Bác sĩ",
  page: "Trang thông tin",
  banner: "Banner trang chủ",
  gallery: "Thư viện ảnh",
  video: "Video",
  promotion: "Thẻ ảnh giới thiệu / liên kết",
  care_activity: "Ảnh hoạt động đội ngũ",
  support_link: "Tiện ích người bệnh",
  editorial_link: "Thẻ bổ sung trong bài viết",
};
const notes: Record<ContentItem["kind"], string> = {
  service:
    "Lưới DỊCH VỤ NỔI BẬT sau banner và lựa chọn dịch vụ trong biểu mẫu đặt lịch.",
  specialty: "Lưới biểu tượng CHUYÊN KHOA và trang chi tiết chuyên khoa.",
  doctor:
    "Khối ĐỘI NGŨ BÁC SĨ khi trang chủ chọn chế độ hồ sơ bác sĩ hoặc tự động.",
  page: "Trang thông tin theo slug. Giới thiệu trang chủ chỉnh trong Thông tin bệnh viện.",
  banner:
    "Slider đầu trang, ngay dưới menu. Có mô tả sẽ dùng bố cục ảnh và chữ; để mô tả trống sẽ hiển thị ảnh banner toàn chiều ngang.",
  gallery:
    "Lưới CƠ SỞ VẬT CHẤT và cột HÌNH ẢNH. Ảnh ưu tiên chọn trong Cấu hình trang chủ.",
  video: "Cột VIDEO cạnh thư viện ảnh và trang Thư viện video.",
  promotion:
    "Hàng ảnh đầu tiên ở GIỚI THIỆU hoặc hàng ảnh sau CHUYÊN KHOA, theo vị trí bạn chọn.",
  care_activity:
    "Các thẻ và chi tiết trong khối ĐỘI NGŨ khi chọn ảnh hoạt động hoặc chưa có hồ sơ bác sĩ.",
  support_link: "Các nút tiện ích trong ĐẠI AN LUÔN BÊN BẠN gần cuối trang.",
  editorial_link:
    "Thẻ ảnh/liên kết bổ sung khi lưới Tin nổi bật, Sống khỏe hoặc Tin bệnh viện còn chỗ trống.",
};
function empty(kind: ContentItem["kind"]): Draft {
  return {
    kind,
    slug: "",
    name: "",
    summary: "",
    body: "",
    image: "",
    qualification: "",
    specialty: "",
    schedule: "",
    link: "",
    active: false,
    order: 0,
    placement:
      kind === "promotion"
        ? "intro"
        : kind === "editorial_link"
          ? "featured"
          : "",
    action: "link",
    icon: "cross",
    buttonLabel: "",
    eyebrow: "",
    targetSlug: "",
  };
}
export default function ContentPanel() {
  const [kind, setKind] = useState<ContentItem["kind"]>("service");
  const [page, setPage] = useState(1);
  const { data, error, reload, setError } = useAdminList<ContentItem>(
    `/admin/content?kind=${kind}&page=${page}`,
  );
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editing, setEditing] = useState("");
  const [saving, setSaving] = useState(false);
  function field<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => current && { ...current, [key]: value });
  }
  async function save(event: FormEvent) {
    event.preventDefault();
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
  const actionable = ["promotion", "support_link", "editorial_link"].includes(
    kind,
  );
  return (
    <section>
      <div className="admin-section-heading">
        <div>
          <h2>Nội dung website</h2>
          <p>Ảnh, thẻ, dịch vụ và thông tin xuất hiện trên website.</p>
        </div>
        <button
          className="button"
          onClick={() => {
            setEditing("");
            setDraft(empty(kind));
          }}
        >
          Thêm nội dung
        </button>
      </div>
      <label className="field">
        Loại nội dung
        <select
          aria-label="Loại nội dung"
          value={kind}
          onChange={(event) => {
            setKind(event.target.value as ContentItem["kind"]);
            setPage(1);
            setDraft(null);
          }}
        >
          {Object.entries(kinds).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <ImpactNote>
        {notes[kind]} Tên, ảnh, mô tả và thứ tự hiển thị được áp dụng ở vị trí
        này. Tắt Hiển thị công khai sẽ ẩn nội dung sau chu kỳ cache.
      </ImpactNote>
      {kind === "page" && (
        <p className="admin-note">
          Slug dành riêng: gioi-thieu, su-menh-tam-nhin, he-thong-y-te,
          hoat-dong, van-hoa-doanh-nghiep, guide, insurance, prices.
        </p>
      )}
      <Message error={error} />
      {draft && (
        <form className="admin-edit-form" onSubmit={save}>
          <div className="form-grid">
            <label className="field full">
              Tên / tiêu đề
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
              <small>
                Đổi tiêu đề của thẻ hoặc phần nội dung tại vị trí ghi bên trên.
              </small>
            </label>
            <label className="field">
              Đường dẫn
              <input
                required
                maxLength={100}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                value={draft.slug}
                onChange={(event) => field("slug", event.target.value)}
              />
              <small>
                Định danh nội dung; ảnh ưu tiên/thẻ mở gallery tham chiếu slug
                này.
              </small>
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
              <small>Số nhỏ hơn xuất hiện trước trong cùng nhóm.</small>
            </label>
            <label className="field full">
              Tóm tắt
              <textarea
                maxLength={600}
                value={draft.summary}
                onChange={(event) => field("summary", event.target.value)}
              />
              <small>
                Mô tả dưới tiêu đề; với banner, nội dung này bật bố cục ảnh và
                chữ.
              </small>
            </label>
            {["promotion", "editorial_link"].includes(kind) && (
              <label className="field">
                Vị trí trên trang chủ
                <select
                  value={draft.placement || ""}
                  onChange={(event) =>
                    field("placement", event.target.value as Draft["placement"])
                  }
                >
                  {(kind === "promotion"
                    ? [
                        ["intro", "Hàng ảnh trong giới thiệu"],
                        ["specialties", "Hàng ảnh sau chuyên khoa"],
                      ]
                    : [
                        ["featured", "Tin tức nổi bật"],
                        ["health", "Sống khỏe"],
                        ["hospital", "Tin bệnh viện"],
                      ]
                  ).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <small>Chọn phần trang chủ sẽ hiển thị thẻ này.</small>
              </label>
            )}
            {actionable && (
              <label className="field">
                Thao tác khi bấm
                <select
                  value={draft.action || "link"}
                  onChange={(event) =>
                    field("action", event.target.value as Draft["action"])
                  }
                >
                  <option value="link">Mở liên kết</option>
                  <option value="booking">Mở đặt lịch khám</option>
                  <option value="feedback">Mở góp ý</option>
                  <option value="gallery">Mở thư viện ảnh</option>
                </select>
                <small>Quyết định hành động khi người dùng nhấn thẻ.</small>
              </label>
            )}
            {((actionable && draft.action === "link") ||
              ["banner", "video"].includes(kind)) && (
              <label className="field full">
                Liên kết
                <input
                  maxLength={300}
                  required={actionable}
                  value={draft.link || ""}
                  onChange={(event) => field("link", event.target.value)}
                  placeholder={
                    kind === "video"
                      ? "URL YouTube/Facebook hoặc /assets/community-demo.mp4"
                      : "/dich-vu/"
                  }
                />
                <small>
                  Địa chỉ đích của nút/thẻ. Banner để trống sẽ mở đặt lịch.
                </small>
              </label>
            )}
            {actionable && draft.action === "gallery" && (
              <label className="field">
                Slug ảnh sẽ mở
                <input
                  maxLength={100}
                  value={draft.targetSlug || ""}
                  onChange={(event) => field("targetSlug", event.target.value)}
                />
                <small>
                  Ảnh công khai trong Thư viện ảnh sẽ được mở khi bấm thẻ.
                </small>
              </label>
            )}
            {["doctor", "care_activity"].includes(kind) && (
              <>
                <label className="field">
                  {kind === "doctor"
                    ? "Học vị / chức danh"
                    : "Chú thích dưới thẻ"}
                  <input
                    maxLength={300}
                    value={draft.qualification || ""}
                    onChange={(event) =>
                      field("qualification", event.target.value)
                    }
                  />
                </label>
                {kind === "doctor" && (
                  <>
                    <label className="field">
                      Chuyên khoa
                      <input
                        maxLength={200}
                        value={draft.specialty || ""}
                        onChange={(event) =>
                          field("specialty", event.target.value)
                        }
                      />
                    </label>
                    <label className="field">
                      Lịch khám
                      <input
                        maxLength={500}
                        value={draft.schedule || ""}
                        onChange={(event) =>
                          field("schedule", event.target.value)
                        }
                      />
                    </label>
                  </>
                )}
              </>
            )}
            {["promotion", "care_activity", "banner"].includes(kind) && (
              <label className="field">
                Dòng chữ nhỏ
                <input
                  maxLength={150}
                  value={draft.eyebrow || ""}
                  onChange={(event) => field("eyebrow", event.target.value)}
                />
                <small>
                  Hiện trên tiêu đề. Thẻ ảnh để trống sẽ dùng nhãn mặc định
                  trong Cấu hình trang chủ.
                </small>
              </label>
            )}
            {["promotion", "banner"].includes(kind) && (
              <label className="field">
                Nhãn nút bấm
                <input
                  maxLength={100}
                  value={draft.buttonLabel || ""}
                  onChange={(event) => field("buttonLabel", event.target.value)}
                />
                <small>
                  Thay chữ của nút trên banner/thẻ ảnh; để trống dùng nhãn mặc
                  định.
                </small>
              </label>
            )}
            {["support_link", "specialty"].includes(kind) && (
              <label className="field">
                {kind === "specialty"
                  ? "Biểu tượng chuyên khoa"
                  : "Biểu tượng tiện ích"}
                <select
                  value={draft.icon || "cross"}
                  onChange={(event) => field("icon", event.target.value)}
                >
                  {[
                    ["calendar", "Lịch khám"],
                    ["file", "Hồ sơ"],
                    ["money", "Chi phí"],
                    ["book", "Hướng dẫn"],
                    ["shield", "Bảo hiểm"],
                    ["message", "Góp ý"],
                    ["phone", "Điện thoại"],
                    ["heart", "Trái tim"],
                    ["cross", "Y tế"],
                    ["users", "Đội ngũ"],
                    ["search", "Tìm kiếm"],
                  ].map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <small>
                  {kind === "specialty"
                    ? "Đổi icon trên từng mục trong lưới CHUYÊN KHOA ở trang chủ."
                    : "Đổi icon trên thẻ tiện ích gần cuối trang."}
                </small>
              </label>
            )}
          </div>
          {kind !== "support_link" && (
            <>
              <p className="admin-note">
                Ảnh này xuất hiện ở thẻ hoặc banner theo vị trí đã chọn.
              </p>
              <ImageUpload
                value={draft.image || ""}
                onChange={(value) => field("image", value)}
              />
            </>
          )}
          {["service", "specialty", "doctor", "page"].includes(kind) && (
            <>
              <p className="admin-note">
                Nội dung chi tiết xuất hiện trên trang riêng khi mở liên kết từ
                trang chủ.
              </p>
              <Editor
                value={draft.body}
                onChange={(value) => field("body", value)}
              />
            </>
          )}
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
              {saving ? "Đang lưu…" : "Lưu nội dung"}
            </button>
            <button type="button" onClick={() => setDraft(null)}>
              Hủy
            </button>
          </div>
        </form>
      )}
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Đường dẫn</th>
              <th>Vị trí</th>
              <th>Hiển thị</th>
              <th>Thứ tự</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.slug}</td>
                <td>{item.placement || kinds[item.kind]}</td>
                <td>{item.active ? "Công khai" : "Chưa xuất bản"}</td>
                <td>{item.order}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditing(item._id);
                      const values = empty(item.kind);
                      for (const key of Object.keys(
                        values,
                      ) as (keyof Draft)[]) {
                        Object.assign(values, {
                          [key]: item[key] ?? values[key],
                        });
                      }
                      setDraft(values);
                    }}
                  >
                    Sửa
                  </button>{" "}
                  <button
                    className="danger"
                    onClick={async () => {
                      if (!confirm(`Xóa nội dung “${item.name}”?`)) return;
                      try {
                        await api(`/admin/content/${item._id}`, {
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
    </section>
  );
}
