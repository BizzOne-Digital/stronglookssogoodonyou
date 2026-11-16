export const CHALLENGE = {
  slug: "free-challenge",
  name: "7-Day Body Sculpting Experience",
  pdfFile: "Strong_Looks_Good_On_You_7_Day_Body_Sculpting_Challenge.pdf",
  disclaimerVersion: "2026-11-v1",
  marketingConsentText:
    "Yes, send me fitness tips, programs and offers from Joanna Michel Fitness by email. I can unsubscribe at any time.",
  followUpDelayDays: 3,
} as const;

export const PROGRAM_28 = {
  slug: "28-day-body-sculpting-program",
  name: "28-Day Body Sculpting Program",
  priceCents: 2999,
  currency: "cad",
  priceLabel: "$29.99 CAD",
  pdfFile: "Strong_Looks_Good_On_You_28_Day_Body_Sculpting_Program.pdf",
  ctaLabel: "UNLOCK THE 28-DAY PROGRAM — $29.99 CAD",
} as const;

/** Final wording must be reviewed by Ontario legal counsel before launch. */
export const DISCLAIMER_PARAGRAPHS = [
  "The 7-Day Body Sculpting Experience is a self-guided fitness program. No in-person supervision, individualized assessment or personal training is included.",
  "By voluntarily participating, you acknowledge that physical exercise involves inherent risks, including the possibility of injury.",
  "Its owner, representatives and affiliates are not responsible for injuries, accidents, health complications or damages arising from participation in this self-serve program, to the fullest extent permitted by applicable law.",
  "Participants are responsible for assessing their own physical readiness, selecting appropriate exercise modifications, using equipment safely and exercising within their individual capabilities.",
  "Please consult a qualified healthcare professional before participating if you have existing injuries, medical conditions, physical limitations or concerns about your ability to exercise safely.",
  "Stop exercising immediately if you experience pain, dizziness, chest discomfort or unusual shortness of breath.",
  "This program is educational fitness content and is not a substitute for medical advice, individualized personal training or professional healthcare services.",
  "Nothing in this disclosure excludes or limits liability where such exclusion or limitation is prohibited by law.",
  "By accessing and participating in this program, you acknowledge that you have read and understood this disclosure.",
] as const;

export const FREE_INCLUDES = [
  "Seven guided daily workout plans",
  "Full-body resistance training",
  "Glute and lower-body exercises",
  "Back, shoulder, chest and arm exercises",
  "Core-strengthening exercises",
  "Home and gym workout alternatives",
  "Beginner-friendly exercise modifications",
  "Warm-up and recovery guidance",
  "Daily completion checklist",
] as const;

export const SCHEDULE = [
  { day: 1, workout: "Full Body Sculpt" },
  { day: 2, workout: "Full Body Burn" },
  { day: 3, workout: "Full Body Conditioning" },
  { day: 4, workout: "Full Body Sculpt" },
  { day: 5, workout: "Full Body Strength" },
  { day: 6, workout: "Full Body Sweat" },
  { day: 7, workout: "Active Recovery" },
] as const;

export const PROGRAM_28_INCLUDES = [
  "Four weeks of progressive workout programming",
  "Full-body strength training",
  "Glute and lower-body development",
  "Upper-body sculpting",
  "Core training",
  "Home and gym exercise options",
  "Weekly workout schedules",
  "Progress tracking sheets",
  "General healthy-habit guidance",
] as const;

export const COACHING_OFFERS = [
  { term: "3-month coaching", price: "$750" },
  { term: "6-month coaching", price: "$1,350" },
  { term: "12-month coaching", price: "$2,400" },
] as const;

export const TRACK_EVENTS = [
  "challenge_view",
  "challenge_form_start",
  "checkout_click",
  "coaching_click",
  "program_view",
  "pdf_click",
] as const;
export type TrackEventName = (typeof TRACK_EVENTS)[number];
