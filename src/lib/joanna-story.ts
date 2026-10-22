/** Client-approved copy (Oct 2025 revised Meet Joanna / achievements). */

export const JOANNA_TAGLINE =
  "Professional Figure Athlete | Fitness Coach | Transformation Advocate";

export const JOANNA_INTRO_PARAGRAPHS = [
  "My fitness journey began in 2015, when I immersed myself in various training disciplines, including high-intensity interval training (HIIT) and strength training. After six transformative years of learning, growth, and dedication, I began my bodybuilding journey in 2020 with a determination to challenge myself and reach new heights.",
  "I found my first bodybuilding coach, who instilled in me the “let’s go” attitude that continues to drive my progress. Investing in coaching was one of the best decisions I ever made, helping me develop not only as an athlete but also as a stronger, more disciplined individual.",
] as const;

export type StoryBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export type JourneySection = {
  year: string;
  title: string;
  blocks: StoryBlock[];
};

export const JOANNA_BODYBUILDING_JOURNEY: JourneySection[] = [
  {
    year: "2020",
    title: "The Beginning",
    blocks: [
      {
        type: "p",
        text:
          "Initially drawn to the Bikini category, I discovered through coaching that my strengths were better suited to Figure competitions. The pandemic delayed my competitive debut, moving our planned show to November 29, 2020. Despite the challenges, I remained committed to my goals and continued building the foundation for my competitive future.",
      },
    ],
  },
  {
    year: "2021",
    title: "My First Competition Results",
    blocks: [
      { type: "p", text: "At the Ottawa Championship on November 20, 2021, I earned:" },
      {
        type: "ul",
        items: [
          "5th Place — Women's Figure Masters 35+",
          "3rd Place — Women's Figure Open Class",
        ],
      },
    ],
  },
  {
    year: "2022",
    title: "Continued Progress",
    blocks: [
      {
        type: "p",
        text:
          "On June 18, 2022, I competed at the Natural Regional Ottawa Classic, achieving:",
      },
      {
        type: "ul",
        items: ["3rd Place — Masters 35+", "5th Place — Open Class"],
      },
      {
        type: "p",
        text:
          "Following the 2022 season, I took a two-year off-season to focus on developing my physique, improving my conditioning, and building a stronger foundation for my return to the stage.",
      },
    ],
  },
  {
    year: "2025",
    title: "A Strong Comeback",
    blocks: [
      {
        type: "p",
        text:
          "On June 21, 2025, I returned to competition at the Ottawa Natural Classic and achieved an outstanding comeback, winning both:",
      },
      {
        type: "ul",
        items: [
          "Overall Winner — Figure Masters 35+",
          "Overall Winner — Figure Open Class",
        ],
      },
      {
        type: "p",
        text:
          "These victories earned me qualification for my first natural professional qualifier, marking a major milestone in my bodybuilding journey.",
      },
      { type: "p", text: "At the natural pro qualifier on August 2, 2025, I placed:" },
      {
        type: "ul",
        items: [
          "2nd Place — Women's Figure Masters 35+",
          "5th Place — Women's Figure Open Class",
        ],
      },
      {
        type: "p",
        text:
          "My results earned me recognition as a Top 5 competitor and the opportunity to return to the national stage in 2026 to pursue my next major goal as a Competitive Figure Athlete & Fitness Coach.",
      },
    ],
  },
  {
    year: "2026",
    title: "National Recognition and Career Highlights",
    blocks: [
      {
        type: "p",
        text:
          "The 2026 season became another defining chapter in my bodybuilding journey. At the Canada Natural Pro Qualifier on August 1, 2026, I achieved:",
      },
      {
        type: "ul",
        items: [
          "Overall Winner — Figure Masters 35+",
          "2nd Place — Top 5 Women's Figure Athletes in Canada",
        ],
      },
      {
        type: "p",
        text:
          "These results represented years of consistency, discipline, sacrifice, and continuous improvement. Competing at this level reinforced my commitment to becoming the best athlete I can be while continuing to inspire others through fitness.",
      },
      {
        type: "p",
        text:
          "In 2026, I was also honoured to be recognized by Inside Fitness magazine as one of Canada's Top 100 Hot & Fit Women. This recognition celebrates inspiring women in the fitness industry, and I am proud to be included among such an accomplished group.",
      },
    ],
  },
];

export const JOANNA_MISSION_PARAGRAPHS = [
  "My journey is about more than competing on stage. Fitness has taught me the value of consistency, resilience, self-belief, and personal accountability. Every season has challenged me to grow, adapt, and become stronger, both physically and mentally.",
  "As a fitness coach, I want to help women discover their own strength, build confidence, develop their physiques, and create sustainable habits that support the lives they want to live.",
  "Whether someone is starting their fitness journey for the first time, returning after a major life change, or pursuing a more athletic and defined physique, I believe that with the right guidance, structure, and commitment, meaningful transformation is possible.",
  "My philosophy is simple: STRONG LOOKS GOOD ON YOU.",
  "I am here to help women become stronger, more confident, and proud of what they are capable of achieving inside and outside the gym.",
] as const;
