"use client";

export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-dark-900 cyber-grid p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Test Basic Colors */}
        <div className="space-y-4">
          <h1 className="text-4xl font-cyber font-bold text-cyber-400 text-glow">
            NECTR Web3 Test
          </h1>
          <p className="text-electric-400 font-mono">
            Testing Tailwind CSS Web3 Configuration
          </p>
        </div>

        {/* Test Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-cyber">
            <h3 className="text-xl font-cyber text-cyber-400 mb-2">
              Cyber Card
            </h3>
            <p className="text-cyber-300">This is a cyber-themed card</p>
          </div>

          <div className="card-neon">
            <h3 className="text-xl font-cyber text-neon-400 mb-2">Neon Card</h3>
            <p className="text-neon-300">This is a neon-themed card</p>
          </div>

          <div className="card-electric">
            <h3 className="text-xl font-cyber text-electric-400 mb-2">
              Electric Card
            </h3>
            <p className="text-electric-300">This is an electric-themed card</p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-cyber text-cyber-400">Button Tests</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-cyber">Cyber Button</button>
            <button className="btn-neon">Neon Button</button>
            <button className="btn-electric">Electric Button</button>
          </div>
        </div>

        {/* Test Animations */}
        <div className="space-y-4">
          <h2 className="text-2xl font-cyber text-cyber-400">
            Animation Tests
          </h2>
          <div className="flex flex-wrap gap-4">
            <div className="w-16 h-16 bg-cyber-500 rounded-full animate-pulse"></div>
            <div className="w-16 h-16 bg-neon-500 rounded-full animate-bounce"></div>
            <div className="w-16 h-16 bg-electric-500 rounded-full animate-spin"></div>
            <div className="w-16 h-16 bg-cyber-500 rounded-full animate-glow"></div>
          </div>
        </div>

        {/* Test Gradients */}
        <div className="space-y-4">
          <h2 className="text-2xl font-cyber text-cyber-400">Gradient Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-cyber-gradient rounded-glass"></div>
            <div className="h-32 bg-neon-gradient rounded-glass"></div>
            <div className="h-32 bg-electric-gradient rounded-glass"></div>
            <div className="h-32 bg-cyber-mesh rounded-glass"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
