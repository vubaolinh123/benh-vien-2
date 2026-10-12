import { SiteLink } from "@/components/ui/site-link";
import { getPublicData } from "@/lib/public-api";
import { ActionButton } from "@/components/ui/action-button";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { Departments } from "./departments";
import { CareTeam } from "./care-team";
import { PhotoGallery } from "./photo-gallery";
import { Questions } from "./questions";
import { Editorial } from "./editorial";
import { QuickServices } from "./quick-services";
import { PromotionRow } from "./promotion-row";
import { Icon } from "@/components/ui/icon";
import { VideoCard } from "./video-card";
const copy = async () => (await getPublicData()).homepage?.copy || {};

export async function Introduction() {
  const data = await getPublicData();
  const c = data.homepage?.copy || {};
  return (
    <section id="gioi-thieu" aria-label="Thông tin và kết nối bệnh viện">
      <PromotionRow variant="introduction" />
      {data.settings?.introduction && (
        <div
          className="container intro-copy"
          dangerouslySetInnerHTML={{ __html: data.settings.introduction }}
        />
      )}
      <div className="center-action">
        <SiteLink className="text-link" href="/gioi-thieu/">
          {c.introMore}
        </SiteLink>
      </div>
    </section>
  );
}
export async function Team() {
  const c = await copy();
  return (
    <section className="doctor-section" id="doi-ngu">
      <div className="container">
        <div className="center-heading">
          <h2>{c.teamTitle}</h2>
          <span />
        </div>
        <CareTeam />
        <div className="center-action">
          <SiteLink className="button white" href="/doi-ngu/">
            {c.teamMore}
          </SiteLink>
        </div>
      </div>
    </section>
  );
}
export async function Specialties() {
  const c = await copy();
  return (
    <section className="specialties-section" id="chuyen-khoa">
      <div className="container">
        <div className="center-heading">
          <h2>{c.specialtiesTitle}</h2>
          <span />
        </div>
        <Departments />
        <div className="center-action">
          <SiteLink className="text-link" href="/chuyen-khoa/">
            {c.specialtiesMore}
          </SiteLink>
        </div>
      </div>
    </section>
  );
}
export async function Facilities() {
  const data = await getPublicData();
  const c = data.homepage?.copy || {};
  const photos = data.content.filter((item) => item.kind === "gallery");
  if (!photos.length) return null;
  const leadIndex = Math.max(
    0,
    photos.findIndex((item) => item.slug === data.homepage?.galleryLeadSlug),
  );
  const lead = photos[leadIndex];
  return (
    <section
      className="facility-section"
      aria-label="Cơ sở vật chất và hoạt động"
    >
      <div className="container facility-mosaic">
        <ActionButton
          className="facility-lead"
          action={{ type: "gallery", index: leadIndex }}
        >
          {lead.image && <ResponsiveImage src={lead.image} alt={lead.name} />}
          <span>
            <strong>{c.facilityTitle}</strong>
            <small>{c.facilityDescription}</small>
          </span>
        </ActionButton>
        <div className="facility-tiles">
          {photos.slice(0, 6).map((photo, index) => (
            <ActionButton key={photo._id} action={{ type: "gallery", index }}>
              {photo.image && (
                <ResponsiveImage src={photo.image} alt={photo.name} />
              )}
            </ActionButton>
          ))}
        </div>
      </div>
    </section>
  );
}
export async function PriceSection() {
  const c = await copy();
  return (
    <section className="container price-section" aria-label="Bảng giá">
      <div>
        <SiteLink href={c.priceLink}>
          <Icon name="money" /> {c.priceLabel}
          <span>→</span>
        </SiteLink>
      </div>
    </section>
  );
}
export async function Media() {
  const data = await getPublicData();
  const c = data.homepage?.copy || {};
  const videos = data.content.filter((item) => item.kind === "video");
  return (
    <section className="media-section" id="thu-vien">
      <div className="container media-columns">
        <div>
          <div className="media-heading">
            <h2>{c.imagesTitle}</h2>
            <SiteLink className="text-link" href={c.imagesLink}>
              {c.imagesMore}
            </SiteLink>
          </div>
          <PhotoGallery />
        </div>
        <div>
          <div className="media-heading">
            <h2>{c.videosTitle}</h2>
            <SiteLink className="text-link" href={c.videosLink}>
              {c.videosMore}
            </SiteLink>
          </div>
          <div className="video-grid">
            {videos.map((video, index) => (
              <VideoCard key={video._id} video={video} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export async function QuestionSection() {
  const c = await copy();
  return (
    <section className="section container" id="hoi-dap">
      <div className="center-heading">
        <h2>{c.qaTitle}</h2>
        <span />
      </div>
      <Questions />
      <div className="center-action">
        <SiteLink className="text-link" href={c.qaLink}>
          {c.qaMore}
        </SiteLink>
      </div>
    </section>
  );
}
export async function News() {
  const c = await copy();
  return (
    <section className="section container" id="tin-tuc">
      <div className="center-heading">
        <h2>{c.newsTitle}</h2>
        <span />
      </div>
      <Editorial variant="featured" />
      <div className="center-action">
        <SiteLink className="text-link" href={c.newsLink}>
          {c.newsMore}
        </SiteLink>
      </div>
    </section>
  );
}
export async function Health() {
  const c = await copy();
  return (
    <section className="health-news" id="song-khoe">
      <div className="container health-news-columns">
        <div>
          <h2>{c.healthTitle}</h2>
          <Editorial variant="health" />
          <SiteLink href={c.healthLink}>{c.healthMore}</SiteLink>
        </div>
        <div>
          <h2>{c.hospitalTitle}</h2>
          <Editorial variant="hospital" />
        </div>
      </div>
    </section>
  );
}
export async function Support() {
  const c = await copy();
  return (
    <section id="huong-dan" className="support-section">
      <div className="container">
        <div className="center-heading">
          <h2>{c.supportTitle}</h2>
          <p>{c.supportDescription}</p>
        </div>
        <QuickServices />
      </div>
    </section>
  );
}
