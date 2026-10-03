# Bệnh viện Đại An — Demo 02

Website HTML, CSS và JavaScript thuần. Demo 02 được đặt trực tiếp tại `/`.

## Deploy Vercel

1. Import repository `vubaolinh123/benh-vien-2` vào Vercel.
2. Root Directory: để mặc định (thư mục gốc repository).
3. Framework Preset: **Other**.
4. Cấu hình trong `vercel.json` tự đặt Build Command `node scripts/build.mjs` và Output Directory `dist`.
5. Deploy. Không cần biến môi trường, database hoặc cài thư viện.

Đường dẫn cũ `/demo-2/` chuyển hướng về trang chủ `/` trên Vercel.

## Chạy và build

```sh
node scripts/build.mjs
python -m http.server 5501 --directory dist
```

Mở http://localhost:5501/. Build xóa và tạo lại duy nhất thư mục `dist` trong project.

## Cấu trúc

- `index.html`: trang chủ demo 02.
- `base.css`: kiểu nền và thành phần dùng chung.
- `styles.css`: nhận diện, bố cục, responsive demo 02.
- `app.js`: chuyên khoa, bài viết, biểu mẫu, tìm kiếm.
- `interactions.js`: banner, đội ngũ, thư viện, video, hỏi đáp.
- `assets/`: logo, hình ảnh và MP4, được đóng gói tại chỗ.
- `scripts/build.mjs`: build static dành cho Vercel.
- `docs/section-audit.md`: đối chiếu các section trang tham chiếu.

## Nội dung demo

Logo do khách hàng cung cấp. Ảnh hoạt động và các bài viết tóm lược lấy từ fanpage https://www.facebook.com/bvdkdaian/; bài viết có liên kết nguồn trong `app.js`. Ảnh Sản/Tai Mũi Họng dùng mẫu thiết kế khách hàng cung cấp. Hồ sơ bác sĩ và danh mục chưa xác nhận được ghi là minh họa.

Hai video MP4 là trình chiếu ảnh fanpage, không có âm thanh, được ghi nhãn demo. File đã dựng sẵn; Vercel không cần FFmpeg. Có thể dựng lại bằng `python scripts/build-demo-videos.py` nếu máy có FFmpeg.

Biểu mẫu không gửi hoặc lưu dữ liệu; không tạo lịch khám thực tế. Tra cứu chỉ dùng `DA-DEMO` / `0900000000`. Bệnh viện cần duyệt thông tin, hồ sơ, bảng giá và chính sách trước khi vận hành chính thức.
