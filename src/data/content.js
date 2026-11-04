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
];
// auction-omniverse.com (000) and github.com/nicsins/omni-auction (404) failed link-check: no link.
export const inDevelopment = [
  { name: 'Zero Breach Guide', tag: 'Preview', href: 'https://zero-breach-guide.vercel.app', desc: 'An offline security toolkit with x403 unlock.' },
  { name: 'Omni-Auction', tag: 'In development', desc: 'A browser extension and auction site with escrowed bids. The test payment flow works and 658 automated tests pass.' },
  { name: 'The crew', tag: 'In development', desc: 'A team of coordinated agents ("Groklettes") that build, monitor, and list services, with a shared knowledge ledger on the way.' },
];
