import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("NectrTokenModule", (m) => {
  // Deploy the NECTR token contract
  const nectrToken = m.contract("NECTRToken");

  // Optional: Mint initial supply to deployer
  // Uncomment and modify the following lines if you want to mint initial tokens
  // const initialSupply = m.getParameter("initialSupply", 1000000n * 10n ** 18n); // 1M tokens with 18 decimals
  // m.call(nectrToken, "mint", [m.getAccount(0), initialSupply]);

  return { nectrToken };
});
