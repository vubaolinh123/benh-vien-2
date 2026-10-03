# Đối chiếu trang chủ demo 02

Đối chiếu ngày 03/10/2026 với https://benhvienthucuc.vn/ và 7 ảnh chụp do khách hàng cung cấp. Phạm vi là các khối trang chủ, không phải toàn bộ trang con của Thu Cúc. Giữ nhận diện xanh dương / xanh lá Đại An.

| Khối tham chiếu, theo thứ tự | Demo 02 |
| --- | --- |
| Thanh thông tin, logo, tìm kiếm, hotline, đặt lịch | Utility + masthead |
| Menu ngang gradient | Navigation Đại An |
| Banner chính | 6 slide, khung cao cố định theo breakpoint |
| Dịch vụ nổi bật | 6 thẻ ban đầu, mở rộng danh sách |
| Dải banner phụ thứ nhất | 3 banner gia đình, kết nối, BHYT |
| Đội ngũ bác sĩ | 5 thẻ chọn + khung giới thiệu + đặt lịch |
| Chuyên khoa | 12 mục, 6 cột × 2 hàng desktop |
| Dải banner phụ thứ hai | 3 banner cộng đồng, hình ảnh, trẻ em |
| Cơ sở vật chất | Ảnh lớn có chú thích + 6 ô ảnh trên nền gradient |
| Bảng giá | Dải CTA và hộp thông tin giá |
| Hình ảnh | 3 ảnh chọn + ảnh lớn, mở thư viện |
| Video | Video lớn + 2 mục nhỏ |
| Hỏi đáp chuyên gia | 2 thẻ/trang, 3 trang, mở câu trả lời |
| Tin tức nổi bật | 1 bài lớn + 4 mục nhỏ |
| Sống khỏe – Tin tức | Hai cột trên nền xanh, tin ngang bên trái, thẻ bên phải |
| Footer | 3 cột, liên hệ, thông tin, mạng xã hội, copyright |
| Liên hệ nổi | Hotline, đặt lịch, fanpage, về đầu trang |

Giữ thêm tiện ích hỗ trợ và CTA đặt lịch của demo trước.

## Nội dung thay thế

- Không gán tên/học vị bác sĩ Thu Cúc cho Đại An. Thẻ đội ngũ dùng ảnh hoạt động có sẵn và ghi rõ chờ hồ sơ chính thức.
- Không tự đặt ưu đãi, số giấy phép, chi nhánh, ứng dụng hoặc giá dịch vụ. Footer dùng địa chỉ Đại An, thông tin hỗ trợ và liên kết fanpage.
- Chuyên khoa chưa xác nhận được ghi là danh mục minh họa trong hộp chi tiết và ghi chú chung.
- Hỏi đáp là câu hỏi quy trình minh họa, không giả danh bác sĩ trả lời chuyên môn.
- Hai MP4 dài 12 giây là trình chiếu ảnh thực tế từ fanpage, không có âm thanh. Có nhãn demo. Dựng lại bằng `python scripts/build-demo-videos.py` (cần FFmpeg), không cần dựng lại khi deploy Vercel.
- Mục video thứ ba liên kết video Trung thu trên fanpage. Không sử dụng ảnh/nhân sự Thu Cúc để nhận diện Đại An.
- Ảnh hiện có đủ để minh họa các khối nên chưa cần ảnh AI.

## Kiểm tra

- Node kiểm tra cú pháp các script; build static gồm demo 01, demo 02, ảnh và MP4.
- Kiểm tra trình duyệt desktop 1440 px và mobile 390 px: các khối không tràn ngang.
- Chọn thẻ đội ngũ cập nhật khung chi tiết; chọn ảnh thay ảnh lớn; video tải được; hỏi đáp phân trang và mở câu trả lời.
- Giữ nguyên khung banner, logo và source demo 01.
