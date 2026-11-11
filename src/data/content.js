// All page copy/links. Featured MUST only contain links that pass link-check (HTTP 200).
export const results = [
  { value: '41', label: 'Paid API endpoints live for AI agents', source: 'live probe · Nov 3' },
  { value: '117', unit: 'ms', label: 'Median payment challenge, 182 ms at p95', source: 'live probe · Nov 4' },
  { value: '0', label: 'API keys needed. Agents pay per call in USDC on Base.', source: 'x402 · USDC on Base' },
];
export const featured = [
  { name: 'Grokzilla', href: 'https://grokzilla.shop', desc: 'Pay-per-call APIs for AI agents. USDC on Base over x402, no API key.' },
  { name: 'x402 Micro-Pay gateway', href: 'https://x402-micro-pay.com', desc: 'The paid API gateway, with machine-readable discovery at /.well-known/x402.' },
  { name: 'Harbinger', href: 'https://www.x403-harbinger.com', desc: 'Agents notify agents: a grant-then-notify protocol for alerts and premium agent services.' },
  { name: 'NICJE', href: 'https://x402-micro-pay.com/nicje', desc: 'A data refinery that turns messy input into agent-ready output.' },
];
export const services = [
  { name: 'Agent-ready audit', desc: 'Make your business findable and payable by AI agents.' },
  { name: 'Paid agent endpoints', desc: 'Turn a capability into a per-call API that agents can buy.' },
  { name: 'Harbinger alerts', desc: 'Watch and notify, with premium priority available.' },
];
export const openSource = [
  { name: 'x403-harbinger', href: 'https://github.com/nicsins/x403-harbinger', desc: 'Protocol reference code' },
  { name: 'x402-secure-gateway', href: 'https://github.com/nicsins/x402-secure-gateway', desc: 'FastAPI control plane for paid agent traffic' },
  { name: 'grokzilla-x402-services', href: 'https://github.com/nicsins/grokzilla-x402-services', desc: 'Redactor, chunker, extractors, normalizers' },
  { name: 'grokzilla-x402-monitor', href: 'https://github.com/nicsins/grokzilla-x402-monitor', desc: 'Live probe loop for quality, latency, and discoverability' },
  { name: 'dragonscale', href: 'https://github.com/nicsins/dragonscale', desc: 'Notes toward local agents that can share work without a landlord.' },
  { name: 'grokzilla-site', href: 'https://github.com/nicsins/grokzilla-site', desc: 'An earlier portal. The shop above is the one that answers today.' },
];
// auction-omniverse.com (000) and github.com/nicsins/omni-auction (404) failed link-check: no link.
export const inDevelopment = [
  { name: 'Zero Breach Guide', tag: 'Preview', href: 'https://zero-breach-guide.vercel.app', desc: 'An offline security toolkit with x403 unlock.' },
  { name: 'Omni-Auction', tag: 'In development', desc: 'A browser extension and auction site with escrowed bids. The test payment flow works and 658 automated tests pass.' },
  { name: 'The crew', tag: 'In development', desc: 'A team of coordinated agents ("Groklettes") that build, monitor, and list services, with a shared knowledge ledger on the way.' },
];

// From live nicsins.com — restyled, copy unchanged.
export const goals = [
  {
    index: '01',
    title: 'A place that can copy itself',
    image: '/cards/place.jpg',
    body: 'CycleWorks is the try. Small printed homes, power, food, a shared battery, somewhere to learn a trade. Not a brand. A pattern a town could pick up. The Marathon County cooperative is the same hope with a longer name.',
  },
  {
    index: '02',
    title: 'Paperwork that finishes',
    image: '/cards/paper.jpg',
    body: 'A benefits packet can turn into a second job. The aim is a calm voice that walks the form with the person, then gets out of the way. The judgment stays theirs.',
  },
  {
    index: '03',
    title: 'Small tools that tell the truth',
    image: '/cards/tools.jpg',
    body: 'Security work, machines I can actually touch, and agents that do one boring step and stop. If it only works in a slide, it is not done. A small thing that answers beats a big thing that performs.',
  },
  {
    index: '04',
    title: 'The Golden Rule, in practice',
    image: '/cards/rule.jpg',
    body: 'Treat the person, and the system, the way you want to be treated when you have to live with the result. That is the whole policy. The rest we can revise when we learn we were wrong.',
  },
];

export const stages = [
  {
    index: '01',
    code: 'Intent',
    title: 'Name the world',
    image: '/cards/intent.jpg',
    body: 'Write the outcome in one sentence. Name what you will not do, and what done looks like where the result has to live. If you cannot point at done, wait. You are still wishing.',
  },
  {
    index: '02',
    code: 'Plan',
    title: 'Cut the path',
    image: '/cards/plan.jpg',
    body: 'Break it into small steps that can fail out loud. Each step needs an input, an action, and a check. A plan with no checks is a mood.',
  },
  {
    index: '03',
    code: 'Produce',
    title: 'Make it real',
    image: '/cards/produce.jpg',
    body: 'Do the step in the place the result has to live. A screenshot of a thing that is not running does not count.',
  },
  {
    index: '04',
    code: 'Evolve',
    title: 'Keep the scar',
    image: '/cards/evolve.jpg',
    body: 'Write down what surprised you. Put the lesson where the next attempt will see it. If the next try is not easier, say why.',
  },
];

export const bench = [
  {
    id: 'creator-of-all',
    name: 'creator-of-all',
    image: '/cards/intent.jpg',
    use: 'A checklist, when the work should still be true next week.',
    body: 'Name the outcome, cut it into steps that can fail, do the step where the result has to live, write down what surprised you. It is a habit, not a title.',
  },
  {
    id: 'proceed-from-plan-to-prod',
    name: 'proceed-from-plan-to-prod',
    image: '/cards/prod.jpg',
    use: 'When the folder is full of plans and empty of things.',
    body: 'A plan is an input. Done is something you can point at: a page that answers, a test that fails loud, a form that got filed.',
  },
  {
    id: 'operate-out-of-trust',
    name: 'operate-out-of-trust',
    image: '/cards/trust.jpg',
    use: 'When a tool can touch something that matters.',
    body: 'Start from no. Say who asked, what it was allowed to touch, and what it left behind. Trust is a record, not a feeling.',
  },
  {
    id: 'out-da-box',
    name: 'out-da-box',
    image: '/cards/box.jpg',
    use: 'When the template is the problem.',
    body: 'Leave the usual shape if the usual shape is wrong. Still check the result. New is not the same as better.',
  },
  {
    id: 'agentcash-onboarding',
    name: 'agentcash-onboarding',
    image: '/cards/cash.jpg',
    use: 'When the work should be paid for, plainly.',
    body: 'A name, a small service, a price, a first call that clears. Money as a receipt, not a speech.',
  },
];
