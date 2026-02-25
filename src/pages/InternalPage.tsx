import { useState } from 'react';

const PASSWORD = 'gamalthecamel';

type FlagCategory = 'redundant' | 'different-layer' | 'partial' | 'dependency' | 'no-overlap';

type CompetitorAnalysis = {
  skill: string;
  category: FlagCategory;
  bankrOverlap: string;
  uniqueCapabilities: string[];
  verdict: string;
};

const categoryConfig: Record<
  FlagCategory,
  { label: string; color: string; bg: string; badgeBg: string; border: string }
> = {
  redundant: {
    label: 'Redundant',
    color: 'text-red-700',
    bg: 'bg-red-50/50',
    badgeBg: 'bg-red-100',
    border: 'border-red-200/60',
  },
  'different-layer': {
    label: 'Different Layer',
    color: 'text-purple-700',
    bg: 'bg-purple-50/50',
    badgeBg: 'bg-purple-100',
    border: 'border-purple-200/60',
  },
  partial: {
    label: 'Partial Overlap',
    color: 'text-amber-700',
    bg: 'bg-amber-50/50',
    badgeBg: 'bg-amber-100',
    border: 'border-amber-200/60',
  },
  dependency: {
    label: 'Dependency',
    color: 'text-blue-700',
    bg: 'bg-blue-50/50',
    badgeBg: 'bg-blue-100',
    border: 'border-blue-200/60',
  },
  'no-overlap': {
    label: 'No Overlap',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50/50',
    badgeBg: 'bg-emerald-100',
    border: 'border-emerald-200/60',
  },
};

const analyses: CompetitorAnalysis[] = [
  {
    skill: 'OnchainKit',
    category: 'different-layer',
    bankrOverlap:
      'Same domain — both handle swaps, wallets, identity, and NFTs. However, OnchainKit is a React frontend component library while Bankr is a backend CLI/API agent.',
    uniqueCapabilities: [
      'React UI components (SwapWidget, WalletConnect, IdentityCard)',
      'Client-side rendering and UX flows',
      'Frontend integration patterns',
      'Coinbase ecosystem components',
    ],
    verdict:
      'Different layer, not competing. OnchainKit builds the frontend; Bankr powers the backend. They complement each other.',
  },
  {
    skill: 'Veil',
    category: 'partial',
    bankrOverlap:
      'Bankr can deposit INTO Veil privacy pools, acting as a feeder. But Bankr cannot perform ZK withdrawals, private transfers, or manage Veil keypairs.',
    uniqueCapabilities: [
      'ZK proof generation for private withdrawals',
      'Private transfer execution',
      'Veil keypair management',
      'Privacy pool selection and mixing strategies',
    ],
    verdict:
      'Partial overlap — Bankr is a feeder, Veil adds a privacy layer Bankr cannot replicate. Both are needed for the full privacy flow.',
  },
  {
    skill: 'ENS Primary Name',
    category: 'partial',
    bankrOverlap:
      'Bankr resolves ENS names for transfer destinations (read-only lookups). ENS Primary Name handles write operations — setting/configuring names, avatars, and reverse resolution.',
    uniqueCapabilities: [
      'Set and configure ENS primary names',
      'Avatar and metadata management',
      'Reverse resolution on L2 networks',
      'ENS registry write operations',
    ],
    verdict:
      'Partial overlap — Bankr reads ENS, this skill writes to it. Complementary, not competing.',
  },
  {
    skill: 'Yoink',
    category: 'dependency',
    bankrOverlap:
      'Yoink uses Bankr for transaction execution. It sends transactions through Bankr rather than competing with it.',
    uniqueCapabilities: [
      'Yoink game mechanics and social interactions',
      'Game-specific smart contract interactions',
      'Hold time tracking and leaderboards',
    ],
    verdict:
      'Dependency — Yoink is a Bankr consumer. It extends Bankr with game mechanics rather than duplicating functionality.',
  },
  {
    skill: 'Bankr Signals',
    category: 'no-overlap',
    bankrOverlap:
      'Bankr Signals feeds trading signals INTO Bankr for execution. It provides social intelligence, not market research or trading capabilities.',
    uniqueCapabilities: [
      'Whale wallet monitoring',
      'Influencer trade copy signals',
      'Social sentiment aggregation',
      'Signal-to-execution pipeline',
    ],
    verdict:
      'No overlap — pure complement. Signals provides the "what to trade", Bankr provides the "how to trade".',
  },
  {
    skill: 'Botchan',
    category: 'no-overlap',
    bankrOverlap: 'Bankr has zero on-chain messaging capability. Completely different domain.',
    uniqueCapabilities: [
      'On-chain agent-to-agent messaging',
      'Smart contract event-based communication',
      'Message verification and signing',
      'Channel-based routing',
    ],
    verdict:
      'No overlap — Botchan handles messaging between agents, a capability Bankr does not have.',
  },
  {
    skill: 'ERC-8004',
    category: 'no-overlap',
    bankrOverlap:
      'Bankr has no agent identity or registration system. ERC-8004 is a completely different domain.',
    uniqueCapabilities: [
      'ERC-721 agent identity NFTs',
      'On-chain capability registration',
      'Trust score attestation',
      'Agent metadata schemas',
    ],
    verdict:
      'No overlap — ERC-8004 creates agent identities on-chain. Bankr has no equivalent.',
  },
  {
    skill: 'Endaoment',
    category: 'no-overlap',
    bankrOverlap:
      'Bankr has no charity or donation functionality. Endaoment operates in a specialized philanthropy domain.',
    uniqueCapabilities: [
      'EIN-based charity lookup',
      '501(c)(3) entity deployment',
      'Tax receipt generation',
      'Donor-advised fund management',
    ],
    verdict:
      'No overlap — charitable donations are a specialized domain Bankr does not address.',
  },
  {
    skill: 'QRCoin',
    category: 'no-overlap',
    bankrOverlap: 'Bankr has no QR code or auction game mechanics. Niche entertainment domain.',
    uniqueCapabilities: [
      'QR code scanning and parsing',
      'Auction bidding mechanics',
      'Game-specific token economics',
      'Camera integration',
    ],
    verdict: 'No overlap — QRCoin is a niche game. Bankr does not address this use case.',
  },
  {
    skill: 'Neynar',
    category: 'no-overlap',
    bankrOverlap:
      'Bankr only uses Farcaster handles as transfer aliases (e.g., send to @username). Neynar provides full Farcaster API access — posting, liking, following, searching.',
    uniqueCapabilities: [
      'Cast posting and thread management',
      'Social interactions (like, recast, follow)',
      'Farcaster search and discovery',
      'Signer key management',
    ],
    verdict:
      'No overlap — Bankr uses Farcaster names for transfers only. Neynar provides the full social layer.',
  },
];

const bankrCapabilities = [
  'Token Swaps & Cross-Chain Bridges',
  'Portfolio Management (5 chains)',
  'Market Research & Technical Analysis',
  'Transfers (address/ENS/social handles)',
  'NFT Operations (OpenSea)',
  'Polymarket Betting',
  'Leverage Trading (50x crypto, 100x forex)',
  'Token Deployment (Solana + EVM)',
  'Automation (limit/stop/DCA/TWAP)',
  'Arbitrary Transactions (raw calldata)',
  'Sign & Submit API (sync)',
  'LLM Gateway (multi-model)',
];

export default function InternalPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="rounded-2xl bg-white p-8 terminal-card w-full max-w-sm">
          <h1 className="text-xl font-extrabold text-[#1a1a1a] mb-1">Internal</h1>
          <p className="text-xs font-mono text-neutral-400 mb-6">Enter password to continue</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password === PASSWORD) {
                setAuthenticated(true);
                setError(false);
              } else {
                setError(true);
              }
            }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              className={`w-full rounded-lg border ${error ? 'border-red-300' : 'border-neutral-200'} px-4 py-3 text-sm font-mono outline-none focus:border-neutral-400 transition-colors`}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-xs font-mono text-red-500">Incorrect password</p>
            )}
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-[#2d2d2d] px-4 py-3 text-[12px] font-mono font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#404040] transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  const categoryCounts = Object.entries(categoryConfig).map(([key, config]) => ({
    key: key as FlagCategory,
    ...config,
    count: analyses.filter((a) => a.category === key).length,
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#1a1a1a] leading-tight">
          Skill Analysis.
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-500 leading-relaxed">
          How do the 10 non-Bankr skills compare against Bankr&apos;s 100+
          capabilities? Redundancies, overlaps, and unique domains.
        </p>
      </div>

      {/* Category Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-16">
        {categoryCounts.map((cat) => (
          <div
            key={cat.key}
            className="rounded-2xl bg-white p-5 text-center terminal-card"
          >
            <div className={`text-2xl font-extrabold ${cat.color}`}>{cat.count}</div>
            <div className="mt-1 text-[10px] font-bold font-mono uppercase tracking-wider text-neutral-400">
              {cat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Bankr Capabilities */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#1a1a1a]">
            Bankr Capabilities
          </h2>
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
            {bankrCapabilities.length} domains
          </span>
        </div>
        <div className="rounded-2xl bg-white p-6 terminal-card">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {bankrCapabilities.map((cap) => (
              <div
                key={cap}
                className="flex items-center gap-2.5 text-sm text-neutral-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 shrink-0" />
                {cap}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#1a1a1a]">
            Skill Analysis
          </h2>
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
            {analyses.length} skills
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {analyses.map((analysis) => {
          const cat = categoryConfig[analysis.category];
          return (
            <div
              key={analysis.skill}
              className={`rounded-2xl border ${cat.border} ${cat.bg} overflow-hidden`}
            >
              <div className="flex items-center justify-between p-6 pb-4">
                <h3 className="text-xl font-bold text-[#1a1a1a]">{analysis.skill}</h3>
                <span
                  className={`rounded-full px-3.5 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider ${cat.color} ${cat.badgeBg}`}
                >
                  {cat.label}
                </span>
              </div>

              <div className="px-6 pb-6 space-y-5">
                <div>
                  <h4 className="text-[10px] font-bold font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Bankr Overlap
                  </h4>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    {analysis.bankrOverlap}
                  </p>
                </div>

                {analysis.uniqueCapabilities.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Skill-Unique Capabilities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.uniqueCapabilities.map((cap) => (
                        <span
                          key={cap}
                          className="rounded-full bg-white border border-neutral-200 px-3 py-1 text-xs text-neutral-600"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-white/80 border border-neutral-100 p-4">
                  <p className="text-[10px] font-bold font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Verdict
                  </p>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {analysis.verdict}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
