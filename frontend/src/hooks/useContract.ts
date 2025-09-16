"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  getTokenContract,
  getStakingContract,
  NECTR_TOKEN_ADDRESS,
  STAKING_CONTRACT_ADDRESS,
  ERC20_ABI,
  STAKING_ABI,
} from "@/lib/ethers";

export const useContract = (address: string | null) => {
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [stakedAmount, setStakedAmount] = useState<string>("0");
  const [allowance, setAllowance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Get token contract
      const tokenContract = new ethers.Contract(
        NECTR_TOKEN_ADDRESS,
        ERC20_ABI,
        provider
      );

      // Get staking contract
      const stakingContract = new ethers.Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_ABI,
        provider
      );

      // Fetch all data in parallel
      const [balance, staked, tokenAllowance] = await Promise.all([
        tokenContract.balanceOf(address),
        stakingContract.stakes(address),
        tokenContract.allowance(address, STAKING_CONTRACT_ADDRESS),
      ]);

      setTokenBalance(ethers.formatEther(balance));
      setStakedAmount(ethers.formatEther(staked));
      setAllowance(ethers.formatEther(tokenAllowance));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to fetch contract data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const stake = async (amount: string) => {
    if (!address) throw new Error("Wallet not connected");

    try {
      const tokenContract = await getTokenContract();
      const stakingContract = await getStakingContract();

      if (!tokenContract || !stakingContract) {
        throw new Error("Failed to get contract instances");
      }

      const amountWei = ethers.parseEther(amount);

      // Check if approval is needed
      const currentAllowance = await tokenContract.allowance(
        address,
        STAKING_CONTRACT_ADDRESS
      );

      if (currentAllowance < amountWei) {
        // Approve first
        const approveTx = await tokenContract.approve(
          STAKING_CONTRACT_ADDRESS,
          amountWei
        );
        await approveTx.wait();
      }

      // Stake the tokens
      const stakeTx = await stakingContract.stake(amountWei);
      const receipt = await stakeTx.wait();

      // Refresh data
      await fetchData();

      return receipt;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(msg || "Staking failed");
    }
  };

  const unstake = async (amount: string) => {
    if (!address) throw new Error("Wallet not connected");

    try {
      const stakingContract = await getStakingContract();

      if (!stakingContract) {
        throw new Error("Failed to get staking contract");
      }

      const amountWei = ethers.parseEther(amount);
      const unstakeTx = await stakingContract.unstake(amountWei);
      const receipt = await unstakeTx.wait();

      // Refresh data
      await fetchData();

      return receipt;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(msg || "Unstaking failed");
    }
  };

  return {
    tokenBalance,
    stakedAmount,
    allowance,
    isLoading,
    error,
    stake,
    unstake,
    refetch: fetchData,
  };
};
