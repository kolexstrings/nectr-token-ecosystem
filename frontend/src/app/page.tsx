"use client";

import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { Copy, Wallet } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import NectrToken from "../../NECTRToken.json";
const NECTR_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_NECTR_TOKEN_ADDRESS!;
const AMOY_RPC_URL = process.env.NEXT_PUBLIC_AMOY_RPC_URL!;

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [nectrBalance, setNectrBalance] = useState<string>("0");

  useEffect(() => {
    if (!account) return;

    const provider = new ethers.JsonRpcProvider(AMOY_RPC_URL);
    const contract = new ethers.Contract(
      NECTR_TOKEN_ADDRESS,
      NectrToken.abi,
      provider
    );

    // Fetch balance initially
    fetchBalance(account);

    // Event listener
    const onTransfer = (from: string, to: string) => {
      if (
        from.toLowerCase() === account.toLowerCase() ||
        to.toLowerCase() === account.toLowerCase()
      ) {
        fetchBalance(account);
      }
    };

    contract.on("Transfer", onTransfer);

    // Cleanup when component unmounts
    return () => {
      contract.off("Transfer", onTransfer);
    };
  }, [account]);

  useEffect(() => {
    if (!window.ethereum) return;

    const handler = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        fetchBalance(accounts[0]);
      } else {
        setAccount(null);
        setNectrBalance("0");
      }
    };

    window.ethereum.on("accountsChanged", handler);
    return () => {
      window.ethereum.removeListener("accountsChanged", handler);
    };
  }, []);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this dApp.");
    }
  };

  const fetchBalance = async (userAddress: string) => {
    try {
      const provider = new ethers.JsonRpcProvider(AMOY_RPC_URL);
      const contract = new ethers.Contract(
        NECTR_TOKEN_ADDRESS,
        NectrToken.abi,
        provider
      );

      const rawBalance = await contract.balanceOf(userAddress);
      const decimals = await contract.decimals();
      const formatted = ethers.formatUnits(rawBalance, decimals);

      // Convert to number and apply formatting rules
      let displayBalance: string;
      const num = parseFloat(formatted);

      if (num >= 1) {
        displayBalance = num.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });
      } else {
        displayBalance = num.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        });
      }

      setNectrBalance(displayBalance);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  useEffect(() => {
    if (account) {
      fetchBalance(account);
    }
  }, [account]);

  return (
    <div className="min-h-screen bg-dark-900 cyber-grid text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-5xl font-cyber font-bold text-cyber-400 text-glow mb-8 text-center">
          NECTR Web3 Ecosystem
        </h1>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <p className="text-xl text-cyber-300 mb-6">
            Experience the future of decentralized staking
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Connect Wallet - Primary (Green) */}
            {!account ? (
              <button
                className="btn-cyber bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg animate-cyber-pulse"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            ) : (
              <button className="btn-cyber bg-green-600 px-6 py-2 rounded-lg cursor-default">
                Connected
              </button>
            )}

            {/* Start Staking - Secondary (Purple) */}
            <button
              className={`px-6 py-2 rounded-lg ${
                account
                  ? "btn-neon bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-600 text-white opacity-50 cursor-not-allowed"
              }`}
              disabled={!account}
            >
              Start Staking
            </button>
          </div>

          {/* Wallet + Balance */}
          {account ? (
            <div className="mt-4">
              <p className="text-sm text-green-400 font-mono">
                <Wallet className="inline-block mr-2" />
                {account.slice(0, 6)}...{account.slice(-4)}
                <CopyToClipboard text={account}>
                  <Copy className="inline-block ml-2 cursor-pointer" />
                </CopyToClipboard>
              </p>
              <p className="text-sm text-cyber-300 font-mono mt-2">
                Balance: {nectrBalance} NECTR
              </p>
            </div>
          ) : (
            <p className="text-sm text-cyber-300 mt-4">
              Connect your wallet to enable staking
            </p>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Cyber Staking */}
          <div className="card-cyber hover:scale-105 transition-transform duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-cyber-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-cyber text-cyber-400">
                Cyber Staking
              </h3>
            </div>
            <p className="text-cyber-300 mb-4">
              Stake your NECTR tokens and earn rewards with our advanced staking
              protocol.
            </p>
            <div className="text-cyber-400 font-mono text-sm">APY: 12.5%</div>
          </div>

          {/* Neon Rewards */}
          <div className="card-neon hover:scale-105 transition-transform duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-neon-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🔮</span>
              </div>
              <h3 className="text-2xl font-cyber text-neon-400">
                Neon Rewards
              </h3>
            </div>
            <p className="text-neon-300 mb-4">
              Earn exclusive rewards and participate in governance with your
              staked tokens.
            </p>
            <div className="text-neon-400 font-mono text-sm">
              Rewards: Active
            </div>
          </div>

          {/* Electric Speed */}
          <div className="card-electric hover:scale-105 transition-transform duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-electric-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-cyber text-electric-400">
                Electric Speed
              </h3>
            </div>
            <p className="text-electric-300 mb-4">
              Lightning-fast transactions powered by Polygon's high-performance
              network.
            </p>
            <div className="text-electric-400 font-mono text-sm">
              Speed: 2.3s
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="glass rounded-glass p-8 mb-12">
          <h2 className="text-3xl font-cyber text-center mb-8">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-cyber text-cyber-400 mb-2">
                $2.4M
              </div>
              <div className="text-cyber-300">Total Value Locked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-cyber text-neon-400 mb-2">
                1,247
              </div>
              <div className="text-neon-300">Active Stakers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-cyber text-electric-400 mb-2">
                12.5%
              </div>
              <div className="text-electric-300">Average APY</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-cyber text-cyber-400 mb-2">
                99.9%
              </div>
              <div className="text-cyber-300">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
