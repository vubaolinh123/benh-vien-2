import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("upload, reuse cover and inline image, show usage, then schedule cleanup after deleting post", async ({
  page,
  isMobile,
}, info) => {
  const name = `media-library-${info.project.name}.png`,
    title = `Bài viết thư viện ${info.project.name} ${Date.now()}`;
  await page.goto("/admin/");
  await page.getByLabel("Email", { exact: true }).fill("admin@example.test");
  await page
    .getByLabel("Mật khẩu", { exact: true })
    .fill("Local-test-password-2026!");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page.locator(".admin-stats").first()).toBeVisible();
  async function navigate(name: string) {
    if (isMobile)
      await page
        .getByRole("button", { name: "Mở thanh điều hướng", exact: true })
        .click();
    await page.getByRole("button", { name, exact: true }).click();
  }
  await navigate("Thư viện ảnh");
  await page
    .getByLabel("Tải ảnh lên", { exact: true })
    .setInputFiles({
      name,
      mimeType: "image/png",
      buffer: await readFile("public/assets/Dai_An-01.png"),
    });
  await expect(page.getByRole("status")).toContainText("Đã tải ảnh");
  await navigate("Bài viết");
  await page
    .getByRole("button", { name: "Thêm bài viết", exact: true })
    .click();
  await page.getByLabel("Tiêu đề", { exact: true }).fill(title);
  await page
    .getByLabel("Tóm tắt", { exact: true })
    .fill("Bài viết kiểm thử chọn ảnh có sẵn từ thư viện.");
  await page
    .locator(".tiptap")
    .fill("Nội dung bài viết kiểm thử sử dụng lại ảnh.");
  async function choose() {
    const library = page.locator(".media-browser");
    await library.getByRole("textbox", { name: "Tìm ảnh theo tên" }).fill(name);
    await library.getByRole("button", { name: "Tìm ảnh", exact: true }).click();
    await library
      .locator(".admin-media-card")
      .filter({ hasText: name })
      .getByRole("button", { name: "Chọn ảnh này", exact: true })
      .click();
  }
  await page
    .getByRole("button", { name: "Chọn từ thư viện ảnh", exact: true })
    .click();
  await choose();
  await page
    .getByRole("button", { name: "Chèn ảnh từ thư viện", exact: true })
    .click();
  await choose();
  await expect(page.locator(".tiptap img")).toHaveCount(1);
  await page.getByRole("button", { name: "Lưu bài viết", exact: true }).click();
  await expect(page.locator("tbody")).toContainText(title);
  await navigate("Thư viện ảnh");
  await page.getByRole("textbox", { name: "Tìm ảnh theo tên" }).fill(name);
  await page.getByRole("button", { name: "Tìm ảnh", exact: true }).click();
  const card = page.locator(".admin-media-card").filter({ hasText: name });
  await expect(card).toContainText("Đang dùng: 1 nơi");
  await expect(card.getByRole("button", { name: "Dọn ảnh" })).toBeDisabled();
  await card.locator("summary").click();
  await expect(card).toContainText(title);
  await page.screenshot({
    path: `preview/media-library-${info.project.name}.png`,
  });
  await navigate("Bài viết");
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .locator("tbody tr")
    .filter({ hasText: title })
    .getByRole("button", { name: "Xóa", exact: true })
    .click();
  await expect(page.locator("tbody")).not.toContainText(title);
  await navigate("Thư viện ảnh");
  await page.getByRole("textbox", { name: "Tìm ảnh theo tên" }).fill(name);
  await page.getByRole("button", { name: "Tìm ảnh", exact: true }).click();
  await expect(card).toContainText("Chưa sử dụng");
  await expect(card).toContainText("Dọn sau:");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
