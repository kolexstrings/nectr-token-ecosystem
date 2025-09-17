"use client";

import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import NectrToken from "../../abis/NECTRToken.json";
import NectrStaking from "../../abis/NectarStaking.json";

import Hero from "../components/Hero";
import WalletBar from "../components/WalletBar";
import ActionBar from "../components/ActionBar";
import StakeModal from "../components/StakeModal";
import UnstakeModal from "../components/UnstakeModal";
import StatsSection from "../components/StatsSection";
import FeatureCards from "../components/FeatureCards";
import NewsFeed from "@/components/NewsFeed";
import CommunitySection from "../components/CommunitySection";

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
    const eth = typeof window !== "undefined" ? window.ethereum : undefined;
    if (!eth) return;

    const handler = (...args: unknown[]) => {
      const accounts = (args[0] ?? []) as string[];
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        fetchBalance(accounts[0]);
      } else {
        setAccount(null);
        setNectrBalance("0");
      }
    };

    if (typeof eth.on === "function") {
      eth.on("accountsChanged", handler);
    }
    return () => {
      if (typeof eth.removeListener === "function") {
        eth.removeListener("accountsChanged", handler);
      }
    };
  }, []);

  useEffect(() => {
    if (document.getElementById("x-wjs")) return;
    const s = document.createElement("script");
    s.id = "x-wjs";
    s.async = true;
    s.src = "https://platform.twitter.com/widgets.js";
    document.body.appendChild(s);
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
      } catch (e: unknown) {
        const err = e as { code?: number };
        if (err?.code === 4902) {
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

      const provider = new ethers.BrowserProvider(window.ethereum!);
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

  // fetchAllowance removed; allowance is checked inline in stake()

  useEffect(() => {
    if (account) {
      fetchBalance(account);
    }
  }, [account]);

  const stake = async (amount: string) => {
    if (!account) return toast.error("Wallet not connected");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
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

      const newStaked = await stakingContract.stakes(account);
      setStakedAmount(ethers.formatUnits(newStaked, decimals));
    } catch (err: unknown) {
      console.error("Staking failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Staking failed");
      setIsApproving(false);
    }
  };

  const unstake = async (amount: string) => {
    if (!account) return toast.error("Wallet not connected");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
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
    } catch (err: unknown) {
      console.error("Unstaking failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Unstaking failed");
    }
  };

  const handleStake = async () => {
    if (!stakeAmount) return;
    setIsStaking(true);
    try {
      await stake(stakeAmount);
      setStakeAmount("");
      setIsStakeModalOpen(false);
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async () => {
    if (!unstakeAmount) return;
    if (parseFloat(unstakeAmount) > parseFloat(stakedAmount)) {
      toast.error("Amount exceeds staked balance");
      return;
    }
    setIsUnstaking(true);
    try {
      await unstake(unstakeAmount);
      setUnstakeAmount("");
      setIsUnstakeModalOpen(false);
    } finally {
      setIsUnstaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 cyber-grid text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Hero />
        <WalletBar
          account={account}
          nectrBalance={nectrBalance}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
        />
        <ActionBar
          account={account}
          onOpenStake={() => setIsStakeModalOpen(true)}
          onOpenUnstake={() => setIsUnstakeModalOpen(true)}
        />

        <StakeModal
          isOpen={isStakeModalOpen}
          onClose={() => setIsStakeModalOpen(false)}
          stakeAmount={stakeAmount}
          setStakeAmount={setStakeAmount}
          isBusy={isStaking}
          isApproving={isApproving}
          onStake={handleStake}
          balanceLabel={`Balance: ${nectrBalance} NECTR`}
        />

        <UnstakeModal
          isOpen={isUnstakeModalOpen}
          onClose={() => setIsUnstakeModalOpen(false)}
          unstakeAmount={unstakeAmount}
          setUnstakeAmount={setUnstakeAmount}
          isBusy={isUnstaking}
          onUnstake={handleUnstake}
          stakedLabel={`Staked: ${stakedAmount} NECTR`}
        />

        <StatsSection />
        <FeatureCards />
        <NewsFeed />
        <CommunitySection />
      </div>
    </div>
  );
}
