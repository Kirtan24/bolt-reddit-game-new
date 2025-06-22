import React from 'react';
import { Player } from '../types/game';

interface OrbProps {
  owner: Player;
  index: number;
  total: number;
  isNearCritical: boolean;
  aiColor?: string;
  playerColor?: string;
}

export const Orb: React.FC<OrbProps> = ({
  owner,
  index,
  total,
  isNearCritical,
  aiColor,
  playerColor,
}) => {
  if (owner === 'empty') return null;

  const getOrbPosition = (index: number, total: number) => {
    if (total === 1) return 'translate-x-0 translate-y-0';
    if (total === 2) {
      return index === 0 ? '-translate-x-3' : 'translate-x-3';
    }
    if (total === 3) {
      const positions = [
        '-translate-x-4 -translate-y-1',
        'translate-x-4 -translate-y-1',
        'translate-y-3',
      ];
      return positions[index] || '';
    }
    if (total === 4) {
      const positions = [
        '-translate-x-3 -translate-y-3',
        'translate-x-3 -translate-y-3',
        '-translate-x-3 translate-y-3',
        'translate-x-3 translate-y-3',
      ];
      return positions[index] || '';
    }
    const angle = (index * 2 * Math.PI) / total;
    const radius = 4;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return `translate-x-[${x}px] translate-y-[${y}px]`;
  };

  const highlightColor = owner === 'player' ? playerColor || '#3B82F6' : aiColor || '#EF4444';

  return (
    <div
      className={`
        absolute w-5 h-5 rounded-full transform transition-all duration-300
        ${getOrbPosition(index, total)}
        ${isNearCritical ? 'animate-bounce' : 'animate-pulse'}
        hover:scale-125
      `}
      style={{
        animationDelay: `${index * 100}ms`,
        animationDuration: isNearCritical ? '0.5s' : '1.5s',
        backgroundColor: highlightColor,
        border: `2px solid ${highlightColor}aa`,
        boxShadow: `0 0 8px ${highlightColor}66`,
      }}
    >
      {/* Highlight dot */}
      <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white/60" />
    </div>
  );
};
