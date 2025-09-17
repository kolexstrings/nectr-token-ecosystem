"use client";

import { useState, useEffect } from "react";

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setWalletState((prev) => ({
        ...prev,
        error:
          "MetaMask is not installed. Please install MetaMask to continue.",
      }));
      return;
    }

    setWalletState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts.length > 0) {
        setWalletState({
          address: accounts[0],
          isConnected: true,
          isConnecting: false,
          error: null,
        });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      setWalletState((prev) => ({
        ...prev,
        isConnecting: false,
        error: msg || "Failed to connect wallet",
      }));
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      address: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  };

  useEffect(() => {
    const eth = typeof window !== "undefined" ? window.ethereum : undefined;
    if (!eth) return;

    // Check if already connected
    const checkConnection = async () => {
      try {
        if (!eth) return;
        const accounts = (await eth.request({
          method: "eth_accounts",
        })) as string[]; // cast return type

        if (accounts.length > 0) {
          setWalletState({
            address: accounts[0],
            isConnected: true,
            isConnecting: false,
            error: null,
          });
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkConnection();

    // Listen for account changes
    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = (args[0] ?? []) as string[];
      if (!Array.isArray(accounts) || accounts.length === 0) {
        disconnectWallet();
      } else {
        setWalletState((prev) => ({
          ...prev,
          address: accounts[0],
          isConnected: true,
        }));
      }
    };

    if (typeof eth.on === "function") {
      eth.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (typeof eth?.removeListener === "function") {
        eth.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
  };
};
