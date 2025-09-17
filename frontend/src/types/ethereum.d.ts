import { Eip1193Provider } from "ethers";

declare global {
  interface EthereumProvider extends Eip1193Provider {
    on?: (event: string, handler: (...args: unknown[]) => void) => void;
    removeListener?: (
      event: string,
      handler: (...args: unknown[]) => void
    ) => void;
  }

  interface Window {
    ethereum?: EthereumProvider;
  }
}
