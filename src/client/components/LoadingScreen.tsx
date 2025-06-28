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
      {/* Consistent silly background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating skulls */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`skull-${i}`}
            className="absolute text-2xl opacity-10 animate-pulse"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${15 + (i * 8)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s',
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            💀
          </div>
        ))}
        
        {/* Floating chains */}
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={`chain-${i}`}
            className="absolute text-xl opacity-8 animate-bounce"
            style={{
              right: `${5 + (i * 15)}%`,
              bottom: `${10 + (i * 12)}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: '4s',
            }}
          >
            ⛓️
          </div>
        ))}

        {/* Floating orbs */}
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute w-3 h-3 rounded-full opacity-15"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 2 === 0 ? '#3B82F6' : '#EF4444',
              animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
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
          ⛓️ Chain it. Break it. Rule it. ⛓️
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