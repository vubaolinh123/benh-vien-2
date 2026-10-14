import { test, expect } from "@playwright/test";
test("communications can discover, edit and reopen introduction pages", async ({
  page,
  isMobile,
}, info) => {
  await page.goto("/admin/");
  await page
    .getByLabel("Email", { exact: true })
    .fill("communications@example.test");
  await page
    .getByLabel("Mật khẩu", { exact: true })
    .fill("Local-test-password-2026!");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await page
    .getByRole("button", {
      name: "Sửa trang Giới thiệu bệnh viện",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Trang giới thiệu", exact: true }),
  ).toBeVisible();
  const slug = isMobile ? "su-menh-tam-nhin" : "gioi-thieu";
  await page
    .getByLabel("Chọn trang cần sửa", { exact: true })
    .selectOption(slug);
  const title = `Giới thiệu kiểm thử ${info.project.name}`;
  await expect(page.locator(".tiptap")).toBeVisible();
  await page.getByLabel("Tiêu đề trang", { exact: true }).fill(title);
  await page
    .getByLabel("Mô tả ngắn", { exact: true })
    .fill("Mô tả giới thiệu bệnh viện đã chỉnh.");
  await page
    .locator(".tiptap")
    .fill(`Nội dung giới thiệu đã sửa ${info.project.name}`);
  await page.getByLabel("Hiển thị công khai", { exact: true }).check();
  await page
    .getByRole("button", { name: "Lưu trang giới thiệu", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Đã lưu trang");
  const response = await page.request.get(`/api/public/content/page/${slug}`);
  expect(response.ok()).toBe(true);
  const content = await response.json();
  expect(content.name).toBe(title);
  expect(content.body).toContain(
    `Nội dung giới thiệu đã sửa ${info.project.name}`,
  );
  await page
    .getByLabel("Chọn trang cần sửa", { exact: true })
    .selectOption("van-hoa-doanh-nghiep");
  await expect(
    page.getByLabel("Tiêu đề trang", { exact: true }),
  ).not.toHaveValue(title);
  await page
    .getByLabel("Chọn trang cần sửa", { exact: true })
    .selectOption(slug);
  await expect(page.getByLabel("Tiêu đề trang", { exact: true })).toHaveValue(
    title,
  );
  await expect(page.locator(".tiptap")).toContainText(
    `Nội dung giới thiệu đã sửa ${info.project.name}`,
  );
  await expect(
    page.getByRole("link", { name: "Xem trang trên website ↗", exact: true }),
  ).toHaveAttribute(
    "href",
    slug === "gioi-thieu" ? "/gioi-thieu/" : `/gioi-thieu/${slug}/`,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `preview/introduction-editor-${info.project.name}.png`,
    fullPage: true,
  });
});
