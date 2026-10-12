# Phạm vi triển khai

Nguồn đối chiếu: `Bao_gia_website_benh_vien.docx`, ngày 05/10/2026, do người dùng cung cấp. Những điều khoản giá, thời gian và bảo hành trong tài liệu là nội dung thương mại, không phải cấu hình hệ thống.

| Hạng mục | Đã triển khai trong source |
| --- | --- |
| Frontend Next.js | App Router, TypeScript, layout dùng chung, responsive và các trang Trang chủ, Giới thiệu, Chuyên khoa, Dịch vụ, Đội ngũ bác sĩ, Sống khỏe, Hỏi đáp, Tin tức, Liên hệ |
| Dữ liệu động | REST API Node.js/Express, MongoDB/Mongoose; frontend đọc nội dung xuất bản từ API và làm mới cache bằng ISR |
| SEO | Metadata, canonical, Open Graph, Twitter, sitemap, robots, Hospital/Article/Breadcrumb JSON-LD; admin và API không lập chỉ mục |
| Tài khoản | JWT cookie HttpOnly, đăng nhập/đăng xuất, đổi mật khẩu, cấp/khóa/xóa tài khoản, phân quyền 3 nhóm tại backend |
| Bài viết | CRUD Tin tức/Sống khỏe/Hỏi đáp; trình soạn thảo rich text, ảnh đại diện, ảnh trong bài, nháp/xuất bản |
| Đăng ký khám | Lưu MongoDB, đồng ý cung cấp thông tin, mã tiếp nhận, chống lưu trùng, tìm kiếm/lọc, trạng thái và ghi chú |
| Excel | Xuất XLSX theo bộ lọc, tạo theo luồng để hạn chế sử dụng bộ nhớ |
| Dashboard | Lượt truy cập theo ngày/7 ngày/30 ngày; đăng ký, bài đã đăng, trang phổ biến; đồ thị SVG và bảng số liệu |
| Nội dung website | Administrator quản lý dịch vụ, chuyên khoa, bác sĩ, trang thông tin, banner, ảnh, video và thông tin liên hệ |
| Kiểm thử/bàn giao | Kiểm thử API với MongoDB cô lập, kiểm thử trình duyệt, hướng dẫn vận hành, cấu hình Vercel và backend riêng |

## Nội dung và dịch vụ cần bên bệnh viện cung cấp

- Danh sách bác sĩ, học vị, lịch khám, chuyên khoa và các dịch vụ được xác nhận. Nội dung chưa được duyệt nằm ở trạng thái nháp/ẩn.
- Bảng giá, hướng dẫn BHYT, thời gian làm việc và chính sách bảo mật được người có thẩm quyền duyệt.
- Tài khoản Vercel, máy chủ backend hoặc dịch vụ container, kết nối MongoDB và quyền cấu hình DNS/TLS.
- Khóa Turnstile nếu dùng chống spam, cùng cơ chế sao lưu MongoDB và volume ảnh.

Không có HIS/LIS, tra cứu bệnh án, gửi SMS/email, thanh toán hoặc xác nhận lịch tự động trong báo giá. Biểu mẫu không tiếp nhận bệnh án; đăng ký khám phải được CSKH xác nhận.
