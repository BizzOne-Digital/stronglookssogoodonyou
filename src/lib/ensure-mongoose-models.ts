/**
 * Import every Mongoose model so `populate()` refs resolve under Turbopack
 * (each route bundle may only load a subset of models otherwise).
 */
import "@/models/AdminAudit";
import "@/models/AdminUser";
import "@/models/Availability";
import "@/models/Booking";
import "@/models/CoachingApplication";
import "@/models/ContactInquiry";
import "@/models/FAQ";
import "@/models/GalleryItem";
import "@/models/MediaAsset";
import "@/models/NotificationLog";
import "@/models/PageContent";
import "@/models/Product";
import "@/models/Service";
import "@/models/SiteSettings";
import "@/models/StoredUpload";
import "@/models/TeamMember";
import "@/models/Testimonial";

export function ensureMongooseModels() {
  // Side-effect imports above register schemas on the shared mongoose instance.
}
