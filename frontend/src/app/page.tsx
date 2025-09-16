"use client";

import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { Copy, Wallet } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import StakingInterface from "@/components/StakingInterface";
import Modal from "@/components/Modal";
import NectrToken from "../../abis/NECTRToken.json";
import NectrStaking from "../../abis/NectarStaking.json";

const NECTR_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_NECTR_TOKEN_ADDRESS!;
const NECTR_STAKING_ADDRESS = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS;
const AMOY_RPC_URL = process.env.NEXT_PUBLIC_AMOY_RPC_URL!;
const AMOY_CHAIN_ID_HEX = "0x13882"; // 80002

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [nectrBalance, setNectrBalance] = useState<string>("0");
  const [stakedAmount, setStakedAmount] = useState("0");
  const [isStaking, setIsStaking] = useState(false);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [isUnstakeModalOpen, setIsUnstakeModalOpen] = useState(false);
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [isUnstaking, setIsUnstaking] = useState(false);

  useEffect(() => {
    if (!account) return;

    const provider = new ethers.JsonRpcProvider(AMOY_RPC_URL);
    const onBlock = () => fetchBalance(account);

    // Initial fetch
    fetchBalance(account);

    // Poll on each new block (no expiring filters)
    provider.on("block", onBlock);

    return () => {
      provider.off("block", onBlock);
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
    if (typeof window === "undefined" || !window.ethereum) {
      toast.error(
        "MetaMask is not installed. Please install it to use this dApp."
      );
      return;
    }

    try {
      // Try to switch/add, but don't block connect if it fails
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: AMOY_CHAIN_ID_HEX }],
        });
      } catch (e: any) {
        if (e?.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: AMOY_CHAIN_ID_HEX,
                  chainName: "Polygon Amoy",
                  nativeCurrency: {
                    name: "MATIC",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  rpcUrls: [AMOY_RPC_URL].filter(Boolean),
                  blockExplorerUrls: ["https://www.oklink.com/amoy"],
                },
              ],
            });
          } catch {
            // ignore; we'll still try to connect
          }
        } else {
          // ignore; we'll still try to connect
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      // Optional: warn if still on wrong chain
      const nw = await provider.getNetwork();
      if (nw.chainId !== 80002n) {
        toast.warn(
          "Connected wallet, but not on Polygon Amoy. Some actions may fail."
        );
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
      toast.error("Wallet connection failed. Please try again.");
    }
  };

  const disconnectWallet = () => {
    // Just reset the state — MetaMask doesn’t have a native “disconnect” method
    setAccount(null);
    setNectrBalance("0");
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
      toast.error("Failed to fetch NECTR balance.");
    }
  };

  const fetchAllowance = async (userAddress: string) => {
    try {
      if (!NECTR_STAKING_ADDRESS) return;
      const provider = new ethers.JsonRpcProvider(AMOY_RPC_URL);
      const token = new ethers.Contract(
        NECTR_TOKEN_ADDRESS,
        NectrToken.abi,
        provider
      );
      const current = (await token.allowance(
        userAddress,
        NECTR_STAKING_ADDRESS
      )) as bigint;
      setAllowance(current);
    } catch (err) {
      console.error("Failed to fetch allowance:", err);
    }
  };

  useEffect(() => {
    if (account) {
      fetchBalance(account);
      fetchAllowance(account);
    }
  }, [account]);

  const stake = async (amount: string) => {
    if (!account) return toast.error("Wallet not connected");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const codeToken = await signer.provider.getCode(NECTR_TOKEN_ADDRESS);
      if (codeToken === "0x") {
        throw new Error(
          "Invalid NECTR token address for this network (no contract code)."
        );
      }
      if (!NECTR_STAKING_ADDRESS)
        throw new Error("Staking contract address is undefined");
      const codeStaking = await signer.provider.getCode(NECTR_STAKING_ADDRESS);
      if (codeStaking === "0x") {
        throw new Error(
          "Invalid staking contract address for this network (no contract code)."
        );
      }

      const tokenContract = new ethers.Contract(
        NECTR_TOKEN_ADDRESS,
        NectrToken.abi,
        signer
      );
      const decimals = await tokenContract.decimals(); // now safe
      const formattedAmount = ethers.parseUnits(amount, decimals);

      const stakingContract = new ethers.Contract(
        NECTR_STAKING_ADDRESS,
        NectrStaking.abi,
        signer
      );

      const currentAllowance = (await tokenContract.allowance(
        account,
        NECTR_STAKING_ADDRESS
      )) as bigint;
      if (currentAllowance < formattedAmount) {
        setIsApproving(true);
        const approveTx = await tokenContract.approve(
          NECTR_STAKING_ADDRESS,
          formattedAmount
        );
        toast.info("Approval sent, waiting for confirmation...");
        await approveTx.wait();
        setIsApproving(false);
      }

      const tx = await stakingContract.stake(formattedAmount);
      toast.info("Transaction sent, waiting for confirmation...");
      await tx.wait();
      toast.success("Successfully staked NECTR!");

      fetchBalance(account);
      fetchAllowance(account);

      const newStaked = await stakingContract.stakes(account);
      setStakedAmount(ethers.formatUnits(newStaked, decimals));
    } catch (err: any) {
      console.error("Staking failed:", err);
      toast.error(err?.message || "Staking failed");
      setIsApproving(false);
    }
  };

  const unstake = async (amount: string) => {
    if (!account) return toast.error("Wallet not connected");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      if (!NECTR_STAKING_ADDRESS)
        throw new Error("Staking contract address is undefined");
      const tokenContract = new ethers.Contract(
        NECTR_TOKEN_ADDRESS,
        NectrToken.abi,
        signer
      );
      const decimals = await tokenContract.decimals();
      const formattedAmount = ethers.parseUnits(amount, decimals);

      const stakingContract = new ethers.Contract(
        NECTR_STAKING_ADDRESS,
        NectrStaking.abi,
        signer
      );
      const tx = await stakingContract.unstake(formattedAmount);
      toast.info("Unstake sent, waiting for confirmation...");
      await tx.wait();
      toast.success("Successfully unstaked NECTR!");

      if (account) {
        fetchBalance(account);
        const newStaked = await stakingContract.stakes(account);
        setStakedAmount(ethers.formatUnits(newStaked, decimals));
      }
    } catch (err: any) {
      console.error("Unstaking failed:", err);
      toast.error(err?.message || "Unstaking failed");
    }
  };

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
            {!account ? (
              <button
                className="btn-cyber bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg animate-cyber-pulse"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            ) : (
              <button
                className="btn-cyber bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg"
                onClick={disconnectWallet}
              >
                Disconnect
              </button>
            )}

            {/* Start Staking - Secondary (Purple) */}
            <button
              onClick={() => setIsStakeModalOpen(true)}
              className={`px-6 py-2 rounded-lg ${
                account
                  ? "btn-neon bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-600 text-white opacity-50 cursor-not-allowed"
              }`}
              disabled={!account}
            >
              Stake NECTR
            </button>
            <button
              onClick={() => setIsUnstakeModalOpen(true)}
              className={`px-6 py-2 rounded-lg ${
                account
                  ? "btn-electric"
                  : "bg-electric-500 text-white opacity-50 cursor-not-allowed"
              }`}
              disabled={!account}
            >
              Unstake
            </button>
          </div>

          {/* Wallet + Balance */}
          {account ? (
            <div className="mt-4">
              <p className="text-sm text-green-400 font-mono flex items-center justify-center">
                <Wallet className="inline-block mr-2" />
                {account.slice(0, 6)}...{account.slice(-4)}
                <CopyToClipboard
                  text={account}
                  onCopy={() =>
                    toast.success("Wallet address copied to clipboard!")
                  }
                >
                  <Copy className="inline-block ml-2 cursor-pointer hover:text-cyber-400" />
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
          {isStakeModalOpen && (
            <Modal
              onClose={() => setIsStakeModalOpen(false)}
              containerClassName="items-center"
              contentClassName="max-w-2xl -mt-36"
            >
              <div className="space-y-4 text-white">
                <h3 className="text-2xl font-cyber text-cyber-400 text-center">
                  Stake NECTR
                </h3>
                <div className="glass rounded-glass p-4 bg-dark-800">
                  <label className="block text-xs font-mono text-cyber-300 mb-1">
                    Amount to Stake
                  </label>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.0"
                    step="0.000001"
                    className="w-full px-3 py-2 rounded-md bg-dark-900 text-white placeholder-cyber-600 border border-cyber-700 focus:outline-none focus:ring-2 focus:ring-cyber-500"
                  />
                  <p className="text-xs text-cyber-500 mt-2">
                    Balance: {nectrBalance} NECTR
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsStakeModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-dark-700 text-cyber-300 hover:bg-dark-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!stakeAmount) return;
                      setIsStaking(true);
                      try {
                        await stake(stakeAmount);
                        setStakeAmount("");
                        setIsStakeModalOpen(false);
                      } finally {
                        setIsStaking(false);
                      }
                    }}
                    disabled={isStaking || isApproving || !stakeAmount}
                    className={`flex-1 px-4 py-2 rounded-lg ${
                      isStaking || isApproving || !stakeAmount
                        ? "opacity-50 cursor-not-allowed bg-dark-700 text-cyber-300"
                        : "btn-neon"
                    }`}
                  >
                    {isApproving
                      ? "Approving..."
                      : isStaking
                      ? "Staking..."
                      : "Stake"}
                  </button>
                </div>
              </div>
            </Modal>
          )}
          {isUnstakeModalOpen && (
            <Modal
              onClose={() => setIsUnstakeModalOpen(false)}
              containerClassName="items-center"
              contentClassName="max-w-2xl -mt-36"
            >
              <div className="space-y-4 text-white">
                <h3 className="text-2xl font-cyber text-cyber-400 text-center">
                  Unstake NECTR
                </h3>
                <div className="glass rounded-glass p-4 bg-dark-800">
                  <label className="block text-xs font-mono text-cyber-300 mb-1">
                    Amount to Unstake
                  </label>
                  <input
                    type="number"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    placeholder="0.0"
                    step="0.000001"
                    className="w-full px-3 py-2 rounded-md bg-dark-900 text-white placeholder-cyber-600 border border-cyber-700 focus:outline-none focus:ring-2 focus:ring-cyber-500"
                  />
                  <p className="text-xs text-cyber-500 mt-2">
                    Staked: {stakedAmount} NECTR
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsUnstakeModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-dark-700 text-cyber-300 hover:bg-dark-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!unstakeAmount) return;
                      if (
                        parseFloat(unstakeAmount) > parseFloat(stakedAmount)
                      ) {
                        return toast.error("Amount exceeds staked balance");
                      }
                      setIsUnstaking(true);
                      try {
                        await unstake(unstakeAmount);
                        setUnstakeAmount("");
                        setIsUnstakeModalOpen(false);
                      } finally {
                        setIsUnstaking(false);
                      }
                    }}
                    disabled={isUnstaking || !unstakeAmount}
                    className={`flex-1 px-4 py-2 rounded-lg ${
                      isUnstaking || !unstakeAmount
                        ? "opacity-50 cursor-not-allowed bg-dark-700 text-cyber-300"
                        : "btn-electric"
                    }`}
                  >
                    {isUnstaking ? "Unstaking..." : "Unstake"}
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}
