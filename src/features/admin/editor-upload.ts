import { api } from "@/lib/client-api";
import { storedImage } from "./blog-image";
export async function uploadBlogImage(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Chọn ảnh JPG, PNG hoặc WebP.");
  if (file.size > 20 * 1024 * 1024) throw new Error("Mỗi ảnh tối đa 20 MB.");
  const data = new FormData();
  data.append("image", file);
  const result = await api<{ url: string }>("/admin/uploads", {
    method: "POST",
    body: data,
  });
  if (!storedImage.test(result.url))
    throw new Error("Máy chủ chưa trả về đường dẫn ảnh hợp lệ.");
  return result.url;
}
// Clipboard HTML is transient browser data; only uploaded URLs enter the editor document.
export async function uploadPastedHTML(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  let skipped = false;
  for (const image of Array.from(doc.querySelectorAll("img"))) {
    const src = image.getAttribute("src") || "";
    if (storedImage.test(src)) continue;
    if (
      (/^data:image\/(png|jpeg|webp);base64,/i.test(src) &&
        src.length <= 28 * 1024 * 1024) ||
      src.startsWith("blob:")
    ) {
      // One unreadable or rejected image must not discard the rest of the pasted content.
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        image.setAttribute(
          "src",
          await uploadBlogImage(
            new File([blob], "anh-dan.png", { type: blob.type }),
          ),
        );
        image.removeAttribute("srcset");
      } catch {
        image.remove();
        skipped = true;
      }
    } else {
      image.remove();
      skipped = true;
    }
  }
  return { html: doc.body.innerHTML, skipped };
}
