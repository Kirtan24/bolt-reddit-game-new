import React from 'react';

interface LaunchPageProps {
  onEnterGame: () => void;
}

export const LaunchPage: React.FC<LaunchPageProps> = ({ onEnterGame }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Clean title */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          ⚡ Chain Reaction
        </h1>

        {/* Simple description */}
        <p className="text-xl text-gray-300 mb-8">
          Strategic orb placement game. Place orbs, trigger chain reactions, and defeat the AI!
        </p>

        {/* Game features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl mb-2">💥</div>
            <h3 className="text-white font-semibold mb-1">Chain Reactions</h3>
            <p className="text-sm text-gray-400">Trigger explosive cascading effects</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="text-white font-semibold mb-1">AI Opponent</h3>
            <p className="text-sm text-gray-400">Battle against intelligent AI</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="text-white font-semibold mb-1">Strategy</h3>
            <p className="text-sm text-gray-400">Plan your moves carefully</p>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={onEnterGame}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Start Game
        </button>

        {/* Simple credits */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Built with Bolt x Devvit</p>
        </div>
      </div>
    </div>
  );
};