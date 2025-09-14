import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("NectrStakingModule", (m) => {
  // First deploy the NECTR token
  const nectrToken = m.contract("NECTRToken");

  // Then deploy the staking contract with the token address
  const nectrStaking = m.contract("NectarStaking", [nectrToken]);

  return { nectrToken, nectrStaking };
});
