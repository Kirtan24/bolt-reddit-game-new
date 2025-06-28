import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 300);
          return 100;
        }
        return prev + 3;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex flex-col items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        {/* Simple animated icon */}
        <div className="mb-8">
          <div className="text-6xl animate-pulse">⚡</div>
        </div>

        {/* Clean title */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Chain Reaction
        </h1>

        <p className="text-gray-400 mb-8">
          Loading game...
        </p>

        {/* Simple progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-lg font-semibold text-blue-400">
          {progress}%
        </p>
      </div>
    </div>
  );
};