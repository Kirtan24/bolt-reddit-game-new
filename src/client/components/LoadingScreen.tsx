import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  const sillyMessages = [
    "🔮 Summoning digital orbs from the void...",
    "🧪 Mixing explosive chain reaction potions...", 
    "🎯 Teaching AI how to be properly evil...",
    "⚡ Charging up the chaos generators...",
    "🌪️ Creating interdimensional orb portals...",
    "🎮 Calibrating maximum silly levels...",
    "💥 Installing explosion sound effects...",
    "🤖 Programming AI to trash talk you...",
    "🎨 Painting orbs with rainbow magic...",
    "🚀 Launching into the stratosphere of fun!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % sillyMessages.length);
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-md mx-auto p-6">
        {/* Spinning logo/icon */}
        <div className="mb-8 relative">
          <div className="text-8xl animate-spin" style={{ animationDuration: '3s' }}>
            ⚡
          </div>
          <div className="absolute inset-0 text-8xl animate-pulse">
            💥
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-4 animate-pulse">
          CHAIN REACTION
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 mb-8 font-semibold">
          🎮 Silly Sh!t Challenge Entry 🎮
        </p>

        {/* Loading message */}
        <div className="mb-6 h-16 flex items-center justify-center">
          <p className="text-lg text-white font-medium animate-bounce">
            {sillyMessages[currentMessage]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
          </div>
        </div>

        {/* Progress percentage */}
        <p className="text-2xl font-bold text-yellow-400">
          {progress}%
        </p>

        {/* Fun fact */}
        <div className="mt-6 text-sm text-gray-400 italic">
          💡 Fun Fact: This game was built with Bolt x Devvit for maximum silliness!
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
        Built for Reddit's Silly Sh!t Challenge 🏆
      </div>
    </div>
  );
};