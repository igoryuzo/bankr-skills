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
  providerUrl?: string;
  description: string;
  demo: { title: string; language: string; code: string };
  setup: string[];
  securityFindings: Finding[];
  overallRating: 'clean' | 'warning' | 'flagged';
};

export const skills: Skill[] = [
  // ─── Bankr ───────────────────────────────────────────────────────────────
  {
    slug: 'bankr',
    name: 'Bankr',
    provider: 'BankrBot',
    providerUrl: 'https://bankr.bot/',
    description:
      'Launch a token, earn from every trade, and fund your agent. Your agent gets a wallet with built-in guardrails — IP whitelisting, hallucination guards, and transaction verification — plus 57% of trading fees sent directly to your wallet. Use the LLM gateway to pay for inference directly from your agent\'s Bankr wallet.',
    demo: {
      title: 'bankr-cli.sh',
      language: 'bash',
      code: `# Launch a token on Base for free
bankr launch

# Track and claim your trading fee revenue
bankr fees
bankr fees claim 0xYourToken

# Fund your agent's intelligence
bankr llm setup
bankr prompt "What tokens are trending on Base?"`,
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
    provider: 'Axiom',
    providerUrl: 'https://www.clawbots.org/',
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

  // ─── Uniswap ─────────────────────────────────────────────────────────────
  {
    slug: 'uniswap-trading',
    name: 'Uniswap Trading',
    provider: 'Uniswap',
    providerUrl: 'https://uniswap.org',
    description:
      'Integrate Uniswap swaps into frontends, backends, and smart contracts — V2/V3/V4 support via Trading API, Universal Router, or direct contract calls.',
    demo: {
      title: 'swap.ts',
      language: 'typescript',
      code: `import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

// Fetch a swap quote from the Uniswap Trading API
const quote = await fetch(
  'https://trading-api.uniswap.org/v1/quote?' +
  new URLSearchParams({
    tokenIn: '0x4200000000000000000000000000000000000006', // WETH
    tokenOut: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
    amount: '1000000000000000000', // 1 ETH
    type: 'EXACT_INPUT',
    chainId: '8453',
  })
).then(r => r.json());

// Execute via Universal Router
const { calldata, value } = quote.routing.universalRouterCalldata;
await walletClient.sendTransaction({ to: UNIVERSAL_ROUTER, data: calldata, value });`,
    },
    setup: [
      'Install plugin: `/plugin install uniswap-trading`',
      'Install viem: `npm install viem`',
      'Configure RPC endpoint for your target chain',
      'Trigger with: "Help me integrate Uniswap swaps into my app"',
    ],
    securityFindings: [
      {
        severity: 'medium',
        title: 'Routing API Response Trusted Without Validation',
        file: 'uniswap-trading/scripts/swap.ts',
        description:
          'Token addresses and calldata returned by the Trading API are used directly without on-chain verification. A compromised or spoofed API response could route funds to a malicious contract.',
        recommendation:
          'Verify token contract addresses on-chain before execution. Validate Universal Router address against a hardcoded allowlist per chain.',
      },
      {
        severity: 'low',
        title: 'Slippage Settings Persisted in Unencrypted Storage',
        file: 'uniswap-trading/scripts/config.ts',
        description:
          'User slippage preferences are stored in localStorage or plaintext config files. A compromised client environment could modify these values to increase MEV exposure.',
        recommendation:
          'Enforce minimum slippage validation at execution time regardless of stored settings.',
      },
    ],
    overallRating: 'warning',
  },
  {
    slug: 'uniswap-hooks',
    name: 'Uniswap Hooks',
    provider: 'Uniswap',
    providerUrl: 'https://uniswap.org',
    description:
      'Security-first assistance for building Uniswap v4 hooks — threat modeling, permission flags analysis, NoOp attack prevention, delta accounting, and pre-deployment audit checklists.',
    demo: {
      title: 'CustomFeeHook.sol',
      language: 'solidity',
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/src/base/hooks/BaseHook.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {BeforeSwapDelta} from "v4-core/src/types/BeforeSwapDelta.sol";

contract CustomFeeHook is BaseHook {
    function getHookPermissions()
        public pure override returns (Hooks.Permissions memory)
    {
        return Hooks.Permissions({
            beforeSwap: true,        // ✓ needed
            afterSwap: false,        // ✗ minimize flags
            beforeSwapReturnDelta: false, // ✗ avoid unless necessary
            // ... all other flags false
        });
    }

    function beforeSwap(address, PoolKey calldata key,
        IPoolManager.SwapParams calldata, bytes calldata)
        external override returns (bytes4, BeforeSwapDelta, uint24)
    {
        // Access-control: only PoolManager can call
        return (BaseHook.beforeSwap.selector, toBeforeSwapDelta(0, 0), 3000);
    }
}`,
    },
    setup: [
      'Install plugin: `/plugin install uniswap-hooks`',
      'Start with security foundations: `/v4-security-foundations`',
      'Ask: "What are the risks of beforeSwapReturnDelta?"',
      'Review the 14-flag permission matrix before deploying',
    ],
    securityFindings: [
      {
        severity: 'high',
        title: 'NoOp Delta Imbalance Exploit Risk',
        file: 'uniswap-hooks/skill.md',
        description:
          'Hooks using beforeSwapReturnDelta or afterSwapReturnDelta without proper delta accounting can create imbalanced deltas that drain pool reserves. This is a known v4-specific attack vector.',
        recommendation:
          'Complete the v4-security-foundations skill before implementing delta-returning hooks. Audit all delta paths with a formal accounting proof.',
      },
      {
        severity: 'medium',
        title: 'Excess Permission Flags Increase Attack Surface',
        file: 'uniswap-hooks/skill.md',
        description:
          'Registering hook permission flags that are not strictly required broadens the attack surface. Unused flags still accept calls, meaning future code changes could inadvertently activate dangerous callbacks.',
        recommendation:
          'Apply the principle of least privilege — only enable the minimum permission flags required. Audit each flag against actual hook logic.',
      },
    ],
    overallRating: 'flagged',
  },
  {
    slug: 'uniswap-viem',
    name: 'Uniswap Viem',
    provider: 'Uniswap',
    providerUrl: 'https://uniswap.org',
    description:
      'EVM blockchain integration using viem and wagmi — wallet connection, contract reads/writes, real-time event subscriptions, multicall, and multi-chain support.',
    demo: {
      title: 'viem-setup.ts',
      language: 'typescript',
      code: `import { createPublicClient, createWalletClient, http, webSocket }
  from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

// Read data
const publicClient = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org'),
});

const balance = await publicClient.getBalance({ address: '0x...' });
const result = await publicClient.readContract({
  address: '0x...', abi, functionName: 'totalSupply',
});

// Watch events in real-time
publicClient.watchContractEvent({
  address: '0x...', abi, eventName: 'Transfer',
  onLogs: (logs) => console.log(logs),
});`,
    },
    setup: [
      'Install plugin: `/plugin install uniswap-viem`',
      'Install viem: `npm install viem`',
      'Trigger with: "Help me read a contract with viem"',
      'For React frontends, also install wagmi: `npm install wagmi`',
    ],
    securityFindings: [
      {
        severity: 'medium',
        title: 'Private Key Loaded from Environment Without Validation',
        file: 'uniswap-viem/scripts/wallet.ts',
        description:
          'Example scripts load private keys directly from process.env without format validation. Malformed or accidentally swapped environment variables could cause unintended transaction signing.',
        recommendation:
          'Validate private key format (0x-prefixed, 64 hex chars) before use. Prefer hardware wallet or OS keychain integration over raw environment variables.',
      },
      {
        severity: 'low',
        title: 'WebSocket Transport Silent Reconnect',
        file: 'uniswap-viem/scripts/transport.ts',
        description:
          'WebSocket transports reconnect automatically on disconnect without re-authenticating. A dropped connection could silently route to a different provider, changing the data source mid-operation.',
        recommendation:
          'Log and alert on transport reconnects. Verify provider identity after reconnection for sensitive operations.',
      },
    ],
    overallRating: 'warning',
  },
  {
    slug: 'uniswap-cca',
    name: 'Uniswap CCA',
    provider: 'Uniswap',
    providerUrl: 'https://uniswap.org',
    description:
      'Configure and deploy Continuous Clearing Auction (CCA) smart contracts — guided parameter setup, convex supply schedule generation, Q96 price calculations, and multi-chain CREATE2 deployment.',
    demo: {
      title: 'cca-deploy.sh',
      language: 'bash',
      code: `# Step 1: Configure your auction parameters
/configurator
# > Token address: 0xYourToken
# > Total supply: 1000000
# > Auction duration: 72 hours
# > Start price (USD): 0.10
# > End price (USD): 0.01
# > Network: base (chainId 8453)
# ✓ Supply schedule generated (convex curve α=1.2)
# ✓ Q96 prices calculated
# ✓ Config saved: cca-config.json

# Step 2: Review and deploy
/deployer
# > Config: cca-config.json
# ✓ Validated against factory 0xCCccCcCAE...
# Foundry script generated — review before signing`,
    },
    setup: [
      'Install plugin: `/plugin install uniswap-cca`',
      'Requires Python 3.10+ for MCP supply schedule server',
      'Run `/configurator` to set auction parameters',
      'Run `/deployer` and test on Sepolia before mainnet',
    ],
    securityFindings: [
      {
        severity: 'high',
        title: 'Plugin Provided for Educational Use Only',
        file: 'uniswap-cca/DISCLAIMER.md',
        description:
          'The CCA plugin explicitly states it is provided for educational purposes. The automated supply schedule generator and price calculators have not been independently audited. Real-asset auctions deployed from generated configs carry unquantified risk.',
        recommendation:
          'Always test on a testnet first. Have all auction configurations and contract deployments independently audited before using real funds.',
      },
      {
        severity: 'medium',
        title: 'Factory Address Hardcoded Without Chain Validation',
        file: 'uniswap-cca/scripts/deploy.ts',
        description:
          'The CREATE2 factory address is hardcoded but the script does not verify the factory bytecode at that address on the target chain before deployment. A misconfigured chain could silently deploy to a different contract.',
        recommendation:
          'Verify the factory contract bytecode hash on-chain before each deployment. Reject unrecognized factory contracts.',
      },
    ],
    overallRating: 'flagged',
  },
  {
    slug: 'uniswap-driver',
    name: 'Uniswap Driver',
    provider: 'Uniswap',
    providerUrl: 'https://uniswap.org',
    description:
      'Plan Uniswap swaps and liquidity positions then execute via deep links — verify tokens on-chain, research market conditions, and generate pre-filled Uniswap interface URLs across 12 chains.',
    demo: {
      title: 'swap-planner.sh',
      language: 'bash',
      code: `# Plan a swap — AI researches tokens and builds the link
"Swap 1 ETH for USDC on Base"
# ✓ Verified WETH: 0x4200...0006 (Base, official)
# ✓ Verified USDC: 0x8335...a02913 (Base, Circle)
# ✓ Current rate: ~3,240 USDC per ETH
# → https://app.uniswap.org/swap?inputCurrency=...

# Plan a liquidity position
"Provide $500 of ETH/USDC liquidity on Base V3"
# ✓ Pool: 0.05% fee tier, TVL $12.4M
# ✓ Current price: 3,240 USDC/ETH
# ✓ Suggested range: 2,800–3,700 USDC
# → https://app.uniswap.org/add/...`,
    },
    setup: [
      'Install plugin: `/plugin install uniswap-driver`',
      'Trigger with: "Swap ETH for USDC on Base" or "Add liquidity"',
      'Review the generated deep link before clicking',
      'Execute through the Uniswap web interface — no autonomous transactions',
    ],
    securityFindings: [
      {
        severity: 'low',
        title: 'Deep Links Expose Swap Parameters in URL',
        file: 'uniswap-driver/scripts/planner.ts',
        description:
          'Generated deep links encode token addresses, amounts, and recipient addresses in the URL. These URLs may be logged by browsers, proxies, or analytics tools, leaking trade intent.',
        recommendation:
          'Avoid sharing generated links in untrusted channels. Use private browsing when following deep links for sensitive trades.',
      },
      {
        severity: 'low',
        title: 'Web Search Token Research Not Cryptographically Verified',
        file: 'uniswap-driver/scripts/research.ts',
        description:
          'Token identity research relies on web search results which could be manipulated via SEO or sponsored results. A scam token could appear legitimate in search data.',
        recommendation:
          'Always cross-reference token addresses against official project documentation and on-chain data before executing swaps.',
      },
    ],
    overallRating: 'clean',
  },

  // ─── Base ─────────────────────────────────────────────────────────────────
  {
    slug: 'base-account',
    name: 'Base Account',
    provider: 'Base',
    providerUrl: 'https://base.org',
    description:
      'ERC-4337 smart wallet integration — Sign in with Base, one-tap USDC payments, gas sponsorship via paymasters, sub accounts, and spend permissions across 9 chains.',
    demo: {
      title: 'base-account.ts',
      language: 'typescript',
      code: `import { createBaseAccountSDK } from '@base-org/account';
import { BasePayButton } from '@base-org/account-ui';

// Initialize SDK
const sdk = createBaseAccountSDK({
  appName: 'My App',
  appLogoUrl: 'https://myapp.com/logo.png',
  appChainIds: [8453], // Base Mainnet
});

// Sign in with Base (generate nonce BEFORE user click)
const nonce = await generateNonce(); // server-side
const { address, token } = await sdk.signIn({ nonce });

// One-tap USDC payment
<BasePayButton
  chargeHandler={async () => ({
    id: crypto.randomUUID(),
    callData: { recipientAddress: '0x...', amount: '5000000' }, // $5 USDC
  })}
  onSuccess={({ paymentId }) => console.log('Paid:', paymentId)}
/>`,
    },
    setup: [
      'Install: `npm install @base-org/account @base-org/account-ui`',
      'Set `Cross-Origin-Opener-Policy: same-origin-allow-popups` on your server',
      'Generate nonces server-side before user clicks Sign in',
      'Use proxy to protect Paymaster URLs from client-side exposure',
    ],
    securityFindings: [
      {
        severity: 'high',
        title: 'Paymaster URL Exposed Client-Side',
        file: 'base-account/scripts/paymaster.ts',
        description:
          'Paymaster sponsorship URLs embedded in frontend code can be extracted from the browser and abused to sponsor arbitrary transactions, draining the sponsorship budget.',
        recommendation:
          'Always proxy Paymaster requests through a backend. Never embed Paymaster URLs or credentials directly in client-side code.',
      },
      {
        severity: 'medium',
        title: 'Missing Transaction ID Replay Protection',
        file: 'base-account/scripts/payment.ts',
        description:
          'Payment verification flows that do not track transaction IDs can be replayed. An attacker could re-submit a valid payment callback to credit an account multiple times.',
        recommendation:
          'Track all transaction IDs server-side and reject duplicate payment confirmations. Implement idempotency checks at the API layer.',
      },
    ],
    overallRating: 'flagged',
  },
  {
    slug: 'base-network',
    name: 'Base Network',
    provider: 'Base',
    providerUrl: 'https://base.org',
    description:
      'Base Mainnet and Sepolia network configuration — RPC endpoints, chain IDs, explorer URLs, and wallet setup for Base blockchain development.',
    demo: {
      title: 'network-config.ts',
      language: 'typescript',
      code: `import { defineChain } from 'viem';

// Base Mainnet
export const base = defineChain({
  id: 8453,
  name: 'Base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://mainnet.base.org'] },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://basescan.org' },
  },
});

// Base Sepolia Testnet
export const baseSepolia = defineChain({
  id: 84532,
  name: 'Base Sepolia',
  rpcUrls: {
    default: { http: ['https://sepolia.base.org'] },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://sepolia.basescan.org' },
  },
});`,
    },
    setup: [
      'Install: `npx skills add base/base-skills`',
      'Add Base to your wallet using chain ID 8453',
      'For testnet: use chain ID 84532 (Base Sepolia)',
      'Replace public RPC endpoints with a provider for production',
    ],
    securityFindings: [
      {
        severity: 'low',
        title: 'Public RPC Endpoints Rate-Limited in Production',
        file: 'base-network/scripts/client.ts',
        description:
          'The public RPC endpoints (mainnet.base.org, sepolia.base.org) are rate-limited and not appropriate for production use. High-traffic apps may fail silently when rate limits are hit.',
        recommendation:
          'Use a dedicated RPC provider (Alchemy, Infura, QuickNode) for production. Never embed RPC API keys in client-side code — proxy through a backend.',
      },
      {
        severity: 'low',
        title: 'Chain ID Not Validated Before Transaction Signing',
        file: 'base-network/scripts/tx.ts',
        description:
          'Transaction construction does not explicitly validate the chainId field before signing. A misconfigured wallet could sign transactions intended for Base on a different chain, risking replay attacks.',
        recommendation:
          'Always assert chainId in transaction parameters and verify it matches the connected network before signing.',
      },
    ],
    overallRating: 'clean',
  },
  {
    slug: 'base-deploy',
    name: 'Base Deploy',
    provider: 'Base',
    providerUrl: 'https://base.org',
    description:
      'Deploy and verify smart contracts on Base with Foundry — testnet faucet access via CDP, encrypted keystore management, BaseScan verification, and common troubleshooting.',
    demo: {
      title: 'deploy.sh',
      language: 'bash',
      code: `# Import key into Foundry encrypted keystore (never commit keys)
cast wallet import deployer --interactive

# Deploy & verify on Base Sepolia
forge create src/MyContract.sol:MyContract \\
  --rpc-url https://sepolia.base.org \\
  --account deployer \\
  --verify \\
  --etherscan-api-key $BASESCAN_API_KEY

# Deploy to Base Mainnet
forge create src/MyContract.sol:MyContract \\
  --rpc-url https://mainnet.base.org \\
  --account deployer \\
  --verify \\
  --etherscan-api-key $BASESCAN_API_KEY

# Faucet: claim testnet ETH via CDP SDK
npx ts-node scripts/faucet.ts --address 0xYourAddress`,
    },
    setup: [
      'Install Foundry: `curl -L https://foundry.paradigm.xyz | bash`',
      'Import key: `cast wallet import deployer --interactive`',
      'Get BaseScan API key at basescan.org/apidashboard',
      'Claim testnet ETH from portal.cdp.coinbase.com/products/faucet',
    ],
    securityFindings: [
      {
        severity: 'high',
        title: 'Private Key Leakage in Verbose Forge Output',
        file: 'base-deploy/scripts/deploy.sh',
        description:
          'Forge deployments with raw `--private-key` flags log the key in shell history and CI/CD system output. Any process with access to logs or history can extract the deployer key.',
        recommendation:
          'Always use Foundry encrypted keystore (`cast wallet import`) instead of raw private keys. Add `.env` to `.gitignore` and never pass keys as CLI arguments.',
      },
      {
        severity: 'medium',
        title: 'BaseScan API Key Exposed in CI Logs',
        file: 'base-deploy/scripts/verify.sh',
        description:
          'BaseScan API keys passed as `--etherscan-api-key` command-line arguments appear in CI/CD system logs and process listings, potentially exposing them to other CI jobs or log aggregation tools.',
        recommendation:
          'Store BaseScan API keys in CI secret stores and reference via `foundry.toml` `${ENV_VAR}` syntax rather than passing as command-line arguments.',
      },
    ],
    overallRating: 'flagged',
  },
  {
    slug: 'base-node',
    name: 'Base Node',
    provider: 'Base',
    providerUrl: 'https://base.org',
    description:
      'Run a production Base node with Reth client — hardware sizing, port configuration, snapshot bootstrapping, security hardening, and sync monitoring.',
    demo: {
      title: 'node-setup.sh',
      language: 'bash',
      code: `# Hardware: 8-core CPU, 16 GB RAM, NVMe SSD
# Storage: (2 × chain_size) + snapshot_size + 20% buffer

# Required firewall ports
ufw allow 9222/udp  # Reth Discovery v5 (critical)
ufw allow 30303/tcp # P2P Discovery & RLPx
ufw deny 8545       # Block RPC from public internet
ufw deny 8546       # Block WebSocket from public internet

# Start Reth (Base)
reth node \\
  --chain base \\
  --http --http.addr 127.0.0.1 \\
  --ws --ws.addr 127.0.0.1 \\
  --datadir /data/reth-base

# Check sync status
cast block-number --rpc-url http://127.0.0.1:8545`,
    },
    setup: [
      'Provision server: 8-core CPU, 16 GB RAM, NVMe SSD',
      'Open ports 9222 (UDP) and 30303 (TCP) in firewall',
      'Block ports 8545 and 8546 from public internet',
      'Download bootstrap snapshot to accelerate initial sync',
    ],
    securityFindings: [
      {
        severity: 'medium',
        title: 'RPC Port Exposed to All Interfaces by Default',
        file: 'base-node/scripts/start.sh',
        description:
          'Default Reth configuration binds the RPC port (8545) to all network interfaces. A node exposed to the internet without a firewall allows unauthenticated access to wallet management and admin RPCs.',
        recommendation:
          'Always bind RPC to `127.0.0.1` explicitly. Use a TLS-terminating reverse proxy (nginx/caddy) for any remote access. Set strict firewall rules before starting the node.',
      },
      {
        severity: 'low',
        title: 'Bootstrap Snapshot Integrity Not Verified',
        file: 'base-node/scripts/snapshot.sh',
        description:
          'Snapshot files downloaded for initial sync are not integrity-checked against a published hash before import. A compromised snapshot source could provide manipulated chain data.',
        recommendation:
          'Verify snapshot checksums against hashes published in official Base documentation before importing. Prefer official snapshot sources only.',
      },
    ],
    overallRating: 'warning',
  },
  {
    slug: 'base-minikit',
    name: 'MiniKit to Farcaster',
    provider: 'Base',
    providerUrl: 'https://base.org',
    description:
      'Migrate Mini Apps from MiniKit (OnchainKit) to native Farcaster SDK — async context patterns, hook-by-hook mappings, FrameProvider setup, and manifest configuration.',
    demo: {
      title: 'migrate.tsx',
      language: 'tsx',
      code: `// Before (MiniKit / OnchainKit)
import { useMiniKit } from '@coinbase/onchainkit/minikit';
const { context } = useMiniKit(); // sync access
console.log(context.user.fid);

// After (Farcaster SDK v0.2.0+)
import sdk from '@farcaster/miniapp-sdk';
import { useEffect, useState } from 'react';

function App() {
  const [context, setContext] = useState(null);

  useEffect(() => {
    // sdk.context is now a Promise — must await
    sdk.context.then(setContext);
    return () => { /* cleanup prevents stale state */ };
  }, []);

  // Replace FrameProvider, update manifest.json
  // setPrimaryButton no longer accepts onClick callback
}`,
    },
    setup: [
      'Ensure Node.js >= 22.11.0 is installed',
      'Update: `npm install @farcaster/miniapp-sdk`',
      'Replace `@coinbase/onchainkit/minikit` imports throughout',
      'Update manifest.json with Farcaster frame configuration',
    ],
    securityFindings: [
      {
        severity: 'low',
        title: 'Async Context Race Condition in React Effects',
        file: 'base-minikit/scripts/context.ts',
        description:
          'Awaiting sdk.context inside useEffect without a cleanup function can cause state updates on unmounted components. In strict mode or fast navigation, this leads to memory leaks and potential stale state bugs.',
        recommendation:
          'Use an ignore flag or AbortController in useEffect to cancel the context promise if the component unmounts before it resolves.',
      },
      {
        severity: 'low',
        title: 'Farcaster Manifest Not Validated Before Submission',
        file: 'base-minikit/scripts/manifest.ts',
        description:
          'The migration guide does not include a manifest.json validation step. An invalid or misconfigured manifest can cause the Mini App to fail silently in the Farcaster client with no visible error.',
        recommendation:
          'Validate manifest.json against the Farcaster Mini App schema before deployment. Test the frame in Warpcast dev tools to catch configuration issues early.',
      },
    ],
    overallRating: 'clean',
  },

  // ─── Other skills ─────────────────────────────────────────────────────────
  {
    slug: 'botchan',
    name: 'Botchan',
    provider: 'Botchan',
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
    provider: '8004.org',
    providerUrl: 'https://www.8004.org/',
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
    providerUrl: 'https://www.base.org/build/onchainkit',
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
    provider: 'Veil Cash',
    providerUrl: 'https://www.veil.cash/',
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

export function getQualityScore(findings: Finding[]): number {
  const deductions: Record<Finding['severity'], number> = {
    critical: 25,
    high: 15,
    medium: 8,
    low: 3,
  };
  const total = findings.reduce((acc, f) => acc + deductions[f.severity], 0);
  return Math.max(0, 100 - total);
}

export function getAllFindings(): Finding[] {
  return skills.flatMap((s) => s.securityFindings);
}
