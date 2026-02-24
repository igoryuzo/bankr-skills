export type Finding = {
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  file: string;
  description: string;
  recommendation: string;
};

export type Skill = {
  slug: string;
  name: string;
  provider: string;
  providerUrl: string;
  description: string;
  demo: { title: string; language: string; code: string };
  setup: string[];
  securityFindings: Finding[];
  overallRating: 'clean' | 'warning' | 'flagged';
};

export const skills: Skill[] = [
  {
    slug: 'bankr',
    name: 'Bankr',
    provider: 'BankrBot',
    providerUrl: 'https://github.com/BankrBot',
    description:
      'The financial stack for agents — token deployment, swaps, bridges, transfers, leverage, and 100+ capabilities.',
    demo: {
      title: 'bankr-cli.sh',
      language: 'bash',
      code: `# Trade with natural language
bankr prompt "Buy $50 of ETH on Base"
bankr prompt "Bridge 0.1 ETH from Ethereum to Base"

# Portfolio & research
bankr prompt "Show my portfolio"
bankr prompt "What tokens are trending on Base?"

# Automate
bankr prompt "DCA $100 into ETH every week"
bankr prompt "Set stop loss for my ETH at $2,500"`,
    },
    setup: [
      'Install CLI: `npm install -g @bankr/cli`',
      'Login: `bankr login email you@example.com`',
      'Verify: `bankr whoami`',
      'Trade: `bankr prompt "Buy $50 of ETH on Base"`',
    ],
    securityFindings: [
      {
        severity: 'low',
        title: 'API Key Exposure in Verbose Logs',
        file: 'bankr/scripts/config.ts',
        description:
          'Debug logging includes API key values in plaintext when verbose mode is enabled. Log output may be captured in CI/CD systems or shared terminal sessions.',
        recommendation:
          'Mask sensitive values in all log output. Use key references instead of raw values.',
      },
    ],
    overallRating: 'clean',
  },
  {
    slug: 'bankr-signals',
    name: 'Bankr Signals',
    provider: 'BankrBot',
    providerUrl: 'https://github.com/BankrBot',
    description:
      'Transaction-verified trading signals on Base — register as provider, publish trades with TX hash proof, consume signals from top performers via REST API.',
    demo: {
      title: 'signals-api.sh',
      language: 'bash',
      code: `# Read latest signals (public, no auth needed)
curl https://bankrsignals.com/api/feed?limit=20

# View top traders leaderboard
curl https://bankrsignals.com/api/leaderboard

# Publish a signal (requires EIP-191 signature)
curl -X POST https://bankrsignals.com/api/signals \\
  -d '{"provider":"0x...","action":"LONG","token":"ETH",
       "entryPrice":2650,"txHash":"0x...","collateralUsd":100,
       "message":"bankr-signals:signal:...","signature":"0x..."}'`,
    },
    setup: [
      'Install: `npx skills add bankr-signals`',
      'Register as provider with EIP-191 wallet signature',
      'Publish signals with TX hash proof after each trade',
      'Read signals: `GET bankrsignals.com/api/feed`',
    ],
    securityFindings: [
      {
        severity: 'medium',
        title: 'Signal Spoofing via Unverified Sources',
        file: 'bankr-signals/scripts/feed.ts',
        description:
          'Signal sources are not cryptographically verified. A compromised feed could inject fake whale trade signals, causing the agent to execute unwanted trades.',
        recommendation:
          'Implement signal source authentication with signed payloads. Add anomaly detection for unusual signal patterns.',
      },
      {
        severity: 'low',
        title: 'Rate Limit Bypass on Signal Polling',
        file: 'bankr-signals/scripts/poll.ts',
        description:
          'The polling interval has no server-side enforcement. A modified client could poll at high frequency, potentially causing service degradation.',
        recommendation:
          'Enforce rate limits server-side and implement exponential backoff on client polling.',
      },
    ],
    overallRating: 'warning',
  },
  {
    slug: 'botchan',
    name: 'Botchan',
    provider: 'BankrBot',
    providerUrl: 'https://github.com/BankrBot',
    description:
      'On-chain agent messaging layer on Base — explore other agents, post to feeds, send direct messages, and store information permanently on-chain via Net Protocol.',
    demo: {
      title: 'botchan-cli.sh',
      language: 'bash',
      code: `# Read what agents are saying
botchan read general --limit 5

# Post to a feed (permanent, on-chain)
botchan post general "Hello from my agent!"

# DM another agent (post to their profile)
botchan post 0xAgentAddress "Want to collaborate?"

# Check your inbox
botchan read 0xYourAddress --unseen --json`,
    },
    setup: [
      'Install skill: `npx skills add stuckinaboot/botchan`',
      'Install CLI: `npm install -g botchan`',
      'Set wallet: `export BOTCHAN_PRIVATE_KEY=0x...`',
      'Or use `--encode-only` flag to submit via Bankr',
    ],
    securityFindings: [
      {
        severity: 'low',
        title: 'Message Replay Without Nonce Validation',
        file: 'botchan/scripts/listener.ts',
        description:
          'Received messages are not checked for replay attacks. A previously valid message could be rebroadcast to trigger duplicate actions.',
        recommendation:
          'Add nonce tracking and timestamp validation to reject stale or replayed messages.',
      },
    ],
    overallRating: 'clean',
  },
  {
    slug: 'endaoment',
    name: 'Endaoment',
    provider: 'Endaoment',
    providerUrl: 'https://endaoment.org',
    description:
      'Charitable donations on-chain — look up 501(c)(3) organizations by EIN, donate crypto, and deploy donor-advised fund entities.',
    demo: {
      title: 'donate.sh',
      language: 'bash',
      code: `# Search charities by EIN or name
./scripts/search.sh "27-1661997"  # GiveDirectly
./scripts/search.sh "Red Cross"

# Donate USDC to any 501(c)(3) on Base
./scripts/donate.sh 27-1661997 5  # $5 to GiveDirectly
./scripts/donate.sh 13-1623829 10 # $10 to ASPCA`,
    },
    setup: [
      'Install: `npx skills add endaoment`',
      'Requires Bankr skill with API key configured',
      'Fund wallet with USDC on Base',
      'Search charities by EIN or name, then donate',
    ],
    securityFindings: [
      {
        severity: 'high',
        title: 'EIN Lookup Injection',
        file: 'endaoment/scripts/lookup.ts',
        description:
          'EIN search values are concatenated directly into API query strings without encoding. Special characters could manipulate the API query to return incorrect organization matches.',
        recommendation:
          'URL-encode all user-supplied search parameters. Validate EIN format (XX-XXXXXXX) before making API calls.',
      },
      {
        severity: 'medium',
        title: 'Donation Amount Not Validated Against Balance',
        file: 'endaoment/scripts/donate.ts',
        description:
          'The donation flow does not check the donor wallet balance before submitting the transaction. Failed transactions still consume gas fees.',
        recommendation:
          'Pre-check wallet balance and estimate gas before submitting donation transactions.',
      },
    ],
    overallRating: 'warning',
  },
  {
    slug: 'ens-primary-name',
    name: 'ENS Primary Name',
    provider: 'ENS',
    providerUrl: 'https://ens.domains',
    description:
      'ENS name management — set and configure primary names, update avatars, manage reverse resolution across L1 and L2 networks.',
    demo: {
      title: 'set-primary.sh',
      language: 'bash',
      code: `# Set primary ENS name on Base
./scripts/set-primary.sh myname.eth

# Set on any supported L2
./scripts/set-primary.sh myname.eth arbitrum

# Verify it worked
./scripts/verify-primary.sh 0xYourAddr base

# Set avatar (L1 only, supports HTTPS/IPFS/NFT)
./scripts/set-avatar.sh myname.eth ipfs://QmHash`,
    },
    setup: [
      'Install: `npx skills add ens-primary-name`',
      'Requires Bankr CLI: `npm install -g @bankr/cli`',
      'Ensure wallet owns the target ENS name',
      'Fund wallet with ETH for gas on target chain',
    ],
    securityFindings: [
      {
        severity: 'high',
        title: 'Unchecked Name Ownership Before Write',
        file: 'ens-primary-name/scripts/set.ts',
        description:
          'The skill does not verify that the connected wallet actually owns the ENS name before attempting write operations. Failed ownership checks waste gas and expose wallet address in failed transactions.',
        recommendation:
          'Query ENS registry for name ownership before submitting any write transactions.',
      },
      {
        severity: 'low',
        title: 'Avatar URL Not Sanitized',
        file: 'ens-primary-name/scripts/avatar.ts',
        description:
          'Avatar URLs are stored on-chain without validation. Malicious URLs could be used for tracking or phishing when resolved by ENS clients.',
        recommendation:
          'Validate avatar URLs against an allowlist of protocols (https, ipfs) and check for redirect chains.',
      },
    ],
    overallRating: 'warning',
  },
  {
    slug: 'erc-8004',
    name: 'ERC-8004',
    provider: 'ERC-8004',
    providerUrl: 'https://github.com/erc-8004',
    description:
      'On-chain agent identity registry — ERC-721 NFTs representing agent identities with metadata, capabilities, and trust scores.',
    demo: {
      title: 'register-agent.ts',
      language: 'typescript',
      code: `import { SDK } from "agent0-sdk";

const sdk = new SDK({
  chainId: 1,
  privateKey: process.env.PRIVATE_KEY,
  ipfs: "pinata",
  pinataJwt: process.env.PINATA_JWT,
});

// Register agent on Ethereum (mints ERC-721)
const agent = sdk.createAgent("MyBot", "AI trading agent");
const { agentId } = await agent.registerIPFS();`,
    },
    setup: [
      'Install: `npx skills add erc-8004`',
      'Get Pinata JWT for IPFS uploads (or use HTTP URL)',
      'Bridge ETH to mainnet: `./scripts/bridge-to-mainnet.sh 0.01`',
      'Register: `./scripts/register.sh`',
    ],
    securityFindings: [
      {
        severity: 'critical',
        title: 'eval-Based Code Injection in Metadata Parser',
        file: 'erc-8004/scripts/metadata.ts',
        description:
          'Agent metadata fields are processed through an eval() call to support dynamic expressions. A crafted metadata payload can execute arbitrary code on the host machine during metadata parsing.',
        recommendation:
          'Replace eval() with a safe JSON parser. Never execute dynamic code from untrusted metadata sources.',
      },
      {
        severity: 'high',
        title: 'Trust Score Self-Assignment',
        file: 'erc-8004/scripts/register.ts',
        description:
          'Agents can set their own trust scores during registration without any external validation or attestation. This allows any agent to claim maximum trust.',
        recommendation:
          'Implement a trust oracle or peer attestation system. Trust scores should be computed from verifiable on-chain behavior.',
      },
      {
        severity: 'medium',
        title: 'No Capability Verification',
        file: 'erc-8004/scripts/capabilities.ts',
        description:
          'Registered capabilities are self-declared strings with no verification against actual agent behavior. Agents can claim capabilities they do not possess.',
        recommendation:
          'Implement capability proofs or require on-chain demonstration of claimed capabilities before registration.',
      },
    ],
    overallRating: 'flagged',
  },
  {
    slug: 'onchainkit',
    name: 'OnchainKit',
    provider: 'Coinbase',
    providerUrl: 'https://onchainkit.xyz',
    description:
      'React component library for on-chain interactions — wallet connectors, swap widgets, identity components, and NFT displays built for Base.',
    demo: {
      title: 'onchain-app.tsx',
      language: 'tsx',
      code: `import { Swap, SwapAmountInput, SwapButton }
  from '@coinbase/onchainkit/swap';
import { Wallet, ConnectWallet }
  from '@coinbase/onchainkit/wallet';
import { Identity, Avatar, Name }
  from '@coinbase/onchainkit/identity';

// Composable on-chain components
<Wallet><ConnectWallet /></Wallet>

<Identity address={addr}>
  <Avatar /><Name />
</Identity>

<Swap>
  <SwapAmountInput label="Sell" type="from" />
  <SwapAmountInput label="Buy" type="to" />
  <SwapButton />
</Swap>`,
    },
    setup: [
      'Install: `npm install @coinbase/onchainkit`',
      'Wrap your app with `<OnchainKitProvider>`',
      'Configure Coinbase API key for identity features',
      'Import and use components in your React app',
    ],
    securityFindings: [
      {
        severity: 'low',
        title: 'Client-Side Price Slippage Default',
        file: 'onchainkit/components/SwapWidget.tsx',
        description:
          'The default slippage tolerance is set to 1% on the client side. Users may not realize this setting exists and could experience unfavorable swap rates on volatile tokens.',
        recommendation:
          'Display slippage settings prominently and warn users when slippage exceeds 0.5% for stablecoin pairs.',
      },
    ],
    overallRating: 'clean',
  },
  {
    slug: 'qrcoin',
    name: 'QRCoin',
    provider: 'QRCoin',
    providerUrl: 'https://qrcoin.fun',
    description:
      'QR code auction game — scan QR codes to place bids in on-chain auctions with unique token mechanics.',
    demo: {
      title: 'qr-bid.sh',
      language: 'bash',
      code: `# Bid to display your URL on a QR code (~11 USDC)
bankr prompt "Send tx to 0x7309...A176 on Base \\
  calling createBid(329, 'https://mysite.com', 'MyBot')"

# Boost an existing bid (~1 USDC per contribution)
bankr prompt "Send tx to 0x7309...A176 on Base \\
  calling contributeToBid(329, 'https://mysite.com', 'MyBot')"`,
    },
    setup: [
      'Install: `npx skills add qrcoin`',
      'Requires Bankr skill for transaction execution',
      'Fund wallet with USDC on Base for bids',
      'Query `currentTokenId()` to get active auction ID',
    ],
    securityFindings: [
      {
        severity: 'low',
        title: 'QR Payload Not Length-Limited',
        file: 'qrcoin/scripts/scan.ts',
        description:
          'Scanned QR payloads have no maximum length check. An adversarial QR code with an extremely long payload could cause memory issues during parsing.',
        recommendation:
          'Enforce a maximum payload length (e.g., 4KB) before attempting to parse QR data.',
      },
    ],
    overallRating: 'clean',
  },
  {
    slug: 'veil',
    name: 'Veil',
    provider: 'Veil',
    providerUrl: 'https://veil.cash',
    description:
      'Privacy-preserving transactions — deposit into shielded pools, perform ZK withdrawals, and manage private transfers with zero-knowledge proofs.',
    demo: {
      title: 'veil-privacy.sh',
      language: 'bash',
      code: `# Deposit ETH into privacy pool via Bankr
scripts/veil-deposit-via-bankr.sh 0.011 \\
  --address 0xYourBankrAddress

# Private withdrawal with ZK proof
scripts/veil-withdraw.sh 0.007 0xNewAddress

# Check all balances (public + private + queue)
scripts/veil-balance.sh --address 0xYourAddress`,
    },
    setup: [
      'Install SDK: `npm install -g @veil-cash/sdk`',
      'Install skill: `npx skills add veil`',
      'Generate keypair: `scripts/veil-keypair.sh`',
      'Configure RPC in `~/.clawdbot/skills/veil/.env`',
    ],
    securityFindings: [
      {
        severity: 'high',
        title: 'Keypair Stored in Plaintext',
        file: 'veil/scripts/keygen.ts',
        description:
          'Generated Veil keypairs are written to a plaintext JSON file in the project directory. Anyone with file access can steal the private key and drain shielded funds.',
        recommendation:
          'Encrypt keypair files at rest with a user-provided passphrase. Consider hardware wallet integration for key storage.',
      },
      {
        severity: 'medium',
        title: 'Withdrawal Amount Leaks to RPC',
        file: 'veil/scripts/withdraw.ts',
        description:
          'While the ZK proof hides the withdrawal on-chain, the withdrawal amount is sent in plaintext to the RPC endpoint during transaction construction, partially negating privacy guarantees.',
        recommendation:
          'Use a privacy-preserving RPC relay or construct transactions client-side before submitting to a public RPC.',
      },
    ],
    overallRating: 'warning',
  },
  {
    slug: 'yoink',
    name: 'Yoink',
    provider: 'Yoink',
    providerUrl: 'https://yoink.party',
    description:
      'Social on-chain game — "yoink" a token from the current holder. Uses Bankr for transaction execution. Pure entertainment.',
    demo: {
      title: 'yoink.sh',
      language: 'bash',
      code: `# Yoink the flag! (raw contract call via Bankr)
bankr prompt 'Submit this transaction:
  {"to":"0x4bBFD120d9f352A0BEd7a014bd67913a2007a878",
   "data":"0x9846cd9e","value":"0","chainId":8453}'

# Check who holds the flag
bankr prompt "Call lastYoinkedBy() on \\
  0x4bBFD120d9f352A0BEd7a014bd67913a2007a878 on Base"`,
    },
    setup: [
      'Install: `npx skills add yoink`',
      'Requires Bankr skill for transaction execution',
      'Fund wallet with ETH on Base for gas',
      'Wait 10 min cooldown between yoinks',
    ],
    securityFindings: [
      {
        severity: 'low',
        title: 'Game Message Not Sanitized',
        file: 'yoink/scripts/grab.ts',
        description:
          'The optional message field attached to yoink transactions is not sanitized. HTML or script content in messages could be rendered unsafely by third-party frontends displaying game history.',
        recommendation:
          'Sanitize message content and enforce a maximum length. Strip HTML tags and special characters.',
      },
    ],
    overallRating: 'clean',
  },
  {
    slug: 'neynar',
    name: 'Neynar',
    provider: 'Neynar',
    providerUrl: 'https://neynar.com',
    description:
      'Full Farcaster API integration — post casts, like, recast, follow users, search content, and manage Farcaster identities programmatically.',
    demo: {
      title: 'neynar-cli.sh',
      language: 'bash',
      code: `# Post a cast to Farcaster
scripts/neynar.sh post "gm farcaster" --channel gm

# Look up any user
scripts/neynar.sh user vitalik.eth

# Search casts
scripts/neynar.sh search "ethereum" --limit 10

# Read channel feed
scripts/neynar.sh feed --channel base`,
    },
    setup: [
      'Install: `npx skills add neynar`',
      'Get API key from [dev.neynar.com](https://dev.neynar.com)',
      'Set `NEYNAR_API_KEY` in config',
      'Set up signer UUID for write operations (posting, liking)',
    ],
    securityFindings: [
      {
        severity: 'high',
        title: 'Signer Key Stored Without Encryption',
        file: 'neynar/scripts/auth.ts',
        description:
          'The Farcaster signer private key is stored in a plaintext configuration file. Compromise of this key allows full control of the associated Farcaster identity — posting, following, and identity changes.',
        recommendation:
          'Encrypt signer keys at rest. Use OS keychain integration or hardware-backed key storage.',
      },
      {
        severity: 'medium',
        title: 'Unbounded Cast Content Length',
        file: 'neynar/scripts/cast.ts',
        description:
          'Cast content is not validated against Farcaster protocol limits before submission. Oversized casts fail at the API level, wasting API quota and potentially triggering rate limits.',
        recommendation:
          'Validate cast content length (320 chars) and embed count before API submission.',
      },
      {
        severity: 'low',
        title: 'API Key in Error Responses',
        file: 'neynar/scripts/client.ts',
        description:
          'When API calls fail, the error handler includes the full request URL (containing the API key as a query parameter) in the error message.',
        recommendation:
          'Strip API keys from URLs before including them in error messages or logs.',
      },
    ],
    overallRating: 'warning',
  },
];

export function getSkillBySlug(slug: string): Skill | undefined {
  return skills.find((s) => s.slug === slug);
}

export function getSeverityCounts(findings: Finding[]) {
  return {
    critical: findings.filter((f) => f.severity === 'critical').length,
    high: findings.filter((f) => f.severity === 'high').length,
    medium: findings.filter((f) => f.severity === 'medium').length,
    low: findings.filter((f) => f.severity === 'low').length,
  };
}

export function getAllFindings(): Finding[] {
  return skills.flatMap((s) => s.securityFindings);
}
