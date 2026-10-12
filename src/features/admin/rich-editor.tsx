"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import {
  Color,
  FontFamily,
  FontSize,
  TextStyle,
} from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { TableKit } from "@tiptap/extension-table";
import { Placeholder } from "@tiptap/extensions";
import { BlogImage } from "./blog-image";
import { EditorIcon } from "./editor-icon";
import { uploadBlogImage, uploadPastedHTML } from "./editor-upload";
const MediaBrowser = dynamic(() => import("./media-browser"));
const validLink = (value: string) =>
  /^(https?:\/\/[^\s]+|mailto:[^\s]+|tel:[+\d\s()-]+|\/(?!\/)[^\s]*|#[a-z0-9-]+)$/i.test(
    value,
  );
// Keep these lists in sync with the style allowlist in the API's cleanHtml().
const fonts = [
  ["", "Font mặc định"],
  ["Arial, Helvetica, sans-serif", "Arial"],
  ["Times New Roman, Times, serif", "Times New Roman"],
  ["Georgia, serif", "Georgia"],
  ["Tahoma, Geneva, sans-serif", "Tahoma"],
  ["Verdana, Geneva, sans-serif", "Verdana"],
  ["Courier New, Courier, monospace", "Courier New"],
];
const sizes = ["12", "14", "16", "18", "20", "24", "28", "32", "36"];
const plainFont = (value: unknown) =>
  String(value || "")
    .replace(/['"]/g, "")
    .replace(/\s*,\s*/g, ", ");
// Browsers report saved colours as rgb(); <input type="color"> only takes #rrggbb.
function toHex(value: unknown, fallback: string) {
  const color = String(value || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;
  if (/^#[0-9a-f]{3}$/i.test(color))
    return "#" + [...color.slice(1)].map((digit) => digit + digit).join("");
  const rgb = color.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  return rgb
    ? "#" +
        rgb
          .slice(1, 4)
          .map((part) =>
            Math.min(255, Number(part)).toString(16).padStart(2, "0"),
          )
          .join("")
    : fallback;
}

export default function RichEditor({
  value,
  onChange,
  onBusyChange,
}: {
  value: string;
  onChange: (html: string) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [libraryOpen, setLibraryOpen] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [link, setLink] = useState(""),
    [linkText, setLinkText] = useState(""),
    [newTab, setNewTab] = useState(true),
    [preview, setPreview] = useState(false);
  const frame = useRef<HTMLDivElement>(null),
    uploading = useRef(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer" },
          isAllowedUri: (url, context) =>
            validLink(url) && context.defaultValidate(url),
        },
      }),
      BlogImage,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      TableKit.configure({ table: { resizable: false } }),
      Placeholder.configure({ placeholder: "Bắt đầu viết nội dung bài…" }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        "aria-label": "Nội dung bài viết",
        class: "rich-text-editor blog-prose",
      },
      handlePaste: (_view, event) => {
        if (uploading.current) {
          event.preventDefault();
          return true;
        }
        const files = Array.from(event.clipboardData?.files || []).filter(
          (file) => file.type.startsWith("image/"),
        );
        if (files.length) {
          event.preventDefault();
          void insertFiles(files);
          return true;
        }
        const html = event.clipboardData?.getData("text/html") || "";
        if (/<img\b/i.test(html)) {
          event.preventDefault();
          void runUpload(async () => {
            const result = await uploadPastedHTML(html);
            if (!editor?.isDestroyed)
              editor?.chain().focus().insertContent(result.html).run();
            if (result.skipped)
              setError(
                "Một số ảnh từ website khác chưa được chèn. Hãy tải ảnh về rồi tải lên hoặc chọn từ thư viện.",
              );
          });
          return true;
        }
        return false;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const files = Array.from(event.dataTransfer?.files || []).filter(
          (file) => file.type.startsWith("image/"),
        );
        if (!files.length) return false;
        event.preventDefault();
        if (uploading.current) return true;
        const position = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });
        if (position) editor?.commands.setTextSelection(position.pos);
        void insertFiles(files);
        return true;
      },
    },
  });
  const state = useEditorState({
    editor,
    selector: ({ editor: snapshotEditor }) => {
      const current = snapshotEditor ?? editor;
      return current
        ? {
            bold: current.isActive("bold"),
            italic: current.isActive("italic"),
            underline: current.isActive("underline"),
            strike: current.isActive("strike"),
            sub: current.isActive("subscript"),
            sup: current.isActive("superscript"),
            font: plainFont(current.getAttributes("textStyle").fontFamily),
            size: String(
              current.getAttributes("textStyle").fontSize || "",
            ).replace(/px$/, ""),
            color: String(current.getAttributes("textStyle").color || ""),
            highlight: current.isActive("highlight")
              ? String(current.getAttributes("highlight").color || "#fff3a3")
              : "",
            table: current.isActive("table"),
            bullet: current.isActive("bulletList"),
            ordered: current.isActive("orderedList"),
            quote: current.isActive("blockquote"),
            heading: current.isActive("heading")
              ? String(current.getAttributes("heading").level)
              : "p",
            align:
              current.getAttributes("paragraph").textAlign ||
              current.getAttributes("heading").textAlign ||
              "left",
            image: current.isActive("image"),
            attrs: current.getAttributes("image"),
            words: current.getText().trim().split(/\s+/).filter(Boolean).length,
          }
        : null;
    },
  });
  useEffect(() => {
    if (editor && editor.getHTML() !== value)
      editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);
  useEffect(() => {
    const form = frame.current?.closest("form");
    const prevent = (event: Event) => {
      if (uploading.current) {
        event.preventDefault();
        event.stopImmediatePropagation();
        setError("Vui lòng chờ tải ảnh hoàn tất trước khi lưu bài.");
      }
    };
    form?.addEventListener("submit", prevent, true);
    return () => form?.removeEventListener("submit", prevent, true);
  }, [editor]);
  async function runUpload(task: () => Promise<void>) {
    if (!editor || editor.isDestroyed || uploading.current) return;
    uploading.current = true;
    setBusy(true);
    onBusyChange?.(true);
    setError("");
    editor.setEditable(false);
    try {
      await task();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      uploading.current = false;
      setBusy(false);
      onBusyChange?.(false);
      if (!editor.isDestroyed) editor.setEditable(true);
    }
  }
  async function insertFiles(files: File[]) {
    await runUpload(async () => {
      const nodes = [];
      let failure = "";
      for (const file of files) {
        let url;
        // Images that already reached the server are still inserted when a later one fails.
        try {
          url = await uploadBlogImage(file);
        } catch (error) {
          failure = `${file.name}: ${(error as Error).message}`;
          continue;
        }
        nodes.push({
          type: "image",
          attrs: {
            src: url,
            alt: file.name.replace(/\.[^.]+$/, ""),
            imageAlign: "center",
            imageSize: "100",
          },
        });
      }
      if (nodes.length && !editor?.isDestroyed)
        editor
          ?.chain()
          .focus()
          .insertContent([...nodes, { type: "paragraph" }])
          .run();
      if (failure) throw new Error(failure);
    });
  }
  if (!editor || !state) return <p>Đang mở trình soạn thảo…</p>;
  return (
    <div className="editor-frame blog-editor" ref={frame} aria-busy={busy}>
      <div className="blog-editor-heading">
        <div>
          <strong>Soạn bài blog</strong>
          <small>
            Viết nội dung, kéo thả hoặc dán ảnh để tải lên máy chủ; bài chỉ lưu
            đường dẫn ảnh.
          </small>
        </div>
        <button
          type="button"
          disabled={busy}
          aria-pressed={preview}
          onClick={() => setPreview((value) => !value)}
        >
          {preview ? "Tiếp tục soạn" : "Xem trước nội dung"}
        </button>
      </div>
      <fieldset disabled={busy || preview} className="editor-controls">
        <div
          className="editor-toolbar"
          role="toolbar"
          aria-label="Định dạng bài viết"
        >
          <select
            aria-label="Kiểu đoạn văn"
            value={state.heading}
            onChange={(event) =>
              event.target.value === "p"
                ? editor.chain().focus().setParagraph().run()
                : editor
                    .chain()
                    .focus()
                    .setHeading({
                      level: Number(event.target.value) as 2 | 3 | 4,
                    })
                    .run()
            }
          >
            <option value="p">Đoạn văn</option>
            <option value="2">Tiêu đề H2</option>
            <option value="3">Tiêu đề H3</option>
            <option value="4">Tiêu đề H4</option>
          </select>
          <button
            type="button"
            className="editor-tool"
            aria-label="Đậm"
            aria-pressed={state.bold}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <EditorIcon name="bold" />
          </button>
          <button
            type="button"
            className="editor-tool"
            aria-label="Nghiêng"
            aria-pressed={state.italic}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <EditorIcon name="italic" />
          </button>
          <button
            type="button"
            className="editor-tool"
            aria-label="Gạch chân"
            aria-pressed={state.underline}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <EditorIcon name="underline" />
          </button>
          <button
            type="button"
            className="editor-tool"
            aria-label="Gạch ngang"
            aria-pressed={state.strike}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <EditorIcon name="strike" />
          </button>
          <button
            type="button"
            className="editor-tool"
            aria-label="Chỉ số dưới"
            aria-pressed={state.sub}
            onClick={() => editor.chain().focus().toggleSubscript().run()}
          >
            <EditorIcon name="sub" />
          </button>
          <button
            type="button"
            className="editor-tool"
            aria-label="Chỉ số trên"
            aria-pressed={state.sup}
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
          >
            <EditorIcon name="sup" />
          </button>
          <span className="editor-tool-divider" />
          <select
            aria-label="Font chữ"
            value={
              fonts.some(([font]) => font === state.font) ? state.font : ""
            }
            onChange={(event) =>
              event.target.value
                ? editor.chain().focus().setFontFamily(event.target.value).run()
                : editor.chain().focus().unsetFontFamily().run()
            }
          >
            {fonts.map(([font, label]) => (
              <option key={label} value={font}>
                {label}
              </option>
            ))}
          </select>
          <select
            aria-label="Cỡ chữ"
            value={sizes.includes(state.size) ? state.size : ""}
            onChange={(event) =>
              event.target.value
                ? editor
                    .chain()
                    .focus()
                    .setFontSize(`${event.target.value}px`)
                    .run()
                : editor.chain().focus().unsetFontSize().run()
            }
          >
            <option value="">Cỡ chữ mặc định</option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
          <label className="editor-color" data-tip="Màu chữ">
            <EditorIcon name="color" />
            <input
              type="color"
              aria-label="Màu chữ"
              value={toHex(state.color, "#29495f")}
              onChange={(event) =>
                editor.chain().focus().setColor(event.target.value).run()
              }
            />
          </label>
          <button
            type="button"
            className="editor-tool"
            aria-label="Bỏ màu chữ"
            disabled={!state.color}
            onClick={() => editor.chain().focus().unsetColor().run()}
          >
            <EditorIcon name="color-off" />
          </button>
          <label className="editor-color" data-tip="Màu nền chữ">
            <EditorIcon name="highlight" />
            <input
              type="color"
              aria-label="Màu nền chữ"
              value={toHex(state.highlight, "#fff3a3")}
              onChange={(event) =>
                editor
                  .chain()
                  .focus()
                  .setHighlight({ color: event.target.value })
                  .run()
              }
            />
          </label>
          <button
            type="button"
            className="editor-tool"
            aria-label="Bỏ màu nền"
            disabled={!state.highlight}
            onClick={() => editor.chain().focus().unsetHighlight().run()}
          >
            <EditorIcon name="highlight-off" />
          </button>
          <span className="editor-tool-divider" />
          {[
            ["left", "Căn trái"],
            ["center", "Căn giữa"],
            ["right", "Căn phải"],
            ["justify", "Căn đều"],
          ].map(([alignment, label]) => (
            <button
              key={alignment}
              type="button"
              className="editor-tool"
              aria-label={label}
              disabled={state.image && alignment === "justify"}
              aria-pressed={
                (state.image ? state.attrs.imageAlign : state.align) ===
                alignment
              }
              onClick={() =>
                state.image
                  ? editor
                      .chain()
                      .focus()
                      .updateAttributes("image", { imageAlign: alignment })
                      .run()
                  : editor.chain().focus().setTextAlign(alignment).run()
              }
            >
              <EditorIcon name={`align-${alignment}`} />
            </button>
          ))}
          <button
            type="button"
            className="editor-tool"
            aria-label="Danh sách"
            aria-pressed={state.bullet}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <EditorIcon name="bullet" />
          </button>
          <button
            type="button"
            className="editor-tool"
            aria-label="Đánh số"
            aria-pressed={state.ordered}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <EditorIcon name="ordered" />
          </button>
          <button
            type="button"
            className="editor-tool"
            aria-label="Trích dẫn"
            aria-pressed={state.quote}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <EditorIcon name="quote" />
          </button>
          <button
            type="button"
            className="editor-tool"
            aria-label="Đường phân cách"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <EditorIcon name="rule" />
          </button>
          <button
            type="button"
            className="editor-tool"
            aria-label="Chèn bảng"
            disabled={state.table}
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          >
            <EditorIcon name="table" />
          </button>
          <button
            type="button"
            className="editor-tool"
            aria-label="Xóa định dạng"
            onClick={() =>
              editor.chain().focus().unsetAllMarks().clearNodes().run()
            }
          >
            <EditorIcon name="clear" />
          </button>
          <button
            type="button"
            className="editor-tool"
            aria-label="Hoàn tác"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <EditorIcon name="undo" />
          </button>
          <button
            type="button"
            className="editor-tool"
            aria-label="Làm lại"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <EditorIcon name="redo" />
          </button>
        </div>
        <div className="editor-link">
          <input
            aria-label="Nhãn liên kết"
            placeholder="Chữ hiển thị (hoặc bôi đen chữ trong bài)"
            value={linkText}
            onChange={(event) => setLinkText(event.target.value)}
          />
          <input
            aria-label="Địa chỉ liên kết"
            placeholder="https://…"
            value={link}
            onChange={(event) => setLink(event.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={newTab}
              onChange={(event) => setNewTab(event.target.checked)}
            />{" "}
            Mở tab mới
          </label>
          <button
            type="button"
            className="editor-tool"
            aria-label="Gắn liên kết"
            onClick={() => {
              const href = link.trim();
              if (!validLink(href)) {
                setError(
                  "Nhập liên kết http(s), email, điện thoại hoặc đường dẫn nội bộ hợp lệ.",
                );
                return;
              }
              setError("");
              const attrs = {
                href,
                target: newTab ? "_blank" : null,
                rel: "noopener noreferrer",
              };
              if (
                linkText.trim() ||
                (editor.state.selection.empty && !editor.isActive("link"))
              )
                editor
                  .chain()
                  .focus()
                  .insertContent({
                    type: "text",
                    text: linkText.trim() || href,
                    marks: [{ type: "link", attrs }],
                  })
                  .run();
              else
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink(attrs)
                  .run();
            }}
          >
            <EditorIcon name="link" />
          </button>
          <button
            type="button"
            className="editor-tool"
            aria-label="Đọc liên kết đang chọn"
            onClick={() => {
              const current = editor.getAttributes("link");
              setLink(current.href || "");
              setNewTab(current.target === "_blank");
              setLinkText("");
            }}
          >
            <EditorIcon name="link-read" />
          </button>
          <button
            type="button"
            className="editor-tool"
            aria-label="Bỏ liên kết"
            onClick={() =>
              editor.chain().focus().extendMarkRange("link").unsetLink().run()
            }
          >
            <EditorIcon name="unlink" />
          </button>
        </div>
        <div className="editor-media-actions">
          <label className="editor-upload">
            Ảnh trong bài
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(event) => {
                const files = Array.from(event.currentTarget.files || []);
                event.currentTarget.value = "";
                if (files.length) void insertFiles(files);
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => setLibraryOpen((value) => !value)}
          >
            {libraryOpen ? "Đóng thư viện ảnh" : "Chèn ảnh từ thư viện"}
          </button>
        </div>
        {state.table && (
          <div
            className="editor-table-options"
            role="toolbar"
            aria-label="Chỉnh bảng"
          >
            <button
              type="button"
              className="editor-tool"
              aria-label="Thêm hàng"
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              <EditorIcon name="row-add" />
            </button>
            <button
              type="button"
              className="editor-tool"
              aria-label="Thêm cột"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              <EditorIcon name="column-add" />
            </button>
            <button
              type="button"
              className="editor-tool"
              aria-label="Xóa hàng"
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              <EditorIcon name="row-delete" />
            </button>
            <button
              type="button"
              className="editor-tool"
              aria-label="Xóa cột"
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              <EditorIcon name="column-delete" />
            </button>
            <button
              type="button"
              className="editor-tool"
              aria-label="Bật/tắt hàng tiêu đề"
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            >
              <EditorIcon name="table-header" />
            </button>
            <button
              type="button"
              className="editor-tool"
              aria-label="Gộp/tách ô"
              disabled={!editor.can().mergeOrSplit()}
              onClick={() => editor.chain().focus().mergeOrSplit().run()}
            >
              <EditorIcon name="cell-merge" />
            </button>
            <button
              type="button"
              className="editor-tool"
              aria-label="Xóa bảng"
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              <EditorIcon name="table-delete" />
            </button>
          </div>
        )}
        {state.image && (
          <div className="editor-image-options">
            <label>
              Mô tả ảnh (alt)
              <input
                value={state.attrs.alt || ""}
                onChange={(event) =>
                  editor.commands.updateAttributes("image", {
                    alt: event.target.value,
                  })
                }
              />
            </label>
            <label>
              Tiêu đề ảnh
              <input
                value={state.attrs.title || ""}
                onChange={(event) =>
                  editor.commands.updateAttributes("image", {
                    title: event.target.value,
                  })
                }
              />
            </label>
            <label>
              Độ rộng ảnh
              <select
                value={state.attrs.imageSize || "100"}
                onChange={(event) =>
                  editor.commands.updateAttributes("image", {
                    imageSize: event.target.value,
                    width: null,
                    height: null,
                  })
                }
              >
                {["25", "50", "75", "100"].map((size) => (
                  <option key={size} value={size}>
                    {size}%
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteSelection().run()}
            >
              Gỡ ảnh khỏi bài
            </button>
          </div>
        )}
        {libraryOpen && (
          <MediaBrowser
            onSelect={(url) => {
              editor.chain().focus().setImage({ src: url }).run();
              setLibraryOpen(false);
            }}
          />
        )}
      </fieldset>
      {preview ? (
        <div
          className="blog-preview blog-prose"
          aria-label="Xem trước bài viết"
          dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
        />
      ) : (
        <EditorContent editor={editor} />
      )}
      <div className="editor-status">
        <span>{state.words} từ</span>
        <span>Ảnh tối đa 20 MB · JPG, PNG, WebP</span>
      </div>
      {busy && (
        <p className="editor-upload-status" role="status">
          Đang tải ảnh lên máy chủ… Vui lòng chờ trước khi lưu.
        </p>
      )}
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
