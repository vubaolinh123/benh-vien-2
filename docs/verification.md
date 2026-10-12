# Kết quả kiểm tra source

Ngày kiểm tra: 07/10/2026. Frontend/backend tách riêng. Kiểm thử dùng MongoDB cô lập trên API 4001; bản build cuối dùng backend được cấu hình cục bộ trên API 4000.

- TypeScript frontend/backend, ESLint frontend và production build: đạt.
- API với MongoDB tạm: 11/11 đạt.
- Trình duyệt desktop/mobile: 16/16 đạt.

Đã xác minh cấu hình trang chủ lưu/đọc qua MongoDB và trả trong API công khai; menu, SEO, thứ tự/ẩn hiện, chế độ đội ngũ; phân quyền Administrator; từ chối liên kết nguy hiểm và khối trùng lặp. Thẻ quảng bá sửa vị trí, nội dung, hành động và nút; tắt công khai loại bỏ khỏi API. Migration giữ nội dung chỉnh sửa, mục đã ẩn/xóa và icon chuyên khoa đã sửa.

Trình duyệt kiểm tra dropdown, HTML SEO, sitemap/404, đăng ký/góp ý, soạn bài, phân quyền, dashboard, quản trị, trang chủ đủ ảnh/nội dung, 12 icon chuyên khoa đúng source demo, sidebar thu gọn/mở rộng và drawer di động/Escape/focus, lưu cấu hình và lưu thẻ CMS. Giao diện không tràn ngang. Đã xem ảnh chụp trang cấu hình desktop/mobile.

Trang chủ quản lý qua CMS cả các phần vừa phục hồi: thẻ giới thiệu/liên kết, ảnh hoạt động đội ngũ, tiện ích, thẻ bổ sung bài viết, logo/menu/copy và 14 khối. Nội dung công khai giữ ISR 60 giây và cache API; thay đổi có thể mất vài phút để hiện trên trang. Dùng fixture mới khi lặp kiểm thử để tránh rate limit; không tắt giới hạn của hệ thống thật.

Chưa triển khai hoặc kiểm tra DNS/TLS, cookie qua Vercel ở domain thật, máy chủ đích hay tải/DDoS. Dữ liệu kiểm thử nằm trong fixture, không đưa vào database thật.

Cập nhật quản lý ảnh: 15/15 kiểm thử API và 18/18 kiểm thử trình duyệt đạt. Kiểm tra file thực bị xóa sau thời gian chờ, ảnh trong bài nháp/HTML và ảnh dùng chung được bảo vệ, thay logo/giới thiệu/gallery, chọn lại ảnh, nhập file cũ idempotent, lease khi lưu, save lỗi và phục hồi claim dọn quá hạn. Trình duyệt kiểm tra upload, chọn cùng ảnh cho cover/HTML, danh sách nơi dùng, chặn dọn ảnh đang dùng và lên lịch sau khi xóa bài; desktop/mobile không tràn ngang.
