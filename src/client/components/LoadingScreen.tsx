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
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Skulls */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`skull-${i}`}
            className="absolute text-2xl opacity-10 animate-pulse"
            style={{
              left: `${(i * 73 + 17) % 100}vw`,
              top: `${(i * 41 + 23) % 100}vh`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '5s',
              transform: `rotate(${i * 45}deg)`,
            }}
          >
            💀
          </div>
        ))}

        {/* Chains */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`chain-${i}`}
            className="absolute text-xl opacity-10 animate-bounce"
            style={{
              left: `${(i * 61 + 13) % 100}vw`,
              top: `${(i * 33 + 37) % 100}vh`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '6s',
            }}
          >
            ⛓️
          </div>
        ))}

        {/* Orbs */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute w-2.5 h-2.5 rounded-full opacity-10"
            style={{
              left: `${(i * 29 + 9) % 100}vw`,
              top: `${(i * 47 + 17) % 100}vh`,
              backgroundColor: i % 2 === 0 ? '#3B82F6' : '#EF4444',
              animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}

        {/* Explosions */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`explosion-${i}`}
            className="absolute text-lg opacity-10 animate-pulse"
            style={{
              left: `${(i * 77 + 19) % 100}vw`,
              top: `${(i * 66 + 31) % 100}vh`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: '7s',
            }}
          >
            💥
          </div>
        ))}
      </div>

      {/* Foreground Content */}
      <div className="text-center max-w-md mx-auto p-6 relative z-10">
        {/* Main Icon */}
        <div className="mb-8">
          <div className="text-8xl animate-bounce">💀</div>
        </div>

        {/* Game Title */}
        <h1 className="text-5xl font-bold text-red-400 mb-2 drop-shadow-lg animate-pulse">
          SPREAD 'TIL DEAD
        </h1>

        {/* Slogan */}
        <p className="text-xl font-semibold text-yellow-400 mb-6">
          Chain it. Break it. Rule it.
        </p>

        {/* Dynamic loading message */}
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

        {/* Progress text */}
        <p className="text-lg font-semibold text-red-400">{progress}%</p>

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

      {/* Floating animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
};
