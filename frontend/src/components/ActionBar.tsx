export default function ActionBar({
  account,
  onOpenStake,
  onOpenUnstake,
}: {
  account: string | null;
  onOpenStake: () => void;
  onOpenUnstake: () => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      <button
        onClick={onOpenStake}
        className={`px-6 py-2 rounded-lg ${
          account
            ? "btn-neon bg-purple-600 hover:bg-purple-700 text-white"
            : "bg-purple-600 text-white opacity-50 cursor-not-allowed"
        }`}
        disabled={!account}
      >
        Stake NECTR
      </button>
      <button
        onClick={onOpenUnstake}
        className={`px-6 py-2 rounded-lg ${
          account
            ? "btn-electric"
            : "bg-electric-500 text-white opacity-50 cursor-not-allowed"
        }`}
        disabled={!account}
      >
        Unstake
      </button>
    </div>
  );
}
