export type Role = "administrator" | "communications" | "customer_service";
export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}
export interface ContentItem {
  _id: string;
  kind:
    | "service"
    | "specialty"
    | "doctor"
    | "page"
    | "banner"
    | "gallery"
    | "video"
    | "promotion"
    | "care_activity"
    | "support_link"
    | "editorial_link";
  slug: string;
  name: string;
  summary: string;
  body: string;
  image?: string;
  qualification?: string;
  specialty?: string;
  schedule?: string;
  link?: string;
  active: boolean;
  order: number;
  updatedAt: string;
  placement?: "" | "intro" | "specialties" | "featured" | "health" | "hospital";
  action?: "link" | "booking" | "feedback" | "gallery";
  icon?: string;
  buttonLabel?: string;
  eyebrow?: string;
  targetSlug?: string;
}
export interface Article {
  _id: string;
  slug: string;
  title: string;
  category: "news" | "health" | "qa";
  excerpt: string;
  body: string;
  image?: string;
  status: "draft" | "published";
  publishedAt?: string;
  updatedAt: string;
}
export interface SiteSettings {
  name: string;
  phone: string;
  email: string;
  address: string;
  introduction: string;
  workingHours: string;
  privacy: string;
  facebook: string;
  tiktok: string;
}
export type HomeSectionKey =
  | "banner"
  | "services"
  | "introduction"
  | "team"
  | "specialties"
  | "specialtyPromos"
  | "facilities"
  | "price"
  | "media"
  | "qa"
  | "news"
  | "health"
  | "support"
  | "booking";
export interface MenuLink {
  label: string;
  href: string;
}
export interface HomepageConfig {
  copy: Record<string, string>;
  logo: string;
  logoAlt: string;
  sections: { key: HomeSectionKey; visible: boolean }[];
  navigation: MenuLink[];
  introductionMenu: MenuLink[];
  footerSupport: MenuLink[];
  footerInfo: MenuLink[];
  teamMode: "auto" | "doctors" | "activities";
  galleryLeadSlug: string;
  galleryInitialSlug: string;
  galleryThumbnailSlugs: string[];
}
export interface PublicData {
  content: ContentItem[];
  posts: Article[];
  settings: SiteSettings | null;
  homepage?: HomepageConfig | null;
}
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
export interface Appointment {
  _id: string;
  reference: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  session: "morning" | "afternoon";
  message?: string;
  status: "new" | "contacted" | "confirmed" | "cancelled";
  notes: string;
  createdAt: string;
}
export interface CustomerFeedback {
  _id: string;
  name: string;
  phone?: string;
  message: string;
  status: "new" | "resolved";
  notes: string;
  createdAt: string;
}
