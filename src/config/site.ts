/**
 * All binary assets live in public/assets/ and are served from the site root,
 * so these paths work in local dev, production builds and the exported source.
 */
const A = "/assets";
const gridpilot = { url: `${A}/images/projects/gridpilot.png` };
const bowlsense = { url: `${A}/images/projects/bowlsense.png` };
const sahaayak = { url: `${A}/images/projects/sahaayak.png` };
const portrait = { url: `${A}/images/portrait.png` };
const character = { url: `${A}/models/character-textured.glb` }; // textures embedded in the GLB
const resume = { url: `${A}/docs/Daya_Raj_Resume.pdf` };
const lc50 = { url: `${A}/images/badges/leetcode-50.png` };
const lc100 = { url: `${A}/images/badges/leetcode-100.png` };
const lcAug = { url: `${A}/images/badges/leetcode-aug.png` };
const landscape = { url: `${A}/images/landscape.png` };
const logo = { url: `${A}/logo/dr-monogram-bold.png` };

/**
 * Central content & asset config. Set a value to a real string to enable it;
 * `null` means "not supplied yet" and the related UI is hidden or disabled.
 */
export const assets = {
  character: character.url,
  portrait: portrait.url,
  landscape: landscape.url as string | null, // Work/Skills workspace background
  logo: logo.url as string | null, // DR monogram
  resume: resume.url as string | null,
};

export const contact = {
  email: "itsdaya1718@gmail.com" as string | null,
  country: "India",
};

export const socials = {
  github: "https://github.com/Daya-Raj/",
  linkedin: "https://www.linkedin.com/in/daya-raj-7b2a4b389/",
  leetcode: "https://leetcode.com/u/DayaRaj/",
};

export type Project = {
  id: string;
  name: string;
  tag: string;
  description: string;
  image: string;
  url: string | null;
};

export const projects: Project[] = [
  {
    id: "gridpilot",
    name: "GridPilot",
    tag: "Energy · Grid reliability",
    description:
      "A software concept for evaluating trustworthy flexibility and improving grid reliability under renewable intermittency.",
    image: gridpilot.url,
    url: "https://gridpilot1.netlify.app/",
  },
  {
    id: "bowlsense",
    name: "BowlSense",
    tag: "Wearable · Sports analytics",
    description:
      "A smart bowling wristband concept for analyzing wrist movement, bowling action, and injury-risk indicators.",
    image: bowlsense.url,
    url: "https://bowlsense.lovable.app/",
  },
  {
    id: "sahaayak",
    name: "Sahaayak",
    tag: "Platform · Services",
    description:
      "A multi-portal service platform concept connecting customers, workers, and service administrators.",
    image: sahaayak.url,
    url: "https://sahaayak12.netlify.app/",
  },
];

/** `icon` = simple-icons export name for the official mark; omitted → text-only tile. */
export type Skill = { name: string; icon?: string };
export const skills: { id: string; name: string; items: Skill[]; platforms?: Skill[] }[] = [
  { id: "languages", name: "Languages", items: [{ name: "Java" }, { name: "Python", icon: "siPython" }, { name: "JavaScript", icon: "siJavascript" }] },
  {
    id: "frontend",
    name: "Frontend",
    items: [
      { name: "HTML5", icon: "siHtml5" }, { name: "CSS3", icon: "siCss" }, { name: "JavaScript", icon: "siJavascript" },
      { name: "React", icon: "siReact" }, { name: "Responsive UI development" }, { name: "DOM manipulation" },
      { name: "CSS transitions and animations" }, { name: "Tailwind CSS", icon: "siTailwindcss" },
    ],
  },
  {
    id: "backend",
    name: "Backend",
    items: [
      { name: "Java backend development" }, { name: "Spring Boot", icon: "siSpringboot" }, { name: "REST APIs" },
      { name: "JDBC" }, { name: "Servlets" }, { name: "JSP" }, { name: "Hibernate/JPA", icon: "siHibernate" },
      { name: "Maven", icon: "siApachemaven" },
    ],
  },
  { id: "databases", name: "Databases", items: [{ name: "MySQL", icon: "siMysql" }, { name: "SQL" }] },
  {
    id: "aiml",
    name: "AI/ML",
    items: [
      { name: "Python", icon: "siPython" }, { name: "NumPy", icon: "siNumpy" }, { name: "pandas", icon: "siPandas" },
      { name: "Machine learning fundamentals" }, { name: "Generative AI learning" }, { name: "AI-powered application development" },
    ],
  },
  {
    id: "dsa",
    name: "DSA",
    items: [
      { name: "Arrays and Strings" }, { name: "Sorting" }, { name: "Linked Lists" }, { name: "Recursion and Backtracking" },
      { name: "Sliding Window" }, { name: "Two Pointers" }, { name: "Hashing" }, { name: "Subarray problems" },
      { name: "KMP and string matching" },
    ],
    platforms: [{ name: "LeetCode", icon: "siLeetcode" }, { name: "CodeChef", icon: "siCodechef" }, { name: "GeeksforGeeks", icon: "siGeeksforgeeks" }],
  },
  {
    id: "tools",
    name: "Tools & DevOps",
    items: [
      { name: "Git", icon: "siGit" }, { name: "GitHub", icon: "siGithub" }, { name: "VS Code" }, { name: "Vite", icon: "siVite" },
      { name: "npm", icon: "siNpm" }, { name: "Netlify", icon: "siNetlify" }, { name: "Maven", icon: "siApachemaven" },
    ],
  },
];

/** Images cropped from the badge screenshot supplied by Daya Raj; names match the badge labels shown there. */
export const leetcodeBadges: { name: string; image: string | null }[] = [
  { name: "50 Days Badge", image: lc50.url },
  { name: "100 Days Badge", image: lc100.url },
  { name: "Aug Badge", image: lcAug.url },
];
