import React, { useState } from 'react';

interface LaunchPageProps {
  onEnterGame: () => void;
}

export const LaunchPage: React.FC<LaunchPageProps> = ({ onEnterGame }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)],
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 3}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto p-6">
        {/* Epic title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-4 animate-pulse drop-shadow-2xl">
            ⚡ CHAIN REACTION ⚡
          </h1>
          <div className="text-2xl md:text-3xl text-yellow-300 font-bold animate-bounce">
            🎮 ULTIMATE SILLY SH!T CHALLENGE ENTRY 🎮
          </div>
        </div>

        {/* Game description */}
        <div className="mb-8 space-y-4">
          <p className="text-xl md:text-2xl text-white font-semibold">
            💥 The Most Ridiculously Fun Orb Explosion Game Ever! 💥
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Place orbs, trigger chain reactions, and watch the chaos unfold! 
            Battle an AI that's programmed to be just the right amount of evil. 
            It's completely pointless and absolutely amazing!
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-3xl mb-2">🔥</div>
            <h3 className="text-yellow-400 font-bold">Epic Explosions</h3>
            <p className="text-sm text-gray-300">Watch orbs explode in glorious chain reactions!</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="text-yellow-400 font-bold">Evil AI</h3>
            <p className="text-sm text-gray-300">Battle an AI with attitude and questionable morals!</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="text-yellow-400 font-bold">Rainbow Chaos</h3>
            <p className="text-sm text-gray-300">Every game has different colors for maximum confusion!</p>
          </div>
        </div>

        {/* Enter button */}
        <div className="mb-6">
          <button
            onClick={onEnterGame}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`
              relative px-12 py-6 text-2xl md:text-3xl font-black rounded-2xl
              bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500
              text-white shadow-2xl transform transition-all duration-300
              hover:scale-110 hover:rotate-2 active:scale-95
              ${isHovering ? 'animate-pulse' : ''}
            `}
            style={{
              boxShadow: isHovering 
                ? '0 0 50px rgba(255, 255, 0, 0.8), 0 0 100px rgba(255, 0, 255, 0.6)' 
                : '0 20px 40px rgba(0, 0, 0, 0.5)'
            }}
          >
            🚀 ENTER THE CHAOS 🚀
            {isHovering && (
              <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping"></div>
            )}
          </button>
        </div>

        {/* Warning */}
        <div className="bg-red-500/20 border-2 border-red-400 rounded-xl p-4 max-w-md mx-auto mb-6">
          <p className="text-red-300 font-bold text-sm">
            ⚠️ WARNING: May cause uncontrollable giggling, strategic thinking, and mild addiction to orb explosions!
          </p>
        </div>

        {/* Credits */}
        <div className="text-sm text-gray-400 space-y-1">
          <p>🏆 Built for Reddit's Silly Sh!t Challenge</p>
          <p>⚡ Powered by Bolt x Devvit</p>
          <p>💝 Made with love, chaos, and way too much caffeine</p>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>💥</div>
      <div className="absolute top-20 right-20 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>⚡</div>
      <div className="absolute bottom-20 left-20 text-5xl animate-bounce" style={{ animationDelay: '1.5s' }}>🎮</div>
      <div className="absolute bottom-10 right-10 text-3xl animate-bounce" style={{ animationDelay: '2s' }}>🔥</div>
    </div>
  );
};