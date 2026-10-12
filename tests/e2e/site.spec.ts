import { test, expect } from "@playwright/test";

test("public pages render and introduction dropdown uses Đại An names", async ({
  page,
  isMobile,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("#specialty-grid")).toContainText(
    "Khám bệnh tổng quát",
  );
  await expect(page.locator(".cover-banner").first()).toHaveAttribute(
    "loading",
    "eager",
  );
  if (isMobile)
    await page.getByRole("button", { name: "Mở menu", exact: true }).click();
  if (isMobile)
    await page
      .getByRole("button", { name: "Mở menu Giới thiệu", exact: true })
      .click();
  else await page.locator(".introduction-trigger").hover();
  const menu = page.locator("#introduction-submenu");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link")).toHaveCount(7);
  await expect(menu).toContainText("Hoạt động Bệnh viện Đại An");
  await expect(menu).toContainText("Văn hóa doanh nghiệp tại Bệnh viện Đại An");
  await expect(menu).not.toContainText("Thu Cúc");
  await menu
    .getByRole("link", { name: "Sứ mệnh – tầm nhìn", exact: true })
    .click();
  await expect(page).toHaveURL(/\/gioi-thieu\/su-menh-tam-nhin\/$/);
  await expect(page.locator("main h1")).toHaveText("Sứ mệnh – tầm nhìn");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("dropdown works with keyboard and gallery page opens a dialog", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  if (isMobile)
    await page.getByRole("button", { name: "Mở menu", exact: true }).click();
  const toggle = page.locator(".introduction-toggle");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#introduction-submenu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#introduction-submenu")).toBeHidden();
  await expect(toggle).toBeFocused();
  await page.goto("/thu-vien/hinh-anh/");
  await expect(page.locator(".library-card")).toHaveCount(6);
  await page.locator(".library-card").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("booking writes a real request and feedback returns receipt", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Đặt lịch ngay",
    exact: true,
  });
  await trigger.click();
  await page.getByLabel("Họ và tên *").fill("Khách hàng trình duyệt");
  await page.getByLabel("Số điện thoại *", { exact: true }).fill("0900000000");
  await page.getByLabel("Dịch vụ *").selectOption("kham-tong-quat");
  await page
    .getByLabel("Ngày khám dự kiến *")
    .fill(
      new Date(Date.now() + 86400000).toLocaleDateString("en-CA", {
        timeZone: "Asia/Ho_Chi_Minh",
      }),
    );
  await page.locator("#booking-form input[name=consent]").check();
  await page
    .getByRole("button", { name: "Gửi đăng ký khám", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Đã tiếp nhận yêu cầu đặt lịch",
  );
  await expect(page.getByRole("status")).toContainText("DA-");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.locator(".quick-item").filter({ hasText: "Góp ý" }).click();
  await page
    .getByLabel("Nội dung góp ý *")
    .fill("Góp ý kiểm thử trình duyệt về website.");
  await page.locator("#feedback-form input[name=consent]").check();
  await page.getByRole("button", { name: "Gửi góp ý", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Đã tiếp nhận góp ý");
});

test("articles are rendered in HTML and production SEO uses the official domain", async ({
  page,
  request,
}) => {
  await page.goto("/song-khoe/ho-hap/");
  await expect(page.locator("main h1")).toContainText("Test nhanh hô hấp");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://benhviendaian.vn/song-khoe/ho-hap/",
  );
  const html = await (await request.get("/")).text();
  expect(html).toContain("DỊCH VỤ NỔI BẬT");
  expect(html).toContain("Khám bệnh tổng quát");
  expect(html).not.toContain("DEMO 02");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("https://benhviendaian.vn");
  expect(sitemap).not.toContain("/admin");
  const notFound = await request.get("/tin-tuc/khong-ton-tai/");
  expect(notFound.status()).toBe(404);
});

test("communications can edit posts but cannot open appointment operations", async ({
  page,
  isMobile,
}, testInfo) => {
  const title = `Bài viết kiểm thử ${testInfo.project.name} ${Date.now()}`;
  await page.goto("/admin/");
  await page
    .getByLabel("Email", { exact: true })
    .fill("communications@example.test");
  await page
    .getByLabel("Mật khẩu", { exact: true })
    .fill("Local-test-password-2026!");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Thêm bài viết" }),
  ).toBeVisible();
  await expect(page.locator(".admin-sidebar")).not.toContainText(
    "Đăng ký khám",
  );
  const status = await page.evaluate(
    async () => (await fetch("/api/admin/appointments")).status,
  );
  expect(status).toBe(403);
  await page.getByRole("button", { name: "Thêm bài viết" }).click();
  await expect(
    page.getByRole("textbox", { name: "Tiêu đề", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".tiptap")).toBeVisible();
  await page.getByRole("textbox", { name: "Tiêu đề", exact: true }).fill(title);
  await page
    .getByLabel("Tóm tắt", { exact: true })
    .fill("Tóm tắt kiểm thử chức năng soạn bài viết.");
  await page
    .locator(".tiptap")
    .fill("Nội dung chính thức trong môi trường kiểm thử.");
  await page.getByRole("button", { name: "Lưu bài viết", exact: true }).click();
  await expect(page.locator("tbody")).toContainText(title);
  if (isMobile)
    await page
      .getByRole("button", { name: "Mở thanh điều hướng", exact: true })
      .click();
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Đăng nhập", exact: true }),
  ).toBeVisible();
});

test("administrator sees dashboard and all management areas", async ({
  page,
  isMobile,
}) => {
  await page.goto("/admin/");
  await page.getByLabel("Email", { exact: true }).fill("admin@example.test");
  await page
    .getByLabel("Mật khẩu", { exact: true })
    .fill("Local-test-password-2026!");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page.locator(".admin-stats").first()).toBeVisible();
  await expect(page.locator(".admin-chart")).toHaveCount(2);
  if (isMobile)
    await page
      .getByRole("button", { name: "Mở thanh điều hướng", exact: true })
      .click();
  await page.getByRole("button", { name: "Tài khoản", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Tạo tài khoản" }),
  ).toBeVisible();
  if (isMobile)
    await page
      .getByRole("button", { name: "Mở thanh điều hướng", exact: true })
      .click();
  await page
    .getByRole("button", { name: "Nội dung website", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Thêm nội dung" }),
  ).toBeVisible();
  if (isMobile)
    await page
      .getByRole("button", { name: "Mở thanh điều hướng", exact: true })
      .click();
  await page.getByRole("button", { name: "Đăng ký khám", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Xuất Excel", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("restored homepage shows old presentation blocks and CMS content", async ({
  page,
  request,
}) => {
  const data = await (await request.get("/api/public/home")).json();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".promo-row")).toHaveCount(2);
  await expect(page.locator(".promo-card img")).toHaveCount(6);
  await expect(page.locator("#gioi-thieu")).toContainText(
    "Chăm sóc cả gia đình",
  );
  await expect(page.locator("#gioi-thieu")).toContainText(
    "An tâm cùng bảo hiểm y tế",
  );
  await expect(page.locator(".price-section")).toContainText(
    "BẢNG GIÁ DỊCH VỤ",
  );
  await expect(page.locator("#specialty-grid .specialty-card")).toHaveCount(6);
  await page.locator("#all-specialties").click();
  await expect(page.locator("#specialty-grid .specialty-card")).toHaveCount(
    data.content.filter((item: { kind: string }) => item.kind === "service")
      .length,
  );
  await expect(page.locator(".slide-dots button")).toHaveCount(
    data.content.filter((item: { kind: string }) => item.kind === "banner")
      .length,
  );
  const bannerIndex = data.content
    .filter((item: { kind: string }) => item.kind === "banner")
    .findIndex((item: { slug: string }) => item.slug === "cong-dong");
  await page
    .getByRole("button", { name: "Banner " + (bannerIndex + 1), exact: true })
    .click();
  await expect(page.locator(".campaign-slide.active")).toContainText(
    "Gửi trọn niềm tin",
  );
  await expect(page.locator(".facility-tiles img")).toHaveCount(6);
  await expect(page.locator("#department-grid a")).toHaveCount(12);
  await expect(page.locator("#department-grid svg")).toHaveCount(12);
  expect(
    await page
      .locator("#department-grid a")
      .evaluateAll((items) =>
        items.map((item) => item.getAttribute("data-icon")),
      ),
  ).toEqual([
    "cross",
    "heart",
    "users",
    "shield",
    "file",
    "search",
    "cross",
    "message",
    "heart",
    "search",
    "shield",
    "users",
  ]);
  await expect(page.locator(".video-grid .video-card")).toHaveCount(3);
  await page.locator(".video-grid .video-card").first().click();
  await expect(page.getByRole("dialog").locator("video")).toBeVisible();
  expect(
    await page
      .locator("video")
      .evaluate((video: HTMLVideoElement) => video.currentSrc),
  ).toContain("/assets/community-demo.mp4");
  await page.keyboard.press("Escape");
  await expect(page.locator("#qa-pager button")).toHaveCount(3);
  await expect(page.locator("#featured-news .editorial-card")).toHaveCount(5);
  const doctors = data.content.filter(
    (item: { kind: string }) => item.kind === "doctor",
  );
  await expect(page.locator("#doctor-cards .doctor-card")).toHaveCount(
    doctors.length || 5,
  );
  if (!doctors.length)
    await expect(page.locator("#doctor-detail")).toContainText(
      "ĐỘI NGŨ CHĂM SÓC ĐẠI AN",
    );
  for (const section of [
    "#gioi-thieu",
    "#doi-ngu",
    ".facility-section",
    "#thu-vien",
    "#tin-tuc",
    "#lien-he",
  ]) {
    await page.locator(section).scrollIntoViewIfNeeded();
    await expect(page.locator(section).locator("img").first()).toBeVisible();
    await expect
      .poll(() =>
        page
          .locator(section)
          .locator("img")
          .evaluateAll((images) =>
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("homepage configuration persists and sidebar collapses or opens as a drawer", async ({
  page,
  isMobile,
}, testInfo) => {
  await page.goto("/admin/");
  await page.getByLabel("Email", { exact: true }).fill("admin@example.test");
  await page
    .getByLabel("Mật khẩu", { exact: true })
    .fill("Local-test-password-2026!");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page.locator(".admin-stats").first()).toBeVisible();
  if (isMobile) {
    await page
      .getByRole("button", { name: "Mở thanh điều hướng", exact: true })
      .click();
    await expect(
      page.getByRole("dialog", { name: "Điều hướng quản trị" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Mở thanh điều hướng", exact: true }),
    ).toBeFocused();
    await page
      .getByRole("button", { name: "Mở thanh điều hướng", exact: true })
      .click();
  } else {
    await page
      .getByRole("button", { name: "Thu gọn sidebar", exact: true })
      .click();
    await expect(page.locator(".admin-sidebar")).toHaveClass(/is-collapsed/);
    await page
      .getByRole("button", { name: "Mở rộng sidebar", exact: true })
      .click();
  }
  await page.getByRole("button", { name: "Trang chủ", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Cấu hình trang chủ", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".home-section-row")).toHaveCount(14);
  await expect(page.locator(".admin-impact-note").first()).toContainText(
    "Vị trí thay đổi",
  );
  await page
    .locator("summary")
    .filter({ hasText: "SEO và tiêu đề trang" })
    .click();
  const title = page.getByLabel("Tiêu đề chính (H1)", { exact: false });
  const original = await title.inputValue();
  await title.fill(original + " ");
  await page
    .getByRole("button", { name: "Lưu cấu hình trang chủ", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Đã lưu thành công");
  await title.fill(original);
  await page
    .getByRole("button", { name: "Lưu cấu hình trang chủ", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Đã lưu thành công");
  await page.screenshot({
    path: "preview/admin-homepage-" + testInfo.project.name + ".png",
    fullPage: false,
  });
  if (isMobile)
    await page
      .getByRole("button", { name: "Mở thanh điều hướng", exact: true })
      .click();
  await page
    .getByRole("button", { name: "Nội dung website", exact: true })
    .click();
  await page
    .getByLabel("Loại nội dung", { exact: true })
    .selectOption("promotion");
  await expect(page.locator("tbody tr")).toHaveCount(6);
  await page
    .locator("tbody tr")
    .first()
    .getByRole("button", { name: "Sửa", exact: true })
    .click();
  await expect(page.getByLabel("Nhãn nút bấm", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Lưu nội dung", exact: true }).click();
  await expect(page.locator(".admin-edit-form")).toHaveCount(0);
  await expect(page.locator(".admin-error")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
