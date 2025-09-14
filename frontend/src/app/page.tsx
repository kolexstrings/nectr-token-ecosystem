export default function Home() {
  return (
    <div className="min-h-screen bg-dark-900 cyber-grid text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-cyber font-bold text-cyber-400 text-glow mb-8 text-center">
          NECTR Web3 Ecosystem
        </h1>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <p className="text-xl text-cyber-300 mb-6">
            Experience the future of decentralized staking
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn-cyber animate-cyber-pulse">
              Start Staking
            </button>
            <button className="btn-neon">Learn More</button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-cyber hover:scale-105 transition-transform duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-cyber-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-cyber text-cyber-400">
                Cyber Staking
              </h3>
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
              <h3 className="text-2xl font-cyber text-neon-400">
                Neon Rewards
              </h3>
            </div>
            <p className="text-neon-300 mb-4">
              Earn exclusive rewards and participate in governance with your
              staked tokens.
            </p>
            <div className="text-neon-400 font-mono text-sm">
              Rewards: Active
            </div>
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
            <div className="text-electric-400 font-mono text-sm">
              Speed: 2.3s
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="glass rounded-glass p-8 mb-12">
          <h2 className="text-3xl font-cyber text-center mb-8">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-cyber text-cyber-400 mb-2">
                $2.4M
              </div>
              <div className="text-cyber-300">Total Value Locked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-cyber text-neon-400 mb-2">
                1,247
              </div>
              <div className="text-neon-300">Active Stakers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-cyber text-electric-400 mb-2">
                12.5%
              </div>
              <div className="text-electric-300">Average APY</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-cyber text-cyber-400 mb-2">
                99.9%
              </div>
              <div className="text-cyber-300">Uptime</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <h2 className="text-3xl font-cyber mb-6">Ready to Start?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-cyber text-lg px-8 py-4">
              Connect Wallet
            </button>
            <button className="btn-neon text-lg px-8 py-4">View Docs</button>
            <button className="btn-electric text-lg px-8 py-4">
              Join Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
