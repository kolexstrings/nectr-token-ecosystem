import Modal from "@/components/Modal";

export default function StakeModal({
  isOpen,
  onClose,
  stakeAmount,
  setStakeAmount,
  isBusy,
  isApproving,
  onStake,
  balanceLabel,
}: {
  isOpen: boolean;
  onClose: () => void;
  stakeAmount: string;
  setStakeAmount: (v: string) => void;
  isBusy: boolean;
  isApproving: boolean;
  onStake: () => Promise<void>;
  balanceLabel: string;
}) {
  if (!isOpen) return null;
  return (
    <Modal
      onClose={onClose}
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
          <p className="text-xs text-cyber-500 mt-2">{balanceLabel}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-dark-700 text-cyber-300 hover:bg-dark-600"
          >
            Cancel
          </button>
          <button
            onClick={onStake}
            disabled={isBusy || isApproving || !stakeAmount}
            className={`flex-1 px-4 py-2 rounded-lg ${
              isBusy || isApproving || !stakeAmount
                ? "opacity-50 cursor-not-allowed bg-dark-700 text-cyber-300"
                : "btn-neon"
            }`}
          >
            {isApproving ? "Approving..." : isBusy ? "Staking..." : "Stake"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
