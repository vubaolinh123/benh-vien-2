import type { ReactNode } from "react";
const glyph = (className: string, children: ReactNode) => (
  <span className={`editor-glyph ${className}`} aria-hidden="true">
    {children}
  </span>
);
const glyphs: Record<string, ReactNode> = {
  bold: glyph("", <b>B</b>),
  italic: glyph("", <i>I</i>),
  underline: glyph("", <u>U</u>),
  strike: glyph("", <s>ab</s>),
  sub: glyph(
    "",
    <>
      x<sub>2</sub>
    </>,
  ),
  sup: glyph(
    "",
    <>
      x<sup>2</sup>
    </>,
  ),
  color: glyph("editor-glyph-color", "A"),
  "color-off": glyph("editor-glyph-color editor-glyph-off", "A"),
  highlight: glyph("editor-glyph-mark", "A"),
  "highlight-off": glyph("editor-glyph-mark editor-glyph-off", "A"),
};
const paths: Record<string, ReactNode> = {
  "align-left": <path d="M4 6h16M4 10h10M4 14h16M4 18h10" />,
  "align-center": <path d="M4 6h16M7 10h10M4 14h16M7 18h10" />,
  "align-right": <path d="M4 6h16M10 10h10M4 14h16M10 18h10" />,
  "align-justify": <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />,
  bullet: (
    <>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" strokeWidth="3" />
    </>
  ),
  ordered: (
    <>
      <path d="M10 6h10M10 12h10M10 18h10" />
      <g fill="currentColor" stroke="none" fontSize="7" fontWeight="700">
        <text x="3" y="8.5">
          1
        </text>
        <text x="3" y="14.5">
          2
        </text>
        <text x="3" y="20.5">
          3
        </text>
      </g>
    </>
  ),
  quote: (
    <path d="M5 17c2.5-1 4-3 4-6V7H5v4.5h4M14 17c2.5-1 4-3 4-6V7h-4v4.5h4" />
  ),
  rule: (
    <>
      <path d="M3 12h18" />
      <path d="M7 7h10M7 17h10" strokeWidth="1.2" opacity=".55" />
    </>
  ),
  table: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M3 14.5h18M9 5v14M15 5v14" />
    </>
  ),
  clear: <path d="M7 5h11M12.5 5 10 19M4 4l16 16" />,
  undo: <path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" />,
  redo: <path d="m15 14 5-5-5-5M20 9H10a6 6 0 0 0 0 12h3" />,
  link: (
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1" />
  ),
  unlink: (
    <path d="M13 6.3l1-1A4 4 0 0 1 19.7 11l-1 1M11 17.7l-1 1A4 4 0 0 1 4.3 13l1-1M4 4l16 16" />
  ),
  "link-read": (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  "row-add": (
    <>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <path d="M12 14.5v6M9 17.5h6" />
    </>
  ),
  "row-delete": (
    <>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <path d="m9.5 15 5 5M14.5 15l-5 5" />
    </>
  ),
  "column-add": (
    <>
      <rect x="4" y="3" width="7" height="18" rx="1.5" />
      <path d="M14.5 12h6M17.5 9v6" />
    </>
  ),
  "column-delete": (
    <>
      <rect x="4" y="3" width="7" height="18" rx="1.5" />
      <path d="m15 9.5 5 5M20 9.5l-5 5" />
    </>
  ),
  "table-header": (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" fill="currentColor" />
      <path d="M4 7.5h16" strokeWidth="4" />
      <path d="M9 10v9M15 10v9" />
    </>
  ),
  "cell-merge": (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M12 5v2.5M12 16.5V19M7 12h10M9 10l-2 2 2 2M15 10l2 2-2 2" />
    </>
  ),
  "table-delete": (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </>
  ),
};
export function EditorIcon({ name }: { name: string }) {
  return (
    glyphs[name] ?? (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {paths[name]}
      </svg>
    )
  );
}
