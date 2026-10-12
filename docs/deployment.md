# Triển khai Vercel và backend riêng

## 1. Backend và MongoDB

Backend cần Node.js 24, MongoDB 8 hoặc MongoDB Atlas, một thư mục lưu ảnh bền vững và HTTPS. MongoDB không được mở công khai ra Internet. Tạo database user chỉ có quyền readWrite với database `dai_an`; bảo vệ kết nối bằng TLS, hạn chế IP máy chủ backend.

Backend ở thư mục riêng `D:\ProjectWeb\benh-vien-2-backend`. File `.env` đã được tạo trong backend với secret JWT ngẫu nhiên. Điền `MONGODB_URI`, `ADMIN_EMAIL` và mật khẩu quản trị tối thiểu 12 ký tự. Khi triển khai đặt `NODE_ENV=production`, `SITE_ORIGIN=https://benhviendaian.vn`; tạo secret riêng cho production nếu cấu hình hiện tại đã dùng để thử. Không commit `.env`. `TRUST_PROXY` phải khớp số reverse proxy đáng tin đứng trước API: 0 nếu trực tiếp; 1 nếu qua Caddy; kiểm tra lại nếu thêm CDN/proxy.

Chạy trong thư mục backend:

```sh
npm ci
npm run build
npm run seed
npm start
```

`seed` chỉ tạo dữ liệu chưa tồn tại, không ghi đè mật khẩu hay nội dung đã chỉnh sửa. Không có mật khẩu mặc định. Sau khi tạo Administrator, bỏ `ADMIN_PASSWORD` khỏi môi trường chạy thông thường.

Nếu triển khai container, đặt `API_DOMAIN` thành hostname API do bạn sở hữu, ví dụ `api.benhviendaian.vn`, trỏ DNS về máy chủ backend. Caddy tự cấp TLS khi DNS đúng. Dùng MongoDB Atlas hoặc MongoDB đã triển khai riêng:

```sh
docker compose --env-file .env -f deploy/compose.yml up -d --build
docker compose --env-file .env -f deploy/compose.yml run --rm api node dist/seed.js
```

Volume `uploads` phải được giữ khi cập nhật. Sao lưu cả MongoDB và volume ảnh; thử khôi phục trên môi trường riêng trước khi vận hành. Trước khi thay database, chạy sao lưu, kiểm tra index và kiểm tra quyền truy cập. Container chạy user không phải root; chỉ Caddy mở cổng 80/443.

## 2. Frontend Vercel

Import repository frontend `benh-vien-2`, chọn preset **Next.js**, root repository. `vercel.json` đã dùng `npm ci` và `npm run build`; chỉ build frontend, không cần source backend. `.env.example` của frontend chỉ chứa cấu hình frontend; MongoDB/JWT/mật khẩu nằm trong `.env` của backend. Thêm các biến:

| Biến | Giá trị |
| --- | --- |
| `API_INTERNAL_URL` | HTTPS origin API riêng, không có `/api` ở cuối |
| `NEXT_PUBLIC_SITE_URL` | `https://benhviendaian.vn` |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` trên production; `false` trên preview |
| `ALLOW_OFFLINE_BUILD` | `false` khi backend sẵn sàng |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Khóa công khai khi bật Turnstile |

Backend phải online trước build vì `generateStaticParams` và ISR đọc dữ liệu đã xuất bản. Có thể dùng `ALLOW_OFFLINE_BUILD=true` cho bản build ban đầu không kết nối API: hệ thống chỉ tạo giao diện rỗng, không phát sinh dữ liệu mẫu. Sau khi API sẵn sàng, tắt biến này và deploy lại.

Gắn tên miền `benhviendaian.vn` trong Vercel và cập nhật bản ghi DNS theo giá trị Vercel cung cấp. Chuyển `www.benhviendaian.vn` về domain chính qua cấu hình Domains của Vercel. Không tự suy đoán IP DNS. Kiểm tra chứng chỉ HTTPS và URL canonical sau deploy.

Frontend proxy `/api/*` sang backend nên trình duyệt dùng cùng origin; JWT ở cookie HttpOnly, không ở localStorage. Không đặt API/admin trong CDN cache chung. Đảm bảo proxy chuyển tiếp Cookie/Set-Cookie và Origin; không override Origin thành hostname backend. Thử đăng nhập bằng trình duyệt ở domain thật trước nghiệm thu.

## 3. Cache và giảm tải

- Nội dung công khai: ISR 60 giây; các trang mới được tạo theo lượt truy cập đầu tiên. Sitemap làm mới 300 giây. HTML công khai không đọc cookie/headers theo người dùng.
- API homepage: cache aggregate 30 giây, gộp truy vấn đồng thời; public API có `s-maxage`, `stale-while-revalidate`. Sửa nội dung xóa cache API, frontend làm mới theo chu kỳ. Xuất bản/ẩn bài không tức thời: có thể còn trong cache vài phút.
- Ảnh có sẵn: WebP nhiều kích thước tạo lúc build, tên có hash; cache một năm. Ảnh tải lên: xác minh bytes, giới hạn 20 MB/50 triệu pixel, chuyển WebP, tên UUID không ghi đè, cache một năm.
- Trang quản trị và form dùng dynamic import; tìm kiếm gần đây dùng dữ liệu đã tải; không có polling trên dashboard.
- MongoDB dùng pool tối đa 10, index cho danh sách và TTL cho session/thống kê; list API phân trang tối đa 100 bản ghi. Excel dùng cursor và streaming.
- API giới hạn 180 yêu cầu/phút/IP, login 10/15 phút, đăng ký/góp ý tổng 5/15 phút/IP; cần xem xét mức phù hợp nếu nhiều người cùng mạng bệnh viện. Giới hạn hiện dùng bộ nhớ của từng tiến trình; nếu chạy nhiều replica, thêm Redis store hoặc giới hạn tại gateway.

Cache và giới hạn API giúp giảm tải, không bảo đảm chống mọi DDoS. Bật Firewall/rate limit trên Vercel và CDN/gateway của API. Chặn lưu lượng bất thường ở biên trước khi đến Node.js. Không đưa dashboard/đăng ký/Excel vào cache công khai. Giám sát HTTP 429/5xx, CPU, memory, pool MongoDB, disk ảnh và thời gian xử lý API; không log body có dữ liệu khách hàng.

## 4. Trước khi mở website

1. Đăng nhập `/admin/`, tạo tài khoản Truyền thông và CSKH. Kiểm tra người dùng mỗi nhóm chỉ mở được đúng API/chức năng.
2. Nội dung trang chủ cũ đã được khôi phục vào CMS theo yêu cầu. Với database đã seed trước thay đổi, chạy `npm run restore:home` trong backend một lần. Kiểm tra lại nội dung, dịch vụ, chuyên khoa và trạng thái xuất bản trước khi mở domain; bổ sung hồ sơ bác sĩ thật, bảng giá, BHYT, địa chỉ và chính sách. Migration không tự khôi phục nội dung mà admin ẩn/xóa sau đó.
3. Bật Turnstile bằng cả khóa frontend/backend và whitelist `benhviendaian.vn`; gửi thử đăng ký, tìm trong CSKH, đổi trạng thái và xuất Excel.
4. Kiểm tra sitemap không chứa nháp, canonical đúng domain, preview noindex, lịch đăng ký chưa được coi là xác nhận tự động.
5. Thiết lập sao lưu và thời hạn giữ đăng ký/góp ý theo quy trình bệnh viện. Dữ liệu đăng ký/góp ý không bị tự xóa; Administrator vận hành MongoDB xử lý yêu cầu chỉnh sửa/xóa theo quy trình đã duyệt.

Triển khai thực tế cần quyền Vercel, backend/MongoDB và DNS. Source không tự đăng ký domain hoặc tạo tài nguyên có phí.
