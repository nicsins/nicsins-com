export type WorkItem = {
  index: string;
  name: string;
  line: string;
  href?: string;
  external?: boolean;
};

export type Goal = {
  index: string;
  title: string;
  body: string;
  image: string;
};

export type Era = {
  when: string;
  title: string;
  body: string;
  image: string;
};

export type SkillCard = {
  id: string;
  name: string;
  use: string;
  body: string;
  image: string;
};

export type SiteKind = "Play" | "Shop" | "Tool" | "Partner";

export type SiteDoor = {
  name: string;
  host: string;
  href: string;
  line: string;
  kind: SiteKind;
};

export const sites: SiteDoor[] = [
  {
    kind: "Play",
    name: "Neon Plaza",
    host: "dragon-and-panda.vercel.app",
    href: "https://dragon-and-panda.vercel.app",
    line: "Be a dragon or a panda. Walk the plaza.",
  },
  {
    kind: "Play",
    name: "Burning Man",
    host: "cyberpunk-burning-man.vercel.app",
    href: "https://cyberpunk-burning-man.vercel.app",
    line: "The playa at night. Free roam, the Man, neon.",
  },
  {
    kind: "Play",
    name: "Plaza, earlier cut",
    host: "dawn-able-terra-terra.vercel.app",
    href: "https://dawn-able-terra-terra.vercel.app",
    line: "An older Dragon and Panda plaza. It still answers.",
  },
  {
    kind: "Play",
    name: "Ro Sham Bo",
    host: "ro-sham-bo.vercel.app",
    href: "https://ro-sham-bo.vercel.app",
    line: "Rock, paper, scissors. Not every hour needs a protocol.",
  },
  {
    kind: "Play",
    name: "Ro Sham Bo Sigma",
    host: "ro-sham-bo-sigma.vercel.app",
    href: "https://ro-sham-bo-sigma.vercel.app",
    line: "The same game, with escrow on Base Sepolia.",
  },
  {
    kind: "Shop",
    name: "Grokzilla Shop",
    host: "grokzilla.shop",
    href: "https://grokzilla.shop",
    line: "Small agent skills. Pay for the step, not the speech.",
  },
  {
    kind: "Shop",
    name: "Micro Pay",
    host: "x402-micro-pay.com",
    href: "https://x402-micro-pay.com",
    line: "The pay desk beside the shop.",
  },
  {
    kind: "Shop",
    name: "Harbinger",
    host: "x403-harbinger.com",
    href: "https://www.x403-harbinger.com",
    line: "A morning note. Grants, flags, what changed.",
  },
  {
    kind: "Shop",
    name: "Gateway",
    host: "x402-gateway.vercel.app",
    href: "https://x402-gateway.vercel.app",
    line: "A marketplace in front of the API gateway.",
  },
  {
    kind: "Shop",
    name: "Action center",
    host: "x402-admin-action-center.vercel.app",
    href: "https://x402-admin-action-center.vercel.app",
    line: "The admin door on the same pay tools.",
  },
  {
    kind: "Tool",
    name: "AetherScribe",
    host: "aetherscribe.vercel.app",
    href: "https://aetherscribe.vercel.app",
    line: "An architect for an ebook. Words, structure, the draft.",
  },
  {
    kind: "Tool",
    name: "NICJE",
    host: "nicje-x402.vercel.app",
    href: "https://nicje-x402.vercel.app",
    line: "Messy data in. Something an agent can use out.",
  },
  {
    kind: "Tool",
    name: "Contextzilla",
    host: "contextzilla.vercel.app",
    href: "https://contextzilla.vercel.app",
    line: "Text that is supposed to stay put.",
  },
  {
    kind: "Tool",
    name: "Omega Utopia",
    host: "omega-utopia.vercel.app",
    href: "https://omega-utopia.vercel.app",
    line: "A longer sketch of the world the other tools are for.",
  },
  {
    kind: "Tool",
    name: "Lil Buddy",
    host: "lil-buddy.vercel.app",
    href: "https://lil-buddy.vercel.app",
    line: "The small one.",
  },
  {
    kind: "Tool",
    name: "Case converter",
    host: "case-converter.vercel.app",
    href: "https://case-converter.vercel.app",
    line: "Upper, lower, title case. Boring on purpose.",
  },
  {
    kind: "Tool",
    name: "Markdown to text",
    host: "markdown-to-text.vercel.app",
    href: "https://markdown-to-text.vercel.app",
    line: "Markdown in. Plain text out.",
  },
  {
    kind: "Tool",
    name: "HMAC",
    host: "x402-hmac-util.vercel.app",
    href: "https://x402-hmac-util.vercel.app",
    line: "A small signer. Nothing more.",
  },
];

export const partners: SiteDoor[] = [
  {
    kind: "Partner",
    name: "Kwizzle",
    host: "keith-kwizz-sovereign-forge.vercel.app",
    href: "https://keith-kwizz-sovereign-forge.vercel.app",
    line: "Keith “Kwizz” Severson. His own front door. Local AI Integrations.",
  },
  {
    kind: "Partner",
    name: "x402 MCP",
    host: "x402-mcp.onrender.com",
    href: "https://x402-mcp.onrender.com",
    line: "Micropayments and agent discovery on Base.",
  },
  {
    kind: "Partner",
    name: "GodlyForge",
    host: "godlyforge.vercel.app",
    href: "https://godlyforge.vercel.app",
    line: "A studio for turning an idea into something you can sell.",
  },
  {
    kind: "Partner",
    name: "A2A Oracle",
    host: "a2a-x402-oracle.vercel.app",
    href: "https://a2a-x402-oracle.vercel.app",
    line: "Counsel for agent-to-agent commerce. People subscribe. Agents pay.",
  },
  {
    kind: "Partner",
    name: "x402 Oracle",
    host: "x402orcle.vercel.app",
    href: "https://x402orcle.vercel.app",
    line: "A paid wisdom market. 402 is how you ask.",
  },
  {
    kind: "Partner",
    name: "Alpha Sentinel",
    host: "alpha-sentinel-mcp.vercel.app",
    href: "https://alpha-sentinel-mcp.vercel.app",
    line: "Market intelligence, paid on-chain.",
  },
  {
    kind: "Partner",
    name: "MN Compliance",
    host: "mn-compliance-webapp.vercel.app",
    href: "https://mn-compliance-webapp.vercel.app",
    line: "A Minnesota compliance quick-check.",
  },
  {
    kind: "Partner",
    name: "SwarmScribe",
    host: "swarmscribe-qma2.vercel.app",
    href: "https://swarmscribe-qma2.vercel.app",
    line: "A prompt vault and a small agent console.",
  },
  {
    kind: "Partner",
    name: "Crediting swarm",
    host: "x402-crediting-swarm.vercel.app",
    href: "https://x402-crediting-swarm.vercel.app",
    line: "Credit where the work went.",
  },
  {
    kind: "Partner",
    name: "DAW Ivader",
    host: "daw-ivader.vercel.app",
    href: "https://daw-ivader.vercel.app",
    line: "A DAW experiment.",
  },
  {
    kind: "Partner",
    name: "Vibe Forge",
    host: "vibe-forge-ide-ochre.vercel.app",
    href: "https://vibe-forge-ide-ochre.vercel.app",
    line: "An agent IDE. Panda on the case.",
  },
  {
    kind: "Partner",
    name: "Jocky",
    host: "jocky-ai.vercel.app",
    href: "https://jocky-ai.vercel.app",
    line: "JockyAI. His build, still answering.",
  },
  {
    kind: "Partner",
    name: "Art builder",
    host: "art-product-builder.vercel.app",
    href: "https://art-product-builder.vercel.app",
    line: "Art, turned into a product.",
  },
];

export const songs = [
  {
    id: "56066409-d2c0-4219-bb07-c65300b5daac",
    title: "Grokzilla (Remix)",
    style: "Hip hop · west coast · jazz rap",
    time: "4:23",
    image: "/cards/grokzilla.jpg",
  },
  {
    id: "2ba324de-f808-4f7e-8903-2c5ded7ec6b1",
    title: "New Gen Rise (Remastered)",
    style: "Zydeco · dancehall · dub",
    time: "3:15",
    image: "/cards/rise.jpg",
  },
] as const;

export const goals: Goal[] = [
  {
    index: "01",
    title: "A place that can copy itself",
    image: "/cards/place.jpg",
    body: "CycleWorks is the try. Small printed homes, power, food, a shared battery, somewhere to learn a trade. Not a brand. A pattern a town could pick up. The Marathon County cooperative is the same hope with a longer name.",
  },
  {
    index: "02",
    title: "Paperwork that finishes",
    image: "/cards/paper.jpg",
    body: "A benefits packet can turn into a second job. The aim is a calm voice that walks the form with the person, then gets out of the way. The judgment stays theirs.",
  },
  {
    index: "03",
    title: "Small tools that tell the truth",
    image: "/cards/tools.jpg",
    body: "Security work, machines I can actually touch, and agents that do one boring step and stop. If it only works in a slide, it is not done. A small thing that answers beats a big thing that performs.",
  },
  {
    index: "04",
    title: "The Golden Rule, in practice",
    image: "/cards/rule.jpg",
    body: "Treat the person, and the system, the way you want to be treated when you have to live with the result. That is the whole policy. The rest we can revise when we learn we were wrong.",
  },
];

export const code: WorkItem[] = [
  {
    index: "01",
    name: "Grokzilla services",
    line: "The microservices behind the shop. The live host has been quiet, so the code is the honest link.",
    href: "https://github.com/nicsins/grokzilla-x402-services",
    external: true,
  },
  {
    index: "02",
    name: "x402 gateway",
    line: "An older gateway host was quiet. The one on the reel is the one that answered.",
    href: "https://github.com/nicsins/x402-secure-gateway",
    external: true,
  },
  {
    index: "03",
    name: "Dragonscale",
    line: "Notes toward local agents that can share work without a landlord.",
    href: "https://github.com/nicsins/dragonscale",
    external: true,
  },
  {
    index: "04",
    name: "Grokzilla desk",
    line: "An earlier portal. The shop above is the one that answers today.",
    href: "https://github.com/nicsins/grokzilla-site",
    external: true,
  },
];

export const eras: Era[] = [
  {
    when: "1994",
    title: "Haiti. Operation Uphold Democracy.",
    image: "/cards/haiti.jpg",
    body: "I was a 97E, a human-intelligence collector with the 525th Military Intelligence Brigade. The work was people, and writing it down so the next person did not have to learn it the hard way. Reports from that tour went to the Library of Congress. The unit received a Meritorious Unit Citation. I received a Humanitarian Service Medal, an Army Commendation Medal, two Army Achievement Medals, and an Armed Forces Expeditionary Medal.",
  },
  {
    when: "After",
    title: "The same questions, quieter rooms.",
    image: "/cards/after.jpg",
    body: "Cybersecurity, the long way. Penetration tests, secure review, zero trust, cryptography, threat modeling, forensics. The question stayed small: where is the truth of this system, and who gets hurt if we miss it.",
  },
  {
    when: "Now",
    title: "Still learning what to build.",
    image: "/cards/now.jpg",
    body: "Cooperatives, a few live sites, and checklists so a project does not die in a chat window. Minneapolis. I would rather be useful than impressive.",
  },
];

export const bench: SkillCard[] = [
  {
    id: "creator-of-all",
    name: "creator-of-all",
    image: "/cards/intent.jpg",
    use: "A checklist, when the work should still be true next week.",
    body: "Name the outcome, cut it into steps that can fail, do the step where the result has to live, write down what surprised you. It is a habit, not a title.",
  },
  {
    id: "proceed-from-plan-to-prod",
    name: "proceed-from-plan-to-prod",
    image: "/cards/prod.jpg",
    use: "When the folder is full of plans and empty of things.",
    body: "A plan is an input. Done is something you can point at: a page that answers, a test that fails loud, a form that got filed.",
  },
  {
    id: "operate-out-of-trust",
    name: "operate-out-of-trust",
    image: "/cards/trust.jpg",
    use: "When a tool can touch something that matters.",
    body: "Start from no. Say who asked, what it was allowed to touch, and what it left behind. Trust is a record, not a feeling.",
  },
  {
    id: "out-da-box",
    name: "out-da-box",
    image: "/cards/box.jpg",
    use: "When the template is the problem.",
    body: "Leave the usual shape if the usual shape is wrong. Still check the result. New is not the same as better.",
  },
  {
    id: "agentcash-onboarding",
    name: "agentcash-onboarding",
    image: "/cards/cash.jpg",
    use: "When the work should be paid for, plainly.",
    body: "A name, a small service, a price, a first call that clears. Money as a receipt, not a speech.",
  },
];

export const stages = [
  {
    index: "01",
    code: "Intent",
    title: "Name the world",
    image: "/cards/intent.jpg",
    body: "Write the outcome in one sentence. Name what you will not do, and what done looks like where the result has to live. If you cannot point at done, wait. You are still wishing.",
  },
  {
    index: "02",
    code: "Plan",
    title: "Cut the path",
    image: "/cards/plan.jpg",
    body: "Break it into small steps that can fail out loud. Each step needs an input, an action, and a check. A plan with no checks is a mood.",
  },
  {
    index: "03",
    code: "Produce",
    title: "Make it real",
    image: "/cards/produce.jpg",
    body: "Do the step in the place the result has to live. A screenshot of a thing that is not running does not count.",
  },
  {
    index: "04",
    code: "Evolve",
    title: "Keep the scar",
    image: "/cards/evolve.jpg",
    body: "Write down what surprised you. Put the lesson where the next attempt will see it. If the next try is not easier, say why.",
  },
] as const;
