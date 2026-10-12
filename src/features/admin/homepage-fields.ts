import type { HomeSectionKey } from "@/types/content";
export const homeSections: Record<
  HomeSectionKey,
  { label: string; location: string }
> = {
  banner: { label: "Banner đầu trang", location: "Slider dưới thanh menu." },
  services: { label: "Dịch vụ nổi bật", location: "Lưới dịch vụ sau banner." },
  introduction: {
    label: "Giới thiệu & kết nối",
    location: "Hàng ảnh đầu tiên và đoạn giới thiệu.",
  },
  team: {
    label: "Đội ngũ",
    location: "Khối bác sĩ hoặc hoạt động trên nền xanh.",
  },
  specialties: {
    label: "Chuyên khoa",
    location: "Lưới biểu tượng chuyên khoa.",
  },
  specialtyPromos: {
    label: "Ảnh sau chuyên khoa",
    location: "Hàng ảnh cộng đồng, chẩn đoán và trẻ em.",
  },
  facilities: {
    label: "Cơ sở vật chất",
    location: "Ảnh lớn và lưới ảnh trên nền xanh.",
  },
  price: { label: "Bảng giá", location: "Dải nút trước thư viện." },
  media: { label: "Thư viện ảnh & video", location: "Hai cột hình ảnh/video." },
  qa: { label: "Hỏi đáp", location: "Thẻ câu hỏi và phân trang." },
  news: {
    label: "Tin nổi bật",
    location: "Lưới bài viết và liên kết bổ sung.",
  },
  health: {
    label: "Sống khỏe & tin tức",
    location: "Hai cột bài viết nền xanh.",
  },
  support: { label: "Tiện ích", location: "Khối Đại An luôn bên bạn." },
  booking: {
    label: "Lời mời đặt lịch",
    location: "Dải đặt lịch phía trên chân trang.",
  },
};
export const copyGroups = [
  {
    label: "Banner đầu trang",
    location:
      "Nội dung khi banner trống và nhãn mặc định trên banner. Nhãn riêng của từng banner chỉnh trong Nội dung website.",
    fields: [
      ["bannerEyebrow", "Dòng nhỏ banner"],
      ["bannerMore", "Nút xem thông tin"],
      ["bannerBooking", "Nút đặt lịch banner"],
      ["bannerEmpty", "Tiêu đề khi chưa có banner"],
    ],
  },
  {
    label: "SEO và tiêu đề trang",
    location: "Tiêu đề chính, thẻ trình duyệt và kết quả tìm kiếm.",
    fields: [
      ["mainTitle", "Tiêu đề chính (H1)"],
      ["seoTitle", "Tiêu đề SEO"],
      ["seoDescription", "Mô tả SEO"],
    ],
  },
  {
    label: "Đầu trang và nút liên hệ",
    location: "Thanh trên cùng, tìm kiếm, hotline, nút đặt lịch và menu.",
    fields: [
      ["tagline", "Slogan đầu trang"],
      ["headerSearch", "Gợi ý tìm kiếm"],
      ["headerConsult", "Chú thích hotline"],
      ["headerBooking", "Nút đặt lịch đầu trang"],
      ["stickyBooking", "Nút đặt lịch cố định"],
      ["utilityExplore", "Liên kết khám phá"],
      ["introMenuLabel", "Tên menu Giới thiệu"],
    ],
  },
  {
    label: "Dịch vụ và giới thiệu",
    location: "Dịch vụ nổi bật, hai hàng ảnh liên kết và phần giới thiệu.",
    fields: [
      ["servicesTitle", "Tiêu đề dịch vụ"],
      ["servicesEyebrow", "Dòng nhỏ trên dịch vụ"],
      ["servicesMore", "Nút mở rộng dịch vụ"],
      ["servicesLess", "Nút thu gọn dịch vụ"],
      ["introMore", "Liên kết tìm hiểu bệnh viện"],
      ["promoEyebrow", "Dòng nhỏ mặc định thẻ ảnh"],
      ["promoButton", "Nút mặc định thẻ ảnh"],
    ],
  },
  {
    label: "Đội ngũ và chuyên khoa",
    location: "Khối đội ngũ nền xanh và danh mục chuyên khoa.",
    fields: [
      ["doctorProfile", "Nút xem hồ sơ bác sĩ"],
      ["teamTitle", "Tiêu đề đội ngũ"],
      ["teamEyebrow", "Dòng nhỏ trong hồ sơ"],
      ["teamMore", "Liên kết xem đội ngũ"],
      ["teamBooking", "Nút đặt lịch đội ngũ"],
      ["teamNote", "Chú thích ảnh hoạt động"],
      ["specialtiesTitle", "Tiêu đề chuyên khoa"],
      ["specialtiesMore", "Liên kết xem chuyên khoa"],
    ],
  },
  {
    label: "Cơ sở vật chất, bảng giá và thư viện",
    location: "Caption ảnh lớn, nút bảng giá và hai cột ảnh/video.",
    fields: [
      ["facilityTitle", "Tiêu đề cơ sở vật chất"],
      ["facilityDescription", "Mô tả cơ sở vật chất"],
      ["priceLabel", "Nhãn bảng giá"],
      ["priceLink", "Đường dẫn bảng giá"],
      ["imagesTitle", "Tiêu đề thư viện ảnh"],
      ["imagesMore", "Nhãn xem thêm ảnh"],
      ["imagesLink", "Đường dẫn xem ảnh"],
      ["videosTitle", "Tiêu đề video"],
      ["videosMore", "Nhãn xem thêm video"],
      ["videosLink", "Đường dẫn xem video"],
    ],
  },
  {
    label: "Hỏi đáp và bài viết",
    location: "Hỏi đáp, tin nổi bật và hai cột Sống khỏe/Tin tức.",
    fields: [
      ["qaAnswer", "Nút xem câu trả lời"],
      ["qaEmpty", "Thông báo khi chưa có câu hỏi"],
      ["qaTitle", "Tiêu đề hỏi đáp"],
      ["qaMore", "Nhãn xem câu hỏi"],
      ["qaLink", "Đường dẫn hỏi đáp"],
      ["qaCategory", "Dòng nhỏ câu hỏi"],
      ["qaCustomer", "Tên nhóm người hỏi"],
      ["qaCaption", "Chú thích người hỏi"],
      ["newsTitle", "Tiêu đề tin nổi bật"],
      ["newsMore", "Nhãn xem tin"],
      ["newsLink", "Đường dẫn tin tức"],
      ["healthTitle", "Tiêu đề Sống khỏe"],
      ["healthMore", "Nhãn xem bài sống khỏe"],
      ["healthLink", "Đường dẫn Sống khỏe"],
      ["hospitalTitle", "Tiêu đề cột tin bệnh viện"],
    ],
  },
  {
    label: "Tiện ích và đặt lịch",
    location: "Tiện ích gần cuối trang và dải đặt lịch phía trên footer.",
    fields: [
      ["supportTitle", "Tiêu đề tiện ích"],
      ["supportDescription", "Mô tả tiện ích"],
      ["bookingEyebrow", "Dòng nhỏ dải đặt lịch"],
      ["bookingTitle", "Tiêu đề dải đặt lịch"],
      ["bookingButton", "Nút dải đặt lịch"],
    ],
  },
  {
    label: "Chân trang",
    location:
      "Slogan, nhãn và bản quyền cuối trang. Thông tin liên hệ chỉnh ở Thông tin bệnh viện.",
    fields: [
      ["footerFeedback", "Nút góp ý"],
      ["footerStaff", "Nhãn đăng nhập nhân sự"],
      ["footerHotline", "Nhãn hotline chân trang"],
      ["footerSlogan", "Slogan chân trang"],
      ["footerConsult", "Nhãn tư vấn"],
      ["footerPolicyLabel", "Nhãn bảo mật"],
      ["footerTermsLabel", "Nhãn điều khoản"],
      ["footerSocialTitle", "Tiêu đề mạng xã hội"],
      ["footerSocialNote", "Mô tả mạng xã hội"],
      ["footerHoursTitle", "Tiêu đề giờ làm việc"],
      ["footerSupportTitle", "Tiêu đề hỗ trợ"],
      ["footerInfoTitle", "Tiêu đề thông tin"],
      ["footerCopyright", "Dòng bản quyền"],
      ["footerMapLabel", "Nhãn đường đi"],
    ],
  },
] as const;
