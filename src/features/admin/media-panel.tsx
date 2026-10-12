import MediaBrowser from "./media-browser";
import { ImpactNote } from "./impact-note";
export default function MediaPanel() {
  return (
    <section>
      <h2>Thư viện ảnh</h2>
      <ImpactNote>
        Quản lý ảnh tải lên cho bài viết, banner, gallery, logo và các nội dung
        khác. Ảnh dùng chung chỉ được dọn khi không còn nội dung nào tham chiếu.
        Thay ảnh tại màn hình chỉnh sửa nội dung tương ứng.
      </ImpactNote>
      <MediaBrowser />
    </section>
  );
}
