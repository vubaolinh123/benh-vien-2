import type { ReactNode } from "react";
const paths: Record<string, ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  homepage: (
    <>
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
      <path d="M9 21v-8h6v8" />
    </>
  ),
  posts: (
    <>
      <path d="M15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" />
      <path d="m9 15 1-4L18 3l3 3-8 8-4 1ZM6 17h6" />
    </>
  ),
  appointments: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M7 3v4m10-4v4M3 11h18m-13 5 3 3 5-5" />
    </>
  ),
  feedback: (
    <>
      <path d="M21 12a9 9 0 0 1-9 9c-1.5 0-3-.4-4-.9L3 21l1-5A9 9 0 1 1 21 12Z" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
    </>
  ),
  content: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8" cy="8" r="1.5" />
      <path d="m3 17 6-6 4 4 3-3 5 5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5" />
    </>
  ),
  settings: (
    <>
      <path d="M4 5h16M4 12h16M4 19h16" />
      <circle cx="8" cy="5" r="2" fill="currentColor" />
      <circle cx="16" cy="12" r="2" fill="currentColor" />
      <circle cx="10" cy="19" r="2" fill="currentColor" />
    </>
  ),
  password: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2" />
    </>
  ),
  logout: (
    <>
      <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4m6-16 5 7-5 7m-6-7h11" />
    </>
  ),
  collapse: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 3v18m7-13-4 4 4 4" />
    </>
  ),
  expand: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 3v18m4-13 4 4-4 4" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  external: (
    <>
      <path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
    </>
  ),
};
export function AdminIcon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.content}
    </svg>
  );
}
