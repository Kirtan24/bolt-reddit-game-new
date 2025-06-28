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
      {/* Minimal floating animation - just a few orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i * 10)}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center max-w-md mx-auto p-6 relative z-10">
        {/* Simple animated skull icon */}
        <div className="mb-8">
          <div className="text-7xl animate-bounce">💀</div>
        </div>

        {/* Game title */}
        <h1 className="text-5xl font-bold text-red-400 mb-2 drop-shadow-lg">
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

        {/* Simple progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-lg font-semibold text-red-400">
          {progress}%
        </p>

        {/* Simple loading dots */}
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
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};