import { loadEnvLocal } from "./load-env-local";

loadEnvLocal();

import { connectMongo } from "../src/lib/mongodb";
import { SiteSettings } from "../src/models/SiteSettings";
import { Service } from "../src/models/Service";
import { FAQ } from "../src/models/FAQ";
import { PageContent } from "../src/models/PageContent";
import { TeamMember } from "../src/models/TeamMember";
import { AvailabilitySettings } from "../src/models/Availability";
import { MediaAsset } from "../src/models/MediaAsset";
import { GalleryItem } from "../src/models/GalleryItem";
import { Testimonial } from "../src/models/Testimonial";
import {
  GALLERY_SEED_SKIP_SRC,
  STATIC_GALLERY_IMAGES,
} from "../src/lib/gallery-static";
import { PACKAGE_IMAGES_BY_SLUG } from "../src/lib/service-images";

const PACKAGE_TERMS = `All prices are in CAD and paid upfront.

Each package includes its listed services and check in frequency.

Coaching communication takes place during defined business hours.

Additional services may incur fees agreed upon in advance.

Programs are tailored to individual goals, experience, and circumstances.

Nutrition and competition guidance is within the coach's qualifications and professional scope.

Results vary according to individual circumstances, consistency, and adherence.`;

const SERVICES = [
  {
    slug: "physique-reset",
    name: "PHYSIQUE RESET",
    durationLabel: "3 months",
    priceCents: 75000,
    tagline: "Your fresh start. Your new direction.",
    description:
      "Designed for women who want to establish consistency, improve their training, and begin working toward a stronger, more defined physique.",
    inclusions: [
      "Personalized strength-training program.",
      "Two scheduled progress check ins per month.",
      "Progress photos, body weight, and measurements.",
      "Training adjustments based on progress.",
      "General nutrition guidance within the coach's qualifications.",
      "Accountability and guidance to build sustainable habits.",
    ],
    idealFor:
      "Women starting their fitness journey, getting back on track, or ready for a fresh start.",
    order: 1,
  },
  {
    slug: "physique-transformation",
    name: "PHYSIQUE TRANSFORMATION",
    durationLabel: "6 months",
    priceCents: 135000,
    tagline: "More structure. More consistency. A stronger you.",
    description:
      "Designed for women ready to commit to longer-term physique development, improve their training, and build habits that support lasting progress.",
    inclusions: [
      "Personalized training program and progress planning.",
      "Weekly scheduled check ins.",
      "Progress photos, body weight, and measurements.",
      "Training and nutrition guidance tailored to individual goals.",
      "Program adjustments based on progress and feedback.",
      "One 20-minute video consultation per month.",
      "Ongoing accountability and progress reviews.",
    ],
    idealFor:
      "Women who want a structured approach to building strength, improving definition, and developing consistency.",
    order: 2,
  },
  {
    slug: "lifestyle-transformation",
    name: "LIFESTYLE TRANSFORMATION",
    durationLabel: "12 months",
    priceCents: 240000,
    tagline: "Build a lifestyle that supports the woman you're becoming.",
    description:
      "Fitness should enhance your life, not require you to put it on hold. This program helps women maintain structure and progress while navigating work, family, travel, and celebrations.",
    inclusions: [
      "Personalized training and ongoing progress planning.",
      "Weekly scheduled check ins.",
      "Progress photos, body weight, and measurements.",
      "Training and nutrition guidance within the coach's qualifications.",
      "Adjustments based on progress, lifestyle, and goals.",
      "One 20-minute video consultation per month.",
      "Strategies for navigating birthdays, weddings, vacations, holidays, and special occasions.",
      "Guidance on balancing planned flexibility with long term consistency.",
      "Opportunity to attend a local bodybuilding show with the coach, subject to availability and agreed arrangements.",
    ],
    idealFor:
      "Women who want long term accountability, sustainable habits, and a fitness routine that works with real life.",
    order: 3,
  },
  {
    slug: "bodybuilding-competition-prep",
    name: "BODYBUILDING COMPETITION PREP",
    durationLabel: "16 weeks",
    priceCents: 320000,
    tagline: "Step onstage prepared. Build with purpose. Compete with confidence.",
    description:
      "A specialist coaching package for physique athletes preparing for their first bodybuilding competition, providing structured preparation, individualized guidance, and progress monitoring throughout the agreed prep period.",
    inclusions: [
      "Individualized training and nutrition planning.",
      "Weekly physique check ins and progress reviews.",
      "Progress photos, body weight, and measurements.",
      "Posing guidance and video feedback.",
      "Meal-preparation strategies and practical nutrition planning.",
      "Refeed strategies when appropriate.",
      "Competition-week and show-day planning within the coach's qualifications and experience.",
      "One local bodybuilding show ticket, subject to event availability and confirmation.",
    ],
    idealFor:
      "Dedicated athletes ready to approach their first competition with structure, discipline, and professional guidance.",
    exclusions:
      "Competition entry fees, travel, accommodation, tanning, suits, and other event expenses are not included unless explicitly agreed in writing.",
    order: 4,
  },
];

const FAQ_SEED = [
  {
    group: "Getting started",
    question: "Is this coaching suitable if I'm a beginner?",
    answer:
      "Yes. Programs are tailored to your experience level, equipment access, and goals, whether you're starting from zero or returning after time away.",
    published: true,
    order: 1,
  },
  {
    group: "Packages",
    question: "How do I choose the right package?",
    answer:
      "Review the packages on the Services page and apply with your goals and timeline. If you're unsure, select \"Help me choose\" on the application and Joanna will recommend a fit after reviewing your needs.",
    published: true,
    order: 2,
  },
  {
    group: "Online coaching",
    question: "Is coaching delivered online?",
    answer:
      "Yes. STRONG LOOKS GOOD ON YOU™ is built around online coaching with structured training, check ins, and accountability, designed for women wherever they are.",
    published: true,
    order: 3,
  },
  {
    group: "Pricing",
    question: "Are prices listed in Canadian dollars?",
    answer:
      "Yes. Package pricing is stored in CAD. Display of prices on the public site is controlled in admin settings; you can apply for coaching at any time.",
    published: true,
    order: 4,
  },
  {
    group: "Pricing",
    question: "Is payment collected upfront?",
    answer:
      "Package terms specify that prices are in CAD and paid upfront. Confirm current payment details directly when your application is reviewed.",
    published: true,
    order: 5,
  },
  {
    group: "Application",
    question: "How do I apply for coaching?",
    answer:
      "Use the Apply for Coaching form to share your goals, experience, schedule, and package preference. You'll receive a confirmation that your submission was received.",
    published: true,
    order: 6,
  },
  {
    group: "Equipment",
    question: "What equipment do I need?",
    answer: "This depends on your access and goals. Share what you have on the application so your program can be built accordingly.",
    published: false,
    isDraft: true,
    order: 7,
  },
  {
    group: "Nutrition",
    question: "Is nutrition coaching included?",
    answer: "",
    published: false,
    isDraft: true,
    order: 8,
  },
];

async function seed() {
  await connectMongo();

  await SiteSettings.findOneAndUpdate(
    { key: "default" },
    {
      $setOnInsert: {
        key: "default",
        showCoachingPrices: false,
        showShop: false,
        bookingMode: "request_only",
        packageTermsHtml: PACKAGE_TERMS,
        footerTagline:
          "Strength, discipline, confidence, and becoming the strongest version of yourself.",
        seoDefaults: {
          title: "STRONG LOOKS GOOD ON YOU™ | Coaching for Women",
          description:
            "Personalized strength, physique, lifestyle, and bodybuilding coaching for women. Build your strength with Joanna Michel.",
        },
      },
    },
    { upsert: true, new: true }
  );

  for (const svc of SERVICES) {
    const pkgImage = PACKAGE_IMAGES_BY_SLUG[svc.slug];
    await Service.findOneAndUpdate(
      { slug: svc.slug },
      {
        $set: {
          imageUrl: pkgImage?.src,
        },
        $setOnInsert: {
          ...svc,
          currency: "CAD",
          showPrice: true,
          published: true,
          positioning: svc.tagline,
        },
      },
      { upsert: true }
    );
  }

  for (const faq of FAQ_SEED) {
    const exists = await FAQ.findOne({ question: faq.question });
    if (!exists) {
      await FAQ.create(faq);
    }
  }

  const homeExists = await PageContent.findOne({ pageKey: "home" });
  if (!homeExists) {
    await PageContent.create({
      pageKey: "home",
      title: "Home",
      metaDescription:
        "Personalized strength and physique coaching for women with Joanna Michel.",
      sections: [
        {
          id: "intro",
          type: "text",
          visible: true,
          order: 1,
          data: {
            body:
              "Whether you're starting from zero, starting over, or ready to level up, build strength with purposeful training, personalized guidance, and accountability.",
          },
        },
        {
          id: "next-chapter",
          type: "text",
          visible: true,
          order: 2,
          data: {
            heading: "YOUR NEXT CHAPTER STARTS HERE",
            body:
              "Training that meets you where you are, and moves you toward the physique and confidence you're building on purpose.",
          },
        },
      ],
    });
  }

  const aboutExists = await PageContent.findOne({ pageKey: "about" });
  if (!aboutExists) {
    await PageContent.create({
      pageKey: "about",
      title: "About Joanna",
      metaDescription: "Meet Joanna Michel, founder of STRONG LOOKS GOOD ON YOU™.",
      sections: [
        {
          id: "bio",
          type: "richText",
          visible: true,
          order: 1,
          data: {
            html: `<p>Joanna Michel is a competitive bodybuilding athlete and fitness coach, and the founder of <strong>STRONG LOOKS GOOD ON YOU™</strong>.</p>
<p>My approach focuses on purposeful strength training, personalized guidance, accountability, and sustainable habits to help women work toward their physique and performance goals. The brand represents strength, discipline, confidence, and becoming the strongest version of yourself.</p>`,
          },
        },
      ],
    });
  }

  const privacyExists = await PageContent.findOne({ pageKey: "privacy-policy" });
  if (!privacyExists) {
    await PageContent.create({
      pageKey: "privacy-policy",
      title: "Privacy Policy",
      sections: [
        {
          id: "policy",
          type: "richText",
          visible: true,
          order: 1,
          data: {
            html: `<p><strong>DRAFT, Owner review required before launch.</strong></p>
<p>This policy describes how STRONG LOOKS GOOD ON YOU™ ("we") handles information collected through this website.</p>
<h2>Information we collect</h2>
<p>Contact inquiries, coaching applications, and consultation booking requests may include your name, email, time zone, goals, and messages you choose to provide.</p>
<h2>How we use information</h2>
<p>We use submissions to respond to you, review coaching fit, schedule consultations, and operate the admin portal. Email notifications may be sent to our business email via SMTP.</p>
<h2>Storage</h2>
<p>Data is stored in MongoDB Atlas. Images uploaded by administrators are stored with Cloudinary.</p>
<h2>Administrative access</h2>
<p>Authorized administrators can view and manage submissions and site content.</p>
<h2>Retention and deletion</h2>
<p>Contact us to request access, correction, or deletion of your personal information. Retention practices should be confirmed by the business owner before launch.</p>
<h2>Cookies</h2>
<p>We use essential session cookies for admin authentication. Analytics cookies are not enabled by default in this build.</p>
<h2>Contact</h2>
<p>strongandsexylooksgoodonyou@gmail.com</p>`,
          },
        },
      ],
    });
  }

  const teamExists = await TeamMember.findOne({ isFounder: true });
  if (!teamExists) {
    await TeamMember.create({
      name: "Joanna Michel",
      role: "Founder & Coach",
      bio:
        "Competitive bodybuilding athlete and coach behind STRONG LOOKS GOOD ON YOU™, helping women train with purpose, structure, and confidence.",
      order: 0,
      published: true,
      isFounder: true,
    });
  }

  await AvailabilitySettings.findOneAndUpdate(
    { key: "default" },
    { $setOnInsert: { key: "default" } },
    { upsert: true }
  );

  /** Removed from site: Instagram story with a third-party coach handle (no consent). */
  const removedGalleryPaths = ["/images/gallery/02-competition-backstage.jpg"];
  for (const path of removedGalleryPaths) {
    const staleMedia = await MediaAsset.find({
      $or: [{ url: path }, { secureUrl: path }],
    });
    for (const media of staleMedia) {
      await GalleryItem.deleteMany({ mediaId: media._id });
      await MediaAsset.deleteOne({ _id: media._id });
    }
  }

  let galleryOrder = 0;
  for (const img of STATIC_GALLERY_IMAGES) {
    if (GALLERY_SEED_SKIP_SRC.has(img.src)) {
      const stale = await MediaAsset.findOne({
        $or: [{ url: img.src }, { secureUrl: img.src }],
      });
      if (stale) {
        await GalleryItem.deleteMany({ mediaId: stale._id });
      }
      continue;
    }
    const publicId = `local${img.src.replace(/[^a-zA-Z0-9]+/g, "_")}`;
    const media = await MediaAsset.findOneAndUpdate(
      { cloudinaryPublicId: publicId },
      {
        $set: {
          cloudinaryPublicId: publicId,
          url: img.src,
          secureUrl: img.src,
          alt: img.alt,
        },
      },
      { upsert: true, new: true }
    );
    await GalleryItem.findOneAndUpdate(
      { mediaId: media._id },
      {
        $set: {
          category: img.category,
          caption: img.caption,
          order: galleryOrder++,
          published: true,
        },
      },
      { upsert: true }
    );
  }

  const testimonialSeeds = [
    {
      displayName: "Client A",
      quote:
        "Replace with an approved client quote. This placeholder is unpublished until you edit it in admin.",
      packageName: "Physique Transformation",
      consent: false,
      featured: true,
      published: false,
      order: 0,
    },
    {
      displayName: "Client B",
      quote:
        "Another placeholder testimonial, update text, set consent, and publish when ready.",
      packageName: "Lifestyle Transformation",
      consent: false,
      featured: false,
      published: false,
      order: 1,
    },
  ];
  for (const t of testimonialSeeds) {
    const exists = await Testimonial.findOne({ displayName: t.displayName, quote: t.quote });
    if (!exists) await Testimonial.create(t);
  }

  console.log("Seed complete (idempotent).");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
