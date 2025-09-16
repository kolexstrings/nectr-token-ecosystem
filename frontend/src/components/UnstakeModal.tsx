import Modal from "@/components/Modal";

export default function UnstakeModal({
  isOpen,
  onClose,
  unstakeAmount,
  setUnstakeAmount,
  isBusy,
  onUnstake,
  stakedLabel,
}: {
  isOpen: boolean;
  onClose: () => void;
  unstakeAmount: string;
  setUnstakeAmount: (v: string) => void;
  isBusy: boolean;
  onUnstake: () => Promise<void>;
  stakedLabel: string;
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
          Unstake NECTR
        </h3>
        <div className="glass rounded-glass p-4 bg-dark-800">
          <label className="block text-xs font-mono text-cyber-300 mb-1">
            Amount to Unstake
          </label>
          <input
            type="number"
            value={unstakeAmount}
            onChange={(e) => setUnstakeAmount(e.target.value)}
            placeholder="0.0"
            step="0.000001"
            className="w-full px-3 py-2 rounded-md bg-dark-900 text-white placeholder-cyber-600 border border-cyber-700 focus:outline-none focus:ring-2 focus:ring-cyber-500"
          />
          <p className="text-xs text-cyber-500 mt-2">{stakedLabel}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-dark-700 text-cyber-300 hover:bg-dark-600"
          >
            Cancel
          </button>
          <button
            onClick={onUnstake}
            disabled={isBusy || !unstakeAmount}
            className={`flex-1 px-4 py-2 rounded-lg ${
              isBusy || !unstakeAmount
                ? "opacity-50 cursor-not-allowed bg-dark-700 text-cyber-300"
                : "btn-electric"
            }`}
          >
            {isBusy ? "Unstaking..." : "Unstake"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
