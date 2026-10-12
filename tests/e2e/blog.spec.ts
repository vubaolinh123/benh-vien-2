import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("blog editor preserves formatting and uploads file, pasted and dropped images as URLs", async ({
  page,
  isMobile,
}, info) => {
  const title = `Bài blog ${info.project.name} ${Date.now()}`;
  const bytes = await readFile("public/assets/Dai_An-01.png");
  await page.goto("/admin/");
  await page
    .getByLabel("Email", { exact: true })
    .fill("communications@example.test");
  await page
    .getByLabel("Mật khẩu", { exact: true })
    .fill("Local-test-password-2026!");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Quản lý bài viết", exact: true }),
  ).toBeVisible();
  if (isMobile)
    await page
      .getByRole("button", { name: "Mở thanh điều hướng", exact: true })
      .click();
  await page.getByRole("button", { name: "Bài viết", exact: true }).click();
  await page
    .getByRole("button", { name: "Thêm bài viết", exact: true })
    .click();
  await page.getByLabel("Tiêu đề", { exact: true }).fill(title);
  const slug = await page.getByLabel("Đường dẫn", { exact: true }).inputValue();
  await page
    .getByLabel("Tóm tắt", { exact: true })
    .fill(
      "Nội dung thử nghiệm bài blog có căn lề, liên kết và ảnh được tải lên.",
    );
  const editor = page.locator(".tiptap");
  await editor.fill("Tiêu đề căn giữa");
  await page.getByLabel("Kiểu đoạn văn").selectOption("2");
  await page.getByRole("button", { name: "Căn giữa", exact: true }).click();
  await expect(editor.locator("h2")).toHaveCSS("text-align", "center");
  await editor.press("End");
  await editor.press("Enter");
  await page.getByLabel("Kiểu đoạn văn").selectOption("p");
  await page.getByLabel("Nhãn liên kết").fill("Bệnh viện Đại An");
  await page.getByLabel("Địa chỉ liên kết").fill("https://benhviendaian.vn/");
  await page.getByRole("button", { name: "Gắn liên kết", exact: true }).click();
  await expect(editor.locator("a")).toHaveAttribute(
    "href",
    "https://benhviendaian.vn/",
  );
  await page
    .getByLabel("Ảnh trong bài", { exact: true })
    .setInputFiles({ name: "blog.png", mimeType: "image/png", buffer: bytes });
  await expect(editor.locator("img")).toHaveCount(1);
  await editor.locator("img").click();
  await page.getByLabel("Độ rộng ảnh").selectOption("50");
  await page.getByLabel("Mô tả ảnh (alt)").fill("Ảnh bệnh viện trong bài");
  await page.getByRole("button", { name: "Căn phải", exact: true }).click();
  await expect(editor.locator("img")).toHaveAttribute("data-align", "right");
  await expect(editor.locator("img")).toHaveAttribute("data-size", "50");
  await editor.press("ArrowDown");
  await editor.press("Control+End");
  // Exercise browser clipboard and drag/drop paths without OS clipboard permissions.
  for (const mode of ["paste", "drop", "html"] as const) {
    await editor.evaluate((element) =>
      element.scrollIntoView({ block: "start" }),
    );
    await editor.evaluate(
      (element, { data, mode }) => {
        const transfer = new DataTransfer();
        if (mode === "html")
          transfer.setData(
            "text/html",
            `<p>Ảnh dán từ tài liệu</p><img src="data:image/png;base64,${data}">`,
          );
        else
          transfer.items.add(
            new File(
              [Uint8Array.from(atob(data), (c) => c.charCodeAt(0))],
              `${mode}.png`,
              { type: "image/png" },
            ),
          );
        const target = element.lastElementChild || element;
        target.scrollIntoView({ block: "center" });
        const rect = target.getBoundingClientRect();
        const event =
          mode === "drop"
            ? new DragEvent("drop", {
                bubbles: true,
                cancelable: true,
                dataTransfer: transfer,
                clientX: rect.left + 20,
                clientY: rect.top + 20,
              })
            : new ClipboardEvent("paste", {
                bubbles: true,
                cancelable: true,
                clipboardData: transfer,
              });
        element.dispatchEvent(event);
      },
      { data: bytes.toString("base64"), mode },
    );
    await expect(page.locator(".blog-editor")).toHaveAttribute(
      "aria-busy",
      "false",
    );
    await expect(editor.locator("img")).toHaveCount(
      { paste: 2, drop: 3, html: 4 }[mode],
    );
  }
  await expect(editor.locator("img")).toHaveCount(4);
  for (const src of await editor
    .locator("img")
    .evaluateAll((images) => images.map((image) => image.getAttribute("src"))))
    expect(src).toMatch(/^\/api\/media\/[a-f0-9-]+\.webp$/);
  await page
    .getByRole("button", { name: "Xem trước nội dung", exact: true })
    .click();
  await expect(
    page.getByLabel("Xem trước bài viết").locator("img"),
  ).toHaveCount(4);
  await page
    .getByRole("button", { name: "Tiếp tục soạn", exact: true })
    .click();
  await expect(editor.locator("img")).toHaveCount(4);
  await page
    .getByRole("combobox", { name: "Trạng thái", exact: true })
    .selectOption("published");
  await page.screenshot({
    path: `preview/blog-editor-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Lưu bài viết", exact: true }).click();
  await expect(page.locator("tbody")).toContainText(title);
  await page
    .locator("tbody tr")
    .filter({ hasText: title })
    .getByRole("button", { name: "Sửa", exact: true })
    .click();
  await expect(editor.locator("img")).toHaveCount(4);
  const html = await editor.innerHTML();
  expect(html).not.toMatch(/(?:blob:|data:image)/);
  await expect(editor.locator("h2")).toHaveCSS("text-align", "center");
  await page.goto(`/tin-tuc/${slug}/`);
  await expect(page.locator(".blog-prose img")).toHaveCount(4);
  await expect(page.locator(".blog-prose h2")).toHaveCSS(
    "text-align",
    "center",
  );
  await expect(page.locator(".blog-prose a")).toHaveAttribute(
    "rel",
    "noopener noreferrer",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `preview/blog-public-${info.project.name}.png`,
    fullPage: true,
  });
});
