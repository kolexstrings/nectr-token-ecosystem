# NECTR Token Ecosystem

A full-stack Web3 project for the NECTR token: production-ready staking smart contracts (Hardhat) and a modern Next.js dApp with wallet connection, staking UI, real‑time balances, a horizontally scrolling news feed, and a live Twitter community feed.

## Features

- **NECTR staking dApp**: Stake/unstake NECTR, view wallet and staked balances
- **Wallet integration**: MetaMask via ethers v6 (Polygon Amoy supported)
- **Modern UI**: Tailwind, glass morphism, marquee news feed with local images
- **Live updates**: Twitter/X embedded timeline

## Tech Stack

- Smart contracts: Solidity, Hardhat (Ignition for deployments)
- Frontend: Next.js, TypeScript, Tailwind CSS
- Blockchain interaction: ethers v6

---

## Quick Start

### 1) Prerequisites

- Node.js 18+
- Yarn or npm
- MetaMask (browser)

### 2) Install dependencies

```bash
# Root deps (Hardhat)
yarn

# Frontend deps
cd frontend
yarn
```

### 3) Configure environment

Create a `.env` file in `frontend/` using `env.example` as reference:

```bash
cd frontend
cp ../env.example .env
```

Required variables for the dApp:

- `NEXT_PUBLIC_AMOY_RPC_URL` – Polygon Amoy RPC URL
- `NEXT_PUBLIC_NECTR_TOKEN_ADDRESS` – NECTR ERC‑20 address on Amoy
- `NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS` – Staking contract address on Amoy

### 4) Run the dApp

```bash
cd frontend
yarn dev
```

Open `http://localhost:3000`. Connect MetaMask, switch to Polygon Amoy if prompted, and interact with staking.

---

## Smart Contracts (Hardhat)

Common scripts:

```bash
# Compile
yarn hardhat compile

# Run tests
yarn hardhat test

# Local node
yarn hardhat node

# Deploy with Ignition (example network)
yarn hardhat ignition deploy ignition/modules/NectrStaking.ts --network <network>
```

Set your private key for deployments using env vars or Hardhat keystore, and configure networks in `hardhat.config.ts`.

Deployment artifacts and addresses for Amoy are stored under `ignition/deployments/` and referenced by the frontend via env vars.

---

## Frontend Notes

- Local news images live in `frontend/public/images/` and are mapped per item.
- External images are allowed via `next.config.ts` if needed.
- The Twitter feed uses `twttr.widgets.createTimeline`; ensure `platform.twitter.com` isn’t blocked by extensions or CSP.

---

## Troubleshooting

- Wallet not connecting: ensure MetaMask is installed and the Amoy network is reachable.
- Images not rendering: confirm local files under `public/images/` and paths in `NewsFeed.tsx`.
- Twitter not rendering: check browser console/network for blocked `platform.twitter.com` requests.

---

## License

MIT
