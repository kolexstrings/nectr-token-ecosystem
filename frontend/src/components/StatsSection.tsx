export default function StatsSection() {
  return (
    <div className="glass rounded-glass p-8 mb-12">
      <h2 className="text-3xl font-cyber text-center mb-8">
        Platform Statistics
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-4xl font-cyber text-cyber-400 mb-2">$2.4M</div>
          <div className="text-cyber-300">Total Value Locked</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-cyber text-neon-400 mb-2">1,247</div>
          <div className="text-neon-300">Active Stakers</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-cyber text-electric-400 mb-2">
            12.5%
          </div>
          <div className="text-electric-300">Average APY</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-cyber text-cyber-400 mb-2">99.9%</div>
          <div className="text-cyber-300">Uptime</div>
        </div>
      </div>
    </div>
  );
}
