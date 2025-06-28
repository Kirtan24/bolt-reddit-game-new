import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(0);

  const loadingTexts = [
    "Spreading the chaos...",
    "Preparing orb mayhem...",
    "Loading chain reactions...",
    "Initializing destruction...",
    "Ready to spread 'til dead!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const textInterval = setInterval(() => {
      setCurrentText(prev => (prev + 1) % loadingTexts.length);
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex flex-col items-center justify-center overflow-hidden">
      {/* Perfect consistent background animation across entire screen */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating skulls everywhere */}
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={`skull-${i}`}
            className="absolute text-2xl opacity-8 animate-pulse"
            style={{
              left: `${(i * 7) % 100}%`,
              top: `${(i * 11) % 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '4s',
              transform: `rotate(${i * 24}deg)`,
            }}
          >
            💀
          </div>
        ))}
        
        {/* Floating chains everywhere */}
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={`chain-${i}`}
            className="absolute text-xl opacity-6 animate-bounce"
            style={{
              left: `${(i * 8.5) % 100}%`,
              top: `${(i * 13) % 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '5s',
            }}
          >
            ⛓️
          </div>
        ))}

        {/* Floating orbs everywhere */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute w-3 h-3 rounded-full opacity-12"
            style={{
              left: `${(i * 5.2) % 100}%`,
              top: `${(i * 7.8) % 100}%`,
              backgroundColor: i % 2 === 0 ? '#3B82F6' : '#EF4444',
              animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}

        {/* Explosion effects */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`explosion-${i}`}
            className="absolute text-lg opacity-5 animate-pulse"
            style={{
              left: `${(i * 12.5) % 100}%`,
              top: `${(i * 15.7) % 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: '6s',
            }}
          >
            💥
          </div>
        ))}
      </div>

      <div className="text-center max-w-md mx-auto p-6 relative z-10">
        {/* Animated skull icon */}
        <div className="mb-8">
          <div className="text-8xl animate-bounce">💀</div>
        </div>

        {/* Game title */}
        <h1 className="text-5xl font-bold text-red-400 mb-2 drop-shadow-lg animate-pulse">
          SPREAD 'TIL DEAD
        </h1>

        {/* Slogan */}
        <p className="text-xl font-semibold text-yellow-400 mb-6">
          Chain it. Break it. Rule it.
        </p>

        {/* Dynamic loading text */}
        <p className="text-gray-300 mb-8 h-6 transition-all duration-300">
          {loadingTexts[currentText]}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-lg font-semibold text-red-400">
          {progress}%
        </p>

        {/* Loading dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};