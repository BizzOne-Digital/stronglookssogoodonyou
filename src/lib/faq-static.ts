/** Client-approved FAQ copy (launch revision). */

export const FAQ_INTRO = {
  title: "FREQUENTLY ASKED QUESTIONS",
  brand: "STRONG LOOKS GOOD ON YOU",
  tagline: "Personalized fitness. Clear expectations. A stronger you.",
  closing: "Build strength. Build confidence. Own your journey.",
} as const;

export type StaticFaq = {
  id: string;
  group: string;
  question: string;
  answer: string;
  order: number;
};

/** Public /faqs page — fixed list of 16 (do not add items here without client approval). */
export const PUBLIC_FAQ_COUNT = 16;

export const STATIC_FAQS: StaticFaq[] = [
  {
    id: "faq-1",
    group: "FAQ",
    order: 1,
    question: "What services do you offer?",
    answer:
      "Strong Looks Good On You provides fitness coaching tailored to individual goals, fitness levels, experience, schedules, and agreed-upon services. Each package includes the specific services and check-in frequency described at the time of purchase.",
  },
  {
    id: "faq-2",
    group: "FAQ",
    order: 2,
    question: "How does the coaching process begin?",
    answer:
      "Before coaching begins, clients must complete the required application and health screening and provide accurate information relevant to their participation. The coach will review the information provided to assess whether the requested services are appropriate and within the coach's qualifications.\n\nAdditional information or medical clearance may be requested where appropriate.",
  },
  {
    id: "faq-3",
    group: "FAQ",
    order: 3,
    question: "How is nutrition handled?",
    answer:
      "Nutrition-related coaching begins with a review of the client's existing meal plan and nutrition guidance, including guidance provided by the client's own qualified nutrition professional, where applicable.\n\nThe coach does not automatically replace, prescribe, or independently validate the client's existing nutrition plan. Any feedback is limited to the services agreed upon and the coach's qualifications and professional scope.\n\nClients are responsible for consulting their registered dietitian, physician, or other appropriately qualified healthcare professional regarding medical nutrition needs, therapeutic diets, allergies, intolerances, and health conditions.",
  },
  {
    id: "faq-4",
    group: "FAQ",
    order: 4,
    question: "What information must I disclose before participating?",
    answer:
      "Clients must disclose all relevant information before purchasing or beginning the program, including:\n• Known food allergies and intolerances.\n• Relevant medical conditions and health concerns.\n• Injuries, physical limitations, or exercise restrictions.\n• Medications or other factors that may affect safe participation.\n• Any other information reasonably relevant to the suitability of the coaching services.\n\nClients must ensure the information they provide is complete and accurate and promptly communicate any changes during their coaching period.",
  },
  {
    id: "faq-5",
    group: "FAQ",
    order: 5,
    question: "Who is responsible for my existing meal plan?",
    answer:
      "Clients remain responsible for the accuracy of information about their existing nutrition plan and for following up with the qualified professional responsible for their nutrition care.\n\nAny review or discussion of an existing plan is based on the information made available to the coach. Such a review does not constitute medical clearance, a diagnosis, or a guarantee that the plan is suitable for the client's individual health needs.\n\nThe coach does not independently diagnose, treat, or manage medical conditions or prescribe therapeutic diets outside their qualifications.",
  },
  {
    id: "faq-6",
    group: "FAQ",
    order: 6,
    question: "What if I have an allergy or medical condition that I did not disclose?",
    answer:
      "Clients must disclose relevant allergies, medical conditions, and dietary restrictions before participating. If material information is missing or a previously undisclosed concern becomes known, coaching or the relevant service may be paused while the matter is clarified.\n\nThe coach may request that the client obtain advice or clearance from an appropriately qualified healthcare professional before services resume.\n\nThe suitability of coaching depends on accurate disclosure and appropriate professional assessment. Any legal responsibilities will be determined under the applicable law and the coaching agreement.",
  },
  {
    id: "faq-7",
    group: "FAQ",
    order: 7,
    question: "Are results guaranteed?",
    answer:
      "No. Individual results vary based on numerous factors, including consistency, adherence, recovery, starting fitness level, health, and individual circumstances. No specific weight loss, physique, body composition change, or competition result is guaranteed.",
  },
  {
    id: "faq-8",
    group: "FAQ",
    order: 8,
    question: "What are my responsibilities as a client?",
    answer:
      "Clients are responsible for:\n• Providing accurate and complete health information.\n• Following agreed exercise instructions and working within their abilities.\n• Obtaining appropriate medical advice when necessary.\n• Following up with their own qualified nutrition or healthcare professional for medical and dietary needs.\n• Communicating injuries, symptoms, concerns, and changes in health status.\n• Completing agreed check-ins and communicating any barriers to participation.",
  },
  {
    id: "faq-9",
    group: "FAQ",
    order: 9,
    question: "What if I experience pain or feel unwell during exercise?",
    answer:
      "Clients must stop exercising if they experience concerning symptoms, unusual pain, dizziness, or other signs that continuing may be unsafe. They should seek appropriate medical attention when needed and notify the coach of any relevant limitations before resuming training.\n\nFitness coaching is not a substitute for medical assessment or treatment.",
  },
  {
    id: "faq-10",
    group: "FAQ",
    order: 10,
    question: "How often will I receive check-ins?",
    answer:
      "Check-in frequency and included services depend on the package purchased. The applicable package description and coaching agreement will specify the services, communication channels, and expected response times.\n\nAdditional services are not included unless agreed upon in writing.",
  },
  {
    id: "faq-11",
    group: "FAQ",
    order: 11,
    question: "What are your communication hours?",
    answer:
      "Coaching communication takes place through the designated channels during established business hours. Coaching does not include unlimited or 24/7 access unless expressly agreed upon in writing.",
  },
  {
    id: "faq-12",
    group: "FAQ",
    order: 12,
    question: "What are the payment and refund terms?",
    answer:
      "Prices are listed in Canadian dollars. Payment requirements, package duration, cancellation conditions, and refund terms are provided before purchase.\n\nAll cancellations and refund requests are handled according to the applicable agreement and consumer protection laws. Nothing in the coaching terms removes rights that cannot legally be waived.",
  },
  {
    id: "faq-13",
    group: "FAQ",
    order: 13,
    question: "Can my program be modified?",
    answer:
      "Programs may be adjusted where appropriate to reflect disclosed goals, experience, progress, equipment availability, and relevant limitations. Changes remain subject to the package purchased and the coach's qualifications.",
  },
  {
    id: "faq-14",
    group: "FAQ",
    order: 14,
    question: "How is my personal information handled?",
    answer:
      "Personal information is handled in accordance with the website's privacy policy and applicable privacy laws. Clients should review the policy to understand how their information is collected, used, stored, and disclosed.",
  },
  {
    id: "faq-15",
    group: "FAQ",
    order: 15,
    question: "What should I review before purchasing?",
    answer:
      "Before purchasing, clients should review the full package description, services included, payment and cancellation terms, privacy policy, health screening, informed-consent documents, and applicable coaching agreement.\n\nBy proceeding with the application, clients acknowledge that they are responsible for providing accurate information and understanding the scope and limitations of the services offered.",
  },
  {
    id: "faq-16",
    group: "FAQ",
    order: 16,
    question: "Have another question?",
    answer:
      "Please contact Strong Looks Good On You through the website before purchasing. We encourage every prospective client to clarify expectations and confirm that the selected service meets their needs.",
  },
];

if (STATIC_FAQS.length !== PUBLIC_FAQ_COUNT) {
  throw new Error(`STATIC_FAQS must contain exactly ${PUBLIC_FAQ_COUNT} items.`);
}
