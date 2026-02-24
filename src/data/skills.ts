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
      'Full-stack crypto trading agent — swaps, bridges, transfers, NFTs, Polymarket, leverage, token deployment, and 100+ capabilities across 5 chains.',
    demo: {
      title: 'bankr-swap.ts',
      language: 'typescript',
      code: `// Buy $50 of ETH on Base
const result = await bankr.submit({
  prompt: "Buy $50 of ETH on Base",
  userId: "user-123"
});

// Cross-chain bridge
await bankr.submit({
  prompt: "Bridge 0.1 ETH from Ethereum to Base"
});`,
    },
    setup: [
      'Install the skill: `npx openclaw install bankr`',
      'Set your API key: `export BANKR_API_KEY=your-key`',
      'Configure chains in `bankr.config.json`',
      'Run the agent: `npx openclaw run bankr`',
    ],
    securityFindings: [
      {
        severity: 'critical',
        title: 'Prompt Injection → Arbitrary Transactions',
        file: 'bankr/scripts/submit.ts',
        description:
          'User-supplied prompts are passed directly to the LLM execution layer without sanitization. A crafted prompt can instruct the agent to execute arbitrary on-chain transactions, including draining wallet funds.',
        recommendation:
          'Implement prompt boundary enforcement with a transaction allow-list. Require explicit user confirmation for high-value or first-time transaction patterns.',
      },
      {
        severity: 'high',
        title: 'Unrestricted Wallet Access Scope',
        file: 'bankr/scripts/wallet.ts',
        description:
          'The agent wallet has full signing authority with no per-transaction limits or spending caps. Any successful prompt injection can access the entire wallet balance.',
        recommendation:
          'Implement per-transaction spending limits and require multi-step approval for transactions exceeding a configurable threshold.',
      },
      {
        severity: 'medium',
        title: 'API Key Exposure in Logs',
        file: 'bankr/scripts/config.ts',
        description:
          'Debug logging includes API key values in plaintext when verbose mode is enabled. Log output may be captured in CI/CD systems or shared terminal sessions.',
        recommendation:
          'Mask sensitive values in all log output. Use key references instead of raw values.',
      },
    ],
    overallRating: 'flagged',
  },
  {
    slug: 'bankr-signals',
    name: 'Bankr Signals',
    provider: 'BankrBot',
    providerUrl: 'https://github.com/BankrBot',
    description:
      'Social copy-trading signals — monitors whale wallets and influencer trades, feeds signals into Bankr for automated execution.',
    demo: {
      title: 'signals-config.ts',
      language: 'typescript',
      code: `// Subscribe to whale wallet signals
const signals = await bankrSignals.watch({
  wallets: ["0xd8dA..."],
  minTradeSize: "$10,000",
  autoExecute: false
});

signals.on("trade", (signal) => {
  console.log(\`Whale bought \${signal.token}\`);
});`,
    },
    setup: [
      'Install: `npx openclaw install bankr-signals`',
      'Requires Bankr skill as dependency',
      'Configure watched wallets in `signals.config.json`',
      'Set alert thresholds and auto-execute preferences',
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
      'On-chain agent messaging protocol — enables agents to send, receive, and verify messages through smart contract events.',
    demo: {
      title: 'botchan-message.ts',
      language: 'typescript',
      code: `// Send a verified on-chain message
await botchan.send({
  to: "0xAgent...",
  message: "Execute trade confirmation",
  channel: "trades",
  sign: true
});

// Listen for incoming messages
botchan.on("message", (msg) => {
  console.log(\`From \${msg.sender}: \${msg.text}\`);
});`,
    },
    setup: [
      'Install: `npx openclaw install botchan`',
      'Configure RPC endpoint in `botchan.config.json`',
      'Register your agent address on the messaging contract',
      'Start listening: `npx openclaw run botchan`',
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
    slug: 'clanker',
    name: 'Clanker',
    provider: 'Clanker',
    providerUrl: 'https://clanker.world',
    description:
      'EVM token deployment via Clanker protocol — deploy ERC-20 tokens on Base and Unichain with automatic liquidity pool creation.',
    demo: {
      title: 'deploy-token.ts',
      language: 'typescript',
      code: `// Deploy a new ERC-20 token on Base
const token = await clanker.deploy({
  name: "My Token",
  symbol: "MTK",
  chain: "base",
  initialLiquidity: "1 ETH"
});

console.log(\`Token deployed: \${token.address}\`);
console.log(\`Pool: \${token.poolAddress}\`);`,
    },
    setup: [
      'Install: `npx openclaw install clanker`',
      'Set deployer wallet private key in environment',
      'Configure target chain (Base or Unichain)',
      'Fund wallet with ETH for gas + initial liquidity',
    ],
    securityFindings: [
      {
        severity: 'high',
        title: 'Private Key Passed as CLI Argument',
        file: 'clanker/scripts/deploy.ts',
        description:
          'The deployer private key can be passed via command-line argument, which is visible in process listings (ps aux) and shell history.',
        recommendation:
          'Only accept private keys via environment variables or encrypted keystore files. Never accept secrets as CLI arguments.',
      },
      {
        severity: 'medium',
        title: 'No Token Parameter Validation',
        file: 'clanker/scripts/validate.ts',
        description:
          'Token name, symbol, and initial supply are not validated before deployment. Malformed parameters could deploy tokens with misleading metadata.',
        recommendation:
          'Validate token parameters against reasonable bounds — symbol length, name character set, and supply limits.',
      },
    ],
    overallRating: 'warning',
  },
  {
    slug: 'endaoment',
    name: 'Endaoment',
    provider: 'Endaoment',
    providerUrl: 'https://endaoment.org',
    description:
      'Charitable donations on-chain — look up 501(c)(3) organizations by EIN, donate crypto, and deploy donor-advised fund entities.',
    demo: {
      title: 'donate.ts',
      language: 'typescript',
      code: `// Donate to a charity by EIN
const donation = await endaoment.donate({
  ein: "13-1837418", // Doctors Without Borders
  amount: "0.5 ETH",
  donor: "0xYourWallet..."
});

console.log(\`Donation tx: \${donation.txHash}\`);
console.log(\`Tax receipt: \${donation.receiptUrl}\`);`,
    },
    setup: [
      'Install: `npx openclaw install endaoment`',
      'Configure Endaoment API credentials',
      'Set donor wallet address',
      'Verify target organizations via EIN lookup',
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
      title: 'set-primary.ts',
      language: 'typescript',
      code: `// Set primary ENS name
await ens.setPrimary({
  name: "myname.eth",
  address: "0xYourAddress..."
});

// Update avatar
await ens.setAvatar({
  name: "myname.eth",
  avatar: "https://example.com/avatar.png"
});`,
    },
    setup: [
      'Install: `npx openclaw install ens-primary-name`',
      'Configure Ethereum RPC endpoint',
      'Ensure wallet owns the target ENS name',
      'Fund wallet with ETH for gas (L1 operations)',
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
      code: `// Register a new agent identity
const agentNFT = await erc8004.register({
  name: "TradingBot-v2",
  capabilities: ["swap", "bridge", "transfer"],
  metadata: {
    version: "2.0.0",
    trustScore: 95
  }
});

console.log(\`Agent ID: \${agentNFT.tokenId}\`);`,
    },
    setup: [
      'Install: `npx openclaw install erc-8004`',
      'Deploy or connect to ERC-8004 registry contract',
      'Configure agent metadata schema',
      'Fund wallet for registration gas fees',
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
      title: 'swap-widget.tsx',
      language: 'tsx',
      code: `import { SwapWidget } from '@coinbase/onchainkit';

// Drop-in swap component
export function TokenSwap() {
  return (
    <SwapWidget
      from="ETH"
      to="USDC"
      chain="base"
      theme="dark"
    />
  );
}`,
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
      title: 'place-bid.ts',
      language: 'typescript',
      code: `// Scan and bid on a QR auction
const auction = await qrcoin.scan({
  qrData: "qrcoin://auction/42"
});

await qrcoin.bid({
  auctionId: auction.id,
  amount: "0.01 ETH"
});

console.log(\`Bid placed on "\${auction.title}"\`);`,
    },
    setup: [
      'Install: `npx openclaw install qrcoin`',
      'Configure wallet for bidding',
      'Enable camera access for QR scanning',
      'Fund wallet with ETH for bids + gas',
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
    providerUrl: 'https://veil.exchange',
    description:
      'Privacy-preserving transactions — deposit into shielded pools, perform ZK withdrawals, and manage private transfers with zero-knowledge proofs.',
    demo: {
      title: 'private-transfer.ts',
      language: 'typescript',
      code: `// Deposit into privacy pool
await veil.deposit({
  amount: "1 ETH",
  pool: "base-eth-pool"
});

// Private withdrawal with ZK proof
await veil.withdraw({
  amount: "0.5 ETH",
  recipient: "0xRecipient...",
  generateProof: true
});`,
    },
    setup: [
      'Install: `npx openclaw install veil`',
      'Generate a Veil keypair: `npx veil keygen`',
      'Configure privacy pool endpoints',
      'Fund wallet for initial deposit',
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
      title: 'yoink.ts',
      language: 'typescript',
      code: `// Yoink the token!
const result = await yoink.grab({
  gameId: "yoink-main",
  message: "mine now 😈"
});

console.log(\`Yoinked from \${result.previousHolder}\`);
console.log(\`Hold time: \${result.holdDuration}\`);`,
    },
    setup: [
      'Install: `npx openclaw install yoink`',
      'Requires Bankr skill for transaction execution',
      'Connect wallet to the Yoink game contract',
      'Ready to yoink!',
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
      title: 'post-cast.ts',
      language: 'typescript',
      code: `// Post a cast to Farcaster
await neynar.cast({
  text: "gm from my OpenClaw agent! 🌅",
  channel: "gm"
});

// Search for casts
const results = await neynar.search({
  query: "openclaw",
  limit: 10
});`,
    },
    setup: [
      'Install: `npx openclaw install neynar`',
      'Get Neynar API key from dashboard',
      'Set `NEYNAR_API_KEY` environment variable',
      'Authenticate your Farcaster signer',
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
