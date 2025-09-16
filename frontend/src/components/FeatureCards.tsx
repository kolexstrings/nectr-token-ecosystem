export default function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="card-cyber hover:scale-105 transition-transform duration-300">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-cyber-500 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-2xl font-cyber text-cyber-400">Cyber Staking</h3>
        </div>
        <p className="text-cyber-300 mb-4">
          Stake your NECTR tokens and earn rewards with our advanced staking
          protocol.
        </p>
        <div className="text-cyber-400 font-mono text-sm">APY: 12.5%</div>
      </div>

      <div className="card-neon hover:scale-105 transition-transform duration-300">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-neon-500 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl">🔮</span>
          </div>
          <h3 className="text-2xl font-cyber text-neon-400">Neon Rewards</h3>
        </div>
        <p className="text-neon-300 mb-4">
          Earn exclusive rewards and participate in governance with your staked
          tokens.
        </p>
        <div className="text-neon-400 font-mono text-sm">Rewards: Active</div>
      </div>

      <div className="card-electric hover:scale-105 transition-transform duration-300">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-electric-500 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-2xl font-cyber text-electric-400">
            Electric Speed
          </h3>
        </div>
        <p className="text-electric-300 mb-4">
          Lightning-fast transactions powered by Polygon's high-performance
          network.
        </p>
        <div className="text-electric-400 font-mono text-sm">Speed: 2.3s</div>
      </div>
    </div>
  );
}
