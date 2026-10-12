# Frontend Bệnh viện Đa khoa Đại An

Website Next.js App Router/TypeScript cho `https://benhviendaian.vn`, triển khai trên Vercel. Backend Node.js/MongoDB nằm ngoài frontend và được cài đặt, build, triển khai độc lập.

```text
D:/ProjectWeb/
  benh-vien-2/             Frontend Next.js (thư mục này)
  benh-vien-2-backend/     Backend Express/MongoDB, .env và Docker
```

## Chạy frontend

Yêu cầu Node.js 24. Sao chép `.env.example` thành `.env.local`; `API_INTERNAL_URL=http://127.0.0.1:4000` khi chạy cục bộ. Trên Vercel đổi thành HTTPS origin API riêng, không thêm `/api` ở cuối. Không đặt MongoDB URI, JWT secret hay mật khẩu quản trị trong frontend.

```sh
npm ci
npm run dev
```

Website: `http://localhost:3000`. Quản trị: `http://localhost:3000/admin/`. Backend cần chạy trước để frontend đọc nội dung và đăng nhập. Xem [hướng dẫn backend](../benh-vien-2-backend/README.md).

## Cấu trúc frontend

```text
src/
  app/                  Routes, layouts, metadata, sitemap và robots
  components/
    home/               Các phần trang chủ
    layout/             Header, dropdown, footer và nội dung dùng chung
    ui/                 Nút hành động, liên kết, ảnh responsive
  features/
    admin/              Quản trị, bài viết, đăng ký khám và dashboard
    dialog/             Hộp thoại/biểu mẫu tải khi cần
  lib/                  API clients, cấu hình domain và SEO
  types/                Kiểu dữ liệu frontend
  data/                 Manifest ảnh tạo lúc build
  styles/               CSS chung, thương hiệu và quản trị
public/assets/          Logo, fonts, ảnh và WebP có hash
scripts/                Tối ưu ảnh và kiểm tra cấu hình frontend
tests/e2e/              Kiểm thử trình duyệt desktop/mobile
docs/                   Phạm vi, vận hành và triển khai
```

## Build và kiểm thử

```sh
npm run typecheck
npm run lint
npm run build
npm start
```

`npm run build` chỉ build frontend. API cần online khi tạo trang từ dữ liệu đã xuất bản; nội dung làm mới bằng ISR 60 giây, sitemap 300 giây. Dialog và các phần quản trị dùng dynamic import. Cấu hình SEO dùng domain chính thức; đặt `NEXT_PUBLIC_ALLOW_INDEXING=false` cho preview.

Trang chủ giữ lại ảnh/nội dung cũ và được quản lý toàn bộ qua MongoDB. Mục Trang chủ chỉnh menu, logo, SEO, tiêu đề, nút bấm và thứ tự/ẩn hiện 14 khối. Nội dung website chỉnh ảnh, thẻ, icon chuyên khoa và liên kết; Bài viết chỉnh tin tức/hỏi đáp. Backend tự chạy migration khi khởi động; có thể chạy `npm run setup:home` để bổ sung cấu hình. Các thay đổi admin về sau được giữ nguyên.

Kiểm thử trình duyệt dùng MongoDB cô lập: mở terminal trong backend và chạy `npm ci`, `$env:TEST_API_PORT="4001"; npm run dev:fixture`. Trong frontend:

```sh
$env:API_INTERNAL_URL="http://127.0.0.1:4001"
npm run build
npx playwright install chromium
npm run test:e2e
```

Fixture không đọc `.env` backend và không kết nối database thật. Nội dung thử chỉ xuất hiện trong môi trường này. Kiểm thử API chạy bằng `npm test` trong backend.

Xem [phạm vi theo báo giá](docs/requirements.md), [triển khai](docs/deployment.md), [hướng dẫn quản trị](docs/user-guide.md) và [kết quả kiểm thử](docs/verification.md).
