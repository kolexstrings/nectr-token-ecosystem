import { Copy, Wallet } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

export default function WalletBar({
  account,
  nectrBalance,
  connectWallet,
  disconnectWallet,
}: {
  account: string | null;
  nectrBalance: string;
  connectWallet: () => void;
  disconnectWallet: () => void;
}) {
  return (
    <div className="text-center mb-8">
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
      </div>

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
  );
}
