import { ethers } from "ethers";

// Contract addresses
export const NECTR_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_NECTR_TOKEN_ADDRESS!;
export const STAKING_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS!;

// ERC20 ABI (minimal for our needs)
export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

// Staking Contract ABI
export const STAKING_ABI = [
  "function token() view returns (address)",
  "function stakes(address user) view returns (uint256)",
  "function stake(uint256 amount) external",
  "function unstake(uint256 amount) external",
  "event Staked(address indexed user, uint256 amount)",
  "event Unstaked(address indexed user, uint256 amount)",
];

// Get provider and signer
export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
};

export const getSigner = async () => {
  const provider = getProvider();
  if (!provider) return null;
  return await provider.getSigner();
};

// Contract instances
export const getTokenContract = async () => {
  const signer = await getSigner();
  if (!signer) return null;
  return new ethers.Contract(NECTR_TOKEN_ADDRESS, ERC20_ABI, signer);
};

export const getStakingContract = async () => {
  const signer = await getSigner();
  if (!signer) return null;
  return new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);
};
