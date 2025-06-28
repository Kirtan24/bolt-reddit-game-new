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
      return index === 0 ? '-translate-x-2 md:-translate-x-3' : 'translate-x-2 md:translate-x-3';
    }
    if (total === 3) {
      const positions = [
        '-translate-x-3 md:-translate-x-4 -translate-y-1',
        'translate-x-3 md:translate-x-4 -translate-y-1',
        'translate-y-2 md:translate-y-3',
      ];
      return positions[index] || '';
    }
    if (total === 4) {
      const positions = [
        '-translate-x-2 md:-translate-x-3 -translate-y-2 md:-translate-y-3',
        'translate-x-2 md:translate-x-3 -translate-y-2 md:-translate-y-3',
        '-translate-x-2 md:-translate-x-3 translate-y-2 md:translate-y-3',
        'translate-x-2 md:translate-x-3 translate-y-2 md:translate-y-3',
      ];
      return positions[index] || '';
    }
    const angle = (index * 2 * Math.PI) / total;
    const radius = total > 4 ? 3 : 4;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return `translate-x-[${x}px] translate-y-[${y}px]`;
  };

  const highlightColor = owner === 'player' ? playerColor || '#3B82F6' : aiColor || '#EF4444';

  return (
    <div
      className={`
        absolute w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-full transform transition-all duration-100 ease-out
        ${getOrbPosition(index, total)}
        ${isNearCritical ? 'animate-bounce' : ''}
      `}
      style={{
        animationDelay: `${index * 50}ms`,
        animationDuration: isNearCritical ? '0.4s' : '1.8s',
        backgroundColor: highlightColor,
        border: `1px solid ${highlightColor}aa`,
        boxShadow: `0 0 6px ${highlightColor}66`,
      }}
    >
      {/* Simple highlight dot */}
      <div className="absolute top-0.5 left-0.5 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/60" />
    </div>
  );
};