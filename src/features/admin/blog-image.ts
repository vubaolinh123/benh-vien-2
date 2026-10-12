import Image from "@tiptap/extension-image";

export const storedImage =
  /^\/(?:api\/media\/[a-f0-9-]+\.webp|assets\/[a-zA-Z0-9._/-]+)$/;
export const BlogImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      imageAlign: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align") || "center",
        renderHTML: (attrs) => ({
          "data-align": ["left", "center", "right"].includes(attrs.imageAlign)
            ? attrs.imageAlign
            : "center",
        }),
      },
      imageSize: {
        default: "100",
        parseHTML: (element) => element.getAttribute("data-size") || "100",
        renderHTML: (attrs) => ({
          "data-size": ["25", "50", "75", "100"].includes(attrs.imageSize)
            ? attrs.imageSize
            : "100",
        }),
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "img[src]",
        getAttrs: (element) =>
          storedImage.test((element as HTMLElement).getAttribute("src") || "")
            ? null
            : false,
      },
    ];
  },
  addInputRules() {
    return [];
  },
}).configure({ allowBase64: false });
