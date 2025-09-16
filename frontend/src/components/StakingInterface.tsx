"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useContract } from "@/hooks/useContract";

export default function StakingInterface() {
  const {
    address,
    isConnected,
    isConnecting,
    error: walletError,
    connectWallet,
  } = useWallet();
  const {
    tokenBalance,
    stakedAmount,
    allowance,
    isLoading,
    error: contractError,
    stake,
    unstake,
  } = useContract(address);

  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleStake = async () => {
    if (!stakeAmount) return;

    setIsStaking(true);
    setTxHash(null);

    try {
      const receipt = await stake(stakeAmount);
      setTxHash(receipt.hash);
      setStakeAmount("");
    } catch (error: unknown) {
      console.error("Staking error:", error);
      const msg = error instanceof Error ? error.message : String(error);
      alert(msg || "Staking failed");
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async () => {
    if (!unstakeAmount) return;

    setIsUnstaking(true);
    setTxHash(null);

    try {
      const receipt = await unstake(unstakeAmount);
      setTxHash(receipt.hash);
      setUnstakeAmount("");
    } catch (error: unknown) {
      console.error("Unstaking error:", error);
      const msg = error instanceof Error ? error.message : String(error);
      alert(msg || "Unstaking failed");
    } finally {
      setIsUnstaking(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            NECTR Staking
          </h1>
          <p className="text-gray-600 mb-6">
            Connect your wallet to start staking NECTR tokens
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
          {walletError && (
            <p className="text-red-500 text-sm mt-2">{walletError}</p>
          )}
        </div>
      </div>
    );
  }

  const needsApproval =
    stakeAmount && allowance
      ? parseFloat(stakeAmount) > parseFloat(allowance)
      : false;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            NECTR Staking
          </h1>
          <p className="text-gray-600">
            Stake your NECTR tokens and earn rewards
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>

        {contractError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {contractError}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Token Balance Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your NECTR Balance</h2>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {isLoading ? "Loading..." : `${tokenBalance} NECTR`}
            </div>
            <div className="text-sm text-gray-500">Available for staking</div>
          </div>

          {/* Staked Amount Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Currently Staked</h2>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {isLoading ? "Loading..." : `${stakedAmount} NECTR`}
            </div>
            <div className="text-sm text-gray-500">Staked tokens</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Stake Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Stake NECTR</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Stake
                </label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0.0"
                  step="0.000001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleStake}
                disabled={isStaking || !stakeAmount || isLoading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isStaking ? "Staking..." : "Stake NECTR"}
              </button>
            </div>
          </div>

          {/* Unstake Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Unstake NECTR</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Unstake
                </label>
                <input
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  placeholder="0.0"
                  step="0.000001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleUnstake}
                disabled={isUnstaking || !unstakeAmount || isLoading}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                {isUnstaking ? "Unstaking..." : "Unstake NECTR"}
              </button>
            </div>
          </div>
        </div>

        {/* Transaction Status */}
        {txHash && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Transaction Status</h3>
            <div className="text-sm text-gray-600 mb-2">Hash: {txHash}</div>
            <div className="text-green-600">Transaction confirmed!</div>
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4 text-xs text-gray-600">
          <h4 className="font-semibold mb-2">Debug Info:</h4>
          <p>Allowance: {allowance} NECTR</p>
          <p>Needs Approval: {needsApproval ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
}
